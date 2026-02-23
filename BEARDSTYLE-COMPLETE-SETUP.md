╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║                   BEARDSTYLE - KOMPLETAN PRODUCTION SETUP                      ║
║                                                                                ║
║              GitHub → Docker → Node.js → PostgreSQL → React                   ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 1: GITHUB REPOSITORY SETUP
═══════════════════════════════════════════════════════════════════════════════════

1. KREIRAJ GITHUB REPO
─────────────────────
   [ ] Idi na https://github.com/new
   [ ] Repository name: beardstyle-app
   [ ] Description: "Hybrid Graphite Beard Style Explorer - Barber Tool"
   [ ] Public ili Private (preporuka: Public za portfolio)
   [ ] Initialize with: README.md, .gitignore (Node)
   [ ] Create repository

2. KLONIRAJ LOKALNO
─────────────────────
   git clone https://github.com/[username]/beardstyle-app.git
   cd beardstyle-app

3. KREIRAJ DIREKTORIJUMSKU STRUKTURU
─────────────────────────────────────
   beardstyle-app/
   ├── backend/                    # Node.js + Express server
   │   ├── src/
   │   │   ├── routes/
   │   │   │   └── beards.js
   │   │   ├── controllers/
   │   │   │   └── beardController.js
   │   │   ├── models/
   │   │   │   └── Beard.js
   │   │   ├── middleware/
   │   │   │   └── errorHandler.js
   │   │   └── server.js
   │   ├── config/
   │   │   └── database.js          # PostgreSQL konekcija
   │   ├── .env.example             # Environment template
   │   ├── package.json
   │   └── Dockerfile
   │
   ├── frontend/                    # React aplikacija
   │   ├── src/
   │   │   ├── components/
   │   │   │   ├── BeardGallery.jsx
   │   │   │   ├── BeardFilter.jsx
   │   │   │   └── BeardDetail.jsx
   │   │   ├── pages/
   │   │   │   ├── Home.jsx
   │   │   │   └── About.jsx
   │   │   ├── styles/
   │   │   │   └── App.css
   │   │   ├── App.jsx
   │   │   └── main.jsx
   │   ├── public/
   │   │   ├── images/
   │   │   │   └── hybrid/          # Beard slike
   │   │   │       └── mutton-chops/
   │   │   └── index.html
   │   ├── package.json
   │   ├── vite.config.js
   │   └── Dockerfile
   │
   ├── database/
   │   ├── migrations/
   │   │   └── 001_init_schema.sql
   │   ├── seeds/
   │   │   └── seed_beards.sql
   │   └── beardstyle-hybrid-setup.sql
   │
   ├── docker-compose.yml           # Orchestration svih servisa
   ├── .github/
   │   └── workflows/
   │       └── ci-cd.yml            # GitHub Actions za auto-deploy
   ├── .gitignore
   ├── README.md
   └── SETUP.md

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 2: BACKEND - NODE.JS + EXPRESS SETUP
═══════════════════════════════════════════════════════════════════════════════════

1. INICIJALIZIRAJ NODE PROJECT
────────────────────────────────
   cd backend
   npm init -y

2. INSTALIRAJ DEPENDENCIES
────────────────────────────
   npm install express \
               pg \                 # PostgreSQL driver
               dotenv \            # Environment variables
               cors \              # Cross-Origin Resource Sharing
               helmet \            # Security headers
               morgan \            # Logging
               joi \               # Data validation
               multer              # File upload (za slike)

   npm install -D nodemon \        # Auto-restart na promjena
                 @types/express    # TypeScript types (optional)

3. KREIRAJ .env FAJL
────────────────────
   cat > .env << EOF
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
   MAX_FILE_SIZE=5242880  # 5MB
   EOF

