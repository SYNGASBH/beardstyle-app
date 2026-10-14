// Transparent, procedural facial-hair shapes. No face sketches or white backgrounds.
// This preview adds hair; it cannot remove an existing beard.
//
// Regions are built from real MediaPipe landmarks (cheek line, jawline, lips),
// so the beard follows each face. Each layer is drawn as a hard mask, feathered,
// then filled with a seeded hair-strand texture oriented with head roll.
export const AR_SHAPES = {
  'full-beard': { length: 1.3, mustache: true },
  'short-boxed-beard': { length: 1.02, mustache: true, boxed: true },
  'corporate-beard': { length: 1.08, mustache: true, boxed: true },
  'stubble-3day': { length: 1, mustache: true, stubble: true },
  'goatee': { length: 1.12, chin: true },
  'extended-goatee': { length: 1.12, chin: true, wide: true, mustache: true },
  'circle-beard': { length: 1.05, chin: true, mustache: true, connected: true },
  'van-dyke': { length: 1.25, chin: true, mustache: true, pointed: true },
  'balbo': { length: 1.12, chin: true, wide: true, mustache: true },
  'anchor-beard': { length: 1.12, chin: true, wide: true, mustache: true, pointed: true },
  'ducktail': { length: 1.5, mustache: true, pointed: true },
  'garibaldi': { length: 1.6, mustache: true },
  'bandholz': { length: 1.9, mustache: true },
  'verdi': { length: 1.5, mustache: true, handlebar: true },
  'french-fork': { length: 1.6, mustache: true, fork: true },
  'chin-strap': { strap: true },
  'mutton-chops': { chops: true },
  'beardstache': { length: 1, stubble: true, mustache: true, bigMustache: true },
  'handlebar': { mustache: true, handlebar: true, onlyMustache: true },
  'clean-shaven': { empty: true },
};

// Chin-region band half-widths, in mouth half-widths.
const CHIN_BAND = {
  'goatee': 0.95, 'van-dyke': 1.0, 'extended-goatee': 1.6, 'balbo': 1.75,
  'anchor-beard': 1.65, 'circle-beard': 1.3,
};

// 'auto' samples the user's eyebrows from the live frame (see sampleHairColor).
export const AUTO_COLOR = 'auto';
export const BEARD_COLORS = {
  'black': { label: 'Crna', base: '#17120f', light: '#3a302a', dark: '#050403' },
  'dark-brown': { label: 'Tamnosmeđa', base: '#33251c', light: '#5b4331', dark: '#140d09' },
  'brown': { label: 'Smeđa', base: '#5a3c27', light: '#8a6343', dark: '#2a1a10' },
  'ginger': { label: 'Riđa', base: '#8a4a24', light: '#c07a45', dark: '#4a230e' },
  'grey': { label: 'Sijeda', base: '#6b6560', light: '#d8d4cf', dark: '#2a2622' },
};

// MediaPipe FaceMesh indices (mirror pairs verified on real captures).
const CHEEK_L = [234, 137, 147, 187, 207, 216, 92, 165, 167];
const CHEEK_R = [454, 366, 376, 411, 427, 436, 322, 391, 393];
const JAW_L = [234, 93, 132, 58, 172, 136, 150, 149, 176, 148];
const JAW_R = [454, 323, 361, 288, 397, 365, 379, 378, 400, 377];
const LIPS = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
const MUSTACHE_TOP = [57, 186, 92, 165, 167, 164, 393, 391, 322, 410, 287];
const UPPER_LIP = [291, 409, 270, 269, 267, 0, 37, 39, 40, 185, 61];
const NEEDED = Math.max(...CHEEK_R, ...JAW_R, ...LIPS, ...MUSTACHE_TOP);

const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a, k) => ({ x: a.x * k, y: a.y * k });
const dot = (a, b) => a.x * b.x + a.y * b.y;
const len = a => Math.hypot(a.x, a.y);
const unit = a => mul(a, 1 / (len(a) || 1));
const mid = (a, b) => mul(add(a, b), 0.5);

