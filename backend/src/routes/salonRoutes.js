const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const { authenticateToken, authenticateSalon, optionalAuth } = require('../middleware/auth');

// ============================================
// SALON PROFILE ROUTES
// ============================================

// Get salon profile
router.get('/profile', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.user.salonId);
    
    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    res.json({ salon });
  } catch (error) {
    next(error);
  }
});

// Get salon statistics
router.get('/stats', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const stats = await Salon.getStats(req.user.salonId);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CUSTOMER MANAGEMENT ROUTES
// ============================================

// Get all customers
router.get('/customers', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const customers = await Salon.getCustomers(req.user.salonId);

    res.json({
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
});

// Create new customer
router.post('/customers', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, notes } = req.body;

    if (!customerName) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    const customer = await Salon.createCustomer(req.user.salonId, {
      customerName,
      customerEmail,
      customerPhone,
      notes,
    });

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    next(error);
  }
});

// Get single customer
router.get('/customers/:customerId', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const customer = await Salon.getCustomerById(customerId, req.user.salonId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
});

// ============================================
// COLLABORATIVE SESSION ROUTES
// ============================================

// Create new session
router.post('/session/create', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const { customerId, uploadId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    // Verify customer belongs to this salon
    const customer = await Salon.getCustomerById(customerId, req.user.salonId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const session = await Salon.createSession(req.user.salonId, customerId, uploadId);

    res.status(201).json({
      message: 'Session created successfully',
      session: {
        id: session.id,
        sessionCode: session.session_code,
        customerId: session.customer_id,
        status: session.status,
        startedAt: session.started_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get session by code (accessible by anyone with the code)
router.get('/session/join/:code', optionalAuth, async (req, res, next) => {
  try {
    const { code } = req.params;

    const session = await Salon.getSessionByCode(code);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Session is no longer active' });
    }

    res.json({ session });
  } catch (error) {
    next(error);
  }
});

// Get session details (salon access)
router.get('/session/:sessionId', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Salon.getSessionById(sessionId, req.user.salonId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get session history
    const history = await Salon.getSessionHistory(sessionId);

    res.json({
      session,
      history,
    });
  } catch (error) {
    next(error);
  }
});

// Update session style
router.put('/session/:sessionId/style', optionalAuth, async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { styleId, notes } = req.body;

    if (!styleId) {
      return res.status(400).json({ error: 'Style ID is required' });
    }

    // Determine who is making the change
    let changedBy = 'customer';
    if (req.user && req.user.accountType === 'salon') {
      changedBy = 'salon';
    }

    const change = await Salon.updateSessionStyle(sessionId, styleId, changedBy, notes);

    res.json({
      message: 'Style updated successfully',
      change,
    });
  } catch (error) {
    next(error);
  }
});

// Complete session
router.post('/session/:sessionId/complete', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { stylistNotes, customerFeedback } = req.body;

    // Verify session belongs to this salon
    const session = await Salon.getSessionById(sessionId, req.user.salonId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await Salon.completeSession(sessionId, stylistNotes, customerFeedback);

    res.json({
      message: 'Session completed successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get active sessions
router.get('/sessions/active', authenticateToken, authenticateSalon, async (req, res, next) => {
  try {
    const sessions = await Salon.getActiveSessions(req.user.salonId);

    res.json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
});

// Get session history
router.get('/session/:sessionId/history', optionalAuth, async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const history = await Salon.getSessionHistory(sessionId);

    res.json({
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
