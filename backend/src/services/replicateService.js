/**
 * replicateService.js
 *
 * Handles realistic beard visualization via Replicate API (inpainting).
 * Uses zsxkib/flux-dev-inpainting — FLUX.1-dev based, significantly better
 * identity preservation and photorealism than SDXL.
 *
 * Flow:
 *   1. POST /v1/predictions  → create prediction, get ID
 *   2. Poll GET /v1/predictions/:id  → wait for 'succeeded'
 *   3. Download output image → save locally → return URL
 *
 * Features:
 *   - Per-style tuned parameters (strength, guidance_scale, neckPad)
 *   - Detailed per-style prompts with texture/color descriptions
 *   - Progressive preview mode (fast 512px + full 1024px)
 *   - Generated image caching by content hash + style
 *   - Hair color detection for prompt enrichment
 *
 * Auth: REPLICATE_API_TOKEN in .env
 */

const axios  = require('axios');
const fs     = require('fs').promises;
const path   = require('path');
const crypto = require('crypto');

// sharp is optional — gracefully falls back to raw base64 if unavailable
// (e.g. local Node < 18.17; Docker always satisfies the requirement)
let sharp;
try { sharp = require('sharp'); } catch (_) { sharp = null; }

const REPLICATE_API = 'https://api.replicate.com/v1';

// FLUX.1-dev Inpainting — best quality, excellent identity preservation.
// Model: zsxkib/flux-dev-inpainting (~$0.075/run, ~54s on A100 80GB)
const MODEL_VERSION = 'ca8350ff748d56b3ebbd5a12bd3436c2214262a4ff8619de9890ecc41751a008';

// Polling config
const POLL_INTERVAL_MS  = 2000;   // check every 2 s
const POLL_TIMEOUT_MS   = 120000; // give up after 2 min

// ─── In-memory cache for generated images ────────────────────────────────────
// Key: sha256(imageBase64).slice(0,16) + styleSlug + quality
// Value: { imageUrl, localPath, generatedAt }
// TTL: 30 min (saves ~$0.075 per cache hit)
const generationCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

function getCacheKey(imageBase64, styleSlug, quality = 'full') {
  const hash = crypto.createHash('sha256')
    .update(imageBase64.slice(0, 5000))  // first 5KB for speed
    .digest('hex')
    .slice(0, 16);
  return `${hash}:${styleSlug}:${quality}`;
}

