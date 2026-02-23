/**
 * Beard Style Sketch Generator v2.0
 * Generise grafitne tehnicke skice za sve stilove brade
 * Koristi OpenAI DALL-E 3 API
 *
 * Poboljsani promptovi sa barberskim vodicem strukturom
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Konfiguracija
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/assets/styles/sketches');
const THUMBNAIL_DIR = path.join(__dirname, '../frontend/public/assets/styles/thumbnails');

// Master prompt - bazni stil (NE MIJENJATI)
const MASTER_PROMPT = `Technical graphite pencil sketch of a male beard style, front-facing view.
Minimalist illustration focused ONLY on the beard shape and contours.
No facial features, no eyes, no nose detail, no hair, no emotions.
Clean white background.
Precise jawline, cheek line, neckline clearly visible.
Soft graphite shading to show beard density and volume.
Professional barber reference style, instructional illustration.
High contrast, sharp edges, realistic proportions.
No color, black and gray pencil only.
Centered composition.
8K quality, clean digital render.`;

// Negative prompt
const NEGATIVE_PROMPT = `photo, realistic face, eyes, nose, lips, hairstyle, color, skin tone, emotion,
background texture, shadow background, artistic painting, cartoon, anime,
watercolor, oil painting, blurry, low quality, text, watermark`;

// Svi stilovi sa detaljnim barberskim vodicem
const BEARD_STYLES = [
  {
    slug: 'stubble-3day',
    name: 'Stubble / 3-Day Shadow',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: 3-Day Stubble Shadow
LENGTH: Very short (1-2mm / 0.04-0.08 inches)
DENSITY: Light, visible shadow effect across jaw
TEXTURE: Peppery dots/stippled texture showing individual short hairs
SHAPE: Follows natural jawline contour, no sharp edges
COVERAGE: Even distribution across chin, jaw, and lower cheeks
TRIM LINES: Natural fade at cheek line, soft neckline blend
CLEAN AREAS: Upper cheeks slightly lighter, natural gradient
KEY FEATURE: Show the "5 o'clock shadow" effect with stippled shading technique
MUSTACHE: Short, matching stubble length, connected to chin area`
  },
  {
    slug: 'full-beard',
    name: 'Full Beard',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Full Natural Beard
LENGTH: Medium to long (5-15cm / 2-6 inches)
DENSITY: Heavy, thick coverage throughout
TEXTURE: Dense crosshatch shading showing volume and thickness
SHAPE: Natural rounded bottom, full coverage from ear to ear
COVERAGE: Complete coverage of chin, jaw, cheeks up to cheekbone line
TRIM LINES: Defined cheek line (natural or shaped), clean neckline above Adam's apple
CLEAN AREAS: Upper cheeks above cheek line, neck below neckline
KEY FEATURE: Show impressive volume with layered shading, natural fullness
MUSTACHE: Full, thick, connected to beard, covers upper lip partially`
  },
  {
    slug: 'clean-shaven',
    name: 'Clean Shaven',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Clean Shaven (Reference)
LENGTH: 0mm - completely smooth
DENSITY: None - no visible hair
TEXTURE: Smooth skin indicated by very light, even shading
SHAPE: Only jawline bone structure visible
COVERAGE: No beard coverage
TRIM LINES: N/A
CLEAN AREAS: Entire face - chin, jaw, cheeks, upper lip all smooth
KEY FEATURE: Show clean jawline contour, bone structure visible
MUSTACHE: None - upper lip area smooth and clean`
  },
  {
    slug: 'short-boxed-beard',
    name: 'Short Boxed Beard',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Short Boxed Beard
LENGTH: Short (5-10mm / 0.2-0.4 inches)
DENSITY: Medium, uniform throughout
TEXTURE: Even, controlled shading showing trimmed precision
SHAPE: Geometric, squared-off bottom edge, sharp defined corners
COVERAGE: Chin, jaw, lower cheeks - controlled area
TRIM LINES: SHARP straight cheek line, SHARP straight neckline (geometric)
CLEAN AREAS: Upper cheeks above sharp line, neck below sharp neckline
KEY FEATURE: Show the SHARP GEOMETRIC EDGES - this is the defining characteristic
MUSTACHE: Trimmed short, connected, matches beard length exactly`
  },
  {
    slug: 'corporate-beard',
    name: 'Corporate Beard',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Corporate/Professional Beard
LENGTH: Short to medium (10-20mm / 0.4-0.8 inches)
DENSITY: Medium, well-maintained, no stray hairs
TEXTURE: Neat, groomed shading - polished appearance
SHAPE: Conservative rounded shape, symmetrical
COVERAGE: Full but controlled - chin, jaw, lower cheeks
TRIM LINES: Clean natural cheek line, defined neckline (not too sharp)
CLEAN AREAS: Upper cheeks neat, neck clean below jawline
KEY FEATURE: Show PROFESSIONAL, POLISHED appearance - office-appropriate
MUSTACHE: Neat, trimmed, connected, professional length`
  },
  {
    slug: 'goatee',
    name: 'Goatee',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Classic Goatee
LENGTH: Medium (10-30mm / 0.4-1.2 inches)
DENSITY: Medium to heavy on chin area only
TEXTURE: Focused shading on chin and mustache area
SHAPE: Rounded or pointed chin beard, connected to mustache
COVERAGE: ONLY chin and mustache - this is critical
TRIM LINES: Sharp line where goatee meets clean cheeks
CLEAN AREAS: BOTH CHEEKS COMPLETELY CLEAN - no hair on cheeks or jaw sides
KEY FEATURE: Show the CONTRAST - dark goatee against clean-shaven cheeks
MUSTACHE: Connected to chin beard, forms continuous shape around mouth`
  },
  {
    slug: 'van-dyke',
    name: 'Van Dyke',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Van Dyke
LENGTH: Medium (20-40mm / 0.8-1.6 inches)
DENSITY: Medium to heavy on chin, medium on mustache
TEXTURE: Refined shading showing elegant style
SHAPE: POINTED chin beard, styled curled mustache ends
COVERAGE: Chin beard and mustache ONLY - disconnected
TRIM LINES: Precise edges around chin beard
CLEAN AREAS: Cheeks completely clean, VISIBLE GAP between mustache and chin beard
KEY FEATURE: Show the DISCONNECTION - mustache and chin beard DO NOT TOUCH
MUSTACHE: Styled, possibly with curled ends, clearly SEPARATE from chin beard`
  },
  {
    slug: 'balbo',
    name: 'Balbo',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Balbo Beard
LENGTH: Medium (10-30mm / 0.4-1.2 inches)
DENSITY: Medium on chin, lighter on mustache
TEXTURE: Clean defined shading
SHAPE: Inverted T-shape - chin beard without sideburns
COVERAGE: Chin beard + soul patch + floating mustache
TRIM LINES: Sharp edges around chin beard, no connection to jaw sides
CLEAN AREAS: Cheeks clean, jaw sides clean, NO SIDEBURNS, gap between mustache and chin
KEY FEATURE: Show THREE SEPARATE ELEMENTS - mustache, soul patch, chin beard
MUSTACHE: Floating above chin beard, NOT connected, styled separately`
  },
  {
    slug: 'circle-beard',
    name: 'Circle Beard',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Circle Beard (Round Goatee)
LENGTH: Short to medium (10-20mm / 0.4-0.8 inches)
DENSITY: Medium, even throughout the circle
TEXTURE: Uniform shading within circular area
SHAPE: PERFECT CIRCLE or oval around mouth - key characteristic
COVERAGE: Circular area around mouth only - chin and mustache connected
TRIM LINES: Smooth rounded edges forming the circle shape
CLEAN AREAS: Cheeks completely clean, jaw sides clean
KEY FEATURE: Show the CIRCULAR SHAPE - smooth round contour is essential
MUSTACHE: Connected to chin beard forming continuous circle around mouth`
  },
  {
    slug: 'ducktail',
    name: 'Ducktail',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Ducktail Beard
LENGTH: Medium to long (30-80mm / 1.2-3.2 inches), longest at chin point
DENSITY: Heavy, thick throughout
TEXTURE: Dense shading showing volume, tapered at bottom
SHAPE: Full beard with POINTED BOTTOM like a duck's tail
COVERAGE: Full face coverage - chin, jaw, cheeks
TRIM LINES: Natural or shaped cheek line, beard tapers to point at chin
CLEAN AREAS: Upper cheeks above cheek line, neck
KEY FEATURE: Show the POINTED TRIANGULAR BOTTOM - distinct duck tail shape
MUSTACHE: Full, connected, part of the overall full beard look`
  },
  {
    slug: 'garibaldi',
    name: 'Garibaldi',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Garibaldi Beard
LENGTH: Long (100-200mm / 4-8 inches)
DENSITY: Very heavy, wild, natural
TEXTURE: Dense layered shading showing natural untrimmed growth
SHAPE: Wide, rounded bottom, impressive width
COVERAGE: Full face coverage, extending well below chin
TRIM LINES: Minimal - natural growth pattern, soft cheek line
CLEAN AREAS: Only upper cheeks, neck may have some growth
KEY FEATURE: Show IMPRESSIVE VOLUME and WIDTH - wild, natural, untamed look
MUSTACHE: Full, thick, natural, blends into the massive beard`
  },
  {
    slug: 'mutton-chops',
    name: 'Mutton Chops',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Mutton Chops (Sideburns)
LENGTH: Medium to long (20-50mm / 0.8-2 inches)
DENSITY: Heavy on sideburns
TEXTURE: Dense shading on sideburn areas
SHAPE: Wide flared sideburns extending to jaw, NO chin beard
COVERAGE: Sideburns only - from ears down along jawline
TRIM LINES: Bottom edge along jawline, may flare outward
CLEAN AREAS: CHIN COMPLETELY CLEAN, upper lip clean or with separate mustache
KEY FEATURE: Show PROMINENT SIDEBURNS with CLEAN CHIN - this contrast is essential
MUSTACHE: Optional - if present, NOT connected to sideburns`
  },
  {
    slug: 'anchor-beard',
    name: 'Anchor Beard',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Anchor Beard
LENGTH: Medium (10-30mm / 0.4-1.2 inches)
DENSITY: Medium, precise
TEXTURE: Clean defined shading showing anchor shape
SHAPE: Resembles a ship's ANCHOR - pointed chin extending along jawline
COVERAGE: Chin point + thin line along jaw + mustache + soul patch
TRIM LINES: Very precise edges creating the anchor silhouette
CLEAN AREAS: Cheeks completely clean, only anchor shape has hair
KEY FEATURE: Show the ANCHOR SHAPE - pointed chin beard with jawline extensions
MUSTACHE: Part of anchor shape, connected or slightly separated`
  },
  {
    slug: 'chin-strap',
    name: 'Chin Strap',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Chin Strap
LENGTH: Very short to short (3-10mm / 0.1-0.4 inches)
DENSITY: Light to medium, thin line
TEXTURE: Light shading showing thin beard line
SHAPE: Thin STRIPE following jawline from ear to ear
COVERAGE: ONLY along jawline - like a strap under the chin
TRIM LINES: Precise thin line, consistent width throughout
CLEAN AREAS: Cheeks completely clean, chin center may be clean or filled
KEY FEATURE: Show the THIN LINE following the JAW CONTOUR from ear to ear
MUSTACHE: Optional - may or may not be present, usually separate`
  },
  {
    slug: 'beardstache',
    name: 'Beardstache',
    prompt: `${MASTER_PROMPT}

BEARD STYLE: Beardstache
LENGTH: Mustache LONG (20-40mm), Beard SHORT (5-15mm)
DENSITY: Heavy on mustache, medium on beard
TEXTURE: Heavy shading on mustache, lighter on beard - show the contrast
SHAPE: Prominent mustache as focal point, shorter full beard underneath
COVERAGE: Full beard coverage, but mustache dominates visually
TRIM LINES: Beard kept short and neat, mustache allowed to grow fuller
CLEAN AREAS: Standard cheek and neck lines
KEY FEATURE: Show the SIZE CONTRAST - BIG STATEMENT MUSTACHE over shorter beard
MUSTACHE: THE STAR - thick, prominent, possibly styled, much longer than beard`
  }
];

// Kreiranje direktorija ako ne postoje
function ensureDirectories() {
  [OUTPUT_DIR, THUMBNAIL_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Kreiran direktorij: ${dir}`);
    }
  });
}

// Generisanje slike kroz DALL-E API
async function generateImage(style) {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Generisem: ${style.name}`);
  console.log(`Slug: ${style.slug}`);
  console.log(`${'─'.repeat(50)}`);

  const requestBody = JSON.stringify({
    model: 'dall-e-3',
    prompt: style.prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'natural',
    response_format: 'url'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            console.log(`  URL dobijen uspjesno`);
            resolve(response.data[0].url);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

// Preuzimanje slike sa URL-a
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    const request = (imageUrl) => {
      https.get(imageUrl, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          request(response.headers.location);
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      }).on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

// Generisi samo jedan stil (za testiranje)
async function generateSingle(slugOrIndex) {
  let style;

  if (typeof slugOrIndex === 'number') {
    style = BEARD_STYLES[slugOrIndex];
  } else {
    style = BEARD_STYLES.find(s => s.slug === slugOrIndex);
  }

  if (!style) {
    console.error(`Stil nije pronadjen: ${slugOrIndex}`);
    console.log('Dostupni stilovi:');
    BEARD_STYLES.forEach((s, i) => console.log(`  ${i}: ${s.slug}`));
    return;
  }

  ensureDirectories();

  try {
    const imageUrl = await generateImage(style);
    const outputPath = path.join(OUTPUT_DIR, `${style.slug}.png`);
    await downloadImage(imageUrl, outputPath);
    console.log(`\n✅ USPJESNO: ${outputPath}`);
  } catch (error) {
    console.error(`\n❌ GRESKA: ${error.message}`);
  }
}

// Glavna funkcija - generisi sve
async function main() {
  console.log('╔' + '═'.repeat(48) + '╗');
  console.log('║  BEARD STYLE SKETCH GENERATOR v2.0            ║');
  console.log('║  Barber Guide Style Prompts                   ║');
  console.log('╚' + '═'.repeat(48) + '╝');

  // Provjera API kljuca
  if (!OPENAI_API_KEY) {
    console.error('\n❌ GRESKA: OPENAI_API_KEY nije postavljen!');
    console.log('\nPostavite environment varijablu:');
    console.log('  export OPENAI_API_KEY=sk-...');
    console.log('\nIli pokrenite sa:');
    console.log('  OPENAI_API_KEY=sk-... node generate-beard-sketches.js');
    console.log('\nZa test jednog stila:');
    console.log('  OPENAI_API_KEY=sk-... node generate-beard-sketches.js test stubble-3day');
    process.exit(1);
  }

  // Check za test mode
  if (process.argv[2] === 'test') {
    const testSlug = process.argv[3] || 'stubble-3day';
    console.log(`\n🧪 TEST MODE: Generisem samo "${testSlug}"\n`);
    await generateSingle(testSlug);
    return;
  }

  // Check za single style
  if (process.argv[2] === 'single') {
    const slug = process.argv[3];
    if (!slug) {
      console.log('\nDostupni stilovi:');
      BEARD_STYLES.forEach((s, i) => console.log(`  ${i}: ${s.slug} - ${s.name}`));
      return;
    }
    await generateSingle(slug);
    return;
  }

  ensureDirectories();

  const results = {
    success: [],
    failed: []
  };

  console.log(`\nGenerisem ${BEARD_STYLES.length} stilova...`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Generisanje svake slike
  for (let i = 0; i < BEARD_STYLES.length; i++) {
    const style = BEARD_STYLES[i];
    console.log(`\n[${i + 1}/${BEARD_STYLES.length}]`);

    try {
      const imageUrl = await generateImage(style);
      const outputPath = path.join(OUTPUT_DIR, `${style.slug}.png`);

      await downloadImage(imageUrl, outputPath);

      console.log(`  ✅ Sacuvano: ${style.slug}.png`);
      results.success.push(style.slug);

      // Pauza izmedju zahtjeva (rate limiting)
      if (i < BEARD_STYLES.length - 1) {
        console.log(`  ⏳ Cekam 3 sekunde...`);
        await new Promise(r => setTimeout(r, 3000));
      }

    } catch (error) {
      console.error(`  ❌ Greska: ${error.message}`);
      results.failed.push({ slug: style.slug, error: error.message });
    }
  }

  // Izvjestaj
  console.log('\n' + '═'.repeat(50));
  console.log('IZVJESTAJ');
  console.log('═'.repeat(50));
  console.log(`✅ Uspjesno: ${results.success.length}/${BEARD_STYLES.length}`);
  console.log(`❌ Neuspjesno: ${results.failed.length}/${BEARD_STYLES.length}`);

  if (results.failed.length > 0) {
    console.log('\nNeuspjeli stilovi:');
    results.failed.forEach(f => console.log(`  - ${f.slug}: ${f.error}`));
  }

  console.log('\n' + '═'.repeat(50));
  console.log('SLJEDECI KORACI');
  console.log('═'.repeat(50));
  console.log('1. Konvertuj PNG u WebP: sharp ili imagemagick');
  console.log('2. Kreiraj thumbnails (400x400)');
  console.log('3. Kopiraj u frontend/public/assets/styles/');
  console.log('4. Restartuj frontend: docker-compose restart frontend');
  console.log('5. Testiraj na http://localhost:3000/gallery');
}

// Export za Node.js module
module.exports = { BEARD_STYLES, generateSingle, generateImage };

// Pokretanje ako je direktno pozvano
if (require.main === module) {
  main().catch(console.error);
}