4. KREIRAJ server.js
────────────────────
   const express = require('express');
   const cors = require('cors');
   const helmet = require('helmet');
   const morgan = require('morgan');
   require('dotenv').config();
   
   const app = express();
   
   // Middleware
   app.use(helmet());
   app.use(cors({ origin: process.env.FRONTEND_URL }));
   app.use(morgan('combined'));
   app.use(express.json());
   
   // Database connection test
   const { Pool } = require('pg');
   const pool = new Pool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     database: process.env.DB_NAME,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
   });
   
   pool.on('error', (err) => console.error('Unexpected error on idle client', err));
   
   // Routes
   app.get('/api/beards', async (req, res) => {
     try {
       const result = await pool.query('SELECT * FROM beard_styles_hybrid WHERE is_active = true ORDER BY featured DESC, created_at DESC');
       res.json(result.rows);
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Database query failed' });
     }
   });
   
   app.get('/api/beards/:id', async (req, res) => {
     try {
       const { id } = req.params;
       const result = await pool.query('SELECT * FROM beard_styles_hybrid WHERE id = $1', [id]);
       if (result.rows.length === 0) {
         return res.status(404).json({ error: 'Beard style not found' });
       }
       res.json(result.rows[0]);
     } catch (err) {
       res.status(500).json({ error: 'Database query failed' });
     }
   });
   
   // Health check
   app.get('/health', (req, res) => {
     res.json({ status: 'OK', timestamp: new Date() });
   });
   
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`🧔 BeardStyle API running on port ${PORT}`);
   });

5. KREIRAJ Dockerfile ZA BACKEND
────────────────────────────────
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["node", "src/server.js"]

6. DODAJ U package.json SCRIPTS
────────────────────────────────
   "scripts": {
     "start": "node src/server.js",
     "dev": "nodemon src/server.js",
     "test": "jest"
   }

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 3: FRONTEND - REACT + VITE SETUP
═══════════════════════════════════════════════════════════════════════════════════

1. KREIRAJ REACT PROJECT
────────────────────────
   cd ../frontend
   npm create vite@latest . -- --template react

2. INSTALIRAJ DEPENDENCIES
───────────────────────────
   npm install axios \             # HTTP requests
              react-router-dom     # Routing

3. KREIRAJ .env FAJL
────────────────────
   VITE_API_URL=http://localhost:5000/api

4. KREIRAJ BeardGallery.jsx
────────────────────────────
   import { useState, useEffect } from 'react';
   import axios from 'axios';
   
   export default function BeardGallery() {
     const [beards, setBeards] = useState([]);
     const [loading, setLoading] = useState(true);
     const [filter, setFilter] = useState('all');
   
     useEffect(() => {
       fetchBeards();
     }, []);
   
     const fetchBeards = async () => {
       try {
         const response = await axios.get(
           `${import.meta.env.VITE_API_URL}/beards`
         );
         setBeards(response.data);
       } catch (error) {
         console.error('Error fetching beards:', error);
       } finally {
         setLoading(false);
       }
     };
   
     if (loading) return <div>Loading...</div>;
   
     return (
       <div className="gallery">
         <h1>🧔 BeardStyle Hybrid Collection</h1>
         <div className="filters">
           <button onClick={() => setFilter('all')}>All Styles</button>
           <button onClick={() => setFilter('mutton_chops')}>Mutton Chops</button>
           <button onClick={() => setFilter('full_beard')}>Full Beard</button>
         </div>
         <div className="grid">
           {beards
             .filter(b => filter === 'all' || b.style_name === filter)
             .map(beard => (
               <div key={beard.id} className="card">
                 <img src={beard.image_url} alt={beard.name} />
                 <h3>{beard.name}</h3>
                 <p>{beard.description}</p>
               </div>
             ))}
         </div>
       </div>
     );
   }

5. KREIRAJ Dockerfile ZA FRONTEND
──────────────────────────────────
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 3000
   CMD ["nginx", "-g", "daemon off;"]

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 4: DATABASE - POSTGRESQL
═══════════════════════════════════════════════════════════════════════════════════

1. DOCKERFILE ZA POSTGRESQL
─────────────────────────────
   FROM postgres:15-alpine
   
   ENV POSTGRES_DB=beardstyle_db
   ENV POSTGRES_USER=amel
   ENV POSTGRES_PASSWORD=secure_password_123
   
   COPY ./database/beardstyle-hybrid-setup.sql /docker-entrypoint-initdb.d/
   
   EXPOSE 5432

2. KREIRAJ database/init.sql
─────────────────────────────
   -- Spremi sve SQL migracije ovdje
   -- Vidi prethodni SQL setup koji smo kreirali

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 5: DOCKER COMPOSE - ORCHESTRATION
═══════════════════════════════════════════════════════════════════════════════════

Kreiraj docker-compose.yml u root direktoriju:

