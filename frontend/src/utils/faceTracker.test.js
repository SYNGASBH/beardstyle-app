import { initTracker, processFrame, destroyTracker } from './faceTracker';
import { loadFaceMesh } from './faceShape';
jest.mock('./faceShape', () => ({ loadFaceMesh: jest.fn() }));
let instances;
beforeEach(() => {
  instances = [];
  loadFaceMesh.mockResolvedValue();
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
  window.FaceMesh = jest.fn().mockImplementation(() => {
    const mesh = { setOptions: jest.fn(), onResults: fn => { mesh.results = fn; }, send: jest.fn().mockResolvedValue(), close: jest.fn() };
    instances.push(mesh); return mesh;
  });
});
afterEach(() => { destroyTracker(); jest.restoreAllMocks(); jest.useRealTimers(); delete window.FaceMesh; });
test('initialization can recover after failure', async () => {
  loadFaceMesh.mockRejectedValueOnce(new Error('Offline'));
  await expect(initTracker()).rejects.toThrow('Offline');
  const recovered = await initTracker();
  expect(recovered).toBe(instances[0]);
});
test('no-face frame resolves and closing tracker releases pending frame', async () => {
  await initTracker();
  const frame = processFrame({},640,480);
  instances[0].results({ multiFaceLandmarks: [] });
  await expect(frame).resolves.toBeNull();
  const pending = processFrame({},640,480);
  destroyTracker();
  await expect(pending).resolves.toBeNull();
  expect(instances[0].close).toHaveBeenCalled();
});
test('hung frame reports failure rather than stopping silently', async () => {
  jest.useFakeTimers(); await initTracker();
  const pending = processFrame({},640,480);
  const assertion = expect(pending).rejects.toThrow('Praćenje lica je isteklo');
  jest.advanceTimersByTime(15000);
  await assertion;
});