function getCachedResult(key) {
  const entry = generationCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    generationCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedResult(key, data) {
  // Limit cache size to 50 entries
  if (generationCache.size >= 50) {
    const oldestKey = generationCache.keys().next().value;
    generationCache.delete(oldestKey);
  }
  generationCache.set(key, { data, timestamp: Date.now() });
}

// ─── Per-style configuration ────────────────────────────────────────────────
//
// Each style has tuned parameters for optimal generation:
//   - prompt:         Detailed description with texture, length, shape cues
//   - strength:       How aggressively to repaint (0.5 = subtle, 1.0 = full)
//   - guidance_scale: Prompt adherence (6 = creative, 10 = strict)
//   - neckPad:        Mask extension below chin (fraction of face height)
//   - maskBlur:       Soft edge radius in pixels (0 = hard, 5 = soft blend)

const STYLE_CONFIG = {
  'full-beard': {
    prompt: 'thick natural full beard 8-12cm length, well-groomed with natural volume and body, dense even coverage across cheeks jaw and chin, connected full mustache blending into beard, natural hair texture with subtle wave, individual hair strands visible, skin showing slightly through hair for realism, photorealistic portrait, same person identical face, same lighting and skin tone, 8k ultra detailed',
    strength: 0.92,
    guidance_scale: 7.5,
    neckPad: 0.10,
    maskBlur: 3,
  },

  'stubble': {
    prompt: 'short 3-day stubble beard 1-3mm length, even masculine shadow across jaw cheeks and chin, individual short hairs visible creating textured grain pattern, slight skin visible underneath, natural shadow effect enhancing jawline definition, subtle color variation in stubble, photorealistic portrait, same person identical face, same natural lighting and skin tone, high detail',
    strength: 0.75,
    guidance_scale: 7.0,
    neckPad: 0.03,
    maskBlur: 5,
  },
  'stubble-3day': {
    prompt: 'short 3-day stubble beard 1-3mm length, even masculine shadow across jaw cheeks and chin, individual short hairs visible creating textured grain pattern, slight skin visible underneath, natural shadow effect enhancing jawline definition, subtle color variation in stubble, photorealistic portrait, same person identical face, same natural lighting and skin tone, high detail',
    strength: 0.75,
    guidance_scale: 7.0,
    neckPad: 0.03,
    maskBlur: 5,
  },

  'van-dyke': {
    prompt: 'classic van dyke beard, pointed triangular chin beard 3-5cm clearly disconnected from styled handlebar mustache with upward curved tips, completely clean shaven cheeks and jaw sides, precise geometric separation between mustache and goatee, refined elegant shape with sharp edges, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.88,
    guidance_scale: 8.5,
    neckPad: 0.06,
    maskBlur: 2,
  },

  'clean-shaven': {
    prompt: 'completely clean shaven perfectly smooth face, no facial hair whatsoever, clear defined strong jawline, healthy natural skin texture with pores visible, slight natural skin sheen, photorealistic portrait, same person identical face, same lighting and skin tone, high quality',
    strength: 0.85,
    guidance_scale: 7.0,
    neckPad: 0.04,
    maskBlur: 5,
  },

  'short-boxed-beard': {
    prompt: 'short boxed beard 5-10mm precisely trimmed with razor sharp geometric edges, perfectly clean defined cheek line and neckline, dense even coverage, professional barbershop finish, uniform length throughout, squared-off bottom edge, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.88,
    guidance_scale: 8.0,
    neckPad: 0.05,
    maskBlur: 2,
  },

  'corporate-beard': {
    prompt: 'corporate professional beard 1-2cm length well-maintained and groomed, balanced proportions with subtle natural taper at cheeks, neat defined neckline, dense but not overly thick, executive polished appearance, connected trimmed mustache, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.88,
    guidance_scale: 7.5,
    neckPad: 0.06,
    maskBlur: 3,
  },

  'goatee': {
    prompt: 'classic goatee beard, chin beard naturally connected to trimmed mustache forming continuous unit, completely clean shaven cheeks and jaw sides, rounded natural bottom shape 2-4cm, moderate thickness with visible hair texture, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.88,
    guidance_scale: 8.0,
    neckPad: 0.05,
    maskBlur: 3,
  },

  'balbo': {
    prompt: 'balbo beard style, clearly disconnected trimmed mustache separated from floating chin beard with thin soul patch connecting them vertically, no sideburns whatsoever, completely clean shaven cheeks and jaw sides, precise geometric shapes, sharp defined edges, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.90,
    guidance_scale: 9.0,
    neckPad: 0.05,
    maskBlur: 2,
  },

  'circle-beard': {
    prompt: 'circle beard, perfectly rounded goatee seamlessly connecting mustache and chin beard in smooth circular shape, symmetrical round appearance, clean shaven cheeks, moderate 1-2cm length, well-groomed uniform density, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.88,
    guidance_scale: 8.0,
    neckPad: 0.05,
    maskBlur: 3,
  },

  'ducktail': {
    prompt: 'ducktail beard, full dense beard with distinctly pointed bottom resembling duck tail shape, longer at chin center 5-8cm tapering to elegant point, shorter on sides 2-3cm, natural thick texture with volume, connected flowing mustache, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.92,
    guidance_scale: 8.0,
    neckPad: 0.10,
    maskBlur: 3,
  },

  'garibaldi': {
    prompt: 'garibaldi beard, impressively wide thick rounded full beard 15-20cm length, natural untrimmed bottom edge with organic rounded shape, maximum volume and width extending well beyond jawline, dense wild organic texture with natural wave, connected thick mustache, photorealistic portrait, same person identical face, same lighting and skin tone, 8k ultra detailed',
    strength: 0.95,
    guidance_scale: 7.5,
    neckPad: 0.12,
    maskBlur: 4,
  },

  'mutton-chops': {
    prompt: 'mutton chops, thick prominent wide sideburns extending from temples down past jawline, dramatically flared outward at bottom, completely clean shaven chin and upper lip area, no mustache, vintage bold dramatic look with dense hair texture, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.90,
    guidance_scale: 8.5,
    neckPad: 0.04,
    maskBlur: 3,
  },

  'anchor-beard': {
    prompt: 'anchor beard, anchor-shaped chin beard with thin vertical soul patch extending down from lower lip, pointed chin beard extending along jawline forming anchor shape, styled separate mustache above, clean shaven cheeks, precise geometric anchor form, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.90,
    guidance_scale: 9.0,
    neckPad: 0.06,
    maskBlur: 2,
  },

  'chin-strap': {
    prompt: 'chin strap beard, thin precise beard line 3-5mm width following jawline contour from ear to ear along bottom of jaw, no cheek coverage, no mustache, clean sharply defined narrow stripe along jaw edge, uniform width throughout, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.88,
    guidance_scale: 9.0,
    neckPad: 0.03,
    maskBlur: 2,
  },

  'beardstache': {
    prompt: 'beardstache style, prominent thick bold statement mustache as dominant focal point with natural body and shape, full beard kept noticeably shorter 3-5mm than the longer 10-15mm mustache, clear contrast between thick mustache and shorter beard, masculine powerful look, photorealistic portrait, same person identical face, same lighting and skin tone, high detail',
    strength: 0.90,
    guidance_scale: 8.0,
    neckPad: 0.06,
    maskBlur: 3,
  },
};

// Default config for unknown styles
const DEFAULT_STYLE_CONFIG = {
  prompt: 'natural well-groomed beard, photorealistic portrait, same person identical face, same lighting and skin tone, high quality',
  strength: 0.90,
  guidance_scale: 7.5,
  neckPad: 0.06,
  maskBlur: 3,
};

const NEGATIVE_PROMPT = [
  'cartoon, anime, illustration, painting, drawing, sketch',
  'different person, changed face, face swap, different identity, altered features',
  'low quality, blurry, pixelated, bad anatomy, deformed, disfigured',
  'watermark, text, signature, logo, overlay',
  'unrealistic skin, plastic skin, fake, wax figure, mannequin',
  'cropped face, cut off head, extra fingers, missing ears',
  'patchy beard, uneven growth, floating hair, disconnected hair, bald patches',
  'different skin tone, different skin color, mismatched lighting',
].join(', ');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeaders() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error('REPLICATE_API_TOKEN not set in environment');
  return { Authorization: `Token ${token}`, 'Content-Type': 'application/json' };
}