/** Face frame: origin at mouth centre, u = lateral, d = down (roll-aware). */
function faceFrame(points) {
  const P = i => points[i];
  const u = unit(sub(P(454), P(234)));
  const d = { x: -u.y, y: u.x };
  const mouth = mid(P(61), P(291));
  const H = len(sub(P(152), P(1))) || 1;        // nose tip → chin
  return {
    P, u, d, mouth, H,
    jawHalf: len(sub(P(454), P(234))) / 2,
    mouthHalf: len(sub(P(291), P(61))) / 2,
    lipBottom: dot(sub(P(17), mouth), d),
    chinY: dot(sub(P(152), mouth), d),
    at: (x, y) => add(mouth, add(mul(u, x), mul(d, y))),
    local: p => ({ x: dot(sub(p, mouth), u), y: dot(sub(p, mouth), d) }),
  };
}

/** Full beard outline: cheek line on top, jawline pushed down by beard length. */
function fullBeard(f, { length = 1.3, profile = 'round', volume = 0.04 }) {
  const ext = Math.max(0, length - 1) * f.H + 0.05 * f.H;
  const weight = t => {
    const a = Math.min(1, Math.abs(t));
    if (profile === 'point') return Math.pow(1 - a, 1.6);
    if (profile === 'box') return Math.max(0, 1 - Math.pow(a, 6));
    return Math.max(0, 1 - a * a);
  };
  const jaw = [...JAW_L, 152, ...[...JAW_R].reverse()].map(i => {
    const p = f.P(i);
    const t = dot(sub(p, f.P(152)), f.u) / (f.jawHalf || 1);
    const out = mul(unit(sub(p, f.P(1))), volume * f.jawHalf);
    return add(add(p, out), mul(f.d, ext * weight(t)));
  });
  const top = [...CHEEK_L.map(f.P), f.P(164), ...[...CHEEK_R].reverse().map(f.P)];
  // top runs L→R under the nose; jaw runs L→chin→R; walk R jaw back to L.
  return [...top, ...[...jaw].reverse()];
}

function mustache(f, { big = false } = {}) {
  const pts = [...MUSTACHE_TOP, ...UPPER_LIP].map(f.P);
  if (!big) return pts;
  // Push the outline away from the mouth centre for a heavier mustache.
  const c = f.at(0, -0.08 * f.H);
  return pts.map(p => add(c, mul(sub(p, c), 1.18)));
}

/** Chin band with curved sides; `taper` narrows it below the chin (pointed styles). */
function chinBand(f, half, yTop, taper) {
  const yMid = (Math.max(yTop, f.lipBottom - 0.2 * f.H) + f.chinY) / 2;
  const yLow = f.chinY + 1.5 * f.H;
  const side = s => [
    f.at(s * half * 0.92, yTop), f.at(s * half, yMid), f.at(s * half * 0.9, f.chinY), f.at(s * half * taper, yLow),
  ];
  return [...side(-1), ...side(1).reverse()];
}

/** Resolve a style into layers of { fills, clips, strokes, cuts } plus texture. */
export function beardLayers(slug, points) {
  const shape = AR_SHAPES[slug];
  if (!shape || shape.empty || !points || points.length <= NEEDED) return [];
  const f = faceFrame(points);
  const far = f.H * 4;
  const profile = shape.pointed ? 'point' : shape.boxed ? 'box' : 'round';
  const strands = shape.length >= 1.4 ? 'long' : 'short';
  const layer = (extra) => ({ fills: [], clips: null, strokes: [], cuts: [LIPS.map(f.P)], texture: strands, density: 0.82, ...extra });

  if (shape.strap) {
    const jaw = [...JAW_L, 152, ...[...JAW_R].reverse()].map(f.P);
    return [layer({ strokes: [{ pts: jaw, width: 0.11 * f.H }], cuts: [], texture: 'short' })];
  }
  if (shape.chops) {
    const side = 1.35 * f.mouthHalf;
    const yEnd = f.lipBottom + 0.12 * f.H;
    return [layer({
      fills: [fullBeard(f, { length: 1, profile: 'round' })],
      clips: [
        [f.at(-far, -far), f.at(-side, -far), f.at(-side, yEnd), f.at(-far, yEnd)],
        [f.at(side, -far), f.at(far, -far), f.at(far, yEnd), f.at(side, yEnd)],
      ],
    })];
  }
  if (shape.stubble) {
    const layers = [layer({
      fills: [fullBeard(f, { length: 1, profile: 'round', volume: 0.01 }), mustache(f)],
      texture: 'stubble', density: 0.5,
    })];
    if (shape.bigMustache) layers.push(layer({ fills: [mustache(f, { big: true })], texture: 'short', density: 0.9 }));
    return layers;
  }
  if (shape.onlyMustache) {
    return [layer({ fills: [mustache(f)], strokes: handlebarCurls(f), texture: 'short', density: 0.9 })];
  }
  if (shape.chin) {
    const half = (CHIN_BAND[slug] || 1) * f.mouthHalf;
    const yTop = shape.connected ? -far : f.lipBottom + 0.02 * f.H;
    const chin = layer({
      fills: [fullBeard(f, { length: shape.length, profile })],
      clips: [chinBand(f, half, yTop, shape.pointed ? 0.15 : 0.7)],
      smoothClips: true,
    });
    if (!shape.mustache || shape.connected) return [chin];
    return [chin, layer({ fills: [mustache(f)], texture: 'short' })];
  }
  const full = layer({
    fills: [fullBeard(f, { length: shape.length, profile })],
    strokes: shape.handlebar ? handlebarCurls(f) : [],
  });
  if (shape.fork) {
    const bottom = f.chinY + Math.max(0, shape.length - 1) * f.H + 0.05 * f.H;
    full.notches = [[f.at(0, f.chinY + 0.12 * f.H), f.at(-0.16 * f.mouthHalf * 2, bottom + 0.1 * f.H), f.at(0.16 * f.mouthHalf * 2, bottom + 0.1 * f.H)]];
  }
  return [full];
}