version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    build:
      context: .
      dockerfile: database/Dockerfile
    container_name: beardstyle-db
    environment:
      POSTGRES_DB: beardstyle_db
      POSTGRES_USER: amel
      POSTGRES_PASSWORD: secure_password_123
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/beardstyle-hybrid-setup.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U amel"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - beardstyle-network

  # Node.js Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: beardstyle-api
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: beardstyle_db
      DB_USER: amel
      DB_PASSWORD: secure_password_123
      NODE_ENV: production
      PORT: 5000
      FRONTEND_URL: http://localhost:3000
    ports:
      - "5000:5000"
    volumes:
      - ./backend/src:/app/src
    networks:
      - beardstyle-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: beardstyle-web
    depends_on:
      - backend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://backend:5000/api
    networks:
      - beardstyle-network

volumes:
  postgres_data:

networks:
  beardstyle-network:
    driver: bridge

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 6: POKRETANJE APLIKACIJE
═══════════════════════════════════════════════════════════════════════════════════

KORAK 1: GIT PUSH
─────────────────
   git add .
   git commit -m "Initial BeardStyle app setup with Docker"
   git push origin main

KORAK 2: DOCKER BUILD & RUN
───────────────────────────
   # Build sve slike
   docker-compose build

   # Pokreni sve servise
   docker-compose up -d

   # Provjeri status
   docker-compose ps

   # Pogledaj logove
   docker-compose logs -f

KORAK 3: INICIJALIZUJ BAZU
──────────────────────────
   # Pokreni SQL setup script
   docker-compose exec postgres psql -U amel -d beardstyle_db -f /docker-entrypoint-initdb.d/init.sql

KORAK 4: TEST APLIKACIJE
────────────────────────
   Backend health check:
   curl http://localhost:5000/health
   
   Get all beards:
   curl http://localhost:5000/api/beards
   
   Frontend:
   Open http://localhost:3000 u browseru

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 7: GITHUB ACTIONS - CI/CD (OPTIONAL ALI PREPORUČENO)
═══════════════════════════════════════════════════════════════════════════════════

Kreiraj .github/workflows/ci-cd.yml:

name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: beardstyle_db
          POSTGRES_USER: amel
          POSTGRES_PASSWORD: secure_password_123
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Backend Dependencies
      run: |
        cd backend
        npm ci

    - name: Build Frontend
      run: |
        cd frontend
        npm ci
        npm run build

    - name: Run Tests (optional)
      run: |
        cd backend
        npm test

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and Push Docker Images
      run: |
        docker-compose build
        docker tag beardstyle-api:latest ${{ secrets.DOCKER_USERNAME }}/beardstyle-api:latest
        docker push ${{ secrets.DOCKER_USERNAME }}/beardstyle-api:latest

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 8: DEPLOY NA PRODUCTION (AWS/HEROKU/RENDER)
═══════════════════════════════════════════════════════════════════════════════════

OPCIJA A: RENDER.COM (Najjednostavnije)
────────────────────────────────────────
   [ ] Registriraj se na https://render.com
   [ ] Connect GitHub repo
   [ ] Kreiraj:
       - PostgreSQL Database service
       - Backend Web Service (Docker)
       - Frontend Static Site (React build)
   [ ] Set environment variables
   [ ] Deploy

OPCIJA B: RAILWAY.APP (Preporučeno)
────────────────────────────────────
   [ ] https://railway.app
   [ ] Connect GitHub
   [ ] Kreiraj PostgreSQL servis
   [ ] Kreiraj backend servis (Docker)
   [ ] Kreiraj frontend servis
   [ ] Railway automatski detecta docker-compose.yml

OPCIJA C: AWS (Professionalno)
───────────────────────────────
   [ ] ECS (Elastic Container Service)
   [ ] RDS (PostgreSQL)
   [ ] CloudFront (CDN za React)
   [ ] ALB (Load Balancer)

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 9: DAILY WORKFLOW - DODAVANJE NOVIH STILOVA
═══════════════════════════════════════════════════════════════════════════════════

1. GENERIRAJ SLIKE U MIDJOURNEY
───────────────────────────────
   Koristi prompt template sa style_name parametrom

2. SPREMI SLIKE
────────────────
   /frontend/public/images/hybrid/[style-name]/v{1,2,3}.png

3. UPDATE SQL (opcija A - direktno)
─────────────────────────────────────
   docker-compose exec postgres psql -U amel -d beardstyle_db

   INSERT INTO beard_styles_hybrid (...) VALUES (...);

4. UPDATE SQL (opcija B - kroz backend API)
──────────────────────────────────────────
   POST /api/beards/admin/create
   {
     "name": "New Style",
     "style_name": "new_style",
     "image_url": "/images/hybrid/new_style/v1.png",
     ...
   }

