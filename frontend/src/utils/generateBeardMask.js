/**
 * generateBeardMask.js
 *
 * Generates a black-and-white canvas mask for the beard zone,
 * ready to be sent to Replicate inpainting API.
 *
 * Uses MediaPipe FaceMesh 468-point indices (refineLandmarks: false).
 *
 * Landmark sources:
 *   FACEMESH_FACE_OVAL  — Google MediaPipe documented connection list
 *   FACEMESH_LIPS       — Google MediaPipe documented connection list
 *
 * Mask polygon strategy:
 *   LOWER BOUNDARY  : face-oval lower half (jawline, left→right through chin)
 *   UPPER CLOSURE   : straight line 454→291, upper-lip arc 291→61, straight 61→234
 *   NECK EXTENSION  : chin point (152) pushed down by `neckPad` to cover neck stubble
 */

// ─── Landmark index constants ──────────────────────────────────────────────

/**
 * Face-oval lower half, going clockwise from left cheekbone (234) to
 * right cheekbone (454) via the chin (152).
 *
 * Derived from the official FACEMESH_FACE_OVAL connection sequence:
 * [..., 93-234, 234→... skip upper head ...→454, 454→323→361→288→397→
 *  365→379→378→400→377→152→148→176→149→150→136→172→58→132→93, ...]
 */
const JAWLINE = [
  234, 93, 132, 58,          // left sideburn → left jaw
  172, 136, 150, 149,        // left jaw → lower left jaw
  176, 148,                  // lower left jaw → chin approach
  152,                       // chin tip (lowest point — anchor for neck pad)
  377, 400, 378, 379,        // chin → lower right jaw
  365, 397, 288, 361,        // right jaw
  323, 454,                  // right jaw → right cheekbone
];

/**
 * Upper lip outer contour, going RIGHT → LEFT (291→61).
 * Source: FACEMESH_LIPS outer upper connection pairs.
 * We traverse them right-to-left to keep the polygon clockwise.
 */
const UPPER_LIP_R_TO_L = [291, 409, 270, 269, 267, 0, 37, 39, 40, 185, 61];

// Anchor indices for the straight-line cheek connectors
const RIGHT_CHEEKBONE = 454;  // = JAWLINE last point
const LEFT_CHEEKBONE  = 234;  // = JAWLINE first point
const RIGHT_MOUTH_CORNER = 291; // = UPPER_LIP_R_TO_L first point
const LEFT_MOUTH_CORNER  = 61;  // = UPPER_LIP_R_TO_L last point

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Build the beard-zone mask and return it as a base64 PNG string.
 *
 * @param {Array}  landmarks  - FaceMesh result: array of 468 objects {x, y, z}
 *                              with x,y normalized to [0,1].
 * @param {number} imgWidth   - Pixel width  of the original image.
 * @param {number} imgHeight  - Pixel height of the original image.
 * @param {Object} [options]
 * @param {number} [options.neckPad=0.06]   - Extra downward push below chin as
 *                                            fraction of face height, to cover neck.
 * @param {number} [options.blur=0]          - Gaussian blur radius (px) to soften
 *                                            mask edges. 0 = hard edge (best for Flux).
 * @param {string} [options.maskColor='white'] - Painted zone: 'white' (masked)
 *                                              or 'black' if API expects inverted.
 * @returns {string} base64-encoded PNG  ("data:image/png;base64,…")
 */
export function generateBeardMask(landmarks, imgWidth, imgHeight, options = {}) {
  const {
    neckPad    = 0.06,
    blur       = 0,        // Hard edge — Flux handles blending internally
    maskColor  = 'white',  // Replicate expects white = area to paint
  } = options;

  // ── 1. Create hidden canvas ──────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.width  = imgWidth;
  canvas.height = imgHeight;
  const ctx = canvas.getContext('2d');

  // Background: black (untouched area)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, imgWidth, imgHeight);

  // ── 2. Denormalize landmarks → pixel coords ──────────────────────────────
  const px = (idx) => ({
    x: landmarks[idx].x * imgWidth,
    y: landmarks[idx].y * imgHeight,
  });

  // ── 3. Calculate neck extension ──────────────────────────────────────────
  // Face height = distance from forehead (idx 10) to chin (idx 152)
  const foreheadY = landmarks[10].y  * imgHeight;
  const chinY     = landmarks[152].y * imgHeight;
  const faceH     = chinY - foreheadY;
  const neckPushPx = faceH * neckPad;

  // ── 4. Build polygon points ──────────────────────────────────────────────
  //
  // Polygon is constructed clockwise:
  //
  //   234 ──── (jawline) ──── 454
  //    │                       │
  //   (straight)           (straight)
  //    │                       │
  //   61 ──── (upper lip) ──── 291
  //
  // Plus: chin point 152 is pushed down by neckPushPx.

  const points = [];

  // Left cheekbone → chin via jawline (with neck push on chin point)
  for (const idx of JAWLINE) {
    const p = px(idx);
    if (idx === 152) {
      // Extend chin downward to cover neck stubble
      points.push({ x: p.x, y: p.y + neckPushPx });
    } else {
      points.push(p);
    }
  }

  // 454 → 291 : straight line across right cheek (closes right side)
  points.push(px(RIGHT_MOUTH_CORNER));

  // Upper lip arc: 291 → 61
  for (const idx of UPPER_LIP_R_TO_L.slice(1)) {   // 291 already pushed above
    points.push(px(idx));
  }

  // 61 → 234 : straight line across left cheek (closes left side)
  // 234 is already the first point, canvas closePath handles this.

  // ── 5. Draw filled polygon ───────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();

  // Optional: blur filter for smooth mask edges (reduces hard-border artifacts)
  if (blur > 0) {
    ctx.filter = `blur(${blur}px)`;
  }

  ctx.fillStyle = maskColor;
  ctx.fill();

  // ── 6. Debug overlay (developer-only, kontrolisano env varijablom) ────────
  const showDebug = process.env.REACT_APP_SHOW_FACE_MESH_DEBUG === 'true';
  if (showDebug) {
    ctx.filter = 'none';

    // Polygon outline
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Landmark points
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FF0000';
      ctx.fill();
    }

    console.debug('[BeardStyle] Face mesh debug iscrtan na maski.');
  } else {
    console.debug('[BeardStyle] Face mesh sakriven (korisnički prikaz).');
  }

  // ── 7. Export as base64 PNG ──────────────────────────────────────────────
  return canvas.toDataURL('image/png');
}