function handlebarCurls(f) {
  const w = f.mouthHalf;
  const y = -0.12 * f.H;
  const curl = s => [f.at(s * 0.8 * w, y), f.at(s * 1.35 * w, y + 0.02 * f.H), f.at(s * 1.55 * w, y - 0.14 * f.H)];
  return [{ pts: curl(-1), width: 0.05 * f.H, open: true }, { pts: curl(1), width: 0.05 * f.H, open: true }];
}

// ── Rendering ────────────────────────────────────────────────────────────

function tracePath(ctx, pts, closed = true) {
  if (pts.length < 3 || !closed) {
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const m = mid(pts[i], pts[i + 1]);
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    return;
  }
  // Smooth closed curve through midpoints so landmark corners do not show.
  const start = mid(pts[pts.length - 1], pts[0]);
  ctx.moveTo(start.x, start.y);
  for (let i = 0; i < pts.length; i++) {
    const m = mid(pts[i], pts[(i + 1) % pts.length]);
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y);
  }
  ctx.closePath();
}

// Deterministic PRNG so the texture is identical frame to frame and in tests.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TEXTURE_SIZE = 256;
const TEXTURE_SPEC = {
  long: { count: 2600, min: 10, max: 22, width: 1.3, spread: 0.35 },
  short: { count: 3200, min: 5, max: 11, width: 1.15, spread: 0.45 },
  stubble: { count: 5200, min: 1.5, max: 3.5, width: 1, spread: 0.9 },
};
const textureCache = new Map();

function hairTexture(kind, color) {
  const key = `${kind}:${color.base}`;
  if (textureCache.has(key)) return textureCache.get(key);
  if (textureCache.size > 24) textureCache.delete(textureCache.keys().next().value);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const spec = TEXTURE_SPEC[kind];
  const tones = [color.dark, color.base, color.base, color.light];
  const rand = rng(kind.length * 7919 + 104729);
  ctx.lineCap = 'round';
  for (let i = 0; i < spec.count; i++) {
    const x = rand() * TEXTURE_SIZE, y = rand() * TEXTURE_SIZE;
    const l = spec.min + rand() * (spec.max - spec.min);
    const a = Math.PI / 2 + (rand() - 0.5) * spec.spread * 2;     // mostly downward
    const bend = (rand() - 0.5) * l * 0.35;
    ctx.strokeStyle = tones[Math.floor(rand() * tones.length)];
    ctx.globalAlpha = 0.45 + rand() * 0.5;
    ctx.lineWidth = spec.width * (0.7 + rand() * 0.6);
    const ex = Math.cos(a) * l, ey = Math.sin(a) * l;
    // Draw wrapped copies so the pattern tiles seamlessly.
    for (const ox of [-TEXTURE_SIZE, 0, TEXTURE_SIZE]) {
      for (const oy of [-TEXTURE_SIZE, 0, TEXTURE_SIZE]) {
        const sx = x + ox, sy = y + oy;
        if (sx + ex < -2 || sx - Math.abs(ex) > TEXTURE_SIZE + 2 || sy + ey < -2 || sy > TEXTURE_SIZE + 2) continue;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + ex / 2 + bend, sy + ey / 2, sx + ex, sy + ey);
        ctx.stroke();
      }
    }
  }
  textureCache.set(key, canvas);
  return canvas;
}