/**
 * Convert base64 data-URL or raw base64 string to a Buffer.
 * Replicate accepts base64-encoded URLs in the form "data:image/png;base64,..."
 */
function toDataUrl(base64String, mimeType = 'image/png') {
  if (base64String.startsWith('data:')) return base64String;
  return `data:${mimeType};base64,${base64String}`;
}

/**
 * Resize image for Flux inpainting, preserving aspect ratio.
 * Uses 'contain' + black padding so faces aren't cropped or distorted.
 * Falls back to returning the original base64 if sharp is unavailable.
 *
 * @param {string} imageBase64  - User photo
 * @param {string} maskBase64   - Beard mask
 * @param {Object} [options]
 * @param {number} [options.targetSize=1024] - Output resolution (512 for preview, 1024 for full)
 * @returns {Promise<Object>} { resizedImageB64, resizedMaskB64, originalWidth, originalHeight, dominantHairColor }
 */
async function prepareImages(imageBase64, maskBase64, options = {}) {
  const { targetSize = 1024 } = options;
  const stripPrefix = (b64) => b64.replace(/^data:[^;]+;base64,/, '');

  if (!sharp) {
    console.warn('[ReplicateService] sharp unavailable — sending original image size');
    return {
      resizedImageB64: stripPrefix(imageBase64),
      resizedMaskB64:  maskBase64 ? stripPrefix(maskBase64) : '',
      originalWidth:   null,
      originalHeight:  null,
      dominantHairColor: null,
    };
  }

  const imgBuf  = Buffer.from(stripPrefix(imageBase64), 'base64');
  const maskBuf = maskBase64 ? Buffer.from(stripPrefix(maskBase64), 'base64') : null;

  const meta = await sharp(imgBuf).metadata();
  const TARGET = targetSize;

  // contain = fit inside TARGET×TARGET, pad with black (preserves face proportions)
  const resizedImg = await sharp(imgBuf)
    .resize(TARGET, TARGET, { fit: 'contain', background: { r: 0, g: 0, b: 0 } })
    .png()
    .toBuffer();

  // Mask: same resize, but pad with black (= no inpainting on padded areas)
  const resizedMask = maskBuf
    ? await sharp(maskBuf)
        .resize(TARGET, TARGET, { fit: 'contain', background: { r: 0, g: 0, b: 0 } })
        .greyscale()
        .png()
        .toBuffer()
    : null;

  // ── Detect dominant hair color from top ~25% of face area ───────────────
  // Sample the region above the face center where hair typically is
  let dominantHairColor = null;
  try {
    const hairRegion = await sharp(imgBuf)
      .resize(128, 128, { fit: 'cover' })
      .extract({ left: 20, top: 5, width: 88, height: 30 }) // top-center strip
      .stats();

    const r = Math.round(hairRegion.channels[0].mean);
    const g = Math.round(hairRegion.channels[1].mean);
    const b = Math.round(hairRegion.channels[2].mean);

    // Classify hair color from RGB
    const brightness = (r + g + b) / 3;
    const warmth = r - b; // positive = warm tones

    if (brightness < 50) {
      dominantHairColor = 'black';
    } else if (brightness < 90 && warmth > 10) {
      dominantHairColor = 'dark brown';
    } else if (brightness < 130 && warmth > 20) {
      dominantHairColor = 'medium brown';
    } else if (brightness < 130) {
      dominantHairColor = 'dark brown';
    } else if (warmth > 40 && r > 150) {
      dominantHairColor = 'red';
    } else if (brightness < 170 && warmth > 15) {
      dominantHairColor = 'light brown';
    } else if (brightness >= 170 && warmth > 10) {
      dominantHairColor = 'blonde';
    } else if (brightness >= 170) {
      dominantHairColor = 'light blonde';
    } else {
      dominantHairColor = 'brown';
    }

    console.log(`🎨 [HairColor] Detected: ${dominantHairColor} (R=${r} G=${g} B=${b} bright=${brightness.toFixed(0)})`);
  } catch (err) {
    console.warn('[HairColor] Detection failed, skipping:', err.message);
  }

  return {
    resizedImageB64: resizedImg.toString('base64'),
    resizedMaskB64:  resizedMask ? resizedMask.toString('base64') : '',
    originalWidth:   meta.width,
    originalHeight:  meta.height,
    dominantHairColor,
  };
}

