╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║              BEARDSTYLE - BRZA CHECKLIST (Što trebam pokrenuti?)              ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════════
PRIJE SVEGA: PREUZMI I INSTALIRAJ
═══════════════════════════════════════════════════════════════════════════════════

[ ] Docker Desktop
    👉 https://www.docker.com/products/docker-desktop
    
[ ] Git
    👉 https://git-scm.com/downloads
    
[ ] GitHub Account
    👉 https://github.com/signup
    
[ ] Node.js 18+ (za local development)
    👉 https://nodejs.org/


═══════════════════════════════════════════════════════════════════════════════════
KORAK 1: GITHUB SETUP (5 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Kreiraj GitHub repo na https://github.com/new
    - Name: beardstyle-app
    - Public
    - Initialize with README.md

[ ] Kloniraj lokalno:
    git clone https://github.com/[tvoj-username]/beardstyle-app.git
    cd beardstyle-app

[ ] Push koda:
    git add .
    git commit -m "Initial commit"
    git push origin main


═══════════════════════════════════════════════════════════════════════════════════
KORAK 2: KREIRAJ FOLDER STRUKTURU (2 minuta)
═══════════════════════════════════════════════════════════════════════════════════

Pokreni u root direktoriju projekta:

mkdir -p backend/src/{routes,controllers,models,middleware}
mkdir -p backend/config
mkdir -p frontend/src/{components,pages,styles}
mkdir -p frontend/public/images/hybrid/mutton-chops
mkdir -p database/migrations
mkdir -p database/seeds
mkdir -p .github/workflows

═══════════════════════════════════════════════════════════════════════════════════
KORAK 3: BACKEND SETUP (10 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] cd backend

[ ] Kreiraj package.json:
    npm init -y

[ ] Kopiiraj sadržaj iz BEARDSTYLE-FILE-EXAMPLES.md
    - package.json
    - .env.example
    - Dockerfile

[ ] Instaliraj dependencies:
    npm install

[ ] Kreiraj src/server.js:
    - Kopiiraj kod iz BEARDSTYLE-FILE-EXAMPLES.md
    - Spremi kao backend/src/server.js

[ ] Test lokalno:
    npm run dev
    
    Trebalo bi vidjeti:
    ╔════════════════════════════════════════════════════════════════╗
    ║  🧔 BeardStyle API Server                                     ║
    ║  Port: 5000                                                    ║
    ║  Health Check: http://localhost:5000/health                   ║
    ╚════════════════════════════════════════════════════════════════╝

[ ] Test API:
    curl http://localhost:5000/health
    
    Trebalo bi vratiti:
    {"status":"OK","timestamp":"2024-02-14T...","service":"BeardStyle API"}

[ ] Vrati na root:
    cd ..


═══════════════════════════════════════════════════════════════════════════════════
KORAK 4: FRONTEND SETUP (10 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] cd frontend

[ ] Kreiraj Vite React projekt:
    npm create vite@latest . -- --template react

[ ] Kopiiraj iz BEARDSTYLE-FILE-EXAMPLES.md:
    - package.json
    - .env.example
    - Dockerfile (Frontend)
    - src/App.jsx

[ ] Instaliraj dependencies:
    npm install

[ ] Test lokalno:
    npm run dev
    
    Trebalo bi vidjeti:
    ➜  Local:   http://localhost:5173/

[ ] Open u browseru:
    http://localhost:5173

[ ] Vrati na root:
    cd ..


═══════════════════════════════════════════════════════════════════════════════════
KORAK 5: DATABASE SETUP (5 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Spremi SQL schema iz prethodnog document-a:
    database/beardstyle-hybrid-setup.sql

[ ] Kreiraj Dockerfile za PostgreSQL:
    database/Dockerfile
    
    FROM postgres:15-alpine
    ENV POSTGRES_DB=beardstyle_db
    ENV POSTGRES_USER=amel
    ENV POSTGRES_PASSWORD=secure_password_123
    COPY ./database/beardstyle-hybrid-setup.sql /docker-entrypoint-initdb.d/
    EXPOSE 5432


═══════════════════════════════════════════════════════════════════════════════════
KORAK 6: DOCKER COMPOSE (5 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Kreiraj docker-compose.yml u root foldera
    (Kopiiraj iz BEARDSTYLE-COMPLETE-SETUP.md - sekcija 5)

[ ] Kreiraj nginx.conf u root foldera:
    (Kopiiraj iz BEARDSTYLE-FILE-EXAMPLES.md - FAJL 9)

[ ] .gitignore (ako ne postoji):
    Kopiiraj iz BEARDSTYLE-COMPLETE-SETUP.md - sekcija 11


═══════════════════════════════════════════════════════════════════════════════════
KORAK 7: DOCKER BUILD & RUN (15 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Pokreni sve Docker servise:
    docker-compose build
    
    Trebalo bi vidjeti:
    [+] Building ... 12.3s
    [+] Running ...

[ ] Pokreni servise:
    docker-compose up -d
    
    Trebalo bi vidjeti:
    ✔ Container beardstyle-db is healthy
    ✔ Container beardstyle-api is healthy
    ✔ Container beardstyle-web is started

[ ] Provjeri status:
    docker-compose ps
    
    Trebalo bi vidjeti:
    STATUS          PORTS
    healthy         0.0.0.0:5432->5432/tcp
    healthy         0.0.0.0:5000->5000/tcp
    started         0.0.0.0:3000->3000/tcp

[ ] Pogledaj logove:
    docker-compose logs -f
    
    Trebalo bi vidjeti:
    postgres  | 🧔 BeardStyle API running on port 5000
    postgres  | listening on IPv4 address "0.0.0.0", port 5432

[ ] Test API kroz Docker:
    curl http://localhost:5000/health
    
    Trebalo bi vratiti:
    {"status":"OK",...}

[ ] Open frontend u browseru:
    http://localhost:3000
    
    Trebalo bi vidjeti:
    🧔 BeardStyle Explorer


═══════════════════════════════════════════════════════════════════════════════════
KORAK 8: POPUNI BAZU SA PODACIMA (5 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Pokreni Mutton Chops INSERT:
    docker-compose exec postgres psql -U amel -d beardstyle_db \
    -c "INSERT INTO beard_styles_hybrid (name, style_name, description, technique, \
    image_url, image_url_thumbnail, beard_density, beard_length_cm, coverage_area, \
    mustache_style, prompt_used) VALUES ('Mutton Chops Classic - Hybrid v1', \
    'mutton_chops', 'Klasični Mutton Chops - 10cm gusta brada', 'graphite_hybrid', \
    '/images/hybrid/mutton-chops/v1.png', '/images/hybrid/mutton-chops/v1-thumb.png', \
    '10-12cm_full', 11, 'cheeks_chin', 'connected', '[prompt tekst]');"

[ ] Provjeri da je insertano:
    docker-compose exec postgres psql -U amel -d beardstyle_db \
    -c "SELECT * FROM beard_styles_hybrid;"

[ ] Test API endpoint-a:
    curl http://localhost:5000/api/beards
    
    Trebalo bi vratiti:
    {"success":true,"count":1,"data":[{...beard data...}]}

[ ] Refresh frontend:
    http://localhost:3000
    
    Trebalo bi vidjeti Mutton Chops sliku (ako je uploadana)


═══════════════════════════════════════════════════════════════════════════════════
KORAK 9: GENERIRAJ SLIKE U MIDJOURNEY (30 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Idi na https://www.midjourney.com/imagine

[ ] Pejst prompt:
    Create an extreme close-up technical illustration showing ONLY the lower 
    third of a standardized male face template, cropped tightly from the bottom 
    of the nose to the neck. The face structure must remain identical across all 
    generations. Only the beard shape is allowed to change. Composition: Crop 
    horizontally just below the nose. Show only lower nostrils, mustache area, 
    lips, chin, jawline and neckline. No eyes. No forehead. No upper face. No 
    ears. No hair on head. Camera: Perfectly frontal orthographic view. Zero 
    perspective distortion. No tilt. No rotation. Perfect bilateral symmetry. 
    Nose anchor: Lower nostrils barely visible and identically positioned. Style: 
    Professional graphite mechanical pencil illustration. 0.3-0.5 mm controlled 
    line weight. Clean precise technical linework. Defined outer silhouette. 
    Controlled beard edge contour. Blueprint technical atlas aesthetic. 
    Instructional barber diagram style. Non-artistic. Beard: Mutton Chops style - 
    10-12cm dense full beard with natural rounded contour on cheeks, tapering to 
    sharp pointed ends at jaw angles. Connected mustache flowing seamlessly into 
    beard. High density coverage from cheeks to chin. Balanced lower contour. 
    Visible layered strand texture. Heavy layered crosshatch for volume and depth. 
    Natural neckline visible below beard mass. Color: Neutral grayscale only. 
    Pure white background (#FFFFFF). Flat clinical lighting. No dramatic shadow. 
    --ar 1:1 --v 6

[ ] Generiraj 4-5 varijacija (klikni "Regenerate" ili "Vary")

[ ] Odaberi najbolje verzije

[ ] Klikni "Upscale" za svaku verziju

[ ] Preuzmi kao .png slike


═══════════════════════════════════════════════════════════════════════════════════
KORAK 10: UPLOAD SLIKA (5 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Spremi slike u folder:
    frontend/public/images/hybrid/mutton-chops/
    
    Trebalo bi:
    mutton-chops/
    ├── v1.png
    ├── v2.png
    └── v3.png

[ ] Refresh Docker container (da vidi nove slike):
    docker-compose restart frontend

[ ] Refresh http://localhost:3000
    Trebalo bi vidjeti sliku sa slike!


═══════════════════════════════════════════════════════════════════════════════════
KORAK 11: GIT PUSH (2 minuta)
═══════════════════════════════════════════════════════════════════════════════════

[ ] Dodaj sve fajlove:
    git add .

[ ] Commit:
    git commit -m "Add BeardStyle app with Docker, PostgreSQL, and Hybrid Graphite style"

[ ] Push:
    git push origin main

[ ] Provjeri na GitHub:
    https://github.com/[username]/beardstyle-app
    
    Trebalo bi vidjeti sve fajlove


═══════════════════════════════════════════════════════════════════════════════════
KORAK 12: DEPLOYMENT (30 minuta - 1 sat)
═══════════════════════════════════════════════════════════════════════════════════

OPCIJA A: RENDER.COM (Najjednostavnije)
────────────────────────────────────────
[ ] Registriraj se na https://render.com
[ ] Connect GitHub repo
[ ] Kreiraj:
    - PostgreSQL Database
    - Backend Web Service (iz docker-compose.yml)
    - Frontend Static Site
[ ] Deploy!

OPCIJA B: RAILWAY.APP (Preporučeno)
────────────────────────────────────
[ ] Idi na https://railway.app
[ ] Login sa GitHub
[ ] Klikni "New Project"
[ ] "Deploy from GitHub repo"
[ ] Odaberi tvoj beardstyle-app repo
[ ] Railway automatski detecta docker-compose.yml
[ ] Dodaj environment variables
[ ] Deploy!

OPCIJA C: VERCEL + AWS RDS (Professionalno)
─────────────────────────────────────────────
[ ] Deploy frontend na Vercel (najjednostavnije za React)
[ ] Deploy backend na AWS ECS
[ ] PostgreSQL na AWS RDS
[ ] Connect preko environment variables


═══════════════════════════════════════════════════════════════════════════════════
TROUBLESHOOTING BRZA REFERENCA
═══════════════════════════════════════════════════════════════════════════════════

Problem: Docker servisi se ne pokreću
─────────────────────────────────────
Rješenje:
  docker-compose down
  docker system prune
  docker-compose build --no-cache
  docker-compose up -d

Problem: "Cannot connect to database"
─────────────────────────────────────
Rješenje:
  docker-compose logs postgres
  Provjeri da su credentials isti u svim .env fajlovima

Problem: "Frontend ne može dosegnuti API"
─────────────────────────────────────────
Rješenje:
  Provjeri VITE_API_URL u frontend/.env
  Trebalo bi biti: http://backend:5000/api
  (Ne http://localhost:5000/api!)

Problem: "Port 5000 već koristi neki drugi proces"
──────────────────────────────────────────────────
Rješenje:
  lsof -i :5000
  kill -9 [PID]
  Ili promijeni PORT u docker-compose.yml

Problem: "Images se ne vide u aplikaciji"
─────────────────────────────────────────
Rješenje:
  Provjeri path u database
  Spremi slike u frontend/public/images/hybrid/
  Restart frontend: docker-compose restart frontend


═══════════════════════════════════════════════════════════════════════════════════
COMMANDS KOJI KORISTIŠ ČESTO
═══════════════════════════════════════════════════════════════════════════════════

Pokreni sve:
  docker-compose up -d

Zaustavi sve:
  docker-compose down

Pogledaj logove:
  docker-compose logs -f

Ulazi u bazu:
  docker-compose exec postgres psql -U amel -d beardstyle_db

Ulazi u backend shell:
  docker-compose exec backend sh

Rebuild backend:
  docker-compose build backend
  docker-compose up -d backend

Cleanup (obriši sve):
  docker-compose down -v

═══════════════════════════════════════════════════════════════════════════════════
SAŽETAK: OD POČETKA DO PRODUKCIJE
═══════════════════════════════════════════════════════════════════════════════════

1. ✅ Preuzmi Docker Desktop, Git, Node.js
2. ✅ Kreiraj GitHub repo
3. ✅ Kloniraj repo lokalno
4. ✅ Kreiraj folder strukturu
5. ✅ Setup backend (Node.js + Express)
6. ✅ Setup frontend (React + Vite)
7. ✅ Setup database (PostgreSQL)
8. ✅ Kreiraj docker-compose.yml
9. ✅ Build i pokreni Docker
10. ✅ Popuni bazu sa podacima
11. ✅ Generiraj slike u Midjourney
12. ✅ Upload slika
13. ✅ Test aplikacije
14. ✅ Git push
15. ✅ Deploy na Render/Railway/AWS

UKUPNO VRIJEME: 2-3 sata

═══════════════════════════════════════════════════════════════════════════════════

SADA POČNI! 🚀

