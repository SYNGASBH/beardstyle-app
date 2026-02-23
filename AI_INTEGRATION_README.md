# AI Integration - Beard Style Advisor

## Pregled

Aplikacija **Beard Style Advisor** koristi **Claude AI (Anthropic)** za naprednu analizu lica i personalizirane preporuke stilova brade.

## Funkcionalnosti AI Integracije

### 1. **Analiza Oblika Lica** 🔍
- AI automatski detektuje oblik lica iz uploadovane slike
- Podržani oblici: oval, round, square, rectangle, heart, diamond, triangle
- Confidence score (0-100%) za pouzdanost detekcije

### 2. **Detaljna Analiza Karakteristika**
- Širina čela (narrow/medium/wide)
- Struktura vilice (soft/medium/strong/angular)
- Oblik brade (pointed/rounded/square)
- Dužina lica (short/medium/long)
- Istaknutost jagodica
- Simetrija lica

### 3. **AI-Powered Preporuke**
- 5-7 konkretnih stilova brade rankiran po odgovaranju
- Match score (0-100%) za svaki stil
- Detaljno obrazloženje zašto svaki stil odgovara
- Key benefits svakog stila
- Savjeti za vizuelnu balans

### 4. **Personalizirani Savjeti za Stilizovanje**
- Šta naglasiti kod vašeg oblika lica
- Šta umanjiti ili balansirati
- Smjernice za dužinu (brada, obrazi, brkovi, zalisci)

### 5. **Vodič za Održavanje**
- Frekvencija trimovanja (npr. "every 3-5 days")
- Preporučeni proizvodi (oils, balms, shampoos)
- Tehnike stilizovanja
- Time commitment (low/medium/high)
- Difficulty level (beginner/intermediate/advanced)

### 6. **Lifestyle-Based Enhancement**
- Dodatne AI preporuke bazirane na:
  - Životnom stilu (corporate, casual, creative, outdoor)
  - Preferenci održavanja (low, medium, high)
  - Starosnoj grupi
  - Trenutnom stilu brade
  - Ciljevima stilizovanja

## Setup Instrukcije

### Korak 1: Dobijanje Claude API Key

