import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { initTracker, processFrame, destroyTracker } from '../utils/faceTracker';
import ThreeBeardRenderer from '../utils/threeBeardRenderer';

/**
 * ARBeardOverlay — Three.js Rendering Layer (Decoupled from Tracking)
 *
 * Consumes face transform data from faceTracker.js and renders:
 *   1. Beard texture on a WebGL PlaneGeometry with perspective projection
 *   2. Skin-tone-matched shadow with multiply blending
 *   3. Technical alignment lines (jawline, mustache symmetry, chin anchor)
 *
 * Architecture:
 *   faceTracker.js → pure data (pitch, yaw, roll, scale, landmarks)
 *   threeBeardRenderer.js → Three.js WebGL scene (renderer, camera, meshes)
 *   ARBeardOverlay → React wrapper, render loop, HUD, tech lines
 *
 * Props:
 *   @param {React.RefObject} videoRef       - Ref to <video> element
 *   @param {string}  beardStyle     - Beard style slug (e.g., 'full-beard')
 *   @param {string}  beardImageSrc  - Path to beard sketch image
 *   @param {boolean} showTechLines  - Show alignment visualization
 *   @param {number}  opacity        - Beard overlay opacity (0–1)
 *   @param {Function} onTrackingStart - Callback when tracking begins
 *   @param {Function} onTrackingLost  - Callback when face lost
 *   @param {Function} onFaceDetected  - Callback with transform data
 */

// Alignment line colors
const TECH_COLORS = {
  jawline: '#FFD700',
  symmetry: '#00BFFF',
  anchor: '#FF6B6B',
  grid: 'rgba(255, 215, 0, 0.15)',
};

