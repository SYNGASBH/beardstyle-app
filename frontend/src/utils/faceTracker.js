/**
 * Face Tracker — Tracking Layer (Decoupled from Rendering)
 *
 * Extracts MediaPipe FaceMesh 468-point landmarks and computes:
 *   - centerX / centerY   (beard anchor point in pixels)
 *   - scale               (face-width-relative sizing)
 *   - roll                (Z-axis: head tilt left/right)
 *   - yaw                 (Y-axis: head turn left/right)
 *   - pitch               (X-axis: head look up/down)
 *   - jawWidth            (pixel distance left-to-right jaw)
 *   - skinTone            (sampled RGBA from cheek region)
 *
 * Architecture note:
 *   This module is PURE DATA — it returns numbers, not DOM elements.
 *   The Rendering Layer (ARBeardOverlay) consumes this data.
 *   When WebGL/Three.js is available in the future, swap the renderer
 *   while keeping this tracker intact.
 *
 * Key landmarks used:
 *   1   = nose tip
 *   152 = chin bottom
 *   234 = left jaw (cheekbone level)
 *   454 = right jaw (cheekbone level)
 *   10  = forehead top
 *   61  = left mouth corner (upper lip)
 *   291 = right mouth corner (upper lip)
 *   50  = left cheek (for skin sampling)
 *   280 = right cheek (for skin sampling)
 */

import { loadFaceMesh } from './faceShape';

// ── Singleton FaceMesh instance for continuous tracking ──────────────────
let _faceMesh = null;
let _onResults = null;
let _initPromise = null;

