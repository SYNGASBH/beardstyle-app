const express = require('express');
const router = express.Router();
const BeardStyle = require('../models/BeardStyle');
const User = require('../models/User');
const ClaudeService = require('../services/claudeService');
const DalleService = require('../services/dalleService');
const ReplicateService = require('../services/replicateService');
const { optionalAuth, authenticateToken, authenticateUser } = require('../middleware/auth');
const { stylesCache, popularCache } = require('../utils/cache');

// Get all beard styles with optional filters and pagination
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      maintenanceLevel: req.query.maintenance,
      faceType: req.query.faceType,
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset,
    };

    // Cache unfiltered requests (gallery page default)
    const cacheKey = JSON.stringify(filters);
    const cached = stylesCache.get(cacheKey);
    if (cached) return res.json(cached);

    const [styles, total] = await Promise.all([
      BeardStyle.findAll(filters),
      BeardStyle.countAll(filters),
    ]);

    const limit = parseInt(req.query.limit) || total;
    const offset = parseInt(req.query.offset) || 0;

    const response = {
      count: styles.length,
      total,
      page: limit > 0 ? Math.floor(offset / limit) + 1 : 1,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      hasMore: offset + styles.length < total,
      styles,
    };

    stylesCache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get popular beard styles
router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const cacheKey = `popular:${limit}`;
    const cached = popularCache.get(cacheKey);
    if (cached) return res.json(cached);

    const styles = await BeardStyle.getPopular(limit);

    const response = {
      count: styles.length,
      styles,
    };

    popularCache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get AI-powered recommendations based on questionnaire and/or upload
router.post('/recommend', async (req, res, next) => {
  try {
    const {
      uploadId,
      faceShape,
      lifestyle,
      maintenancePreference,
      ageRange,
      currentStyle,
      styleGoals
    } = req.body;

    let aiAnalysis = null;
    let aiEnhancedRecommendations = null;

    // If uploadId provided, fetch AI analysis or perform it
    if (uploadId) {
      aiAnalysis = await User.getAIAnalysis(uploadId);
      
      // If no AI analysis exists, perform it now
      if (!aiAnalysis) {
        try {
          const uploadRecord = await User.getUploadById(uploadId);
          if (uploadRecord) {
            console.log(`Performing lazy AI analysis for upload ${uploadId}`);
            const rawAnalysis = await ClaudeService.analyzeFaceForBeardStyle(uploadRecord.file_path);

            // Save AI analysis to database
            await User.saveAIAnalysis(uploadId, rawAnalysis);

            // Re-fetch from DB so aiAnalysis is in snake_case (consistent with the cached path)
            aiAnalysis = await User.getAIAnalysis(uploadId);
          }
        } catch (aiError) {
          console.error('Lazy AI analysis failed:', aiError);
          // Continue without AI analysis
        }
      }
    }

    // Get database recommendations
    const searchFaceShape = aiAnalysis ? aiAnalysis.face_shape : faceShape;

    if (!searchFaceShape || !lifestyle || !maintenancePreference) {
      return res.status(400).json({
        error: 'Missing required fields: faceShape (or uploadId with AI analysis), lifestyle, maintenancePreference',
      });
    }

    const dbRecommendations = await BeardStyle.getRecommendations({
      faceShape: searchFaceShape,
      lifestyle,
      maintenancePreference,
      ageRange,
    });

    // Enhance recommendations with AI if we have questionnaire data
    try {
      aiEnhancedRecommendations = await ClaudeService.enhanceRecommendations({
        faceShape: searchFaceShape,
        lifestyle,
        maintenancePreference,
        ageRange,
        currentStyle,
        styleGoals,
      });
    } catch (aiError) {
      console.error('AI enhancement failed:', aiError);
      // Continue without AI enhancement
    }

    // Merge AI recommendations with database styles
    const aiStyles = aiAnalysis?.recommended_styles
      ? (typeof aiAnalysis.recommended_styles === 'string'
          ? JSON.parse(aiAnalysis.recommended_styles)
          : aiAnalysis.recommended_styles)
      : [];

    const mergedRecommendations = aiStyles.length > 0
      ? mergeRecommendations(aiStyles, dbRecommendations)
      : dbRecommendations;

    res.json({
      count: mergedRecommendations.length,
      recommendations: mergedRecommendations,
      aiAnalysis: aiAnalysis ? {
        faceShape: aiAnalysis.face_shape,
        confidence: aiAnalysis.face_shape_confidence,
        facialCharacteristics: aiAnalysis.facial_characteristics,
        stylingAdvice: aiAnalysis.styling_advice,
        maintenanceGuide: aiAnalysis.maintenance_guide,
        additionalNotes: aiAnalysis.additional_notes,
      } : null,
      aiEnhanced: aiEnhancedRecommendations,
    });
  } catch (error) {
    next(error);
  }
});

// Mapping rječnik za poznate AI prijevode na bosanski (fallback)
const styleNameMapping = {
  'puna brada': 'full-beard',
  'kratka geometrijska': 'short-boxed',
  'kratka brada': 'short-boxed',
  'trodnevna brada': 'stubble',
  'korporativna brada': 'corporate',
  'pačiji rep': 'ducktail',
  'jarebica': 'goatee',
  'van dyke': 'van-dyke',
  'balbo': 'balbo',
};

