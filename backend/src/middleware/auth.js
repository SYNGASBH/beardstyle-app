const jwt = require('jsonwebtoken');

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// Verify user is salon account
const authenticateSalon = (req, res, next) => {
  if (req.user.accountType !== 'salon') {
    return res.status(403).json({ error: 'Salon account required' });
  }
  next();
};

// Verify user is regular user
const authenticateUser = (req, res, next) => {
  if (req.user.accountType !== 'user') {
    return res.status(403).json({ error: 'User account required' });
  }
  next();
};

// Optional authentication - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  });
};

// Require a minimum salon subscription tier
// Usage: requireSalonTier('premium') or requireSalonTier('enterprise')
const requireSalonTier = (minTier) => {
  const tierOrder = { basic: 0, premium: 1, enterprise: 2 };

  return async (req, res, next) => {
    // Lazy-load Salon model to avoid circular deps
    const Salon = require('../models/Salon');
    const salon = await Salon.findById(req.user.salonId);

    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    const currentTier = salon.subscription_tier || 'basic';
    const currentLevel = tierOrder[currentTier] ?? 0;
    const requiredLevel = tierOrder[minTier] ?? 0;

    if (currentLevel < requiredLevel) {
      return res.status(403).json({
        error: `Ova funkcija zahtijeva ${minTier} pretplatu. Trenutni plan: ${currentTier}.`,
        requiredTier: minTier,
        currentTier,
      });
    }

    req.salonTier = currentTier;
    next();
  };
};

module.exports = {
  authenticateToken,
  authenticateSalon,
  authenticateUser,
  optionalAuth,
  requireSalonTier,
};
