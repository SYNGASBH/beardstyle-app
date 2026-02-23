import React, { useState, useRef, useEffect, useCallback } from 'react';
import BeardOverlay from './BeardOverlay';

/**
 * BeforeAfterSlider Component
 *
 * Interactive slider component for comparing before/after images
 * Perfect for showing beard style transformations
 */
const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  styleName = "Beard Style",
  onSave,
  beardStyle = "full-beard",
  showControls = true
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showAfter, setShowAfter] = useState(true);
  const containerRef = useRef(null);

  // Handle mouse/touch drag - wrapped in useCallback for stable reference
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Constrain between 0 and 100
    const newPosition = Math.max(0, Math.min(100, percentage));
    setSliderPosition(newPosition);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleToggle = () => {
    setShowAfter(!showAfter);
    setSliderPosition(showAfter ? 0 : 100);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave({ beforeImage, afterImage, styleName });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Title */}
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Your Transformation: {styleName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Drag the slider to compare before and after
        </p>
      </div>

      {/* Comparison Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-2xl cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Before Image (Full Width) */}
        <div className="absolute inset-0">
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            BEFORE
          </div>
        </div>

        {/* After Image (Clipped by slider) WITH BEARD OVERLAY */}
        <div
          className="absolute inset-0 overflow-hidden transition-opacity duration-300"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            opacity: showAfter ? 1 : 0
          }}
        >
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Beard Overlay */}
          <BeardOverlay
            style={beardStyle}
            opacity={0.75}
            color="#2C1810"
            position={{ x: 0, y: 0 }}
            scale={1}
          />
          <div className="absolute bottom-4 right-4 bg-red-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-semibold">
            AFTER
          </div>
        </div>

        {/* Slider Line */}
        {showAfter && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 transition-all"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing border-4 border-red-600">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Quick Toggle Buttons (corners) */}
        <button
          onClick={() => setSliderPosition(0)}
          className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all z-20"
          title="Show Before"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setSliderPosition(100)}
          className="absolute top-4 right-4 bg-red-600 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all z-20"
          title="Show After"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            {showAfter ? 'Hide After' : 'Show After'}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setSliderPosition(50)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save Image
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `My ${styleName} Transformation`,
                  text: 'Check out my beard style transformation!',
                  url: window.location.href
                });
              } else {
                // Fallback - copy link
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      )}

      {/* Mobile Hint */}
      <div className="mt-4 text-center text-sm text-gray-500">
        💡 <span className="font-semibold">Tip:</span> On mobile, swipe left and right to compare
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
