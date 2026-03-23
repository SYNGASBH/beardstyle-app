/**
 * BeforeAfterSlider.js
 *
 * Interactive before/after comparison slider for beard visualizations.
 * Drag the divider left/right to reveal original vs generated image.
 *
 * Works with both old props (beforeImage/afterImage) and new props (beforeSrc/afterSrc).
 *
 * Props:
 *   beforeImage / beforeSrc  {string} - URL or base64 of the original photo
 *   afterImage  / afterSrc   {string} - URL or base64 of the generated photo
 *   styleName   {string}             - Display name of the style
 *   onSave      {Function}           - Callback for save action
 *   showControls {boolean}           - Show action buttons below (default: true)
 *   compact     {boolean}            - Compact mode for inline use (default: false)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeSrc,
  afterSrc,
  styleName = 'Stil brade',
  onSave,
  showControls = true,
  compact = false,
}) => {
  // Support both prop naming conventions
  const before = beforeSrc || beforeImage;
  const after  = afterSrc  || afterImage;

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  // Handle mouse/touch drag
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  }, []);

  const handleStart = useCallback((clientX) => {
    setIsDragging(true);
    setHasInteracted(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleTouchStart = useCallback((e) => {
    handleStart(e.touches[0].clientX);
  }, [handleStart]);

  useEffect(() => {
    const onMouseMove = (e) => { if (isDragging) handleMove(e.clientX); };
    const onTouchMove = (e) => { if (isDragging) handleMove(e.touches[0].clientX); };
    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleMove]);

  if (!before || !after) return null;

  return (
    <div className={compact ? 'w-full' : 'w-full max-w-lg mx-auto'}>
      {/* Title (only in non-compact mode) */}
      {!compact && (
        <div className="mb-3 text-center">
          <h3 className="text-lg font-bold text-gray-800">
            {styleName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Prevuci slider za poredjenje
          </p>
        </div>
      )}

      {/* Comparison Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-ew-resize select-none touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* After image (full, below) */}
        <img
          src={after}
          alt="Poslije"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={before}
            alt="Prije"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Drop shadow on slider line */}
          <div className="absolute inset-0 w-1 -ml-0.5 bg-white/80 shadow-lg" />

          {/* Drag handle circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-red-600 z-20">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L3 10L7 16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L17 10L13 16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 bg-black/60 text-white text-xs font-semibold rounded">
            Prije
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 bg-red-600/80 text-white text-xs font-semibold rounded">
            Poslije
          </span>
        </div>

        {/* Quick jump buttons (corners) */}
        <button
          onClick={(e) => { e.stopPropagation(); setSliderPosition(2); setHasInteracted(true); }}
          className="absolute bottom-2.5 left-2.5 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all z-20"
          title="Prikaži prije"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setSliderPosition(98); setHasInteracted(true); }}
          className="absolute bottom-2.5 right-2.5 bg-red-600/60 hover:bg-red-600/80 text-white p-1.5 rounded-full transition-all z-20"
          title="Prikaži poslije"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Instruction overlay (only shows if user hasn't interacted) */}
        {!hasInteracted && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-pulse pointer-events-none">
            <span className="px-3 py-1.5 bg-black/50 text-white text-xs rounded-full whitespace-nowrap">
              ← Prevuci za poredjenje →
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && !compact && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {/* Reset to 50% */}
          <button
            onClick={() => setSliderPosition(50)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Resetuj
          </button>

          {/* Save / Download */}
          {onSave && (
            <button
              onClick={() => onSave({ beforeImage: before, afterImage: after, styleName })}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Snimi
            </button>
          )}

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Transformacija: ${styleName}`, url: window.location.href });
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Podijeli
          </button>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterSlider;
