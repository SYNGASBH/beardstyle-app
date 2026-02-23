# 🚀 Quick Start Guide - AI Integration

## Korak po Korak Setup (5 minuta)

### 1️⃣ Dobij Claude API Key (2 min)

1. Idi na: https://console.anthropic.com/
2. Sign up ili Log in
3. Klikni **Settings** → **API Keys**
4. Klikni **Create Key**
5. Kopiraj key (počinje sa `sk-ant-api03-...`)

### 2️⃣ Dodaj API Key u Backend (30 sec)

```bash
cd backend
# Otvori .env fajl i zameni:
CLAUDE_API_KEY=your_claude_api_key_here
# sa pravim key-em:
CLAUDE_API_KEY=sk-ant-api03-XYZ123...
```

### 3️⃣ Instaliraj Dependencies (1 min)

```bash
# U backend folderu
npm install
```

### 4️⃣ Pokreni Database Migration (30 sec)

**Ako koristiš Docker:**
```bash
# Iz root foldera projekta
docker-compose exec postgres psql -U bearduser -d beard_style_db -f /docker-entrypoint-initdb.d/migrations/002_ai_analysis_table.sql
```

**Bez Docker-a:**
```bash
psql -U bearduser -d beard_style_db < database/migrations/002_ai_analysis_table.sql
```

### 5️⃣ Pokreni Aplikaciju (1 min)

**Sa Docker:**
```bash
docker-compose up -d
```

**Bez Docker:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 6️⃣ Testiraj! (1 min)

1. Otvori: http://localhost:3000
2. Klikni **Upload Sliku**
3. Upload sliku lica (ili koristi kameru)
4. Čekaj 10-20 sekundi za AI analizu
5. Vidi rezultate na AI Results stranici! 🎉

## ✅ Checklist

- [ ] Claude API key dobijen
- [ ] API key dodat u `backend/.env`
- [ ] `npm install` izvršen u backend folderu
- [ ] Database migration pokrenuta
- [ ] Backend server radi (port 5000)
- [ ] Frontend server radi (port 3000)
- [ ] Test upload izvršen uspješno
- [ ] AI analiza radi

## 🎯 Očekivani Rezultati

Nakon uploada slike, treba da vidiš:

✅ **Face Shape**: "Oval" (ili drugi oblik)
✅ **Confidence**: "92% sigurnosti"
✅ **Karakteristike**: Širina čela, struktura vilice, itd.
✅ **AI Preporučeni Stilovi**: 5-7 stilova sa match scores
✅ **Savjeti**: Šta naglasiti/umanjiti
✅ **Vodič za Održavanje**: Proizvodi, tehnike, frekvencija

## ❌ Troubleshooting

### Problem: "Invalid API key"
**Rješenje**: Provjeri da li si pravilno kopirao API key u `.env` fajl. Key treba započeti sa `sk-ant-api03-`

### Problem: "Database connection failed"
**Rješenje**: Provjeri da li je PostgreSQL pokrenut:
```bash
docker-compose ps
# Ili provjeri lokalni PostgreSQL service
```

### Problem: "AI analysis timeout"
**Rješenje**: Claude API ponekad može biti spor. Čekaj do 30 sekundi. Ako i dalje ne radi, provjeri internet konekciju.

### Problem: "Table ai_face_analysis does not exist"
**Rješenje**: Nisi pokrenuo migration. Vidi korak 4 gore.

## 📊 Kako Znam da Radi?

### Backend Health Check
```bash
curl http://localhost:5000/health
# Očekivano: {"status":"OK", ...}
```

### Test AI Endpoint (sa auth token)
```bash
# Prvo login da dobiješ token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Onda test upload
curl -X POST http://localhost:5000/api/user/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@path/to/face.jpg"
```

## 💡 Pro Tips

1. **Kvalitet Slike**: Koristi clear, frontal face photo za najbolje rezultate
2. **Osvjetljenje**: Dobro osvijetljene slike daju bolju AI analizu
3. **Bez Naočara**: AI bolje radi bez naočara ili maski
4. **Neutral Expression**: Neutralan izraz lica je najbolji

## 🎨 Demo Slike

Za testiranje, koristi slike koje:
- Prikazuju lice frontalno
- Imaju dobro osvjetljenje
- Ne sadrže naočare ili maske
- Rezolucija minimalno 300x300px

## 📞 Pomoć

Ako nešto ne radi:
1. Provjeri sve korake gore
2. Pogledaj `AI_INTEGRATION_README.md` za detaljnije info
3. Provjeri backend logs: `docker-compose logs backend`
4. Provjeri da li Claude API key ima dovoljno kredita

## 🚀 Šta Dalje?

Nakon uspješnog setup-a:
1. Testiraj sa različitim slikama
2. Provjeri različite AI preporuke
3. Explore maintenance tips za različite stilove
4. Integriši sa questionnaire page-om
5. Dodaj više beard styles u database

---

**Trajanje cijelog setup-a**: ~5 minuta
**Trajanje jedne AI analize**: 10-20 sekundi
**Cost per analiza**: ~$0.02

Enjoy! 🎉
