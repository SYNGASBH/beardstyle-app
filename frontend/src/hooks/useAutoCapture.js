import { useEffect, useRef, useState } from 'react';

export const HOLD_MS = 1500;   // face must stay aligned this long before the countdown
export const COUNTDOWN = 3;    // 3 … 2 … 1
export const STEP_MS = 700;    // short countdown: ~2 s in total

/**
 * Hands-free capture: once `aligned` has held for HOLD_MS, counts down and
 * calls `onCapture`. Losing alignment at any point cancels and starts over,
 * so the photo is never taken of a face that has just moved.
 *
 * @returns {{ phase: 'idle'|'holding'|'countdown', count: number }}
 */
export default function useAutoCapture({ aligned, enabled, onCapture }) {
  const [state, setState] = useState({ phase: 'idle', count: 0 });
  const capture = useRef(onCapture);
  capture.current = onCapture;

  useEffect(() => {
    if (!enabled || !aligned) {
      setState({ phase: 'idle', count: 0 });
      return undefined;
    }
    let timer;
    const step = count => {
      if (count === 0) {
        setState({ phase: 'idle', count: 0 });
        capture.current?.();
        return;
      }
      setState({ phase: 'countdown', count });
      timer = setTimeout(() => step(count - 1), STEP_MS);
    };
    setState({ phase: 'holding', count: 0 });
    timer = setTimeout(() => step(COUNTDOWN), HOLD_MS);
    return () => clearTimeout(timer);
  }, [aligned, enabled]);

  return state;
}