1. Posjetite [Anthropic Console](https://console.anthropic.com/)
2. Napravite nalog ili se prijavite
3. Idite na **Settings → API Keys**
4. Kreirajte novi API key
5. Kopirajte API key (počinje sa `sk-ant-...`)

### Korak 2: Konfiguracija Backend-a

1. Otiđite u `backend/` folder
2. Otvorite `.env` fajl
3. Dodajte vaš Claude API key:

```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

### Korak 3: Instalacija Dependencies

```bash
# U backend folderu
cd backend
npm install

# Ovo će instalirati @anthropic-ai/sdk
```

### Korak 4: Database Migration

Potrebno je pokrenuti novu migraciju za AI analysis tabelu:

```bash
# Ako koristite Docker
docker-compose exec postgres psql -U bearduser -d beard_style_db -f /docker-entrypoint-initdb.d/migrations/002_ai_analysis_table.sql

# Ili direktno
psql beard_style_db < database/migrations/002_ai_analysis_table.sql
```

### Korak 5: Pokretanje Aplikacije

```bash
# Pokreni sve servise sa Docker Compose
docker-compose up -d

# Ili pojedinačno:

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## AI Flow Dijagram

```
User Upload → Backend Endpoint → Claude API → Face Analysis
                                      ↓
                                 AI Results Page
                                      ↓
                              Questionnaire Page
                                      ↓
                        Enhanced Recommendations
                                      ↓
                              Gallery/Preview
```

## API Endpoints

### Upload sa AI Analizom
```
POST /api/user/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- image: File

Response:
{
  "message": "Image uploaded successfully",
  "upload": {
    "id": 123,
    "filePath": "uploads/...",
    "fileUrl": "http://..."
  },
  "aiAnalysis": {
    "faceShape": "oval",
    "faceShapeConfidence": 92,
    "facialCharacteristics": { ... },
    "recommendedStyles": [ ... ],
    "stylingAdvice": { ... },
    "maintenanceGuide": { ... }
  }
}
```

### Get AI Analysis
```
GET /api/user/analysis/:uploadId
Authorization: Bearer {token}

Response:
{
  "analysis": {
    "faceShape": "oval",
    "confidence": 92,
    "facialCharacteristics": { ... },
    "recommendedStyles": [ ... ],
    "stylingAdvice": { ... },
    "maintenanceGuide": { ... }
  }
}
```

### AI-Enhanced Recommendations
```
POST /api/styles/recommend
Content-Type: application/json

Body:
{
  "uploadId": 123,  // optional - koristi AI analizu ako postoji
  "faceShape": "oval",  // fallback ako nema uploadId
  "lifestyle": "corporate",
  "maintenancePreference": "medium",
  "ageRange": "26-35",
  "currentStyle": "clean shaven",
  "styleGoals": "professional look"
}

Response:
{
  "count": 10,
  "recommendations": [
    {
      "id": 5,
      "name": "Corporate Beard",
      "aiMatchScore": 95,  // AI-calculated match
      "aiReasoning": "This style complements your oval face...",
      "aiKeyBenefits": ["Professional appearance", "Easy maintenance"],
      "aiRecommended": true,
      ...
    }
  ],
  "aiAnalysis": { ... },
  "aiEnhanced": { ... }
}
```

### Personalizirani Savjeti za Održavanje
```
POST /api/user/maintenance-tips
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "beardStyle": "Corporate Beard",
  "lifestyle": "corporate",
  "maintenancePreference": "medium",
  "ageRange": "26-35"
}

Response:
{
  "beardStyle": "Corporate Beard",
  "maintenanceTips": {
    "dailyRoutine": {
      "morning": ["Wash with beard shampoo", "Apply beard oil"],
      "evening": ["Brush and comb", "Apply balm"],
      "estimatedTime": "5-10 minutes daily"
    },
    "weeklyTasks": ["Trim edges", "Deep condition"],
    "productRecommendations": [ ... ],
    "lifestyleSpecificTips": [ ... ],
    "commonMistakes": [ ... ],
    "professionalCare": { ... },
    "seasonalAdvice": { ... },
    "troubleshooting": [ ... ]
  }
}
```

## Claude AI Service Architecture

### ClaudeService Metode

#### 1. `analyzeFaceForBeardStyle(imagePath)`
- Prima: Path do slike
- Vraća: Kompletnu AI analizu oblika lica i preporuke
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 4096

#### 2. `getPersonalizedMaintenanceTips(beardStyle, userPreferences)`
- Prima: Naziv stila + user preferences (lifestyle, maintenance, age)
- Vraća: Personalizirani vodič za održavanje
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 2048

#### 3. `enhanceRecommendations(questionnaireData)`
- Prima: Upitnik podatke
- Vraća: AI-enhanced preporuke (personality-based, career-appropriate, trending)
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 1536

## Database Schema

### Tabela: `ai_face_analysis`

```sql
CREATE TABLE ai_face_analysis (
    id SERIAL PRIMARY KEY,
    upload_id INT REFERENCES user_uploads(id) ON DELETE CASCADE,

    -- Face Analysis
    face_shape VARCHAR(50) NOT NULL,
    face_shape_confidence DECIMAL(5,2),

    -- JSON Fields
    facial_characteristics JSONB,
    recommended_styles JSONB,
    styling_advice JSONB,
    maintenance_guide JSONB,

    -- Metadata
    additional_notes TEXT,
    raw_analysis JSONB,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50),

    UNIQUE(upload_id)
);
```

## Frontend Komponente

### AIResultsPage.js
Prikazuje:
- Uploadovanu sliku
- Oblik lica sa confidence score-om
- Detalj ne karakteristike lica
- AI preporučene stilove sa match scores
- Savjete za stilizovanje
- Vodič za održavanje

### UploadPage.js (Ažurirano)
- Nakon uspješnog uploada, navigacija ka `/ai-results`
- Prikazuje loading tokom AI analize
- Fallback na `/questionnaire` ako AI analiza ne uspije

## Troškovi i Performance

### Claude AI Pricing (Sonnet 4.5)
- Input: ~$3 / million tokens
- Output: ~$15 / million tokens

### Prosječan Request
- Face Analysis: ~500 input + 1000 output tokens = **~$0.018 po analizi**
- Maintenance Tips: ~200 input + 500 output tokens = **~$0.009 po zahtevu**
- Enhanced Recommendations: ~150 input + 400 output tokens = **~$0.007 po zahtevu**

### Performance
- Face analysis: **10-20 sekundi**
- Maintenance tips: **5-8 sekundi**
- Enhanced recommendations: **4-6 sekundi**

## Error Handling

AI analiza je **gracefully degradable**:
- Ako AI analiza ne uspije, upload se i dalje izvršava
- Korisnik može nastaviti sa manuelnim upitnikom
- Recommendations će koristiti database matching umjesto AI matching-a
- Sve greške se loguju ali ne blokiraju user flow

## Best Practices

### 1. **Kvalitet Slike**
Za najbolje AI rezultate, slika treba:
- Biti dobro osvijetljena
- Prikazivati lice frontalno
- Ne sadržavati naočare ili maske
- Biti minimalno 300x300px

### 2. **API Key Security**
- NIKADA ne commitujte `.env` fajl u git
- Koristite environment variables u production
- Rotatujte API keys redovno

### 3. **Rate Limiting**
- Claude API ima rate limits
- Implementiran je exponential backoff
- Cachiranje AI rezultata u bazi

### 4. **Cost Optimization**
- AI analiza se pokreće samo jednom po uploadu
- Rezultati se cachiraju u database
- Koristi se Sonnet model (cost-effective)

## Troubleshooting

### AI Analiza vraća grešku
```
Error: Face analysis failed: Invalid API key
```
**Rješenje**: Provjeri da li je `CLAUDE_API_KEY` pravilno postavljen u `.env`

### Timeout tokom analize
```
Error: Analysis timeout
```
**Rješenje**: Poveć timeout u `claudeService.js` ili provjeri internet konekciju

### JSON Parse Error
```
Error: Claude response did not contain valid JSON
```
**Rješenje**: Ovo se dešava rijetko kada Claude odgovori sa dodatnim tekstom. Service ima fallback parsing.

## Future Enhancements

- [ ] Real-time AR preview sa detektovanim oblikom lica
- [ ] Multi-angle face detection
- [ ] Beard growth simulation
- [ ] Style evolution tracking
- [ ] Social sharing sa AI insights
- [ ] Mobile-optimized face capture
- [ ] Video analysis support

## Support

Za pitanja ili probleme sa AI integracijom:
- Email: [email protected]
- GitHub Issues: [repo]/issues

---

**Napomena**: Ova AI integracija koristi najnoviji Claude 3.5 Sonnet model koji pruža izuzetno preciznu analizu lica i kontekstualne preporuke. Sistem je dizajniran da bude robustan i skalabilan.