// Helper function to merge AI recommendations with DB styles
function mergeRecommendations(aiRecommendations, dbStyles) {
  return aiRecommendations.map(aiStyle => {
    let matchedDbStyle = null;

    // 1. Match po slug polju koje Claude vraća (najpouzdanije)
    if (aiStyle.slug) {
      matchedDbStyle = dbStyles.find(db =>
        db.slug === aiStyle.slug ||
        db.name.toLowerCase() === aiStyle.slug.replace(/-/g, ' ')
      );
    }

    // 2. Fallback: prevedi bosansko ime u slug pomoću mapping rječnika
    if (!matchedDbStyle && aiStyle.styleName) {
      const normalizedName = aiStyle.styleName.toLowerCase().trim();
      const mappedSlug = styleNameMapping[normalizedName];
      if (mappedSlug) {
        matchedDbStyle = dbStyles.find(db =>
          db.slug === mappedSlug ||
          db.name.toLowerCase() === mappedSlug.replace(/-/g, ' ')
        );
      }
    }

    // 3. Fallback: string includes za edge case-ove
    if (!matchedDbStyle && aiStyle.styleName) {
      matchedDbStyle = dbStyles.find(db =>
        db.name.toLowerCase().includes(aiStyle.styleName.toLowerCase())
      );
    }

    if (matchedDbStyle) {
      return {
        ...matchedDbStyle,
        aiReasoning: aiStyle.reasoning,
        aiKeyBenefits: aiStyle.keyBenefits,
        aiMatchScore: aiStyle.matchScore,
        aiRecommended: true,
      };
    }

    console.warn(`[BeardStyle] Stil nije matchiran: ${aiStyle.styleName} (slug: ${aiStyle.slug})`);
    return null;
  }).filter(Boolean);
}

// Get single beard style by ID or slug
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support both numeric ID and slug lookup
    const isNumeric = /^\d+$/.test(id);
    const style = isNumeric
      ? await BeardStyle.findById(id)
      : await BeardStyle.findBySlug(id);

    if (!style) {
      return res.status(404).json({ error: 'Beard style not found' });
    }

    // Increment popularity
    await BeardStyle.incrementPopularity(style.id);

    res.json({ style });
  } catch (error) {
    next(error);
  }
});

// Get beard style by slug
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const style = await BeardStyle.findBySlug(slug);
    
    if (!style) {
      return res.status(404).json({ error: 'Beard style not found' });
    }

    // Increment popularity
    await BeardStyle.incrementPopularity(style.id);

    res.json({ style });
  } catch (error) {
    next(error);
  }
});

// Get all tags
router.get('/meta/tags', async (req, res, next) => {
  try {
    const tags = await BeardStyle.getAllTags();
    res.json({ tags });
  } catch (error) {
    next(error);
  }
});

// Get all face types
router.get('/meta/face-types', async (req, res, next) => {
  try {
    const faceTypes = await BeardStyle.getAllFaceTypes();
    res.json({ faceTypes });
  } catch (error) {
    next(error);
  }
});

// Generate visual preview of beard style on user's face
router.post('/visualize', async (req, res, next) => {
  try {
    const { uploadId, styleId } = req.body;

    if (!uploadId || !styleId) {
      return res.status(400).json({
        error: 'Missing required fields: uploadId, styleId',
      });
    }

    // Check if DALL-E service is available
    if (!DalleService.isAvailable()) {
      return res.status(503).json({
        error: 'Image generation service not available. Please configure OpenAI API key.',
        visualization: {
          status: 'unavailable',
          message: 'DALL-E API key not configured'
        }
      });
    }

    // Get upload and style details
    const upload = await User.getUploadById(uploadId);
    const style = await BeardStyle.findById(styleId);

    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    if (!style) {
      return res.status(404).json({ error: 'Beard style not found' });
    }

    // Get AI analysis for better prompt generation
    let aiAnalysis = null;
    try {
      aiAnalysis = await User.getAIAnalysis(uploadId);
    } catch (analysisError) {
      console.warn('Could not fetch AI analysis for visualization:', analysisError.message);
    }

    console.log(`🎨 Starting beard visualization generation for upload ${uploadId}, style ${style.name}`);

    // Generate beard visualization
    const visualization = await DalleService.generateBeardVisualization(
      upload.file_path,
      style,
      aiAnalysis
    );

    res.json({
      success: true,
      message: 'Beard visualization generated successfully',
      visualization: {
        ...visualization,
        status: 'completed',
        uploadId,
        styleId
      }
    });

  } catch (error) {
    console.error('Visualization error:', error);
    res.status(500).json({
      error: 'Failed to generate beard visualization',
      details: error.message,
      visualization: {
        status: 'failed',
        error: error.message
      }
    });
  }
});

// Generate realistic beard photo via Replicate inpainting
// POST /api/styles/generate-realistic
// Body: { imageBase64, maskBase64, styleSlug }
// Auth: optional — logged-in users get the result saved to their history
router.post('/generate-realistic', optionalAuth, async (req, res, next) => {
  try {
    const { imageBase64, maskBase64, styleSlug } = req.body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }
    if (!maskBase64) {
      return res.status(400).json({ error: 'maskBase64 is required — run generateBeardMask() on the frontend first' });
    }
    if (!styleSlug) {
      return res.status(400).json({ error: 'styleSlug is required (e.g. "full-beard", "stubble")' });
    }

    // ── Service availability check ───────────────────────────────────────────
    if (!ReplicateService.isAvailable() && process.env.USE_MOCK_AI !== 'true') {
      return res.status(503).json({
        error: 'Replicate API not configured. Add REPLICATE_API_TOKEN to .env or set USE_MOCK_AI=true for testing.',
      });
    }

    console.log(`🎨 [/generate-realistic] styleSlug=${styleSlug}, user=${req.user?.id || 'anonymous'}`);

    // ── Generate ─────────────────────────────────────────────────────────────
    const result = await ReplicateService.generateBeardVisualization(
      imageBase64,
      maskBase64,
      styleSlug,
    );

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('[/generate-realistic] Error:', error.message);
    next(error);
  }
});

module.exports = router;