/**
 * Fallback mask kada MediaPipe/WebGL nije dostupan.
 * Crta bijelu elipsu koja pokriva zonu brade (donja ~45% lica).
 * Puno bolje od praznog maska — Replicate može inpaintovati.
 *
 * @param {number} imgWidth
 * @param {number} imgHeight
 * @returns {string} base64 PNG
 */
export function generateFallbackMask(imgWidth, imgHeight) {
  const canvas = document.createElement('canvas');
  canvas.width  = imgWidth;
  canvas.height = imgHeight;
  const ctx = canvas.getContext('2d');

  // Crna pozadina (nedirnutо područje)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, imgWidth, imgHeight);

  // Bijela elipsa — zona brade: centar ~75% visine, širina ~65%, visina ~40%
  const cx = imgWidth  * 0.50;
  const cy = imgHeight * 0.76;
  const rx = imgWidth  * 0.33;
  const ry = imgHeight * 0.20;

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  console.debug('[BeardStyle] Fallback mask generisan (WebGL/MediaPipe nedostupan).');
  return canvas.toDataURL('image/png');
}

/**
 * Convenience wrapper: runs FaceMesh (re-uses the already-loaded instance
 * from faceShape.js) on an HTMLImageElement and returns the mask.
 *
 * Returns null if face detection fails (no face, tilted, CDN down).
 *
 * @param {HTMLImageElement} imageElement
 * @param {Object} [options] - Passed to generateBeardMask
 * @returns {Promise<string|null>} base64 PNG or null
 */
/**
 * Provjeri da li je WebGL dostupan prije nego MediaPipe pokuša.
 * Sprečava 4-6 console grešaka na računarima bez GPU podrške.
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('webgl2') ||
      canvas.getContext('experimental-webgl')
    );
  } catch (_) {
    return false;
  }
}

export async function detectAndGenerateMask(imageElement, options = {}) {
  // Ako WebGL nije dostupan, odmah idi na fallback — ne pokreći MediaPipe
  if (!isWebGLAvailable()) {
    console.debug('[BeardStyle] WebGL nije dostupan — preskačem MediaPipe, koristim fallback mask.');
    return null;
  }

  // Re-use the same loadFaceMesh singleton to avoid double script injection
  const { loadFaceMesh } = await import('./faceShape.js');
  await loadFaceMesh();

  if (!window.FaceMesh) return null;

  const MP_VERSION = '0.4.1633559619';
  const MP_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${MP_VERSION}`;

  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };

    const timeout = setTimeout(() => done(null), 10000);

    try {
      const fm = new window.FaceMesh({ locateFile: (f) => `${MP_CDN}/${f}` });

      fm.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,   // 468 points — matches our index map
        minDetectionConfidence: 0.5,
        minTrackingConfidence:  0.5,
      });

      fm.onResults((results) => {
        clearTimeout(timeout);
        try { fm.close(); } catch (_) {}

        const lms = results.multiFaceLandmarks?.[0];
        if (!lms) { done(null); return; }

        const mask = generateBeardMask(
          lms,
          imageElement.naturalWidth  || imageElement.width,
          imageElement.naturalHeight || imageElement.height,
          options,
        );
        done(mask);
      });

      fm.send({ image: imageElement }).catch(() => {
        clearTimeout(timeout);
        done(null);
      });
    } catch (_) {
      clearTimeout(timeout);
      done(null);
    }
  });
}
