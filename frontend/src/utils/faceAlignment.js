/**
 * Face alignment guide for photo capture.
 *
 * Pure geometry: compares a FaceTransform from faceTracker.js with the
 * on-screen guide oval and returns the first problem to fix (or 'ok').
 * Thresholds are deliberately tolerant — the goal is a frontal, centred,
 * well-sized face for face-shape analysis, not pixel-perfect framing.
 */

// Guide oval in frame-relative units (height-based so it stays an oval on
// landscape webcams and portrait phones alike).
export const GUIDE = {
  centerX: 0.5,      // fraction of frame width
  centerY: 0.47,     // fraction of frame height
  heightRatio: 0.62, // oval height as fraction of frame height
  aspect: 0.74,      // oval width / oval height
};

export const LIMITS = {
  center: 0.12,      // max nose offset from oval centre, as fraction of oval height
  minFill: 0.68,     // forehead–chin height / oval height
  maxFill: 1.0,
  roll: 7,           // degrees
  yaw: 12,
  pitch: 12,
  minBrightness: 70, // mean luma 0–255
  maxBrightness: 225,
};

export const HINTS = {
  noFace: 'Lice nije pronađeno — postavite lice u oval.',
  offCenter: 'Pomjerite lice u sredinu ovala.',
  tooFar: 'Približite se kameri — lice treba ispuniti oval.',
  tooClose: 'Odmaknite se malo — cijela brada i čelo moraju biti u ovalu.',
  roll: 'Ispravite glavu — ne naginjite je u stranu.',
  yaw: 'Okrenite lice ravno prema kameri.',
  pitch: 'Držite bradu ravno — ne podižite je i ne spuštajte.',
  dark: 'Slabo osvjetljenje — okrenite se prema svjetlu.',
  bright: 'Previše svjetla — izbjegnite direktno sunce ili blic.',
  ok: 'Odlično! Ne pomjerajte se i uslikajte.',
};

export function guideOval(width, height) {
  const ry = (height * GUIDE.heightRatio) / 2;
  return { cx: width * GUIDE.centerX, cy: height * GUIDE.centerY, rx: ry * GUIDE.aspect, ry };
}

/**
 * @param {import('./faceTracker').FaceTransform|null} face
 * @param {number} width  frame width (px)
 * @param {number} height frame height (px)
 * @param {number} [brightness] mean frame luma 0–255, if measured
 * @returns {{ status: keyof HINTS, message: string, aligned: boolean }}
 */
export function evaluateAlignment(face, width, height, brightness) {
  const result = status => ({ status, message: HINTS[status], aligned: status === 'ok' });
  if (!face || !width || !height || face.confidence < 0.5) return result('noFace');

  const oval = guideOval(width, height);
  const ovalHeight = oval.ry * 2;
  // Face centre: midpoint between forehead-to-chin, approximated by nose/chin.
  const faceCenterY = face.chinTip.y - face.faceHeight / 2;
  const offset = Math.hypot(face.noseTip.x - oval.cx, faceCenterY - oval.cy) / ovalHeight;
  const fill = face.faceHeight / ovalHeight;

  if (fill < LIMITS.minFill * 0.6 || offset > LIMITS.center * 2.5) return result('noFace');
  if (offset > LIMITS.center) return result('offCenter');
  if (fill < LIMITS.minFill) return result('tooFar');
  if (fill > LIMITS.maxFill) return result('tooClose');
  if (Math.abs(face.roll) > LIMITS.roll) return result('roll');
  if (Math.abs(face.yaw) > LIMITS.yaw) return result('yaw');
  if (Math.abs(face.pitch) > LIMITS.pitch) return result('pitch');
  if (brightness != null && brightness < LIMITS.minBrightness) return result('dark');
  if (brightness != null && brightness > LIMITS.maxBrightness) return result('bright');
  return result('ok');
}

/** Mean luma of a frame, sampled on a small canvas to stay cheap. */
export function measureBrightness(source, canvas) {
  try {
    const w = 32, h = 24;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(source, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    return sum / (w * h);
  } catch (_) {
    return undefined;
  }
}
