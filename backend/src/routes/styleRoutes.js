const express = require('express');
const router = express.Router();
const BeardStyle = require('../models/BeardStyle');
const User = require('../models/User');
const ClaudeService = require('../services/claudeService');
const DalleService = require('../services/dalleService');
const { optionalAuth, authenticateToken, authenticateUser } = require('../middleware/auth');

// Get all beard styles with optional filters
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      maintenanceLevel: req.query.maintenance,
      faceType: req.query.faceType,
      search: req.query.search,
    };

    const styles = await BeardStyle.findAll(filters);

    res.json({
      count: styles.length,
      styles,
    });
  } catch (error) {
    next(error);
  }
});

// Get popular beard styles
router.get('/popular', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const styles = await BeardStyle.getPopular(limit);

    res.json({
      count: styles.length,
      styles,
    });
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
    const mergedRecommendations = mergeRecommendations(
      dbRecommendations,
      aiAnalysis,
      aiEnhancedRecommendations
    );

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

// Helper function to merge recommendations
function mergeRecommendations(dbStyles, aiAnalysis, aiEnhanced) {
  const recommendations = [...dbStyles];

  // If we have AI analysis, boost matching styles
  if (aiAnalysis && aiAnalysis.recommended_styles) {
    const aiStyles = typeof aiAnalysis.recommended_styles === 'string'
      ? JSON.parse(aiAnalysis.recommended_styles)
      : aiAnalysis.recommended_styles;

    aiStyles.forEach(aiStyle => {
      const matchingDb = recommendations.find(db =>
        db.name.toLowerCase().includes(aiStyle.styleName.toLowerCase()) ||
        aiStyle.styleName.toLowerCase().includes(db.name.toLowerCase())
      );

      if (matchingDb) {
        matchingDb.aiMatchScore = aiStyle.matchScore;
        matchingDb.aiReasoning = aiStyle.reasoning;
        matchingDb.aiKeyBenefits = aiStyle.keyBenefits;
        matchingDb.aiRecommended = true;
      }
    });

    // Sort by AI match score if available
    recommendations.sort((a, b) => {
      if (a.aiMatchScore && b.aiMatchScore) {
        return b.aiMatchScore - a.aiMatchScore;
      }
      if (a.aiMatchScore) return -1;
      if (b.aiMatchScore) return 1;
      return 0;
    });
  }

  return recommendations;
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

module.exports = router;