/**
 * Poll prediction until it succeeds, fails, or times out.
 * Returns the final prediction object.
 */
async function pollPrediction(predictionId) {
  const headers   = getAuthHeaders();
  const start     = Date.now();
  const url       = `${REPLICATE_API}/predictions/${predictionId}`;

  while (Date.now() - start < POLL_TIMEOUT_MS) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const { data } = await axios.get(url, { headers });

    if (data.status === 'succeeded') return data;

    if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(`Replicate prediction ${data.status}: ${data.error || 'unknown error'}`);
    }

    // status === 'starting' | 'processing' → keep polling
  }

  throw new Error(`Replicate prediction timed out after ${POLL_TIMEOUT_MS / 1000}s`);
}

/**
 * Download a remote image URL and save it to the uploads directory.
 * Returns the relative file path (e.g. "uploads/generated-xyz.png").
 */
async function downloadAndSave(imageUrl, styleSlug) {
  const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const filename  = `generated-${styleSlug}-${Date.now()}.png`;
  const filepath  = path.join('uploads', filename);
  await fs.writeFile(filepath, data);
  console.log(`💾 Saved generated image: ${filepath}`);
  return filepath;
}

// ─── Public API ───────────────────────────────────────────────────────────────

class ReplicateService {
  /**
   * Get per-style configuration. Returns tuned parameters for the given style,
   * falling back to DEFAULT_STYLE_CONFIG for unknown slugs.
   *
   * @param {string} styleSlug
   * @returns {Object} { prompt, strength, guidance_scale, neckPad, maskBlur }
   */
  static getStyleConfig(styleSlug) {
    return STYLE_CONFIG[styleSlug] || { ...DEFAULT_STYLE_CONFIG };
  }

