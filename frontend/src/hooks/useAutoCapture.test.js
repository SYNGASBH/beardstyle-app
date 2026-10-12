import { renderHook, act } from '@testing-library/react';
import useAutoCapture, { HOLD_MS, STEP_MS, COUNTDOWN } from './useAutoCapture';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

const setup = (props) => renderHook(p => useAutoCapture(p), { initialProps: { enabled: true, onCapture: jest.fn(), ...props } });

test('holds, counts down 3-2-1 and captures once', () => {
  const onCapture = jest.fn();
  const { result } = setup({ aligned: true, onCapture });
  expect(result.current.phase).toBe('holding');
  act(() => jest.advanceTimersByTime(HOLD_MS));
  expect(result.current).toEqual({ phase: 'countdown', count: 3 });
  act(() => jest.advanceTimersByTime(STEP_MS));
  expect(result.current.count).toBe(2);
  act(() => jest.advanceTimersByTime(STEP_MS * (COUNTDOWN - 1)));
  expect(onCapture).toHaveBeenCalledTimes(1);
  expect(result.current.phase).toBe('idle');
  act(() => jest.advanceTimersByTime(10000));
  expect(onCapture).toHaveBeenCalledTimes(1);
});

test('moving out of alignment cancels and restarts the hold', () => {
  const onCapture = jest.fn();
  const { result, rerender } = setup({ aligned: true, onCapture });
  act(() => jest.advanceTimersByTime(HOLD_MS + STEP_MS));
  rerender({ aligned: false, enabled: true, onCapture });
  expect(result.current.phase).toBe('idle');
  rerender({ aligned: true, enabled: true, onCapture });
  act(() => jest.advanceTimersByTime(HOLD_MS + STEP_MS));
  expect(onCapture).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(STEP_MS * 2));
  expect(onCapture).toHaveBeenCalledTimes(1);
});

test('disabled auto-capture never fires', () => {
  const onCapture = jest.fn();
  const { result } = setup({ aligned: true, enabled: false, onCapture });
  act(() => jest.advanceTimersByTime(10000));
  expect(result.current.phase).toBe('idle');
  expect(onCapture).not.toHaveBeenCalled();
});
