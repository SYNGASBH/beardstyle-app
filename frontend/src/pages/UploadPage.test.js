import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UploadPage from './UploadPage';
import { initTracker } from '../utils/faceTracker';

jest.mock('../services/api', () => ({ userAPI: { uploadImage: jest.fn() } }));
jest.mock('../context/useAuthStore', () => () => ({ isAuthenticated: true }));
jest.mock('../utils/faceShape', () => ({ loadFaceMesh: jest.fn(), detectFaceShape: jest.fn() }));
jest.mock('../utils/faceTracker', () => ({ initTracker: jest.fn(), processFrame: jest.fn(), destroyTracker: jest.fn() }));

let getUserMedia, stop;
beforeEach(() => {
  stop = jest.fn();
  getUserMedia = jest.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  initTracker.mockRejectedValue(new Error('WebGL is not available on this device'));
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
