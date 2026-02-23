const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, authenticateUser } = require('../middleware/auth');
const ClaudeService = require('../services/claudeService');
const { convertVariants } = require('../utils/convertToWebpMagick');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'user-' + req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
  },
});

// ============================================
// USER PROFILE ROUTES
// ============================================

// Get user profile
router.get('/profile', authenticateToken, authenticateUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, authenticateUser, async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await User.update(req.user.userId, {
      firstName,
      lastName,
      phone,
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// UPLOAD ROUTES
// ============================================

// Upload user image with AI analysis
router.post(
  '/upload',
  authenticateToken,
  authenticateUser,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Convert uploaded image to responsive WebP variants
      const variants = await convertVariants(req.file.path);

      // Use largest variant for AI analysis (best quality), disk path for DB
      const largestVariant = variants[variants.length - 1]; // 1200w
      const diskPath = path.join('uploads', largestVariant.filename);

      // Save upload record with disk-relative path (for AI analysis file reads)
      const uploadRecord = await User.saveUpload(
        req.user.userId,
        diskPath,
        'image/webp',
        variants.reduce((sum, v) => sum + v.size, 0)
      );

      res.status(201).json({
        ok: true,
        upload: {
          id: uploadRecord.id,
          filePath: uploadRecord.file_path,
          fileUrl: `${req.protocol}://${req.get('host')}/uploads/${largestVariant.filename}`,
        },
        variants,
        aiAnalysis: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// QUESTIONNAIRE ROUTES
// ============================================

// Submit questionnaire
router.post(
  '/questionnaire',
  authenticateToken,
  authenticateUser,
  async (req, res, next) => {
    try {
      const {
        uploadId,
        faceShape,
        lifestyle,
        maintenancePreference,
        ageRange,
        currentStyle,
        styleGoals,
        additionalNotes,
      } = req.body;

      const questionnaire = await User.saveQuestionnaire(
        req.user.userId,
        uploadId,
        {
          faceShape,
          lifestyle,
          maintenancePreference,
          ageRange,
          currentStyle,
          styleGoals,
          additionalNotes,
        }
      );

      res.status(201).json({
        message: 'Questionnaire submitted successfully',
        questionnaire,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get questionnaire history
router.get('/questionnaire/history', authenticateToken, authenticateUser, async (req, res, next) => {
  try {
    const history = await User.getQuestionnaireHistory(req.user.userId);

    res.json({
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// FAVORITES ROUTES
// ============================================

// Get user favorites
router.get('/favorites', authenticateToken, authenticateUser, async (req, res, next) => {
  try {
    const favorites = await User.getFavorites(req.user.userId);

    res.json({
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    next(error);
  }
});

// Add to favorites
router.post(
  '/favorites/:styleId',
  authenticateToken,
  authenticateUser,
  async (req, res, next) => {
    try {
      const { styleId } = req.params;
      const { notes } = req.body;

      const favorite = await User.addFavorite(req.user.userId, styleId, notes);

      res.status(201).json({
        message: 'Added to favorites',
        favorite,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Remove from favorites
router.delete(
  '/favorites/:styleId',
  authenticateToken,
  authenticateUser,
  async (req, res, next) => {
    try {
      const { styleId } = req.params;

      await User.removeFavorite(req.user.userId, styleId);

      res.json({
        message: 'Removed from favorites',
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// AI ANALYSIS ROUTES
// ============================================

// Get AI analysis for upload
router.get(
  '/analysis/:uploadId',
  authenticateToken,
  authenticateUser,
  async (req, res, next) => {
    try {
      const { uploadId } = req.params;

      const analysis = await User.getAIAnalysis(uploadId);

      if (!analysis) {
        return res.status(404).json({ error: 'AI analysis not found for this upload' });
      }

      res.json({
        analysis: {
          faceShape: analysis.face_shape,
          confidence: analysis.face_shape_confidence,
          facialCharacteristics: analysis.facial_characteristics,
          recommendedStyles: analysis.recommended_styles,
          stylingAdvice: analysis.styling_advice,
          maintenanceGuide: analysis.maintenance_guide,
          additionalNotes: analysis.additional_notes,
          analyzedAt: analysis.analyzed_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get personalized maintenance tips
router.post(
  '/maintenance-tips',
  authenticateToken,
  authenticateUser,
  async (req, res, next) => {
    try {
      const { beardStyle, lifestyle, maintenancePreference, ageRange } = req.body;

      if (!beardStyle || !lifestyle || !maintenancePreference) {
        return res.status(400).json({
          error: 'Missing required fields: beardStyle, lifestyle, maintenancePreference',
        });
      }

      const maintenanceTips = await ClaudeService.getPersonalizedMaintenanceTips(
        beardStyle,
        { lifestyle, maintenancePreference, ageRange }
      );

      res.json({
        beardStyle,
        maintenanceTips,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
