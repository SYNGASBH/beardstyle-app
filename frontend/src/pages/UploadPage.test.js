import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UploadPage from './UploadPage';
import { initTracker } from '../utils/faceTracker';

jest.mock('../services/api', () => ({ userAPI: { uploadImage: jest.fn() } }));
jest.mock('../context/useAuthStore', () => () => ({ isAuthenticated: true }));
jest.mock('../utils/faceShape', () => ({ loadFaceMesh: jest.fn(), detectFaceShape: jest.fn() }));
jest.mock('../utils/faceTracker', () => ({ initTracker: jest.fn(), processFrame: jest.fn(), destroyTracker: jest.fn() }));
let mockAlignment = null;
jest.mock('../components/FaceGuideOverlay', () => {
  const actual = jest.requireActual('../components/FaceGuideOverlay').default;
  return function MockOverlay(props) {
    const React = require('react');
    React.useEffect(() => { if (mockAlignment) props.onAlignmentChange(mockAlignment); }, [props]);
    return actual(props);
  };
});

let getUserMedia, stop;
beforeEach(() => {
  stop = jest.fn();
  getUserMedia = jest.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  initTracker.mockRejectedValue(new Error('WebGL is not available on this device'));
  mockAlignment = null;
  try { localStorage.clear(); } catch (_) {}
});
afterEach(() => jest.restoreAllMocks());
const showPage = () => render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><UploadPage /></MemoryRouter>);

test('placement guide is shown before any photo is chosen', () => {
  showPage();
  expect(screen.getByText('📐 Kako postaviti lice za fotografiju')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Lice unutar ovala/ })).toBeInTheDocument();
});

test('camera shows the face mask, falls back without tracking and stops on unmount', async () => {
  const { unmount } = showPage();
  fireEvent.click(screen.getByText('Koristi Kameru'));
  expect(await screen.findByTestId('face-guide')).toBeInTheDocument();
  expect(getUserMedia).toHaveBeenCalledWith(expect.objectContaining({ audio: false }));
  expect(await screen.findByText(/Automatska provjera nije dostupna/)).toBeInTheDocument();
  expect(screen.getByText('📸 Uslikaj')).not.toBeDisabled();
  unmount();
  expect(stop).toHaveBeenCalled();
});

test('denied camera permission explains how to fix it', async () => {
  getUserMedia.mockRejectedValueOnce(Object.assign(new Error('Denied'), { name: 'NotAllowedError' }));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  showPage();
  fireEvent.click(screen.getByText('Koristi Kameru'));
  await waitFor(() => expect(screen.getByText(/Pristup kameri je odbijen/)).toBeInTheDocument());
});

describe('automatic capture', () => {
  let toBlob;
  beforeEach(() => {
    jest.useFakeTimers();
    mockAlignment = { status: 'ok', aligned: true, message: 'Odlično! Ne pomjerajte se i uslikajte.' };
    initTracker.mockReturnValue(new Promise(() => {}));
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: jest.fn() });
    toBlob = jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(cb => cb(new Blob(['x'], { type: 'image/jpeg' })));
    global.URL.createObjectURL = jest.fn(() => 'blob:x');
    global.URL.revokeObjectURL = jest.fn();
  });
  afterEach(() => jest.useRealTimers());

  const openCamera = async () => {
    showPage();
    fireEvent.click(screen.getByText('Koristi Kameru'));
    await screen.findByTestId('face-guide');
  };

  test('aligned face triggers countdown and a single capture that stops the camera', async () => {
    await openCamera();
    expect(screen.getByText('Odlično! Zadržite položaj…')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(1500));
    expect(screen.getByTestId('auto-capture-count')).toHaveTextContent('3');
    expect(screen.getByText('Ne pomjerajte se — slikam za 3…')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(700 * 3));
    expect(toBlob).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalled();
    expect(screen.queryByTestId('face-guide')).not.toBeInTheDocument();
  });

  test('turning auto-capture off keeps manual control and is remembered', async () => {
    await openCamera();
    fireEvent.click(screen.getByLabelText('Automatsko slikanje kad je lice poravnato'));
    act(() => jest.advanceTimersByTime(10000));
    expect(toBlob).not.toHaveBeenCalled();
    expect(localStorage.getItem('beardstyle.autoCapture')).toBe('off');
    fireEvent.click(screen.getByText('📸 Uslikaj'));
    expect(toBlob).toHaveBeenCalledTimes(1);
  });
});
