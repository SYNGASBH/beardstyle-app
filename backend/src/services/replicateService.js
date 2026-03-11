/**
 * replicateService.js
 *
 * Handles realistic beard visualization via Replicate API (inpainting).
 * Uses stability-ai/stable-diffusion-inpainting to paint a beard
 * onto the user's actual photo, guided by the mask from generateBeardMask.js.
 *
 * Flow:
 *   1. POST /v1/predictions  → create prediction, get ID
 *   2. Poll GET /v1/predictions/:id  → wait for 'succeeded'
 *   3. Download output image → save locally → return URL
 *
 * Auth: REPLICATE_API_TOKEN in .env
 */

const axios  = require('axios');
const fs     = require('fs').promises;
const path   = require('path');

// sharp is optional — gracefully falls back to raw base64 if unavailable
// (e.g. local Node < 18.17; Docker always satisfies the requirement)
let sharp;
try { sharp = require('sharp'); } catch (_) { sharp = null; }

const REPLICATE_API = 'https://api.replicate.com/v1';

// Stable Diffusion Inpainting — well-tested, widely available on Replicate.
// Model: stability-ai/stable-diffusion-inpainting
// Version pinned for reproducibility (update if Replicate deprecates it).
const MODEL_VERSION = '95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3';

// Polling config
const POLL_INTERVAL_MS  = 2000;   // check every 2 s
const POLL_TIMEOUT_MS   = 120000; // give up after 2 min

// ─── Beard prompts (per style slug) ──────────────────────────────────────────
//
// Each prompt describes the PERSON WITH the beard — not just the beard.
// This is how inpainting works: the model fills the masked area
// in a way that matches the surrounding context + the prompt.
//
// Rules:
//   - Start with the beard description
//   - Add "photorealistic, same person, same lighting" for consistency
//   - Keep prompts specific enough to distinguish styles

const BEARD_PROMPTS = {
  'full-beard': 'thick natural full beard 8-12cm length, well-groomed with natural volume, dense even coverage, connected mustache, photorealistic portrait, same person, same lighting, 8k, high quality',

  'stubble':         'short 3-day beard stubble 2-3mm, masculine shadow effect, even distribution, photorealistic portrait, same person, same lighting, high quality',
  'stubble-3day':    'short 3-day beard stubble 2-3mm, masculine shadow effect, even distribution, photorealistic portrait, same person, same lighting, high quality',

  'van-dyke':        'van dyke beard style, pointed chin beard clearly disconnected from styled upward-curved mustache, clean shaven cheeks, elegant refined shape, photorealistic portrait, same person, same lighting',

  'clean-shaven':    'completely clean shaven smooth face, no facial hair, clear defined jawline, photorealistic portrait, same person, same lighting, high quality',

  'short-boxed-beard': 'short boxed beard 5-8mm precisely trimmed, sharp geometric edges, clean defined cheek line and neckline, neat professional, photorealistic portrait, same person, same lighting',

  'corporate-beard': 'corporate beard 1-2cm well-maintained, balanced proportions, subtle taper at cheeks, professional groomed, photorealistic portrait, same person, same lighting',

  'goatee':          'goatee beard, chin beard connected to mustache, clean shaven cheeks, rounded bottom shape, photorealistic portrait, same person, same lighting',

  'balbo':           'balbo beard, disconnected mustache and floating chin beard with soul patch, no sideburns, clean shaven cheeks and jaw sides, photorealistic portrait, same person, same lighting',

  'circle-beard':    'circle beard, rounded goatee connecting mustache and chin in circular shape, clean shaven cheeks, symmetrical circular appearance, photorealistic portrait, same person, same lighting',

  'ducktail':        'ducktail beard, full beard with pointed bottom resembling duck tail shape, longer at chin tapering to point, dense texture, photorealistic portrait, same person, same lighting',

  'garibaldi':       'garibaldi beard, wide thick rounded full beard 15-20cm, natural untrimmed bottom edge, impressive volume and width, organic texture, photorealistic portrait, same person, same lighting',

  'mutton-chops':    'mutton chops, thick prominent sideburns extending down to jawline, completely clean shaven chin, wide flared sideburns, vintage dramatic look, photorealistic portrait, same person, same lighting',

  'anchor-beard':    'anchor beard, anchor-shaped chin beard with thin soul patch, pointed chin extending along jawline, styled mustache, clean shaven cheeks, photorealistic portrait, same person, same lighting',

  'chin-strap':      'chin strap beard, thin beard line following jawline contour from ear to ear, no cheek coverage, clean defined stripe along jaw, photorealistic portrait, same person, same lighting',

  'beardstache':     'beardstache style, prominent thick statement mustache as dominant focal point, full beard kept shorter than mustache, bold masculine mustache, photorealistic portrait, same person, same lighting',
};

