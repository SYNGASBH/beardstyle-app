import React, { useEffect, useRef, useState } from 'react';
import { initTracker, processFrame, destroyTracker } from '../utils/faceTracker';
import { evaluateAlignment, guideOval, measureBrightness } from '../utils/faceAlignment';

const FRAME_INTERVAL_MS = 120; // ~8 fps is enough for guidance and spares mobile batteries
const STABLE_FRAMES = 3;       // consecutive identical results before the UI changes

const COLORS = { ok: '#22c55e', warn: '#fbbf24', idle: '#ffffff' };

/**
 * Face placement mask for camera capture: darkens everything outside a guide
 * oval, draws eye/chin reference lines and reports live alignment feedback.
 * Rendered inside the same mirrored container as the <video>, with a viewBox
 * equal to the video resolution so oval and frame share one coordinate space.
 */
export default function FaceGuideOverlay({ videoRef, onAlignmentChange }) {
  const [size, setSize] = useState({ w: 640, h: 480 });
  const [state, setState] = useState({ status: 'idle', aligned: false });
  const latest = useRef(onAlignmentChange);
  latest.current = onAlignmentChange;

  useEffect(() => {
    let cancelled = false;
    let timer;
    let pending = { status: null, count: 0 };
    let shown = null;
    const sampler = document.createElement('canvas');

    const publish = result => {
      if (result.status === pending.status) pending.count += 1;
      else pending = { status: result.status, count: 1 };
      if (pending.count < STABLE_FRAMES || shown === result.status) return;
      shown = result.status;
      setState({ status: result.status, aligned: result.aligned });
      latest.current?.(result);
    };

    const tick = async () => {
      if (cancelled) return;
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !video.videoWidth) {
        timer = setTimeout(tick, FRAME_INTERVAL_MS);
        return;
      }
      const w = video.videoWidth, h = video.videoHeight;
      setSize(s => (s.w === w && s.h === h ? s : { w, h }));
      try {
        const face = await processFrame(video, w, h);
        if (cancelled) return;
        publish(evaluateAlignment(face, w, h, measureBrightness(video, sampler)));
      } catch (_) {
        // A single slow frame is not fatal; keep guiding.
      }
      if (!cancelled) timer = setTimeout(tick, FRAME_INTERVAL_MS);
    };

    initTracker().then(() => { if (!cancelled) tick(); }).catch(() => {
      if (cancelled) return;
      // No WebGL / CDN: keep the static mask, capture stays available.
      setState({ status: 'unavailable', aligned: false });
      latest.current?.({ status: 'unavailable', aligned: false, message: null });
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      destroyTracker();
    };
  }, [videoRef]);

  const { w, h } = size;
  const oval = guideOval(w, h);
  const color = state.aligned ? COLORS.ok
    : state.status === 'idle' || state.status === 'unavailable' ? COLORS.idle : COLORS.warn;
  // Reference lines: eyes sit ~42% down the oval, chin touches its bottom edge.
  const eyeY = oval.cy - oval.ry + oval.ry * 2 * 0.42;
  const chinY = oval.cy + oval.ry;
  const stroke = Math.max(2, w / 240);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      data-testid="face-guide"
      data-status={state.status}
    >
      <defs>
        <mask id="face-guide-cutout">
          <rect width={w} height={h} fill="white" />
          <ellipse cx={oval.cx} cy={oval.cy} rx={oval.rx} ry={oval.ry} fill="black" />
        </mask>
      </defs>
      <rect width={w} height={h} fill="rgba(0,0,0,0.55)" mask="url(#face-guide-cutout)" />
      <ellipse
        cx={oval.cx} cy={oval.cy} rx={oval.rx} ry={oval.ry}
        fill="none" stroke={color} strokeWidth={stroke * 1.5}
        strokeDasharray={state.aligned ? 'none' : `${stroke * 6} ${stroke * 4}`}
        style={{ transition: 'stroke 200ms' }}
      />
      <g stroke={color} strokeOpacity="0.6" strokeWidth={stroke * 0.75} strokeDasharray={`${stroke * 3} ${stroke * 3}`}>
        <line x1={oval.cx - oval.rx * 0.8} x2={oval.cx + oval.rx * 0.8} y1={eyeY} y2={eyeY} />
        <line x1={oval.cx} x2={oval.cx} y1={oval.cy - oval.ry * 0.9} y2={chinY - oval.ry * 0.05} />
      </g>
      <line
        x1={oval.cx - oval.rx * 0.35} x2={oval.cx + oval.rx * 0.35} y1={chinY} y2={chinY}
        stroke={color} strokeWidth={stroke * 2} strokeLinecap="round"
      />
    </svg>
  );
}
