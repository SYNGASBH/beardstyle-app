const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Salon = require('../models/Salon');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ============================================
// USER AUTHENTICATION
// ============================================

// Register new user
router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ]),
  async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        accountType: 'user',
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// User login
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await User.verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        accountType: 'user',
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// SALON AUTHENTICATION
// ============================================

// Register new salon
router.post(
  '/salon/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('salonName').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('country').trim().notEmpty(),
  ]),
  async (req, res, next) => {
    try {
      const { email, password, salonName, phone, address, city, country } = req.body;

      // Check if salon exists
      const existingSalon = await Salon.findByEmail(email);
      if (existingSalon) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Create salon
      const salon = await Salon.create({
        salonName,
        email,
        password,
        phone,
        address,
        city,
        country,
      });

      // Generate token
      const token = generateToken({
        salonId: salon.id,
        email: salon.email,
        accountType: 'salon',
      });

      res.status(201).json({
        message: 'Salon registered successfully',
        salon: {
          id: salon.id,
          salonName: salon.salon_name,
          email: salon.email,
          city: salon.city,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Salon login
router.post(
  '/salon/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find salon
      const salon = await Salon.findByEmail(email);
      if (!salon) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await Salon.verifyPassword(password, salon.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        salonId: salon.id,
        email: salon.email,
        accountType: 'salon',
      });

      res.json({
        message: 'Login successful',
        salon: {
          id: salon.id,
          salonName: salon.salon_name,
          email: salon.email,
          subscriptionTier: salon.subscription_tier,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