const NEGATIVE_PROMPT = [
  'cartoon, anime, illustration, painting, drawing, sketch',
  'different person, changed face, face swap',
  'low quality, blurry, pixelated, bad anatomy',
  'watermark, text, signature, logo',
  'unrealistic skin, plastic skin, fake',
  'cropped face, cut off head',
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
 * Resize image to 512×512 for SD inpainting.
 * Falls back to returning the original base64 if sharp is unavailable.
 */
async function prepareImages(imageBase64, maskBase64) {
  const stripPrefix = (b64) => b64.replace(/^data:[^;]+;base64,/, '');

  if (!sharp) {
    // No sharp — pass images as-is; Replicate will resize server-side
    console.warn('[ReplicateService] sharp unavailable — sending original image size');
    return {
      resizedImageB64: stripPrefix(imageBase64),
      resizedMaskB64:  maskBase64 ? stripPrefix(maskBase64) : '',
      originalWidth:   null,
      originalHeight:  null,
    };
  }

  const imgBuf  = Buffer.from(stripPrefix(imageBase64), 'base64');
  const maskBuf = maskBase64 ? Buffer.from(stripPrefix(maskBase64), 'base64') : null;

  const meta = await sharp(imgBuf).metadata();
  const TARGET = 512;

  const resizedImg  = await sharp(imgBuf).resize(TARGET, TARGET, { fit: 'cover' }).png().toBuffer();
  const resizedMask = maskBuf
    ? await sharp(maskBuf).resize(TARGET, TARGET, { fit: 'cover' }).greyscale().png().toBuffer()
    : null;

  return {
    resizedImageB64: resizedImg.toString('base64'),
    resizedMaskB64:  resizedMask ? resizedMask.toString('base64') : '',
    originalWidth:   meta.width,
    originalHeight:  meta.height,
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
   * Generate a photorealistic beard visualization via inpainting.
   *
   * @param {string} imageBase64 - User's photo (base64 or data-URL)
   * @param {string} maskBase64  - White-on-black beard mask (base64 or data-URL)
   * @param {string} styleSlug   - e.g. 'full-beard', 'stubble', 'van-dyke'
   * @returns {Promise<Object>}  { imageUrl, localPath, styleSlug, generatedAt }
   */
  static async generateBeardVisualization(imageBase64, maskBase64, styleSlug) {
    if (process.env.USE_MOCK_AI === 'true') {
      console.log('🎭 [Replicate] Using mock visualization');
      return this.getMockVisualization(styleSlug);
    }

    // 1. Resolve prompt for this style
    const prompt = BEARD_PROMPTS[styleSlug] || BEARD_PROMPTS['full-beard'];
    console.log(`🎨 [Replicate] Starting inpainting for style: ${styleSlug}`);

    // 2. Resize images to 512×512 (SD requirement)
    const { resizedImageB64, resizedMaskB64, originalWidth, originalHeight } =
      await prepareImages(imageBase64, maskBase64);

    // 3. Create Replicate prediction
    const { data: prediction } = await axios.post(
      `${REPLICATE_API}/predictions`,
      {
        version: MODEL_VERSION,
        input: {
          image:           toDataUrl(resizedImageB64, 'image/png'),
          mask:            toDataUrl(resizedMaskB64,  'image/png'),
          prompt,
          negative_prompt: NEGATIVE_PROMPT,
          num_outputs:     1,
          num_inference_steps: 30,
          guidance_scale:  7.5,
          // Preserve the unmasked area as much as possible
          strength:        0.85,
        },
      },
      { headers: getAuthHeaders() },
    );

    console.log(`⏳ [Replicate] Prediction created: ${prediction.id}`);

    // 4. Poll until done
    const result = await pollPrediction(prediction.id);
    const outputUrl = result.output?.[0];
    if (!outputUrl) throw new Error('Replicate returned no output URL');

    // 5. Download and save locally
    const localPath = await downloadAndSave(outputUrl, styleSlug);

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

    return {
      imageUrl:     `${backendUrl}/${localPath}`,
      localPath,
      styleSlug,
      model:        'stability-ai/stable-diffusion-inpainting',
      generatedAt:  new Date().toISOString(),
    };
  }

  /** True only when the API token is present in env */
  static isAvailable() {
    return !!(
      process.env.REPLICATE_API_TOKEN &&
      process.env.REPLICATE_API_TOKEN !== 'your_replicate_api_token_here'
    );
  }

  static getMockVisualization(styleSlug) {
    return {
      imageUrl:    `/assets/mock-beard-${styleSlug}.jpg`,
      localPath:   `uploads/mock-${styleSlug}.jpg`,
      styleSlug,
      model:       'mock-replicate',
      generatedAt: new Date().toISOString(),
      isMock:      true,
    };
  }
}

module.exports = ReplicateService;
