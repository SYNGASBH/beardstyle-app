const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create({ email, password, firstName, lastName, phone }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, phone, created_at`,
      [email, passwordHash, firstName, lastName, phone]
    );
    
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, created_at, last_login
       FROM users WHERE id = $1 AND is_active = true`,
      [id]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(userId) {
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  // Update user profile
  static async update(userId, { firstName, lastName, phone }) {
    const result = await query(
      `UPDATE users 
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           phone = COALESCE($4, phone)
       WHERE id = $1
       RETURNING id, email, first_name, last_name, phone`,
      [userId, firstName, lastName, phone]
    );
    return result.rows[0];
  }

  // Add to favorites
  static async addFavorite(userId, styleId, notes = null) {
    const result = await query(
      `INSERT INTO user_favorites (user_id, beard_style_id, notes)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, beard_style_id) DO UPDATE
       SET notes = EXCLUDED.notes
       RETURNING *`,
      [userId, styleId, notes]
    );
    return result.rows[0];
  }

  // Remove from favorites
  static async removeFavorite(userId, styleId) {
    await query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND beard_style_id = $2',
      [userId, styleId]
    );
  }

  // Get user favorites
  static async getFavorites(userId) {
    const result = await query(
      `SELECT bs.*, uf.added_at, uf.notes as favorite_notes
       FROM user_favorites uf
       JOIN beard_styles bs ON uf.beard_style_id = bs.id
       WHERE uf.user_id = $1
       ORDER BY uf.added_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // Save upload
  static async saveUpload(userId, filePath, fileType, fileSize) {
    const result = await query(
      `INSERT INTO user_uploads (user_id, file_path, file_type, file_size)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, filePath, fileType, fileSize]
    );
    return result.rows[0];
  }

  // Save questionnaire
  static async saveQuestionnaire(userId, uploadId, questionnaireData) {
    const {
      faceShape,
      lifestyle,
      maintenancePreference,
      ageRange,
      currentStyle,
      styleGoals,
      additionalNotes,
    } = questionnaireData;

    const result = await query(
      `INSERT INTO user_questionnaires 
       (user_id, upload_id, face_shape, lifestyle, maintenance_preference, 
        age_range, current_style, style_goals, additional_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, uploadId, faceShape, lifestyle, maintenancePreference, 
       ageRange, currentStyle, styleGoals, additionalNotes]
    );
    return result.rows[0];
  }

  // Get user's questionnaire history
  static async getQuestionnaireHistory(userId) {
    const result = await query(
      `SELECT * FROM user_questionnaires
       WHERE user_id = $1
       ORDER BY submitted_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // Save AI analysis
  static async saveAIAnalysis(uploadId, analysisData) {
    const result = await query(
      `INSERT INTO ai_face_analysis
       (upload_id, face_shape, face_shape_confidence, facial_characteristics,
        recommended_styles, styling_advice, maintenance_guide, additional_notes, raw_analysis)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        uploadId,
        analysisData.faceShape,
        analysisData.faceShapeConfidence,
        JSON.stringify(analysisData.facialCharacteristics),
        JSON.stringify(analysisData.recommendedStyles),
        JSON.stringify(analysisData.stylingAdvice),
        JSON.stringify(analysisData.maintenanceGuide),
        analysisData.additionalNotes,
        JSON.stringify(analysisData),
      ]
    );
    return result.rows[0];
  }

  // Get AI analysis by upload ID
  static async getAIAnalysis(uploadId) {
    const result = await query(
      'SELECT * FROM ai_face_analysis WHERE upload_id = $1',
      [uploadId]
    );
    return result.rows[0];
  }

  // Get upload by ID
  static async getUploadById(uploadId) {
    const result = await query(
      'SELECT * FROM user_uploads WHERE id = $1',
      [uploadId]
    );
    return result.rows[0];
  }

  // Get upload with AI analysis
  static async getUploadWithAnalysis(uploadId, userId) {
    const result = await query(
      `SELECT
         uu.*,
         afa.*
       FROM user_uploads uu
       LEFT JOIN ai_face_analysis afa ON uu.id = afa.upload_id
       WHERE uu.id = $1 AND uu.user_id = $2`,
      [uploadId, userId]
    );
    return result.rows[0];
  }
}

module.exports = User;