const ARBeardOverlay = ({
  videoRef,
  beardStyle = 'full-beard',
  beardImageSrc,
  showTechLines = true,
  opacity = 0.88,
  onTrackingStart,
  onTrackingLost,
  onFaceDetected,
}) => {
  const canvasRef = useRef(null);       // Hidden canvas for MediaPipe frame capture
  const glCanvasRef = useRef(null);     // WebGL canvas for Three.js
  const techCanvasRef = useRef(null);   // Canvas 2D for tech alignment lines
  const rendererRef = useRef(null);     // ThreeBeardRenderer instance
  const animFrameRef = useRef(null);
  const lastTransformRef = useRef(null);
  const trackingActiveRef = useRef(false);

  const [isTracking, setIsTracking] = useState(false);
  const [skinTone, setSkinTone] = useState(null);
  const [trackerReady, setTrackerReady] = useState(false);
  const [transform, setTransform] = useState(null);
  const [fps, setFps] = useState(0);

  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() });

  // ── Initialize MediaPipe tracker ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    initTracker()
      .then(() => {
        if (!cancelled) setTrackerReady(true);
      })
      .catch((err) => {
        console.warn('[AR] Tracker init failed:', err.message);
      });

    return () => {
      cancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      destroyTracker();
    };
  }, []);

  // ── Initialize Three.js renderer ─────────────────────────────────────
  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    if (!glCanvas) return;

    // Default size; will be updated in render loop when video dimensions are known
    const r = new ThreeBeardRenderer(glCanvas, 640, 480);
    rendererRef.current = r;

    return () => {
      r.dispose();
      rendererRef.current = null;
    };
  }, []);

  // ── Load beard texture when style changes ────────────────────────────
  useEffect(() => {
    const src = beardImageSrc || `/assets/sketches/${beardStyle}.webp`;
    rendererRef.current?.loadBeardTexture(src);
  }, [beardStyle, beardImageSrc]);

  // ── Update opacity ───────────────────────────────────────────────────
  useEffect(() => {
    rendererRef.current?.setOpacity(opacity);
  }, [opacity]);

  // ── Render loop: capture frame → process → update Three.js ───────────
  const renderLoop = useCallback(async () => {
    const video = videoRef?.current;
    const canvas = canvasRef.current;
    const threeRenderer = rendererRef.current;

    if (!video || !canvas || video.readyState < 2 || !threeRenderer) {
      animFrameRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const w = video.videoWidth || video.width || 640;
    const h = video.videoHeight || video.height || 480;

    // Resize Three.js to match display
    const displayW = glCanvasRef.current?.clientWidth || w;
    const displayH = glCanvasRef.current?.clientHeight || h;
    threeRenderer.resize(displayW, displayH);

    // Draw video frame to hidden canvas for MediaPipe
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, w, h);

    // Process frame through MediaPipe
    const result = await processFrame(canvas, w, h);

    if (result && result.confidence > 0.3) {
      lastTransformRef.current = result;
      setTransform(result);

      // Update Three.js renderer with transform data
      threeRenderer.update(result, w, h);

      if (!trackingActiveRef.current) {
        trackingActiveRef.current = true;
        setIsTracking(true);
        onTrackingStart?.();
      }

      onFaceDetected?.(result);

      // Sample skin tone every 30 frames
      fpsCounterRef.current.frames++;
      if (fpsCounterRef.current.frames % 30 === 0) {
        try {
          const midX = Math.round(result.centerX);
          const cheekY = Math.round(result.noseTip.y);
          const cheekOffset = Math.round(result.jawWidth * 0.3);

          const pixel1 = ctx.getImageData(
            Math.max(0, midX - cheekOffset), Math.max(0, cheekY), 1, 1
          ).data;
          const pixel2 = ctx.getImageData(
            Math.min(w - 1, midX + cheekOffset), Math.max(0, cheekY), 1, 1
          ).data;

          const r = Math.round((pixel1[0] + pixel2[0]) / 2);
          const g = Math.round((pixel1[1] + pixel2[1]) / 2);
          const b = Math.round((pixel1[2] + pixel2[2]) / 2);
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

          const newTone = { r, g, b, hex };
          setSkinTone(newTone);
          threeRenderer.updateSkinTone(newTone);
        } catch (_) {}
      }

      // Draw tech lines on separate Canvas 2D
      if (showTechLines && techCanvasRef.current) {
        drawTechLines(techCanvasRef.current, result, w, h);
      }
    } else {
      // Face lost — hide meshes
      threeRenderer.update(null, w, h);

      if (trackingActiveRef.current) {
        trackingActiveRef.current = false;
        setIsTracking(false);
        onTrackingLost?.();
      }
    }

    // FPS calculation
    const now = performance.now();
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      setFps(fpsCounterRef.current.frames);
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }

    animFrameRef.current = requestAnimationFrame(renderLoop);
  }, [videoRef, showTechLines, onTrackingStart, onTrackingLost, onFaceDetected]);

  // Start render loop when tracker is ready
  useEffect(() => {
    if (trackerReady && videoRef?.current) {
      animFrameRef.current = requestAnimationFrame(renderLoop);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackerReady, renderLoop]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Hidden canvas for frame capture + skin sampling */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Three.js WebGL canvas — transparent, overlays the video */}
      <canvas
        ref={glCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Tech lines canvas (Canvas 2D — stays separate from WebGL) */}
      {showTechLines && (
        <canvas
          ref={techCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 20 }}
        />
      )}

      {/* ── Status HUD ──────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5" style={{ pointerEvents: 'none' }}>
        {/* Tracking indicator */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-md ${
          isTracking
            ? 'bg-emerald-900/70 text-emerald-300 border border-emerald-500/30'
            : 'bg-red-900/70 text-red-300 border border-red-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isTracking ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
          }`} />
          {isTracking ? 'TRACKING (WebGL)' : 'NO FACE'}
        </div>

        {/* FPS counter */}
        {isTracking && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-gray-900/70 text-gray-300 border border-gray-600/30 backdrop-blur-md">
            {fps} FPS
          </div>
        )}

        {/* Skin tone swatch */}
        {isTracking && skinTone && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-gray-900/70 text-gray-300 border border-gray-600/30 backdrop-blur-md">
            <div
              className="w-4 h-4 rounded border border-white/20"
              style={{ backgroundColor: skinTone.hex }}
            />
            {skinTone.hex}
          </div>
        )}
      </div>

      {/* ── Tech data readout (bottom) ──────────────────────────── */}
      {isTracking && transform && showTechLines && (
        <div className="absolute bottom-3 left-3 right-3 z-30 flex gap-2 flex-wrap" style={{ pointerEvents: 'none' }}>
          {[
            { label: 'PITCH', value: `${transform.pitch.toFixed(1)}°`, color: 'text-amber-400' },
            { label: 'YAW', value: `${transform.yaw.toFixed(1)}°`, color: 'text-cyan-400' },
            { label: 'ROLL', value: `${transform.roll.toFixed(1)}°`, color: 'text-rose-400' },
            { label: 'SCALE', value: transform.scale.toFixed(2), color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-gray-900/80 border border-gray-700/50 backdrop-blur-md"
            >
              <span className="text-gray-500">{label}</span>{' '}
              <span className={color}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Technical Alignment Lines (Canvas 2D — unchanged) ─────────────────────

/**
 * Draw technical alignment visualization:
 *   - Jawline contour (gold)
 *   - Mustache symmetry axis (cyan)
 *   - Chin anchor point (coral pulse)
 *   - Vertical face center line
 */
function drawTechLines(canvas, transform, videoW, videoH) {
  const displayW = canvas.clientWidth;
  const displayH = canvas.clientHeight;

  if (canvas.width !== displayW || canvas.height !== displayH) {
    canvas.width = displayW;
    canvas.height = displayH;
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, displayW, displayH);

  const sx = displayW / videoW;
  const sy = displayH / videoH;
  const time = performance.now();

  // ── 1. Jawline contour (gold, animated glow) ────────────
  if (transform.jawline && transform.jawline.length > 2) {
    const glowIntensity = 0.4 + Math.sin(time * 0.003) * 0.2;

    ctx.beginPath();
    ctx.moveTo(transform.jawline[0].x * sx, transform.jawline[0].y * sy);
    for (let i = 1; i < transform.jawline.length; i++) {
      ctx.lineTo(transform.jawline[i].x * sx, transform.jawline[i].y * sy);
    }
    ctx.strokeStyle = TECH_COLORS.jawline;
    ctx.lineWidth = 2;
    ctx.globalAlpha = glowIntensity;
    ctx.shadowColor = TECH_COLORS.jawline;
    ctx.shadowBlur = 12;
    ctx.stroke();

    ctx.globalAlpha = 0.7;
    ctx.shadowBlur = 0;
    ctx.font = '10px monospace';
    ctx.fillStyle = TECH_COLORS.jawline;
    const labelPt = transform.jawline[Math.floor(transform.jawline.length / 2)];
    ctx.fillText('JAWLINE ALIGNMENT', labelPt.x * sx - 55, labelPt.y * sy + 18);
  }

  // ── 2. Mustache symmetry line (cyan) ────────────────────
  if (transform.mouthLeft && transform.mouthRight) {
    const ml = transform.mouthLeft;
    const mr = transform.mouthRight;
    const midX = (ml.x + mr.x) / 2 * sx;
    const midY = (ml.y + mr.y) / 2 * sy;
    const halfLen = transform.jawWidth * 0.4 * sx;

    const pulse = 0.3 + Math.sin(time * 0.005) * 0.15;

    ctx.beginPath();
    ctx.moveTo(midX - halfLen, midY);
    ctx.lineTo(midX + halfLen, midY);
    ctx.strokeStyle = TECH_COLORS.symmetry;
    ctx.lineWidth = 1;
    ctx.globalAlpha = pulse;
    ctx.shadowColor = TECH_COLORS.symmetry;
    ctx.shadowBlur = 8;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.6;
    ctx.font = '9px monospace';
    ctx.fillStyle = TECH_COLORS.symmetry;
    ctx.fillText('MUSTACHE SYMMETRY', midX + halfLen + 6, midY + 3);
  }

  // ── 3. Chin anchor point (coral, pulsing circle) ────────
  if (transform.chinTip) {
    const cx = transform.chinTip.x * sx;
    const cy = transform.chinTip.y * sy;
    const pulseRadius = 5 + Math.sin(time * 0.006) * 2;

    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = TECH_COLORS.anchor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.shadowColor = TECH_COLORS.anchor;
    ctx.shadowBlur = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.strokeStyle = TECH_COLORS.anchor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 0;
    ctx.stroke();

    ctx.font = '9px monospace';
    ctx.fillStyle = TECH_COLORS.anchor;
    ctx.globalAlpha = 0.6;
    ctx.fillText('CHIN ANCHOR', cx + 14, cy - 6);
  }

  // ── 4. Vertical center line (faint gold) ────────────────
  if (transform.noseTip && transform.chinTip) {
    const topX = transform.noseTip.x * sx;
    const topY = (transform.noseTip.y - transform.faceHeight * 0.1) * sy;
    const botX = transform.chinTip.x * sx;
    const botY = (transform.chinTip.y + 10) * sy;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(botX, botY);
    ctx.strokeStyle = TECH_COLORS.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

export default memo(ARBeardOverlay);
