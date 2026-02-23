# Beard Style Advisor - Quick Start Guide

## Brzo Pokretanje Projekta

### Opcija 1: Docker (Preporučeno - Najbrže)

Ovo će pokrenuti cijeli stack (PostgreSQL, Backend, Frontend) sa jednom komandom:

```bash
# Kopiraj cijeli projekat
cd beard-style-app

# Pokreni sve servise
docker-compose up -d

# Čekaj 30-60 sekundi dok se sve pokrene, zatim pristup:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# PostgreSQL: localhost:5432
```

Za zaustavljanje:
```bash
docker-compose down
```

Za ponovni build:
```bash
docker-compose down
docker-compose up -d --build
```

---

### Opcija 2: Manuelna Instalacija

#### 1. Setup PostgreSQL Baze

```bash
# Kreiraj bazu
createdb beard_style_db

# Pokreni migrations
cd database
psql beard_style_db < migrations/001_initial_schema.sql

# Pokreni seeds
psql beard_style_db < seeds/001_beard_styles_seed.sql
```

#### 2. Setup Backend

```bash
cd backend

# Instaliraj dependencies
npm install

# Kreiraj .env fajl (kopiraj iz .env.example)
cp .env.example .env

# Edituj .env sa tvojim podacima:
# DATABASE_URL=postgresql://username:password@localhost:5432/beard_style_db
# JWT_SECRET=your_secret_key

# Pokreni development server
npm run dev

# Backend će biti na http://localhost:5000
```

#### 3. Setup Frontend

```bash
# U novom terminalu
cd frontend

# Instaliraj dependencies
npm install

# Kreiraj .env fajl
cp .env.example .env

# Pokreni development server
npm start

# Frontend će biti na http://localhost:3000
```

---

## Test Accounts (iz seed data)

### User Account
- Email: `demo@example.com`
- Password: `demo123`

### Salon Account
- Email: `salon@example.com`
- Password: `demo123`

---

## API Endpoints - Brzi Test

Testiranje API-a sa `curl`:

```bash
# Health check
curl http://localhost:5000/health

# Get all beard styles
curl http://localhost:5000/api/styles

# Get popular styles
curl http://localhost:5000/api/styles/popular

# User login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

---

## Struktura Projekta - Brzi Pregled

```
beard-style-app/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, error handling
│   │   └── server.js    # Entry point
│   └── package.json
│
├── frontend/            # React aplikacija
│   ├── src/
│   │   ├── components/  # React komponente
│   │   ├── pages/       # Page komponente
│   │   ├── services/    # API calls
│   │   └── App.js       # Main app
│   └── package.json
│
├── database/            # SQL migrations i seeds
│   ├── migrations/
│   └── seeds/
│
└── docker-compose.yml   # Docker setup
```

---

## Šta Dalje?

### Prioriteti za MVP:

1. **Upload Komponenta** (`frontend/src/components/upload/`)
   - Image upload
   - Camera capture
   - Preview

2. **Upitnik Forma** (`frontend/src/components/questionnaire/`)
   - Multi-step form
   - Validacija
   - Submit API call

3. **Galerija** (`frontend/src/components/gallery/`)
   - Grid layout
   - Filteri
   - Search

4. **Preview/Overlay** (`frontend/src/components/preview/`)
   - Canvas manipulation
   - Beard overlay na user slici

5. **Salon Dashboard** (`frontend/src/pages/SalonDashboard.js`)
   - Customer management
   - Session creation
   - Collaborative features

---

## Debugging

### Backend ne radi?
```bash
# Provjeri logs
docker-compose logs backend

# Ili ako pokrenut manualno:
cd backend
npm run dev
# Pogledaj error message u terminalu
```

### Frontend ne radi?
```bash
# Provjeri logs
docker-compose logs frontend

# Provjeri da li je backend running
curl http://localhost:5000/health
```

### Database issue?
```bash
# Provjeri da li je PostgreSQL running
docker-compose logs postgres

# Ili manualno:
psql beard_style_db -c "SELECT * FROM users LIMIT 1;"
```

---

## Dodatne Komande

```bash
# Reset baze podataka
docker-compose down -v
docker-compose up -d

# Backend tests (kada budu implementirani)
cd backend
npm test

# Production build frontend
cd frontend
npm run build
```

---

## Pomoć

Za dodatna pitanja ili probleme:
1. Provjeri README.md za detaljnu dokumentaciju
2. Provjeri API dokumentaciju u `docs/API.md` (TODO)
3. Kontaktiraj SYNGAS BH team

Happy coding! 🚀
