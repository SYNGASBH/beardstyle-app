const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Validate environment variables before anything else
const validateEnv = require('./config/validateEnv');
validateEnv();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const styleRoutes = require('./routes/styleRoutes');
const salonRoutes = require('./routes/salonRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration (must be before helmet so preflight requests work)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Security headers — disable policies that conflict with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Static files for uploads (with CORS headers for cross-origin access)
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static('uploads'));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query({ text: 'SELECT 1', query_timeout: 3000 });
    res.json({ status: 'OK', database: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
  } catch (_) {
    res.status(503).json({ status: 'unavailable', database: 'unavailable', timestamp: new Date().toISOString() });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/salon', salonRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Beard Style Advisor API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      user: '/api/user',
      styles: '/api/styles',
      salon: '/api/salon',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

// Test database connection before starting server
const { pool } = require('./config/database');

let server;
let shuttingDown = false;

pool.query('SELECT NOW()')
  .then(() => {
    if (shuttingDown) return;
    console.log('✅ Database connection successful');
    
    // Start server
    server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║  Beard Style Advisor API Server                  ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  Port: ${PORT}                                      ║
║  Time: ${new Date().toLocaleString()}    ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Graceful shutdown
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  const finish = async () => {
    try { await pool.end(); clearTimeout(timeout); process.exit(0); }
    catch (error) { console.error('Shutdown failed:', error); process.exit(1); }
  };
  if (server) server.close(finish); else finish();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