const BROWS = [70, 63, 105, 66, 107, 336, 296, 334, 293, 300];
const hex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
const toHex = ([r, g, b]) => `#${hex(r)}${hex(g)}${hex(b)}`;

/** Tones derived from one RGB colour, quantized so the texture cache stays small. */
export function tonesFromRgb(rgb) {
  const q = rgb.map(v => Math.round(v / 12) * 12);
  return {
    base: toHex(q),
    light: toHex(q.map(v => v + (255 - v) * 0.35)),
    dark: toHex(q.map(v => v * 0.45)),
  };
}

/**
 * Hair colour from the eyebrows: the darkest third of the brow pixels
 * (skin between hairs is lighter). Returns null when the frame cannot be read.
 */
export function sampleHairColor(source, points, sampler) {
  try {
    const xs = BROWS.map(i => points[i].x), ys = BROWS.map(i => points[i].y);
    const x0 = Math.min(...xs), y0 = Math.min(...ys);
    const w = Math.max(...xs) - x0, h = Math.max(4, Math.max(...ys) - y0);
    sampler.width = 48; sampler.height = 12;
    const c = sampler.getContext('2d', { willReadFrequently: true });
    c.drawImage(source, x0, y0, w, h, 0, 0, 48, 12);
    const d = c.getImageData(0, 0, 48, 12).data;
    const px = [];
    for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2], 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]]);
    px.sort((a, b) => a[3] - b[3]);
    const dark = px.slice(0, Math.max(1, Math.floor(px.length / 3)));
    return [0, 1, 2].map(k => dark.reduce((sum, p) => sum + p[k], 0) / dark.length);
  } catch (_) {
    return null;
  }
}

const WORK_MAX = 800; // long side of the working canvases; keeps live preview fast
const workCache = new WeakMap();

function workCanvases(target) {
  let work = workCache.get(target);
  if (!work) {
    const make = () => document.createElement('canvas');
    work = { mask: make(), soft: make(), shade: make(), sampler: make(), hair: null, frame: 0 };
    workCache.set(target, work);
  }
  const scale = Math.min(1, WORK_MAX / Math.max(target.width, target.height));
  const w = Math.max(1, Math.round(target.width * scale));
  const h = Math.max(1, Math.round(target.height * scale));
  for (const c of [work.mask, work.soft, work.shade]) {
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  }
  return { ...work, scale };
}

/**
 * Draw a style onto a transparent overlay context (same pixel space as the video).
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./faceTracker').FaceTransform} face
 * @param {string} slug
 * @param {number} [opacity=0.8]
 * @param {{ color?: keyof BEARD_COLORS | 'auto', source?: CanvasImageSource }} [options]
 *   `source` is the video frame: enables 'auto' colour and lighting from the face.
 */
