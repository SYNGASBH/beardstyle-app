╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║                   BEARDSTYLE - PRIMJERI GLAVNIH FAJLOVA                        ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════════
FAJL 1: backend/package.json
═══════════════════════════════════════════════════════════════════════════════════

{
  "name": "beardstyle-api",
  "version": "1.0.0",
  "description": "BeardStyle Backend API - Beard Style Explorer",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": [
    "beard",
    "barber",
    "api",
    "graphite",
    "illustration"
  ],
  "author": "Amel",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "joi": "^17.11.0",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "@types/express": "^4.17.21",
    "eslint": "^8.54.0"
  }
}

═══════════════════════════════════════════════════════════════════════════════════
FAJL 2: backend/src/server.js
═══════════════════════════════════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();

// ─── MIDDLEWARE ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ─── DATABASE CONNECTION ─────────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'beardstyle_db',
  user: process.env.DB_USER || 'amel',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// ─── ROUTES ──────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    service: 'BeardStyle API'
  });
});

// Get all active beard styles
app.get('/api/beards', async (req, res) => {
  try {
    const query = `
      SELECT * FROM beard_styles_hybrid 
      WHERE is_active = true 
      ORDER BY featured DESC, created_at DESC
    `;
    const result = await pool.query(query);
    
    // Update view count
    result.rows.forEach(async (beard) => {
      await pool.query(
        'UPDATE beard_styles_hybrid SET view_count = view_count + 1 WHERE id = $1',
        [beard.id]
      );
    });

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch beard styles'
    });
  }
});

// Get specific beard style
app.get('/api/beards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get main beard style
    const mainQuery = 'SELECT * FROM beard_styles_hybrid WHERE id = $1';
    const mainResult = await pool.query(mainQuery, [id]);
    
    if (mainResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Beard style not found'
      });
    }

    // Get variants
    const variantsQuery = 'SELECT * FROM beard_style_variants WHERE beard_style_id = $1 ORDER BY variant_number';
    const variantsResult = await pool.query(variantsQuery, [id]);

    // Update view count
    await pool.query(
      'UPDATE beard_styles_hybrid SET view_count = view_count + 1 WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...mainResult.rows[0],
        variants: variantsResult.rows
      }
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch beard style'
    });
  }
});

// Get beard styles by category
app.get('/api/beards/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const query = `
      SELECT * FROM beard_styles_hybrid 
      WHERE is_active = true AND style_name = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [category]);
    
    res.json({
      success: true,
      count: result.rows.length,
      category: category,
      data: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch beard styles by category'
    });
  }
});

// Get all collections
app.get('/api/collections', async (req, res) => {
  try {
    const query = `
      SELECT bsc.*, COUNT(bsic.beard_style_id) as style_count
      FROM beard_style_collections bsc
      LEFT JOIN beard_style_in_collection bsic ON bsc.id = bsic.collection_id
      GROUP BY bsc.id
      ORDER BY bsc.featured DESC
    `;
    const result = await pool.query(query);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collections'
    });
  }
});

// Get styles in collection
app.get('/api/collections/:collectionId/beards', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const query = `
      SELECT bsh.*, bsic.sort_order
      FROM beard_styles_hybrid bsh
      INNER JOIN beard_style_in_collection bsic ON bsh.id = bsic.beard_style_id
      WHERE bsic.collection_id = $1 AND bsh.is_active = true
      ORDER BY bsic.sort_order
    `;
    const result = await pool.query(query, [collectionId]);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection styles'
    });
  }
});

// Search beards
app.get('/api/search', async (req, res) => {
  try {
    const { q, density, length } = req.query;
    let query = 'SELECT * FROM beard_styles_hybrid WHERE is_active = true';
    const params = [];

    if (q) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
      params.push(`%${q}%`);
    }

    if (density) {
      query += ` AND beard_density LIKE $${params.length + 1}`;
      params.push(`%${density}%`);
    }

    if (length) {
      query += ` AND coverage_area = $${params.length + 1}`;
      params.push(length);
    }

    query += ' ORDER BY featured DESC, created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// ─── ERROR HANDLING ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// ─── START SERVER ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🧔 BeardStyle API Server                                     ║
║                                                                ║
║  Port: ${PORT}                                                   ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432} ║
║  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}       ║
║                                                                ║
║  Health Check: http://localhost:${PORT}/health                 ║
║  API Root: http://localhost:${PORT}/api                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

