import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { initTracker, processFrame, destroyTracker } from '../utils/faceTracker';
import { drawARBeard } from '../utils/arPreview';

const ARBeardOverlay = forwardRef(function ARBeardOverlay({
  videoRef, beardStyle = 'full-beard', opacity = 0.8, showTechLines = true,
  visible = true, onFaceDetected, onTrackingLost, onError,
}, ref) {
  const canvasRef = useRef(null);
  const linesRef = useRef(null);
  const latest = useRef({});
  latest.current = { beardStyle, opacity, showTechLines, visible, onFaceDetected, onTrackingLost, onError };
  useImperativeHandle(ref, () => ({ getCanvas: () => canvasRef.current }), []);

  useEffect(() => {
    let cancelled = false;
    let animation;
    const frame = async () => {
      if (cancelled) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const lines = linesRef.current;
      if (!video || !canvas || video.readyState < 2 || !video.videoWidth) {
        animation = requestAnimationFrame(frame);
        return;
      }
      try {
        const face = await processFrame(video, video.videoWidth, video.videoHeight);
        if (cancelled) return;
        for (const layer of [canvas, lines]) {
          if (layer.width !== video.videoWidth || layer.height !== video.videoHeight) {
            layer.width = video.videoWidth; layer.height = video.videoHeight;
          }
          layer.getContext('2d').clearRect(0, 0, layer.width, layer.height);
        }
        const settings = latest.current;
        if (face && face.confidence > 0.3) {
          if (settings.visible) drawARBeard(canvas.getContext('2d'), face, settings.beardStyle, settings.opacity);
          if (settings.showTechLines) {
            const ctx = lines.getContext('2d');
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
            ctx.beginPath();
            face.jawline.forEach((p, i) => i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y));
            ctx.stroke();
          }
          settings.onFaceDetected?.(face);
        } else settings.onTrackingLost?.();
        animation = requestAnimationFrame(frame);
      } catch (error) {
        if (!cancelled) latest.current.onError?.(error.message);
      }
    };
    initTracker().then(() => {
      if (!cancelled) animation = requestAnimationFrame(frame);
    }).catch(error => { if (!cancelled) latest.current.onError?.(error.message); });
    return () => {
      cancelled = true;
      cancelAnimationFrame(animation);
      destroyTracker();
    };
  }, [videoRef]);

  return <div className="absolute inset-0 pointer-events-none">
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" aria-hidden="true" />
    <canvas ref={linesRef} className="absolute inset-0 w-full h-full object-contain" aria-hidden="true" />
  </div>;
});
export default ARBeardOverlay;