  /**
   * Enrich the base prompt with detected hair color for natural blending.
   *
   * @param {string} basePrompt   - Style-specific prompt
   * @param {string|null} hairColor - Detected hair color (e.g. 'dark brown')
   * @returns {string} Enhanced prompt
   */
  static enrichPromptWithColor(basePrompt, hairColor) {
    if (!hairColor) return basePrompt;
    // Insert hair color naturally after the beard description, before the realism tags
    const realism = 'photorealistic portrait';
    const idx = basePrompt.indexOf(realism);
    if (idx === -1) return `${basePrompt}, ${hairColor} colored beard hair matching head hair`;
    return (
      basePrompt.slice(0, idx) +
      `${hairColor} colored beard hair naturally matching head hair color, ` +
      basePrompt.slice(idx)
    );
  }

  /**
   * Generate a photorealistic beard visualization via inpainting.
   *
   * @param {string} imageBase64 - User's photo (base64 or data-URL)
   * @param {string} maskBase64  - White-on-black beard mask (base64 or data-URL)
   * @param {string} styleSlug   - e.g. 'full-beard', 'stubble', 'van-dyke'
   * @param {Object} [options]
   * @param {string} [options.quality='full']     - 'preview' (512px, 15 steps) or 'full' (1024px, 28 steps)
   * @param {number} [options.strengthOverride]    - User-controlled strength (0.5-1.0)
   * @returns {Promise<Object>}  { imageUrl, localPath, styleSlug, generatedAt, quality, cached }
   */
  static async generateBeardVisualization(imageBase64, maskBase64, styleSlug, options = {}) {
    const { quality = 'full', strengthOverride } = options;

    if (process.env.USE_MOCK_AI === 'true') {
      console.log('🎭 [Replicate] Using mock visualization');
      return this.getMockVisualization(styleSlug);
    }

    // ── Check cache first ──────────────────────────────────────────────────
    const cacheKey = getCacheKey(imageBase64, styleSlug, quality);
    const cached = getCachedResult(cacheKey);
    if (cached) {
      console.log(`⚡ [Replicate] Cache hit for ${styleSlug} (${quality})`);
      return { ...cached, cached: true };
    }

    // ── Get per-style config ───────────────────────────────────────────────
    const config = this.getStyleConfig(styleSlug);
    console.log(`🎨 [Replicate] Starting ${quality} inpainting for: ${styleSlug} (strength=${config.strength}, guidance=${config.guidance_scale})`);

    // ── Progressive quality settings ───────────────────────────────────────
    const isPreview = quality === 'preview';
    const targetSize = isPreview ? 512 : 1024;
    const inferenceSteps = isPreview ? 15 : 28;
    const strength = strengthOverride != null
      ? Math.max(0.5, Math.min(1.0, strengthOverride))
      : config.strength;

    // ── Resize images ──────────────────────────────────────────────────────
    const { resizedImageB64, resizedMaskB64, originalWidth, originalHeight, dominantHairColor } =
      await prepareImages(imageBase64, maskBase64, { targetSize });

    // ── Build prompt with hair color ───────────────────────────────────────
    const prompt = this.enrichPromptWithColor(config.prompt, dominantHairColor);

    // ── Create Replicate prediction ────────────────────────────────────────
    const { data: prediction } = await axios.post(
      `${REPLICATE_API}/predictions`,
      {
        version: MODEL_VERSION,
        input: {
          image:              toDataUrl(resizedImageB64, 'image/png'),
          mask:               toDataUrl(resizedMaskB64,  'image/png'),
          prompt,
          negative_prompt:    NEGATIVE_PROMPT,
          strength,
          num_inference_steps: inferenceSteps,
          guidance_scale:     config.guidance_scale,
          output_format:      'png',
        },
      },
      { headers: getAuthHeaders() },
    );

    console.log(`⏳ [Replicate] Prediction ${prediction.id} (${quality}: ${targetSize}px, ${inferenceSteps} steps, strength=${strength})`);

    // ── Poll until done ────────────────────────────────────────────────────
    const result = await pollPrediction(prediction.id);
    const outputUrl = result.output?.[0];
    if (!outputUrl) throw new Error('Replicate returned no output URL');

    // ── Download and save locally ──────────────────────────────────────────
    const suffix = isPreview ? '-preview' : '';
    const localPath = await downloadAndSave(outputUrl, `${styleSlug}${suffix}`);

    // Use relative URL so nginx proxy works correctly from any hostname
    const resultData = {
      imageUrl:          `/${localPath.replace(/\\/g, '/')}`,
      localPath,
      styleSlug,
      model:             'zsxkib/flux-dev-inpainting',
      quality,
      generatedAt:       new Date().toISOString(),
      detectedHairColor: dominantHairColor,
      parameters: {
        strength,
        guidance_scale:     config.guidance_scale,
        num_inference_steps: inferenceSteps,
        targetSize,
      },
    };

    // ── Cache the result ───────────────────────────────────────────────────
    setCachedResult(cacheKey, resultData);

    return { ...resultData, cached: false };
  }

