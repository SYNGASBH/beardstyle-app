import { evaluateAlignment, guideOval, HINTS } from './faceAlignment';

const W = 1280, H = 960;
// Build a FaceTransform that sits exactly inside the guide oval.
const face = (overrides = {}, fill = 0.85) => {
  const oval = guideOval(W, H);
  const faceHeight = oval.ry * 2 * fill;
  const chinY = oval.cy + faceHeight / 2;
  return {
    confidence: 1, roll: 0, yaw: 0, pitch: 0, faceHeight,
    noseTip: { x: oval.cx, y: oval.cy },
    chinTip: { x: oval.cx, y: chinY },
    ...overrides,
  };
};

test('centred, frontal, well-lit face is aligned', () => {
  expect(evaluateAlignment(face(), W, H, 140)).toEqual({ status: 'ok', message: HINTS.ok, aligned: true });
});

test('missing or low-confidence face asks to enter the oval', () => {
  expect(evaluateAlignment(null, W, H).status).toBe('noFace');
  expect(evaluateAlignment(face({ confidence: 0.3 }), W, H).status).toBe('noFace');
});

test('distance, position and pose each produce their own hint', () => {
  const base = face();
  const shift = (dx) => ({ noseTip: { ...base.noseTip, x: base.noseTip.x + dx }, chinTip: { ...base.chinTip, x: base.chinTip.x + dx } });
  expect(evaluateAlignment(face(shift(130)), W, H).status).toBe('offCenter');
  expect(evaluateAlignment(face({}, 0.55), W, H).status).toBe('tooFar');
  expect(evaluateAlignment(face({}, 1.1), W, H).status).toBe('tooClose');
  expect(evaluateAlignment(face({ roll: 12 }), W, H).status).toBe('roll');
  expect(evaluateAlignment(face({ yaw: -20 }), W, H).status).toBe('yaw');
  expect(evaluateAlignment(face({ pitch: 18 }), W, H).status).toBe('pitch');
});

test('lighting is checked only when measured', () => {
  expect(evaluateAlignment(face(), W, H, 30).status).toBe('dark');
  expect(evaluateAlignment(face(), W, H, 250).status).toBe('bright');
  expect(evaluateAlignment(face(), W, H, undefined).status).toBe('ok');
});
