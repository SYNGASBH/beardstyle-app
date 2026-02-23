# DALL-E Image Generation Setup

## OpenAI API Key Configuration

Da biste omogućili generiranje brade slika koristeći DALL-E, trebate konfigurirati OpenAI API key:

### 1. Dobijte OpenAI API Key
- Idite na [OpenAI Platform](https://platform.openai.com/api-keys)
- Kreirajte novi API key
- Kopirajte key (čuvajte ga sigurno!)

### 2. Konfigurirajte Environment Variable
U `backend/.env` fajlu zamijenite placeholder sa vašim stvarnim API key-em:

```env
# OpenAI DALL-E Configuration
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. Restartujte Backend
```bash
docker-compose restart backend
```

## Kako Funkcionira

### API Endpoint
```
POST /api/styles/visualize
```

**Body:**
```json
{
  "uploadId": 123,
  "styleId": 456
}
```

**Response:**
```json
{
  "success": true,
  "message": "Beard visualization generated successfully",
  "visualization": {
    "imageUrl": "http://localhost:3000/uploads/generated-user-123-456-1640995200000.png",
    "localPath": "uploads/generated-user-123-456-1640995200000.png",
    "model": "dall-e-3",
    "status": "completed",
    "styleId": 456,
    "styleName": "Full Beard"
  }
}
```

### Proces Generiranja

1. **Analiza**: Koristi AI analizu lica za kontekst
2. **Prompt Kreiranje**: Generira detaljan DALL-E prompt baziran na:
   - Obliku lica (oval, round, square, etc.)
   - Stil brade (Full Beard, Stubble, Goatee, etc.)
   - Nivou održavanja (Low/Medium/High)
3. **Generiranje**: Poziva DALL-E 3 API
4. **Download & Spremanje**: Sprema generiranu sliku u `uploads/` folder
5. **Response**: Vraća URL generirane slike

### Cijene

- **DALL-E 3**: ~$0.04 po slici (1024x1024)
- Besplatni kredit: $5 (dovoljno za ~125 generiranja)

### Troubleshooting

**"Image generation service not available"**
- Provjerite da li je `OPENAI_API_KEY` konfiguriran u `.env`
- Restartujte backend

**"Failed to generate beard visualization"**
- Provjerite OpenAI API key
- Provjerite kredit na OpenAI računu
- Pogledajte backend logove za detalje

### Mock Mode

Ako želite testirati bez stvarnog API poziva:
```env
USE_MOCK_AI=true
```

Ovo će vratiti mock podatke umjesto stvarnih generiranih slika.</content>
<parameter name="filePath">c:\Users\User\Desktop\beard-style-app/DALL-E_SETUP.md