  /**
   * Generate a fast preview (512px, 15 steps) — returns in ~15-20s vs ~55s.
   * Use for instant feedback; user can then request full quality.
   */
  static async generatePreview(imageBase64, maskBase64, styleSlug, options = {}) {
    return this.generateBeardVisualization(imageBase64, maskBase64, styleSlug, {
      ...options,
      quality: 'preview',
    });
  }

  /**
   * Generate full quality (1024px, 28 steps).
   */
  static async generateFullQuality(imageBase64, maskBase64, styleSlug, options = {}) {
    return this.generateBeardVisualization(imageBase64, maskBase64, styleSlug, {
      ...options,
      quality: 'full',
    });
  }

  /** True only when the API token is present in env */
  static isAvailable() {
    return !!(
      process.env.REPLICATE_API_TOKEN &&
      process.env.REPLICATE_API_TOKEN !== 'your_replicate_api_token_here'
    );
  }

  /** Clear the generation cache (useful for testing) */
  static clearCache() {
    generationCache.clear();
    console.log('🗑️ [Replicate] Generation cache cleared');
  }

  /** Get cache stats */
  static getCacheStats() {
    return {
      size: generationCache.size,
      maxSize: 50,
      ttlMinutes: CACHE_TTL_MS / 60000,
    };
  }

  static getMockVisualization(styleSlug) {
    // Use the actual sketch image that exists in frontend/public/assets/sketches/
    // This prevents 404 errors in mock mode
    return {
      imageUrl:    `/assets/sketches/${styleSlug}.webp`,
      localPath:   `uploads/mock-${styleSlug}.webp`,
      styleSlug,
      model:       'mock-replicate',
      quality:     'full',
      generatedAt: new Date().toISOString(),
      isMock:      true,
    };
  }
}

module.exports = ReplicateService;
