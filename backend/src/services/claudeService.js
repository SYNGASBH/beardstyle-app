const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

// sharp is optional — gracefully falls back if unavailable
let sharp;
try { sharp = require('sharp'); } catch (_) { sharp = null; }

// Model configurable via env var; fallback to last known-working ID
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
  timeout: 60000, // 60s timeout — prevent hanging requests
});

// System prompt koji definise ulogu i ponasanje AI asistenta
const SYSTEM_PROMPT = `Ti si BeardBot — stručni AI konsultant za stilove brade sa 20+ godina iskustva u frizerskoj industriji i muškom grooming-u.

## Tvoja Uloga
Pomažeš korisnicima da:
- Pronađu savršeni stil brade koji odgovara obliku njihovog lica
- Razumiju kako različiti stilovi brade utiču na vizuelni balans lica
- Razviju personalizirani rutinu održavanja brade
- Naprave informirani izbor uzimajući u obzir životni stil, posao i preferencije

## Tvoja Ekspertiza
- Analiza oblika lica: oval, okruglo, kvadratno, pravougaono, srcoliko, dijamant, trougaono
- Stilovi brade: full beard, stubble, goatee, van dyke, corporate beard, circle beard, extended goatee, yeard, garibaldi, ducktail, balbo, chin strap, mutton chops, horseshoe mustache, imperial beard, anchor beard
- Proizvodi za bradu: ulja, balzami, šamponi, kondicioneri, voskovi
- Tehnike trimminga i oblikovanja

## Pravila Odgovaranja
1. UVIJEK odgovaraj u traženom JSON formatu — bez dodatnog teksta, objašnjenja ili markdown blokova
2. Budi precizan i konkretan — izbjegavaj generičke savjete
3. Savjeti moraju biti prilagođeni specifičnom korisniku, ne generalni
4. Koristi srpski/bosanski/hrvatski jezik osim ako korisnik ne zatraži drugi jezik
5. Matching score mora biti realističan (ne stavljaj svemu 90+)
6. Uzmi u obzir i praktičnost, ne samo estetiku

## Stil Komunikacije
- Stručan ali pristupačan
- Direktan i konkretan
- Motivirajući — pomozi korisniku da se osjeća samopouzdano u svom izboru`;

