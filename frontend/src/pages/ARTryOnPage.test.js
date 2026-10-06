import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ARTryOnPage from './ARTryOnPage';
import { captureARFrame } from '../utils/arPreview';

jest.mock('../utils/arPreview', () => ({
  ...jest.requireActual('../utils/arPreview'),
  captureARFrame: jest.fn(() => ({ before: 'data:image/jpeg;base64,before', after: 'data:image/jpeg;base64,after' })),
}));
jest.mock('../components/ARBeardOverlay', () => {
  const React = require('react');
  return React.forwardRef(function Overlay({ onFaceDetected }, ref) {
    React.useImperativeHandle(ref, () => ({ getCanvas: () => 'overlay' }));
    React.useEffect(() => { onFaceDetected({ confidence: 1 }); }, [onFaceDetected]);
    return <div>Tracking overlay</div>;
  });
});
let getUserMedia, stop;
beforeEach(() => {
  captureARFrame.mockReturnValue({ before: 'data:image/jpeg;base64,before', after: 'data:image/jpeg;base64,after' });
  stop = jest.fn();
  getUserMedia = jest.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
});
afterEach(() => jest.restoreAllMocks());
const showPage = () => render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/ar-tryon?style=puna-brada']}><ARTryOnPage /></MemoryRouter>);

test('camera starts on request, captures overlay, stops and restarts for retake', async () => {
  const { unmount } = showPage();
  expect(getUserMedia).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox').value).toBe('full-beard');
  fireEvent.click(screen.getByText('Pokreni kameru'));
  await waitFor(() => expect(screen.getByText('Snimi prikaz').disabled).toBe(false));
  fireEvent.click(screen.getByText('Snimi prikaz'));
  expect(captureARFrame).toHaveBeenCalledWith(expect.anything(), 'overlay');
  expect(screen.getByAltText('Prije — originalni snimak').src).not.toBe(screen.getByAltText('Poslije — snimak s AR bradom').src);
  expect(stop).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByText('Ponovi snimak'));
  await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(2));
  unmount();
  expect(stop).toHaveBeenCalledTimes(2);
});
test('permission denial offers retry and does not permit capture', async () => {
  getUserMedia.mockRejectedValueOnce(Object.assign(new Error('Denied'), { name: 'NotAllowedError' }));
  showPage();
  fireEvent.click(screen.getByText('Pokreni kameru'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Pristup kameri je odbijen');
  expect(screen.getByText('Snimi prikaz').disabled).toBe(true);
  fireEvent.click(screen.getByText('Pokušaj ponovo'));
  await waitFor(() => expect(screen.getByText('Snimi prikaz').disabled).toBe(false));
});
