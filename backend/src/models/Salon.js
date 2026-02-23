const { query, transaction } = require('../config/database');
const bcrypt = require('bcryptjs');

class Salon {
  // Create new salon account
  static async create({ salonName, email, password, phone, address, city, country }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO salon_accounts 
       (salon_name, email, password_hash, phone, address, city, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, salon_name, email, phone, address, city, country, 
                 subscription_tier, created_at`,
      [salonName, email, passwordHash, phone, address, city, country]
    );
    
    return result.rows[0];
  }

  // Find salon by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM salon_accounts WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  }

  // Find salon by ID
  static async findById(id) {
    const result = await query(
      `SELECT id, salon_name, email, phone, address, city, country,
              subscription_tier, subscription_expires, created_at
       FROM salon_accounts WHERE id = $1 AND is_active = true`,
      [id]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create customer for salon
  static async createCustomer(salonId, { customerName, customerEmail, customerPhone, notes }) {
    const result = await query(
      `INSERT INTO salon_customers 
       (salon_id, customer_name, customer_email, customer_phone, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [salonId, customerName, customerEmail, customerPhone, notes]
    );
    return result.rows[0];
  }

  // Get all customers for salon
  static async getCustomers(salonId) {
    const result = await query(
      `SELECT * FROM salon_customers 
       WHERE salon_id = $1 
       ORDER BY last_visit DESC NULLS LAST, created_at DESC`,
      [salonId]
    );
    return result.rows;
  }

  // Get customer by ID
  static async getCustomerById(customerId, salonId) {
    const result = await query(
      `SELECT * FROM salon_customers 
       WHERE id = $1 AND salon_id = $2`,
      [customerId, salonId]
    );
    return result.rows[0];
  }

  // Generate unique session code
  static generateSessionCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Create collaborative session
  static async createSession(salonId, customerId, uploadId = null) {
    let sessionCode;
    let unique = false;
    
    // Ensure unique session code
    while (!unique) {
      sessionCode = this.generateSessionCode();
      const existing = await query(
        'SELECT id FROM salon_sessions WHERE session_code = $1',
        [sessionCode]
      );
      if (existing.rows.length === 0) {
        unique = true;
      }
    }

    const result = await query(
      `INSERT INTO salon_sessions 
       (salon_id, customer_id, session_code, upload_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [salonId, customerId, sessionCode, uploadId]
    );
    
    return result.rows[0];
  }

  // Get session by code
  static async getSessionByCode(sessionCode) {
    const result = await query(
      `SELECT ss.*, 
              sc.customer_name, sc.customer_email,
              sa.salon_name,
              bs.name as current_style_name
       FROM salon_sessions ss
       JOIN salon_customers sc ON ss.customer_id = sc.id
       JOIN salon_accounts sa ON ss.salon_id = sa.id
       LEFT JOIN beard_styles bs ON ss.current_style_id = bs.id
       WHERE ss.session_code = $1`,
      [sessionCode]
    );
    return result.rows[0];
  }

  // Get session by ID
  static async getSessionById(sessionId, salonId) {
    const result = await query(
      `SELECT ss.*,
              sc.customer_name, sc.customer_email,
              bs.name as current_style_name
       FROM salon_sessions ss
       JOIN salon_customers sc ON ss.customer_id = sc.id
       LEFT JOIN beard_styles bs ON ss.current_style_id = bs.id
       WHERE ss.id = $1 AND ss.salon_id = $2`,
      [sessionId, salonId]
    );
    return result.rows[0];
  }

  // Update session style
  static async updateSessionStyle(sessionId, styleId, changedBy, notes = null) {
    return transaction(async (client) => {
      // Update current style
      await client.query(
        `UPDATE salon_sessions 
         SET current_style_id = $1 
         WHERE id = $2`,
        [styleId, sessionId]
      );

      // Record change in history
      const result = await client.query(
        `INSERT INTO session_styles 
         (session_id, beard_style_id, changed_by, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [sessionId, styleId, changedBy, notes]
      );

      return result.rows[0];
    });
  }

  // Get session style history
  static async getSessionHistory(sessionId) {
    const result = await query(
      `SELECT ss.*, bs.name as style_name, bs.image_url
       FROM session_styles ss
       JOIN beard_styles bs ON ss.beard_style_id = bs.id
       WHERE ss.session_id = $1
       ORDER BY ss.changed_at ASC`,
      [sessionId]
    );
    return result.rows;
  }

  // Complete session
  static async completeSession(sessionId, stylistNotes = null, customerFeedback = null) {
    return transaction(async (client) => {
      // Update session
      await client.query(
        `UPDATE salon_sessions 
         SET status = 'completed',
             completed_at = CURRENT_TIMESTAMP,
             stylist_notes = COALESCE($2, stylist_notes),
             customer_feedback = COALESCE($3, customer_feedback)
         WHERE id = $1`,
        [sessionId, stylistNotes, customerFeedback]
      );

      // Update customer last visit
      await client.query(
        `UPDATE salon_customers 
         SET last_visit = CURRENT_TIMESTAMP
         WHERE id = (SELECT customer_id FROM salon_sessions WHERE id = $1)`,
        [sessionId]
      );
    });
  }

  // Get salon's active sessions
  static async getActiveSessions(salonId) {
    const result = await query(
      `SELECT ss.*,
              sc.customer_name,
              bs.name as current_style_name
       FROM salon_sessions ss
       JOIN salon_customers sc ON ss.customer_id = sc.id
       LEFT JOIN beard_styles bs ON ss.current_style_id = bs.id
       WHERE ss.salon_id = $1 AND ss.status = 'active'
       ORDER BY ss.started_at DESC`,
      [salonId]
    );
    return result.rows;
  }

  // Get salon statistics
  static async getStats(salonId) {
    const result = await query(
      `SELECT 
         COUNT(DISTINCT customer_id) as total_customers,
         COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
         COUNT(*) FILTER (WHERE status = 'active') as active_sessions,
         COUNT(*) FILTER (WHERE started_at > NOW() - INTERVAL '30 days') as sessions_last_month
       FROM salon_sessions
       WHERE salon_id = $1`,
      [salonId]
    );
    return result.rows[0];
  }
}

module.exports = Salon;
