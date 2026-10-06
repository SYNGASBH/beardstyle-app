import { AR_SHAPES, captureARFrame } from './arPreview';
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