export function drawARBeard(ctx, face, slug, opacity = 0.8, options = {}) {
  if (!ctx?.canvas || !face?.points) return;
  const layers = beardLayers(slug, face.points);
  if (!layers.length) return;
  const work = workCanvases(ctx.canvas);
  const { mask, soft, shade, scale } = work;
  const m = mask.getContext('2d');
  const s = soft.getContext('2d');
  if (!m || !s) return;
  const source = options.source;
  let color = BEARD_COLORS[options.color] || BEARD_COLORS['dark-brown'];
  if (options.color === AUTO_COLOR && source) {
    // Re-sample every ~10 frames and smooth, so the colour does not flicker.
    if (!work.hair || work.frame % 10 === 0) {
      const rgb = sampleHairColor(source, face.points, work.sampler);
      if (rgb) work.hair = work.hair ? work.hair.map((v, i) => v * 0.7 + rgb[i] * 0.3) : rgb;
    }
    work.frame += 1;
    if (work.hair) color = tonesFromRgb(work.hair);
  }
  const H = Math.hypot(face.chinTip.x - face.noseTip.x, face.chinTip.y - face.noseTip.y) * scale;
  const blur = Math.max(1.5, H * 0.035);

  for (const layer of layers) {
    // 1. Hard mask in working-canvas pixels.
    m.setTransform(1, 0, 0, 1, 0, 0);
    m.globalCompositeOperation = 'source-over';
    m.globalAlpha = 1;
    m.clearRect(0, 0, mask.width, mask.height);
    m.setTransform(scale, 0, 0, scale, 0, 0);
    m.save();
    if (layer.clips) {
      m.beginPath();
      layer.clips.forEach(c => {
        if (layer.smoothClips) { tracePath(m, c); return; }
        m.moveTo(c[0].x, c[0].y); c.slice(1).forEach(p => m.lineTo(p.x, p.y)); m.closePath();
      });
      m.clip();
    }
    m.fillStyle = m.strokeStyle = '#000';
    for (const fill of layer.fills) { m.beginPath(); tracePath(m, fill); m.fill(); }
    m.restore();
    m.lineCap = m.lineJoin = 'round';
    for (const stroke of layer.strokes) {
      m.lineWidth = stroke.width;
      m.beginPath(); tracePath(m, stroke.pts, false); m.stroke();
    }
    m.globalCompositeOperation = 'destination-out';
    for (const cut of [...layer.cuts, ...(layer.notches || [])]) { m.beginPath(); tracePath(m, cut); m.fill(); }

    // 2. Feather: blurred shadow of the mask (works in every browser, unlike ctx.filter).
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.globalCompositeOperation = 'source-over';
    s.globalAlpha = 1;
    s.clearRect(0, 0, soft.width, soft.height);
    const off = soft.width + 50;
    s.shadowColor = '#000';
    s.shadowBlur = blur;
    s.shadowOffsetX = off;
    s.drawImage(mask, -off, 0);
    s.shadowColor = 'transparent';
    s.shadowBlur = 0;
    s.shadowOffsetX = 0;

    // 3. Colour + strand texture, oriented with head roll and scaled to the face.
    s.globalCompositeOperation = 'source-in';
    s.globalAlpha = layer.density;
    s.fillStyle = color.base;
    s.fillRect(0, 0, soft.width, soft.height);
    const tex = hairTexture(layer.texture, color);
    if (tex) {
      s.globalCompositeOperation = 'source-atop';
      s.globalAlpha = 1;
      s.save();
      s.translate(face.noseTip.x * scale, face.noseTip.y * scale);
      s.rotate((face.roll || 0) * Math.PI / 180);
      const k = H / 150;
      s.scale(k, k);
      s.fillStyle = s.createPattern(tex, 'repeat');
      const span = (soft.width + soft.height) * 2 / k;
      s.fillRect(-span, -span, span * 2, span * 2);
      s.restore();
    }

    // 4. Lighting: the face's own light and shadow (luminance only) modulate the beard.
    const sh = source && shade.getContext('2d');
    if (sh) {
      try {
        sh.setTransform(1, 0, 0, 1, 0, 0);
        sh.globalAlpha = 1;
        sh.globalCompositeOperation = 'source-over';
        sh.fillStyle = '#808080';
        sh.fillRect(0, 0, shade.width, shade.height);
        sh.globalCompositeOperation = 'luminosity';
        sh.drawImage(source, 0, 0, shade.width, shade.height);
        sh.globalCompositeOperation = 'destination-in';
        sh.drawImage(soft, 0, 0);
        s.globalCompositeOperation = 'soft-light';
        s.globalAlpha = 0.7;
        s.drawImage(shade, 0, 0);
      } catch (_) {
        // Tainted or unsupported frame: keep the flat-lit beard.
      }
    }

    // 5. Composite onto the overlay in video pixel space.
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(soft, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
}

export function captureARFrame(video, overlay) {
  if (!video?.videoWidth || !video?.videoHeight) throw new Error('Kamera još nije spremna.');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const before = canvas.toDataURL('image/jpeg', 0.92);
  if (overlay) ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
  return { before, after: canvas.toDataURL('image/jpeg', 0.92) };
}
