import { AR_SHAPES, BEARD_COLORS, beardLayers, captureARFrame, drawARBeard } from './arPreview';
import identity from '../data/styleIdentity.json';

test('all app styles have distinct supported AR shapes', () => {
  expect(Object.keys(AR_SHAPES).sort()).toEqual(identity.map(style => style.slug).sort());
  expect(AR_SHAPES['chin-strap'].mustache).toBeUndefined();
  expect(AR_SHAPES.beardstache.bigMustache).toBe(true);
  expect(AR_SHAPES.goatee.mustache).toBeUndefined();
});
test('capture saves original before compositing overlay, with the same mirror transform', () => {
  const context = { translate: jest.fn(), scale: jest.fn(), drawImage: jest.fn() };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  const data = jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValueOnce('before').mockReturnValueOnce('after');
  const video = { videoWidth: 1280, videoHeight: 720 };
  const overlay = document.createElement('canvas');
  expect(captureARFrame(video, overlay)).toEqual({ before: 'before', after: 'after' });
  expect(context.scale).toHaveBeenCalledWith(-1,1);
  expect(context.drawImage.mock.calls.map(call => call[0])).toEqual([video, overlay]);
  expect(data.mock.invocationCallOrder[0]).toBeLessThan(context.drawImage.mock.invocationCallOrder[1]);
  jest.restoreAllMocks();
});
test('capture refuses video before metadata is ready', () => {
  expect(() => captureARFrame({ videoWidth: 0 })).toThrow('Kamera još nije spremna');
});

// Synthetic frontal face in pixels: nose tip (500,400), chin (500,640), mouth at y=500.
function syntheticFace() {
  const pts = Array.from({ length: 468 }, () => ({ x: 500, y: 500 }));
  const set = (i, x, y) => { pts[i] = { x, y }; };
  const both = (l, r, x, y) => { set(l, 500 - x, y); set(r, 500 + x, y); };
  set(1, 500, 400); set(152, 500, 640); set(164, 500, 452);
  const jawL = [234, 93, 132, 58, 172, 136, 150, 149, 176, 148];
  const jawR = [454, 323, 361, 288, 397, 365, 379, 378, 400, 377];
  jawL.forEach((l, i) => {
    const phi = (i / jawL.length) * Math.PI / 2;
    both(l, jawR[i], 160 * Math.cos(phi), 360 + 280 * Math.sin(phi));
  });
  const cheekL = [234, 137, 147, 187, 207, 216, 92, 165, 167];
  const cheekR = [454, 366, 376, 411, 427, 436, 322, 391, 393];
  cheekL.forEach((l, i) => { const t = i / (cheekL.length - 1); both(l, cheekR[i], 160 - 140 * t, 360 + 90 * t); });
  const lips = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
  lips.forEach((i, k) => { const a = Math.PI + k * 2 * Math.PI / lips.length; set(i, 500 + 50 * Math.cos(a), 500 + 15 * Math.sin(a)); });
  both(57, 287, 60, 510); both(186, 410, 55, 470);
  return pts;
}
const lowest = layer => Math.max(...layer.fills.flat().map(p => p.y));

test('every style except clean-shaven resolves to finite landmark-based layers', () => {
  const points = syntheticFace();
  for (const slug of Object.keys(AR_SHAPES)) {
    const layers = beardLayers(slug, points);
    if (slug === 'clean-shaven') { expect(layers).toEqual([]); continue; }
    expect(layers.length).toBeGreaterThan(0);
    const coords = layers.flatMap(l => [...l.fills.flat(), ...l.strokes.flatMap(s => s.pts), ...(l.clips || []).flat()]);
    expect(coords.length).toBeGreaterThan(0);
    coords.forEach(p => { expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true); });
  }
});

test('beard length follows the style and the lips stay uncovered', () => {
  const points = syntheticFace();
  const chin = 640;
  const full = beardLayers('full-beard', points)[0];
  const boxed = beardLayers('short-boxed-beard', points)[0];
  const long = beardLayers('bandholz', points)[0];
  expect(lowest(boxed)).toBeGreaterThan(chin);
  expect(lowest(full)).toBeGreaterThan(lowest(boxed));
  expect(lowest(long)).toBeGreaterThan(lowest(full));
  expect(full.cuts[0]).toHaveLength(20);           // lip contour is erased
  expect(beardLayers('chin-strap', points)[0].cuts).toEqual([]);
});

test('chin styles are clipped and keep their mustache rules', () => {
  const points = syntheticFace();
  const goatee = beardLayers('goatee', points);
  expect(goatee).toHaveLength(1);                   // no mustache
  expect(goatee[0].clips).toHaveLength(1);
  expect(beardLayers('van-dyke', points)).toHaveLength(2);       // separate mustache
  expect(beardLayers('circle-beard', points)).toHaveLength(1);   // connected around the mouth
  const stubble = beardLayers('stubble-3day', points);
  expect(stubble[0].texture).toBe('stubble');
  expect(beardLayers('beardstache', points).map(l => l.texture)).toEqual(['stubble', 'short']);
});

test('renderer is a safe no-op without landmarks or a usable canvas', () => {
  expect(beardLayers('full-beard', [])).toEqual([]);
  const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  const ctx = { canvas: document.createElement('canvas'), drawImage: jest.fn() };
  expect(() => drawARBeard(ctx, { chinTip: {}, noseTip: {} }, 'full-beard')).not.toThrow();
  expect(() => drawARBeard(ctx, { points: syntheticFace(), chinTip: { x: 500, y: 640 }, noseTip: { x: 500, y: 400 } }, 'full-beard')).not.toThrow();
  expect(ctx.drawImage).not.toHaveBeenCalled();     // jsdom has no 2D context
  expect(Object.keys(BEARD_COLORS)).toContain('grey');
  getContext.mockRestore();
});