5. GIT PUSH
──────────
   git add .
   git commit -m "Add new beard style: [name]"
   git push origin main

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 10: TROUBLESHOOTING CHECKLIST
═══════════════════════════════════════════════════════════════════════════════════

Problem: "Cannot connect to database"
   [ ] Provjeri da je postgres servis pokrenut: docker-compose ps
   [ ] Provjeri logove: docker-compose logs postgres
   [ ] Provjeri credentials u .env fajlu
   [ ] Reset: docker-compose down -v && docker-compose up -d

Problem: "CORS error - frontend can't reach API"
   [ ] Provjeri FRONTEND_URL u backend .env
   [ ] Provjeri VITE_API_URL u frontend .env
   [ ] Provjeri da je backend running: curl http://localhost:5000/health

Problem: "Images not loading"
   [ ] Provjeri path u database: SELECT image_url FROM beard_styles_hybrid;
   [ ] Provjeri da su slike u /frontend/public/images/hybrid/
   [ ] Provjeri nginx.conf za static files

Problem: "Port already in use"
   [ ] Pronađi proces: lsof -i :5000 (ili :3000, :5432)
   [ ] Kill proces: kill -9 [PID]
   [ ] Ili promijeni port u docker-compose.yml

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 11: .gitignore TEMPLATE
═══════════════════════════════════════════════════════════════════════════════════

# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build
dist/
build/
*.tsbuildinfo

# Logs
logs/
*.log
npm-debug.log*

# Docker
.docker/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
.postgres_data/

═══════════════════════════════════════════════════════════════════════════════════
SEKCIJA 12: VERZIJA - README.md TEMPLATE
═══════════════════════════════════════════════════════════════════════════════════

# BeardStyle - Hybrid Graphite Beard Explorer

Modern web application for exploring and discovering beard styles using hybrid graphite 
pencil illustrations with digital shading. Built for barbers, stylists, and beard enthusiasts.

## Features

- 🧔 Extensive beard style gallery with hybrid graphite illustrations
- 🎨 Professional technical barber diagram aesthetic
- 📱 Responsive design for mobile and desktop
- 🔍 Filter and search by beard density, length, and coverage
- 📊 Analytics and view tracking
- 🎯 Curated collections of styles

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL 15
- **DevOps**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (za local development)

### Installation

1. Clone repository
```bash
git clone https://github.com/[username]/beardstyle-app.git
cd beardstyle-app
```

2. Build and run with Docker
```bash
docker-compose build
docker-compose up -d
```

3. Access application
- Frontend: http://localhost:3000
- API: http://localhost:5000
- API Health: http://localhost:5000/health

### Development

Local development (bez Docker):
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (u drugom terminalu)
cd frontend
npm install
npm run dev
```

## Project Structure

```
beardstyle-app/
├── backend/          # Node.js API
├── frontend/         # React application
├── database/         # PostgreSQL schemas
└── docker-compose.yml
```

## API Endpoints

- `GET /api/beards` - Sve brade
- `GET /api/beards/:id` - Specifična brада
- `GET /health` - Health check

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file

## Contact

Amel | SYNGAS BH | Sarajevo

═══════════════════════════════════════════════════════════════════════════════════
UKUPNA CHECKLIST ZA PRODUCTION
═══════════════════════════════════════════════════════════════════════════════════

[ ] GitHub repo kreiran i inicijaliziran
[ ] Backend folder sa Express serverom
[ ] Frontend folder sa React Vite aplikacijom
[ ] PostgreSQL database sa SQL schema
[ ] Dockerfile za backend
[ ] Dockerfile za frontend
[ ] docker-compose.yml sa svim servisima
[ ] .env template files
[ ] .gitignore
[ ] README.md
[ ] GitHub Actions CI/CD workflow
[ ] Testiran lokalno sa docker-compose
[ ] Sve slike u public/images folderima
[ ] Database migracije pokrenut
[ ] API endpoints testirani sa curl
[ ] Frontend može učitati podatke sa API-ja
[ ] Deployed na production (Render/Railway/AWS)
[ ] Domain/SSL konfiguriran
[ ] Monitoring setup (optional)
[ ] Backup strategy za bazu (optional)

═══════════════════════════════════════════════════════════════════════════════════

SPREMAN ZA START! 🚀

