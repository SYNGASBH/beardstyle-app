# BeardStyle — Hybrid Graphite Beard Style Explorer

Personalni AI savjetnik za stil brade. Korisnik uploada fotografiju lica, Claude AI analizira oblik lica i preporučuje optimalne stilove brade iz galerije ilustracija u tehnici grafitne olovke.

Alat je namijenjen brijačnicama, frizerima i entuzijastima koji žele pronaći idealan stil brade.

---

## Tehnologije

| Sloj | Stack |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Zustand |
| Backend | Node.js, Express, Multer, ImageMagick |
| Baza | PostgreSQL 14 |
| AI | Claude API (Anthropic) — analiza lica i preporuke |
| DevOps | Docker, Docker Compose |

---

## Zahtjevi

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (uključuje Docker Compose)
- Git
- Claude API ključ — [console.anthropic.com](https://console.anthropic.com)

---

## Pokretanje (lokalno)

### 1. Kloniraj repozitorij

```bash
git clone https://github.com/SYNGASBH/beardstyle-app.git
cd beardstyle-app
```

### 2. Kreiraj `.env` fajl

```bash
cp .env.example .env
```

Uredi `.env` i popuni vrijednosti:

```env
# Database
POSTGRES_USER=bearduser
POSTGRES_PASSWORD=beardpass123
POSTGRES_DB=beard_style_db

# Backend
NODE_ENV=development
PORT=5000
JWT_SECRET=promijeni_ovo_u_tajni_kljuc

# CORS
FRONTEND_URL=http://localhost:3000

# AI
USE_MOCK_AI=false
CLAUDE_API_KEY=sk-ant-api03-...
```

> Ako nemaš Claude API ključ, postavi `USE_MOCK_AI=true` da koristiš mock podatke.

### 3. Pokreni Docker

```bash
docker-compose up -d --build
```

Prva build traje 2–3 minute. Nakon toga:

| Servis | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/health |

### 4. Kreiraj korisnički račun

Idi na http://localhost:3000/register i registruj se.

---

## Korištenje

1. **Registracija / Login** — na `/register` ili `/login`
2. **Upload fotografije** — na `/upload`, odaberi fotografiju lica ili uslikaj kamerom
3. **AI analiza** — Claude analizira oblik lica (oval, kvadrat, okruglo, itd.)
4. **Preporuke** — prikazuju se stilovi brade rangirani po podudarnosti
5. **Galerija** — pregledaj sve stilove na `/gallery`
6. **Favoriti** — spremi omiljene stilove

---

## API Endpointi

```
POST   /api/auth/register          Registracija korisnika
POST   /api/auth/login             Login korisnika
POST   /api/user/upload            Upload fotografije (auth)
POST   /api/styles/recommend       AI preporuke (auth)
GET    /api/styles                 Svi stilovi brade
GET    /api/styles/popular         Popularni stilovi
GET    /health                     Health check
```

---

## Upravljanje Dockerom

```bash
# Provjeri status servisa
docker-compose ps

# Pogledaj logove
docker-compose logs -f

# Zaustavi sve servise
docker-compose down

# Zaustavi i obriši bazu (reset)
docker-compose down -v
```

---

## Struktura projekta

```
beardstyle-app/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── routes/   # Auth, User, Styles
│       ├── models/   # User, BeardStyle, Salon
│       └── services/ # ClaudeService (AI analiza)
├── frontend/         # React aplikacija
│   └── src/
│       ├── pages/    # Upload, Gallery, Preview, Login...
│       └── services/ # API klijent (axios)
├── database/         # SQL migracije i seed podaci
├── docker-compose.yml
└── .env.example
```

---

## Autor

Amel Topčagić — [SYNGAS BH](https://github.com/SYNGASBH), Sarajevo

---

## Licenca

MIT