const MP_VERSION = '0.4.1633559619';
const MP_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${MP_VERSION}`;

/**
 * Check if WebGL is available (MediaPipe requires it).
 */
function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('webgl2') || c.getContext('experimental-webgl'));
  } catch (_) {
    return false;
  }
}

/**
 * Initialize MediaPipe FaceMesh for continuous frame processing.
 * Returns a Promise that resolves when ready.
 */
export async function initTracker() {
  if (_faceMesh) return _faceMesh;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    if (!isWebGLAvailable()) {
      console.warn('[FaceTracker] WebGL nedostupan — tracker ne moze raditi bez GPU podrske.');
      throw new Error('WebGL is not available on this device');
    }

    await loadFaceMesh();
    if (!window.FaceMesh) {
      throw new Error('MediaPipe FaceMesh failed to load from CDN');
    }

    const fm = new window.FaceMesh({
      locateFile: (f) => `${MP_CDN}/${f}`,
    });

    fm.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    fm.onResults((results) => {
      if (_onResults) _onResults(results);
    });

    // Warm up with a small canvas to trigger WASM init
    const warmup = document.createElement('canvas');
    warmup.width = 10;
    warmup.height = 10;
    try {
      await fm.send({ image: warmup });
    } catch (_) {
      // Warm-up may fail on some browsers — that's OK
    }

    _faceMesh = fm;
    return fm;
  })();

  return _initPromise;
}

/**
 * Send a video/image frame to MediaPipe and get transform data back.
 *
 * @param {HTMLVideoElement|HTMLCanvasElement|HTMLImageElement} frame
 * @param {number} width  - frame width in pixels
 * @param {number} height - frame height in pixels
 * @returns {Promise<FaceTransform|null>}
 */
export function processFrame(frame, width, height) {
  return new Promise((resolve) => {
    if (!_faceMesh) {
      resolve(null);
      return;
    }

    _onResults = (results) => {
      const lms = results.multiFaceLandmarks?.[0];
      if (!lms || lms.length < 468) {
        resolve(null);
        return;
      }
      resolve(calculateBeardTransform(lms, width, height));
    };

    _faceMesh.send({ image: frame }).catch(() => resolve(null));
  });
}

/**
 * Clean up the tracker instance.
 */
export function destroyTracker() {
  if (_faceMesh) {
    try { _faceMesh.close(); } catch (_) {}
    _faceMesh = null;
    _initPromise = null;
    _onResults = null;
  }
}

// ── Transform Calculation ────────────────────────────────────────────────

/**
 * @typedef {Object} FaceTransform
 * @property {number} centerX       - Beard anchor X (px)
 * @property {number} centerY       - Beard anchor Y (px)
 * @property {number} scale         - Face-width-relative scale factor
 * @property {number} roll          - Z rotation in degrees (head tilt)
 * @property {number} yaw           - Y rotation in degrees (left/right turn)
 * @property {number} pitch         - X rotation in degrees (up/down look)
 * @property {number} jawWidth      - Left-to-right jaw distance (px)
 * @property {number} faceHeight    - Forehead-to-chin distance (px)
 * @property {{x:number,y:number}[]} jawline - Raw jawline points (px)
 * @property {{x:number,y:number}} noseTip   - Nose tip position (px)
 * @property {{x:number,y:number}} chinTip   - Chin bottom position (px)
 * @property {{x:number,y:number}} leftJaw   - Left jaw point (px)
 * @property {{x:number,y:number}} rightJaw  - Right jaw point (px)
 * @property {{x:number,y:number}} mouthLeft - Left mouth corner (px)
 * @property {{x:number,y:number}} mouthRight - Right mouth corner (px)
 * @property {number} confidence    - Detection quality (0–1)
 */

// Jawline landmark indices (ear-to-ear along the jaw)
const JAWLINE_INDICES = [
  234, 93, 132, 58, 172, 136, 150, 149, 176, 148,
  152,
  377, 400, 378, 379, 365, 397, 288, 361, 323, 454,
];

/**
 * Core math: Extract pitch, yaw, roll, scale, and position from landmarks.
 *
 * @param {Array} landmarks - MediaPipe normalized landmarks (0–1)
 * @param {number} w - Video/canvas width in pixels
 * @param {number} h - Video/canvas height in pixels
 * @returns {FaceTransform}
 */
function calculateBeardTransform(landmarks, w, h) {
  // 1. Extract key points and convert to pixels
  const nose = {
    x: landmarks[1].x * w,
    y: landmarks[1].y * h,
    z: landmarks[1].z * w, // Z is approximate depth
  };
  const chin = {
    x: landmarks[152].x * w,
    y: landmarks[152].y * h,
    z: landmarks[152].z * w,
  };
  const leftJaw = {
    x: landmarks[234].x * w,
    y: landmarks[234].y * h,
    z: landmarks[234].z * w,
  };
  const rightJaw = {
    x: landmarks[454].x * w,
    y: landmarks[454].y * h,
    z: landmarks[454].z * w,
  };
  const forehead = {
    x: landmarks[10].x * w,
    y: landmarks[10].y * h,
  };
  const mouthLeft = {
    x: landmarks[61].x * w,
    y: landmarks[61].y * h,
  };
  const mouthRight = {
    x: landmarks[291].x * w,
    y: landmarks[291].y * h,
  };

  // 2. Beard anchor point: between nose tip and chin, biased 40% below nose
  const centerX = (nose.x + chin.x) / 2;
  const centerY = nose.y + (chin.y - nose.y) * 0.4;

  // 3. Scale: based on face width (left-to-right jaw distance)
  const dx = rightJaw.x - leftJaw.x;
  const dy = rightJaw.y - leftJaw.y;
  const jawWidth = Math.sqrt(dx * dx + dy * dy);
  const faceHeight = Math.sqrt(
    (chin.x - forehead.x) ** 2 + (chin.y - forehead.y) ** 2
  );

  // Scale factor: normalized to a 300px reference beard image width
  const BASE_IMAGE_WIDTH = 300;
  const scale = (jawWidth * 1.15) / BASE_IMAGE_WIDTH;

  // 4. Roll (Z-axis): head tilt left/right
  const roll = Math.atan2(dy, dx) * (180 / Math.PI);

  // 5. Yaw (Y-axis): head turn left/right
  const dzJaw = rightJaw.z - leftJaw.z;
  const yaw = Math.asin(Math.max(-1, Math.min(1, dzJaw / (jawWidth || 1)))) * (180 / Math.PI) * -1;

  // 6. Pitch (X-axis): head look up/down
  const dyFace = chin.y - nose.y;
  const dzFace = chin.z - nose.z;
  const pitch = Math.atan2(dzFace, dyFace) * (180 / Math.PI) * -0.5;

  // 7. Jawline points for alignment visualization
  const jawline = JAWLINE_INDICES.map((idx) => ({
    x: landmarks[idx].x * w,
    y: landmarks[idx].y * h,
  }));

  // 8. Confidence: based on face proportions sanity check
  const aspectRatio = faceHeight / (jawWidth || 1);
  const confidence = (aspectRatio > 0.8 && aspectRatio < 2.5) ? 1.0 : 0.5;

  return {
    centerX,
    centerY,
    scale,
    roll,
    yaw,
    pitch,
    jawWidth,
    faceHeight,
    jawline,
    noseTip: { x: nose.x, y: nose.y },
    chinTip: { x: chin.x, y: chin.y },
    leftJaw: { x: leftJaw.x, y: leftJaw.y },
    rightJaw: { x: rightJaw.x, y: rightJaw.y },
    mouthLeft,
    mouthRight,
    confidence,
  };
}

/**
 * Sample skin tone from a canvas at cheek landmark positions.
 *
 * @param {HTMLCanvasElement} canvas - The video frame drawn to canvas
 * @param {Array} landmarks - MediaPipe normalized landmarks
 * @returns {{ r: number, g: number, b: number, hex: string }}
 */
export function sampleSkinTone(canvas, landmarks) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const w = canvas.width;
  const h = canvas.height;

  // Sample from both cheeks (landmarks 50 and 280) and average
  const samplePoints = [
    { x: Math.round(landmarks[50].x * w), y: Math.round(landmarks[50].y * h) },
    { x: Math.round(landmarks[280].x * w), y: Math.round(landmarks[280].y * h) },
  ];

  let totalR = 0, totalG = 0, totalB = 0;
  let sampleCount = 0;

  for (const pt of samplePoints) {
    // Sample a 5x5 region around the point for stability
    for (let ox = -2; ox <= 2; ox++) {
      for (let oy = -2; oy <= 2; oy++) {
        const px = Math.max(0, Math.min(w - 1, pt.x + ox));
        const py = Math.max(0, Math.min(h - 1, pt.y + oy));
        const pixel = ctx.getImageData(px, py, 1, 1).data;
        totalR += pixel[0];
        totalG += pixel[1];
        totalB += pixel[2];
        sampleCount++;
      }
    }
  }

  const r = Math.round(totalR / sampleCount);
  const g = Math.round(totalG / sampleCount);
  const b = Math.round(totalB / sampleCount);
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return { r, g, b, hex };
}