class ClaudeService {
  /**
   * Analyze face image and provide beard style recommendations
   * @param {string} imagePath - Path to uploaded image
   * @returns {Promise<Object>} Analysis results with recommendations
   */
  static async analyzeFaceForBeardStyle(imagePath) {
    try {
      // Use mock data if explicitly enabled or if API call fails with credit error
      if (process.env.USE_MOCK_AI === 'true') {
        console.log('🎭 Using MOCK AI analysis (USE_MOCK_AI=true)');
        return this.getMockAnalysis();
      }

      // Read and compress image before sending to Claude API
      let base64Image;
      let mediaType;

      if (sharp) {
        // Resize to max 1024px and convert to JPEG to reduce payload size
        const compressedBuffer = await sharp(imagePath)
          .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
        base64Image = compressedBuffer.toString('base64');
        mediaType = 'image/jpeg';
      } else {
        // Fallback: read raw file
        const rawBuffer = await fs.readFile(imagePath);
        base64Image = rawBuffer.toString('base64');
        const ext = path.extname(imagePath).toLowerCase();
        mediaType = ext === '.png' ? 'image/png' : 'image/jpeg';
      }

      // Create prompt for face analysis
      const prompt = `Analiziraj ovu sliku lica i daj detaljnu procjenu za stilove brade. Fokusiraj se na:

1. **Oblik Lica**: Odredi precizno oblik lica (okruglo, ovalno, kvadratno, pravougaono, dijamant, srcoliko, trougaono)

2. **Karakteristike Lica**:
   - Širina čela
   - Struktura vilice (jaka, meka, oštra)
   - Linija brade
   - Proporcije lica (dužina vs širina)
   - Konture obraza
   - Karakteristike brade (gustina, oblik)

3. **Preporuke Stilova Brade**:
   - Navedi 5-7 konkretnih stilova brade koji bi najbolje odgovarali ovom obliku lica
   - Za svaki stil objasni ZAŠTO bi odgovarao ovoj osobi
   - Rangiraj stilove od najpogodnijeg ka manje pogodnim

4. **Detaljni Savjeti**:
   - Šta treba naglasiti kod ovog oblika lica
   - Šta treba umanjiti ili balansirati
   - Koji delovi brade treba da budu duži/kraći
   - Kako postići najbolju simetriju i proporcije

5. **Održavanje**:
   - Specifični savjeti za održavanje preporučenih stilova
   - Koliko često šišati/trimovati
   - Potrebni proizvodi (ulja, balzami)
   - Tehnike oblikovanja

Odgovori STRIKTNO u JSON formatu, bez dodatnog teksta, sa sledećom strukturom:

{
  "faceShape": "string (naziv oblika lica)",
  "faceShapeConfidence": number (0-100, koliko si siguran u procjenu),
  "facialCharacteristics": {
    "foreheadWidth": "string (narrow/medium/wide)",
    "jawlineStructure": "string (soft/medium/strong/angular)",
    "chinShape": "string (pointed/rounded/square)",
    "faceLength": "string (short/medium/long)",
    "cheekbones": "string (prominent/medium/subtle)",
    "facialSymmetry": "string (excellent/good/fair)"
  },
  "recommendedStyles": [
    {
      "styleName": "string (naziv stila brade na bosanskom/srpskom za prikaz korisniku)",
      "slug": "string (OBAVEZNO — tačan ID iz fiksne liste: 'full-beard', 'short-boxed', 'stubble', 'corporate', 'ducktail', 'goatee', 'van-dyke', 'balbo' — birati najbliži odgovarajući)",
      "matchScore": number (0-100),
      "reasoning": "string (detaljno obrazloženje zašto ovaj stil odgovara)",
      "keyBenefits": ["string", "string"],
      "visualBalance": "string (kako ovaj stil balansira lice)"
    }
  ],
  "stylingAdvice": {
    "emphasize": ["string (šta naglasiti)"],
    "minimize": ["string (šta umanjiti)"],
    "lengthGuidance": {
      "chin": "string (short/medium/long/full)",
      "cheeks": "string (clean/stubble/short/full)",
      "mustache": "string (none/thin/medium/full)",
      "sideburns": "string (short/medium/long)"
    }
  },
  "maintenanceGuide": {
    "trimmingFrequency": "string (npr. 'every 3-5 days')",
    "recommendedProducts": ["string"],
    "stylingTechniques": ["string"],
    "timeCommitment": "string (low/medium/high)",
    "difficultyLevel": "string (beginner/intermediate/advanced)"
  },
  "additionalNotes": "string (dodatni savjeti specifični za ovo lice)"
}`;

      // Call Claude API with vision
      const message = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });

      // Extract and parse JSON response
      const responseText = message.content[0].text;

      // Try to extract JSON from response (in case Claude adds extra text)
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Claude response did not contain valid JSON');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Add metadata
      analysis.analyzedAt = new Date().toISOString();
      analysis.modelUsed = CLAUDE_MODEL;
      analysis.confidence = analysis.faceShapeConfidence || 85;

