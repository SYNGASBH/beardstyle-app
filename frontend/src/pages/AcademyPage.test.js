import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AcademyPage from './AcademyPage';
import useAuthStore from '../context/useAuthStore';
import { userAPI } from '../services/api';

jest.mock('../context/useAuthStore', () => jest.fn());
jest.mock('../services/api', () => ({ userAPI: { getLessonProgress: jest.fn(), completeLesson: jest.fn() } }));
beforeEach(() => {
  localStorage.clear();
  useAuthStore.mockReturnValue({ isAuthenticated: false, user: null });
  userAPI.getLessonProgress.mockResolvedValue({ data: { completedLessons: [] } });
  userAPI.completeLesson.mockResolvedValue({ data: { ok: true } });
  jest.clearAllMocks();
});
const page = () => render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AcademyPage /></MemoryRouter>);
test('premium course is open to guests, keyboard works, completion persists', () => {
  const { unmount } = page();
  fireEvent.keyDown(screen.getByText('Precizni stilovi').closest('[role="button"]'), { key: 'Enter' });
  fireEvent.click(screen.getByText('Kako održavati simetriju'));
  expect(screen.getByText('Ogledalo je tvoj prijatelj')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Označi kao završeno'));
  expect(JSON.parse(localStorage.getItem('bs_progress:guest')).ps2).toBe(true);
  unmount(); page();
  fireEvent.click(screen.getByText('Precizni stilovi'));
  fireEvent.click(screen.getByText('Kako održavati simetriju'));
  expect(screen.getByText('Završeno').disabled).toBe(true);
});
test('all four steps of a free guide can be reached', () => {
  page(); fireEvent.click(screen.getByText('Osnove njege brade'));
  fireEvent.click(screen.getByText('Kako oblikovati punu bradu'));
  for (let i=0;i<3;i++) fireEvent.click(screen.getByLabelText('Sljedeći korak'));
  expect(screen.getByText('Korak 4/4')).toBeInTheDocument();
});
test('signed-in progress loads from account and saves new completions', async () => {
  useAuthStore.mockReturnValue({ isAuthenticated: true, user: { id: 7 }, accountType: 'user' });
  userAPI.getLessonProgress.mockResolvedValue({ data: { completedLessons: [{ lesson_id: 'bb3' }] } });
  page();
  await waitFor(() => expect(localStorage.getItem('bs_progress:7')).toContain('bb3'));
  fireEvent.click(screen.getByText('Precizni stilovi')); fireEvent.click(screen.getByText('Kako održavati simetriju'));
  fireEvent.click(screen.getByText('Označi kao završeno'));
  expect(userAPI.completeLesson).toHaveBeenCalledWith('precision-styles', 'ps2');
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('sinhronizovan'));
});
test('bad storage and backend failure retain usable lessons and local progress', async () => {
  localStorage.setItem('bs_progress:7', 'null');
  useAuthStore.mockReturnValue({ isAuthenticated: true, user: { id: 7 }, accountType: 'user' });
  userAPI.getLessonProgress.mockRejectedValue(new Error('Offline'));
  page();
  expect(await screen.findByRole('status')).toHaveTextContent('trenutno nije dostupna');
  fireEvent.click(screen.getByText('Njega i proizvodi'));
  fireEvent.click(screen.getByText('Pranje brade — greške koje svi rade'));
  expect(screen.getByText('Sušenje')).toBeInTheDocument();
});

test('changing accounts cannot carry over another learner’s completions', async () => {
  localStorage.setItem('bs_progress:7', JSON.stringify({ ps2: true }));
  useAuthStore.mockReturnValue({ isAuthenticated: true, user: { id: 7 }, accountType: 'user' });
  const view = page();
  await screen.findByRole('status');
  useAuthStore.mockReturnValue({ isAuthenticated: true, user: { id: 8 }, accountType: 'user' });
  view.rerender(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AcademyPage /></MemoryRouter>);
  await waitFor(() => expect(localStorage.getItem('bs_progress:8')).toBe('{}'));
  fireEvent.click(screen.getByText('Precizni stilovi'));
  fireEvent.click(screen.getByText('Kako održavati simetriju'));
  expect(screen.getByText('Označi kao završeno')).toBeInTheDocument();
});
