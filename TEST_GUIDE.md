# 🧪 Test Guide - AI Integration

## ✅ Status: READY TO TEST!

Backend ✅ Running
Frontend ✅ Running
Database ✅ Connected
AI Service ✅ Configured (Claude API Key dodat)

---

## 🚀 Quick Test Steps

### 1. Otvori Aplikaciju
```
URL: http://localhost:3000
```

### 2. Test Flow (Bez Autentifikacije - Lakši Test)

**Korak 1: Homepage**
- Otvori http://localhost:3000
- Klikni na "Upload Sliku" ili navigiraj na `/upload`

**Korak 2: Upload Page**
- Upload sliku lica (drag & drop ili click to select)
- **VAŽNO**: Koristi clear, frontal photo lica
- Najbolji rezultati: dobro osvijetljenje, bez naočara

**Korak 3: Čekaj AI Analizu**
- Trebalo bi da vidiš loading state
- AI analiza traje **10-20 sekundi**
- Claude analizira:
  - Oblik lica
  - Karakteristike lica
  - Preporučuje stilove brade

**Korak 4: AI Results Page**
Trebalo bi da vidiš:
- ✅ Uploadovanu sliku
- ✅ Face shape (oval, round, square, etc.)
- ✅ Confidence score (npr. "92% sigurnosti")
- ✅ Facial characteristics:
  - Širina čela
  - Struktura vilice
  - Oblik brade
  - Dužina lica
  - Jagodice
  - Simetrija
- ✅ AI Preporučeni stilovi sa match scores
- ✅ Styling advice (šta naglasiti/umanjiti)
- ✅ Length guidance
- ✅ Maintenance guide
- ✅ Additional notes

**Korak 5: Dalje Akcije**
- Klikni "Nastavi sa Upitnikom" → Detaljni questionnaire
- Klikni "Pregledaj Sve Stilove" → Gallery
- Klikni na bilo koji stil → Preview sa overlay

---

## 🧪 Alternativni Test (Sa Autentifikacijom)

### Registracija
```
1. Navigiraj na: http://localhost:3000/register
2. Unesi:
   - Email: test@example.com
   - Password: test123
   - First Name: Test
   - Last Name: User
3. Klikni "Register"
```

### Login
```
1. Navigiraj na: http://localhost:3000/login
2. Unesi:
   - Email: test@example.com
   - Password: test123
3. Klikni "Login"
```

### Upload sa Auth
```
1. Nakon login-a, idi na /upload
2. Upload sliku
3. Čekaj AI analizu
4. Vidi rezultate
```

---

## 🔍 Test Cases

### Test Case 1: Basic Upload + AI Analysis
**Input**: Upload clear face photo
**Expected**:
- Upload uspješan
- AI analiza završena u 10-20s
- Face shape detektovan
- Confidence > 80%
- Minimum 5 preporučenih stilova

**Verification**:
```bash
# Check backend logs
docker-compose logs backend | grep -i "claude"
```

### Test Case 2: AI Results Display
**Input**: Nakon uspješnog uploada
**Expected**:
- AI Results Page se prikaže
- Svi podaci su vidljivi
- Match scores su prikazani
- Styling advice je čitljiv
- Maintenance guide je kompletan

### Test Case 3: Error Handling (Optional)
**Input**: Upload non-face image (npr. landscape)
**Expected**:
- Upload uspješan
- AI pokušava analizu
- Graceful fallback ako AI ne može detektovati lice

### Test Case 4: Recommendations Flow
**Input**: Sa AI Results, klikni "Nastavi sa Upitnikom"
**Expected**:
- Navigation ka /questionnaire
- Upitnik se prikaže
- AI analysis data se prenosi

---

## 📊 Očekivani AI Response Format

```json
{
  "faceShape": "oval",
  "faceShapeConfidence": 92,
  "facialCharacteristics": {
    "foreheadWidth": "medium",
    "jawlineStructure": "strong",
    "chinShape": "rounded",
    "faceLength": "medium",
    "cheekbones": "prominent",
    "facialSymmetry": "excellent"
  },
  "recommendedStyles": [
    {
      "styleName": "Corporate Beard",
      "matchScore": 95,
      "reasoning": "Your oval face shape...",
      "keyBenefits": ["Professional", "Easy maintenance"],
      "visualBalance": "Complements natural proportions"
    }
  ],
  "stylingAdvice": {
    "emphasize": ["Strong jawline", "Facial symmetry"],
    "minimize": ["Forehead width"],
    "lengthGuidance": {
      "chin": "medium",
      "cheeks": "short",
      "mustache": "medium",
      "sideburns": "short"
    }
  },
  "maintenanceGuide": {
    "trimmingFrequency": "every 3-5 days",
    "recommendedProducts": ["Beard oil", "Balm", "Trimmer"],
    "stylingTechniques": ["Brush daily", "Apply oil after shower"],
    "timeCommitment": "medium",
    "difficultyLevel": "beginner"
  }
}
```