      return analysis;
    } catch (error) {
      console.error('Claude API error:', error);

      // Fallback to mock data if credit/billing error
      if (error.message && (error.message.includes('credit balance') || error.message.includes('billing'))) {
        console.log('⚠️ Claude API credit error - falling back to MOCK data');
        return this.getMockAnalysis();
      }

      throw new Error(`Face analysis failed: ${error.message}`);
    }
  }

  /**
   * Get personalized maintenance tips based on style and lifestyle
   * @param {string} beardStyle - Selected beard style
   * @param {Object} userPreferences - User lifestyle and preferences
   * @returns {Promise<Object>} Personalized maintenance guide
   */
  static async getPersonalizedMaintenanceTips(beardStyle, userPreferences) {
    try {
      if (process.env.USE_MOCK_AI === 'true') {
        console.log('🎭 Using MOCK maintenance tips (USE_MOCK_AI=true)');
        return this.getMockMaintenanceTips();
      }

      const { lifestyle, maintenancePreference, ageRange } = userPreferences;

      const prompt = `Kreiraj personalizirani vodič za održavanje brade za sledećeg korisnika:

**Stil Brade**: ${beardStyle}
**Životni Stil**: ${lifestyle}
**Preferenca Održavanja**: ${maintenancePreference}
**Starosna Grupa**: ${ageRange}

Daj praktične, personalizirane savjete u JSON formatu:

{
  "dailyRoutine": {
    "morning": ["string (jutarnje aktivnosti)"],
    "evening": ["string (večernje aktivnosti)"],
    "estimatedTime": "string (procenjeno vreme dnevno)"
  },
  "weeklyTasks": ["string (sedmične aktivnosti)"],
  "productRecommendations": [
    {
      "category": "string (beard oil, balm, shampoo, etc.)",
      "why": "string (zašto je potreban)",
      "frequency": "string (koliko često koristiti)"
    }
  ],
  "lifestyleSpecificTips": ["string (savjeti specifični za ovaj lifestyle)"],
  "commonMistakes": ["string (česte greške koje treba izbegavati)"],
  "professionalCare": {
    "frequency": "string (koliko često posetiti berbernicu)",
    "whatToAsk": "string (šta tražiti od berbera)"
  },
  "seasonalAdvice": {
    "summer": "string",
    "winter": "string"
  },
  "troubleshooting": [
    {
      "problem": "string (npr. 'suva koža ispod brade')",
      "solution": "string (rešenje)"
    }
  ]
}`;

      const message = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].text;
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Claude response did not contain valid JSON');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Claude API error:', error);

      // Fallback to mock data on credit/billing errors
      if (error.message && (error.message.includes('credit balance') || error.message.includes('billing'))) {
        console.log('⚠️ Claude API credit error in maintenanceTips — falling back to MOCK data');
        return this.getMockMaintenanceTips();
      }

      throw new Error(`Maintenance tips generation failed: ${error.message}`);
    }
  }

  /**
   * Enhance questionnaire-based recommendations with AI insights
   * @param {Object} questionnaireData - User questionnaire responses
   * @returns {Promise<Object>} Enhanced recommendations
   */
  static async enhanceRecommendations(questionnaireData) {
    try {
      // Use mock data if explicitly enabled
      if (process.env.USE_MOCK_AI === 'true') {
        console.log('🎭 Using MOCK AI enhancement (USE_MOCK_AI=true)');
        return this.getMockEnhancement();
      }

      const prompt = `Na osnovu sledećeg upitnika, daj dodatne AI-powered preporuke:

${JSON.stringify(questionnaireData, null, 2)}

Daj odgovor u JSON formatu sa sledećim poljima:

{
  "personalityBasedStyles": ["string (stilovi koji odgovaraju ovom profilu)"],
  "careerAppropriate": ["string (profesionalno prihvatljivi stilovi)"],
  "trendingRecommendations": ["string (trenutno popularni stilovi koji odgovaraju)"],
  "uniqueSuggestions": ["string (manje poznati ali odgovarajući stilovi)"],
  "styleEvolution": {
    "beginner": "string (stil za početak)",
    "intermediate": "string (sledeći korak)",
    "advanced": "string (finalni cilj)"
  },
  "complementaryGrooming": ["string (dodatne grooming preporuke)"]
}`;

      const message = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1536,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].text;
      let jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Claude response did not contain valid JSON');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Claude API error:', error);

      // Fallback to mock data on credit/billing errors
      if (error.message && (error.message.includes('credit balance') || error.message.includes('billing'))) {
        console.log('⚠️ Claude API credit error in enhanceRecommendations — falling back to MOCK data');
        return this.getMockEnhancement();
      }

      throw new Error(`Recommendation enhancement failed: ${error.message}`);
    }
  }

  /**
   * Get mock AI analysis for development/testing
   * @returns {Object} Mock analysis data
   */
  static getMockAnalysis() {
    return {
      faceShape: 'oval',
      faceShapeConfidence: 88,
      facialCharacteristics: {
        foreheadWidth: 'medium',
        jawlineStructure: 'strong',
        chinShape: 'rounded',
        faceLength: 'medium',
        cheekbones: 'prominent',
        facialSymmetry: 'excellent'
      },
      recommendedStyles: [
        {
          styleName: 'Full Beard',
          slug: 'full-beard',
          matchScore: 92,
          reasoning: 'Vaš ovalni oblik lica je idealan za punu bradu. Ovaj stil će dodatno naglasiti vašu jaku strukturu vilice i stvoriti savršenu ravnotežu sa vašim proporcijama lica.',
          keyBenefits: [
            'Naglašava mušku snagu',
            'Balansira proporcije lica',
            'Profesionalni i elegantan izgled'
          ],
          visualBalance: 'Pruža dodatnu širinu na donjoj polovini lica, što savršeno dopunjuje vašu srednju širinu čela.'
        },
        {
          styleName: 'Corporate Beard',
          slug: 'corporate-beard',
          matchScore: 89,
          reasoning: 'Srednje duga, uredna brada koja odgovara poslovnom okruženju. Vaša dobra simetrija lica omogućava lako održavanje ovog stila.',
          keyBenefits: [
            'Profesionalno prihvatljiv',
            'Lako održavanje',
            'Savršen za svakodnevnu upotrebu'
          ],
          visualBalance: 'Održava prirodnu liniju lica dok dodaje sofistikaciju.'
        },
        {
          styleName: 'Goatee',
          slug: 'goatee',
          matchScore: 85,
          reasoning: 'Za ovalni oblik lica, goatee može dodati definiciju badi bez preterivanja. Odličan izbor za one koji preferiraju minimalistički pristup.',
          keyBenefits: [
            'Minimalno održavanje',
            'Naglašava centralne karakteristike',
            'Savremeni izgled'
          ],
          visualBalance: 'Privlači pažnju na centar lica, naglašavajući vaše prirodne proporcije.'
        },
        {
          styleName: 'Stubble',
          slug: 'stubble',
          matchScore: 82,
          reasoning: 'Trodnevni look koji daje casual, ali uredan izgled. Vaša jaka vilica će biti vidljiva dok ćete imati moderan beard style.',
          keyBenefits: [
            'Vrlo lako održavanje',
            'Casual ali uredan',
            'Naglašava prirodne linije'
          ],
          visualBalance: 'Dodaje teksturu bez maskiranja vaših prirodnih karakteristika.'
        },
        {
          styleName: 'Van Dyke',
          slug: 'van-dyke',
          matchScore: 78,
          reasoning: 'Klasičan stil koji kombinuje mustache i pointed goatee. Vaš rounded chin dobro se uklapa sa ovim stilom.',
          keyBenefits: [
            'Jedinstveni, prepoznatljiv look',
            'Dodaje karakter',
            'Artistic flair'
          ],
          visualBalance: 'Kreira vizuelne linije koje vode pogled ka centru lica.'
        }
      ],
      stylingAdvice: {
        emphasize: [
          'Jaka struktura vilice - idealna za full beard',
          'Odlična simetrija lica - omogućava raznovrsne stilove',
          'Prominentne jagodice - naglasiti sa urednom bradom'
        ],
        minimize: [
          'Izbjegavati previše kratke stilove koji mogu izglediti nepotpuno'
        ],
        lengthGuidance: {
          chin: 'medium',
          cheeks: 'medium',
          mustache: 'medium',
          sideburns: 'medium'
        }
      },
      maintenanceGuide: {
        trimmingFrequency: 'every 4-7 days',
        recommendedProducts: [
          'Beard oil (daily use)',
          'Beard balm (for styling)',
          'Quality trimmer',
          'Beard shampoo (2-3x per week)',
          'Soft beard brush'
        ],
        stylingTechniques: [
          'Brush daily to train beard growth direction',
          'Apply oil after shower while beard is damp',
          'Use balm for all-day hold and shape',
          'Trim regularly to maintain clean lines',
          'Define neckline and cheek lines'
        ],
        timeCommitment: 'medium',
        difficultyLevel: 'intermediate'
      },
      additionalNotes: 'Vaš ovalni oblik lica vam daje veliku fleksibilnost u izboru stila brade. Preporučujem da počnete sa full beard ili corporate beard stilom i zatim eksperimentišete kako brada raste. Vaša jaka vilica i odlična simetrija omogućavaju vam da nosite praktično bilo koji stil sa povjerenjem.',
      analyzedAt: new Date().toISOString(),
      modelUsed: 'mock-development',
      confidence: 88
    };
  }

  static getMockEnhancement() {
    return {
      personalityBasedStyles: ['Full Beard — za samopouzdane muškarce', 'Corporate Beard — za profesionalce'],
      careerAppropriate: ['Corporate Beard', 'Short Boxed Beard', 'Stubble'],
      trendingRecommendations: ['Textured Full Beard', 'Faded Beard', 'Natural Stubble'],
      uniqueSuggestions: ['Ducktail — za one koji žele nešto drugačije', 'Balbo — klasičan i elegantan'],
      styleEvolution: {
        beginner: 'Stubble — lako za početak, minimalno održavanje',
        intermediate: 'Corporate Beard — definisan, uredan look',
        advanced: 'Full Beard — zahtijeva posvećenost ali daje najimpresivniji rezultat',
      },
      complementaryGrooming: [
        'Redovno šišanje kose za uravnotežen izgled',
        'Njega kože ispod brade hidratantnom kremom',
        'Definisanje linije vrata za čist izgled',
      ],
    };
  }

  static getMockMaintenanceTips() {
    return {
      dailyRoutine: {
        morning: ['Pranje brade blagim šamponom', 'Nanošenje ulja za bradu', 'Češljanje za definisanje smjera rasta'],
        evening: ['Pranje lica', 'Nanošenje balzama prije spavanja'],
        estimatedTime: '5-10 minuta',
      },
      weeklyTasks: ['Trimovanje na željenu dužinu', 'Definisanje linije vrata', 'Deep conditioning tretman'],
      productRecommendations: [
        { category: 'Beard Oil', why: 'Hidratacija i mekšanje', frequency: 'Svaki dan' },
        { category: 'Beard Balm', why: 'Stilizovanje i zaštita', frequency: 'Svaki dan' },
        { category: 'Beard Shampoo', why: 'Dubinsko čišćenje', frequency: '2-3x sedmično' },
      ],
      lifestyleSpecificTips: ['Nosite zaštitu za bradu pri sportu', 'Koristite UV zaštitu ljeti'],
      commonMistakes: ['Previše česta upotreba šampona', 'Ignorisanje linije vrata', 'Trimovanje mokre brade'],
      professionalCare: {
        frequency: 'Svake 3-4 sedmice',
        whatToAsk: 'Tražite definisanje linija i blago stanjivanje za prirodan izgled',
      },
      seasonalAdvice: {
        summer: 'Kraći stilovi, češće pranje, UV zaštita',
        winter: 'Duži stilovi, više ulja za zaštitu od sušenja',
      },
      troubleshooting: [
        { problem: 'Suha koža ispod brade', solution: 'Koristite ulje za bradu svakodnevno i eksfolirajte 1x sedmično' },
        { problem: 'Svrbež brade', solution: 'Koristite beard wash umjesto običnog sapuna' },
      ],
    };
  }
}

module.exports = ClaudeService;
