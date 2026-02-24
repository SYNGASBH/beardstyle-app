/**
 * Client-side face shape detection using MediaPipe FaceMesh (CDN).
 * Loaded lazily — no npm package required, no Docker rebuild.
 *
 * FaceMesh 468-point indices used:
 *   T=10  (forehead top)   B=152  (chin tip)
 *   F_L=54 / F_R=284       (forehead width, brow level)
 *   C_L=234 / C_R=454      (cheekbone width, widest point)
 *   J_L=172 / J_R=397      (jaw angle / gonion)
 */

const MP_VERSION = '0.4.1633559619';
const MP_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${MP_VERSION}`;

// Singleton script-load promise
let _loadPromise = null;

export const loadFaceMesh = () => {
  if (_loadPromise) return _loadPromise;
  _loadPromise = new Promise((resolve) => {
    if (window.FaceMesh) { resolve(); return; }
    const s = document.createElement('script');
    s.src = `${MP_CDN}/face_mesh.js`;
    s.crossOrigin = 'anonymous';
    s.onload  = resolve;
    s.onerror = resolve; // fail silently — Claude is the fallback
    document.head.appendChild(s);
  });
  return _loadPromise;
};

// ── Landmark indices ────────────────────────────────────────────────────────
const LM = { T: 10, B: 152, F_L: 54, F_R: 284, C_L: 234, C_R: 454, J_L: 172, J_R: 397 };

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const angleDeg = (a, b, c) => {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const mag = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y);
  return (Math.acos(Math.max(-1, Math.min(1, dot / (mag || 1)))) * 180) / Math.PI;
};

/**
 * Classify face shape from a FaceMesh landmarks array (normalized 0–1 coords).
 * Returns one of: 'oval' | 'round' | 'square' | 'rectangular' | 'diamond' | 'triangle'
 * Returns null if face is too tilted for reliable measurement.
 */
export function classifyFaceShape(landmarks) {
  const p = {};
  for (const [key, idx] of Object.entries(LM)) p[key] = landmarks[idx];

  const Wf = dist(p.F_L, p.F_R);
  const Wc = dist(p.C_L, p.C_R);
  const Wj = dist(p.J_L, p.J_R);
  const H  = dist(p.T,   p.B);
  const R  = H / (Wc || 1);

  // Quality gate: if left/right cheek y-coords differ > 8% of face width → face tilted
  if (Math.abs(p.C_L.y - p.C_R.y) / (Wc || 1) > 0.08) return null;

  const A = (angleDeg(p.C_L, p.J_L, p.B) + angleDeg(p.C_R, p.J_R, p.B)) / 2;
  const jaw = A < 118 ? 'sharp' : A > 128 ? 'soft' : 'medium';

  if (R >= 1.55) return 'rectangular';
  if (Wc > Wf * 1.06 && Wc > Wj * 1.06) return 'diamond';
  if (Wj > Wc * 1.03 && Wj > Wf * 1.05) return 'triangle';
  if (R <= 1.25 && jaw === 'soft' && Math.abs(Wc - Wj) / (Wc || 1) < 0.08) return 'round';
  if (R > 1.25 && R < 1.55 && jaw === 'sharp'
      && Math.abs(Wj - Wc) / (Wc || 1) < 0.08
      && Math.abs(Wf - Wc) / (Wc || 1) < 0.10) return 'square';
  return 'oval';
}

/**
 * Run FaceMesh on an HTMLImageElement and return the classified face shape.
 * Returns null on any failure (no face detected, tilted, CDN unavailable).
 */
export async function detectFaceShape(imageElement) {
  await loadFaceMesh();
  if (!window.FaceMesh) return null;

  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };

    // Safety timeout — don't block upload if WASM init is slow
    const timeout = setTimeout(() => done(null), 8000);

    try {
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
        clearTimeout(timeout);
        try { fm.close(); } catch (_) {}
        const lms = results.multiFaceLandmarks?.[0];
        done(lms ? classifyFaceShape(lms) : null);
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