---

## 🐛 Troubleshooting

### Problem: "Invalid API key" greška
**Check**:
```bash
# Provjeri da li je key u .env fajlu
cat backend/.env | grep CLAUDE_API_KEY

# Restart backend
docker-compose restart backend
```

### Problem: Timeout tokom AI analize
**Rješenje**:
- Normalno je da traje 10-20s
- Ako traje duže od 30s, provjeri:
  - Internet konekciju
  - Claude API status: https://status.anthropic.com/
  - Backend logs: `docker-compose logs backend`

### Problem: AI analiza vraća prazno
**Check Backend Logs**:
```bash
docker-compose logs backend | tail -50
```

Look for errors like:
- `Face analysis failed`
- `Claude API error`
- `JSON parse error`

### Problem: Frontend pokazuje grešku
**Check Frontend Logs**:
```bash
docker-compose logs frontend | tail -30
```

**Check Browser Console**:
- Otvori Developer Tools (F12)
- Provjeri Console tab za greške
- Provjeri Network tab za failed requests

---

## ✅ Success Checklist

Pre nego što kažeš da sve radi:

- [ ] Backend health check: http://localhost:5000/health vraća OK
- [ ] Frontend accessible: http://localhost:3000 učitava stranicu
- [ ] Upload page vidljiv: http://localhost:3000/upload
- [ ] File upload radi (bez grešaka)
- [ ] AI analiza se izvršava (10-20s wait)
- [ ] AI Results page se prikaže
- [ ] Face shape je prikazan
- [ ] Confidence score je prikazan
- [ ] Recommended styles su prikazani
- [ ] Match scores su vidljivi (npr. "95% match")
- [ ] Styling advice je čitljiv
- [ ] Maintenance guide je prikazan
- [ ] Navigation dugmići rade (Upitnik, Gallery)

---

## 🎯 Performance Benchmarks

| Metric | Expected | Acceptable |
|--------|----------|------------|
| Upload time | < 1s | < 3s |
| AI analysis | 10-20s | < 30s |
| Face shape confidence | > 85% | > 70% |
| Recommended styles | 5-7 | 3+ |
| AI reasoning quality | Detailed | Present |

---

## 📞 Ako Nešto Ne Radi

1. **Check Status**:
   ```bash
   docker-compose ps
   # Sve treba biti "Up"
   ```

2. **Check Logs**:
   ```bash
   docker-compose logs backend --tail=50
   docker-compose logs frontend --tail=50
   ```

3. **Restart Everything**:
   ```bash
   docker-compose restart
   ```

4. **Full Rebuild** (last resort):
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

---

## 🎉 Success Scenario

Kad sve radi kako treba, trebalo bi da vidiš:

1. **Upload** → ✅ Success message
2. **Wait** → ⏳ Loading (10-20s)
3. **Results** → 📊 AI Results Page sa:
   - Face shape: "Oval" (92% confident)
   - 7 preporučenih stilova
   - Match scores: 95%, 89%, 87%, etc.
   - Detaljni savjeti
   - Maintenance guide

4. **Navigation** → Smooth transition ka Questionnaire/Gallery

---

## 💡 Tips za Najbolje Rezultate

### Kvalitet Slike:
- ✅ Frontalno lice
- ✅ Dobro osvjetljenje
- ✅ Neutral izraz
- ✅ Bez naočara/maski
- ✅ Minimum 300x300px
- ❌ Selfie sa bad lighting
- ❌ Side profile
- ❌ Grupna slika

### Test Slike:
Možeš koristiti:
- Własnu sliku
- Stock photo sa sajta kao pexels.com (search "man face portrait")
- Google Images (search "professional headshot male")

---

## 📈 Next Steps Nakon Uspješnog Testa

1. **Populate Database** sa beard styles
2. **Test Questionnaire** flow
3. **Test Gallery** sa filterima
4. **Test Preview** sa overlay
5. **Test Salon Dashboard** features

---

**Datum**: 2026-01-07
**Status**: ✅ READY TO TEST
**API Key**: ✅ Configured
**Backend**: 🟢 Running
**Frontend**: 🟢 Running

**Uživaj u testiranju! 🎉**