export default app;

═══════════════════════════════════════════════════════════════════════════════════
FAJL 3: frontend/package.json
═══════════════════════════════════════════════════════════════════════════════════

{
  "name": "beardstyle-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}

═══════════════════════════════════════════════════════════════════════════════════
FAJL 4: frontend/src/App.jsx
═══════════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [beards, setBeards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeard, setSelectedBeard] = useState(null);
  const [filter, setFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchBeards();
  }, [filter]);

  const fetchBeards = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/beards`;
      if (filter !== 'all') {
        url = `${API_URL}/beards/category/${filter}`;
      }

      const response = await axios.get(url);
      setBeards(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching beards:', err);
      setError('Failed to load beard styles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBeardDetails = async (beardId) => {
    try {
      const response = await axios.get(`${API_URL}/beards/${beardId}`);
      setSelectedBeard(response.data.data);
    } catch (err) {
      console.error('Error fetching beard details:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            🧔 BeardStyle Explorer
          </h1>
          <p className="text-gray-600 mt-2">
            Discover professional beard styles with hybrid graphite illustrations
          </p>
        </div>
      </header>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Styles
          </button>
          <button
            onClick={() => setFilter('mutton_chops')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'mutton_chops'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Mutton Chops
          </button>
          <button
            onClick={() => setFilter('full_beard')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'full_beard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Full Beard
          </button>
        </div>
      </div>

      {/* GALLERY */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading beard styles...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-gray-600 mb-4">
              Found {beards.length} beard style{beards.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beards.map((beard) => (
                <div
                  key={beard.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
                  onClick={() => fetchBeardDetails(beard.id)}
                >
                  <img
                    src={beard.image_url}
                    alt={beard.name}
                    className="w-full h-64 object-cover bg-gray-100"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {beard.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {beard.description}
                    </p>
                    <div className="mt-4 flex gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {beard.beard_density}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {beard.coverage_area}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-3">
                      Views: {beard.view_count}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBeard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedBeard.name}</h2>
              <button
                onClick={() => setSelectedBeard(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedBeard.image_url}
                alt={selectedBeard.name}
                className="w-full mb-6 rounded-lg"
              />
              <p className="text-gray-700 mb-4">{selectedBeard.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Density</p>
                  <p className="text-gray-600">{selectedBeard.beard_density}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Length</p>
                  <p className="text-gray-600">{selectedBeard.beard_length_cm} cm</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Coverage</p>
                  <p className="text-gray-600">{selectedBeard.coverage_area}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mustache</p>
                  <p className="text-gray-600">{selectedBeard.mustache_style}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

═══════════════════════════════════════════════════════════════════════════════════
FAJL 5: backend/.env.example
═══════════════════════════════════════════════════════════════════════════════════

# DATABASE
DB_HOST=postgres
DB_PORT=5432
DB_NAME=beardstyle_db
DB_USER=amel
DB_PASSWORD=secure_password_123

# SERVER
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=http://localhost:3000

# FILE UPLOAD
UPLOAD_DIR=../frontend/public/images
MAX_FILE_SIZE=5242880

═══════════════════════════════════════════════════════════════════════════════════
FAJL 6: frontend/.env.example
═══════════════════════════════════════════════════════════════════════════════════

VITE_API_URL=http://localhost:5000/api

═══════════════════════════════════════════════════════════════════════════════════
FAJL 7: Dockerfile (Backend)
═══════════════════════════════════════════════════════════════════════════════════

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "src/server.js"]

═══════════════════════════════════════════════════════════════════════════════════
FAJL 8: Dockerfile (Frontend)
═══════════════════════════════════════════════════════════════════════════════════

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

═══════════════════════════════════════════════════════════════════════════════════
FAJL 9: nginx.conf (za Frontend)
═══════════════════════════════════════════════════════════════════════════════════

server {
    listen 3000;
    server_name _;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve static files
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

═══════════════════════════════════════════════════════════════════════════════════

SADA IMAŠ SVE ŠTO TREBAS! 🚀

