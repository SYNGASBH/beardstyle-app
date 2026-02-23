import React, { useState, useRef } from 'react';
import BeardOverlay from './BeardOverlay';
import SketchOverlay, { hasRealSketch } from './SketchOverlay';

/**
 * BeardStylePreview Component
 *
 * Advanced preview showing user's photo with beard style overlay
 * Supports two overlay modes:
 * - 'sketch': Real Midjourney-generated images with mix-blend-mode: multiply
 * - 'svg': SVG stroke-based overlays with color customization
 */
const BeardStylePreview = ({
  userImage,
  beardStyle = 'full-beard',
  styleName = 'Full Beard',
  onSave,
  showControls = true
}) => {
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [overlayScale, setOverlayScale] = useState(1);
  const [beardColor, setBeardColor] = useState('#2C1810');
  const [showOverlay, setShowOverlay] = useState(true);
  // Default to sketch mode if real image available, otherwise SVG
  const [overlayMode, setOverlayMode] = useState(hasRealSketch(beardStyle) ? 'sketch' : 'svg');
  const [position, setPosition] = useState({ x: 0, y: 15 });
  const canvasRef = useRef(null);

  // Beard color presets
  const colorPresets = [
    { name: 'Dark Brown', value: '#2C1810' },
    { name: 'Medium Brown', value: '#5C4033' },
    { name: 'Light Brown', value: '#8B7355' },
    { name: 'Black', value: '#1A1110' },
    { name: 'Auburn', value: '#A0522D' },
    { name: 'Gray', value: '#808080' },
    { name: 'Salt & Pepper', value: '#505050' }
  ];

  // Download combined image
  const handleDownload = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load user image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = userImage;

    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw user image
      ctx.drawImage(img, 0, 0);

      if (overlayMode === 'sketch') {
        // For sketch mode, find the img element and use mix-blend-mode simulation
        const container = document.querySelector(`#beard-preview-${beardStyle}`);
        const sketchImg = container?.querySelector('img');

        if (sketchImg && sketchImg.src) {
          const overlayImg = new Image();
          overlayImg.crossOrigin = 'anonymous';
          overlayImg.onload = () => {
            ctx.globalAlpha = overlayOpacity;
            // Simulate mix-blend-mode: multiply
            ctx.globalCompositeOperation = 'multiply';

            // Calculate position and scale
            const scaleX = canvas.width * overlayScale;
            const scaleY = canvas.height * overlayScale;
            const offsetX = (canvas.width - scaleX) / 2 + (position.x / 100) * canvas.width;
            const offsetY = (canvas.height - scaleY) / 2 + (position.y / 100) * canvas.height;

            ctx.drawImage(overlayImg, offsetX, offsetY, scaleX, scaleY);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;

            // Download
            canvas.toBlob((blob) => {
              const link = document.createElement('a');
              link.download = `beard-preview-${styleName.toLowerCase().replace(/\s/g, '-')}.png`;
              link.href = URL.createObjectURL(blob);
              link.click();
            });
          };
          overlayImg.src = sketchImg.src;
        }
      } else {
        // For SVG mode, serialize the SVG
        const container = document.querySelector(`#beard-preview-${beardStyle}`);
        const svg = container?.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const overlayImg = new Image();
          overlayImg.onload = () => {
            ctx.globalAlpha = overlayOpacity;
            ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            // Download
            canvas.toBlob((blob) => {
              const link = document.createElement('a');
              link.download = `beard-preview-${styleName.toLowerCase().replace(/\s/g, '-')}.png`;
              link.href = URL.createObjectURL(blob);
              link.click();
            });

            URL.revokeObjectURL(url);
          };
          overlayImg.src = url;
        }
      }
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Title */}
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Preview: {styleName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Adjust the settings to see how this style looks on you
        </p>
      </div>

      {/* Preview Container */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-2xl">
        {/* User Image */}
        <img
          src={userImage}
          alt="Your face"
          className="w-full h-full object-cover"
        />

        {/* Beard Overlay */}
        {showOverlay && (
          <div id={`beard-preview-${beardStyle}`} className="absolute inset-0">
            {overlayMode === 'sketch' ? (
              <SketchOverlay
                style={beardStyle}
                opacity={overlayOpacity}
                scale={overlayScale}
                position={position}
                showBadge={false}
              />
            ) : (
              <BeardOverlay
                style={beardStyle}
                opacity={overlayOpacity}
                color={beardColor}
                scale={overlayScale}
                position={{ x: 0, y: 0 }}
              />
            )}
          </div>
        )}

        {/* Control Buttons (top corners) */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          {/* Mode Toggle (only show if real sketch available) */}
          {hasRealSketch(beardStyle) && (
            <button
              onClick={() => setOverlayMode(overlayMode === 'sketch' ? 'svg' : 'sketch')}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-2 rounded-full transition-all text-sm font-semibold"
              title={overlayMode === 'sketch' ? 'Switch to SVG mode' : 'Switch to AI Sketch mode'}
            >
              {overlayMode === 'sketch' ? 'AI Sketch' : 'SVG'}
            </button>
          )}
          {/* Show/Hide Toggle */}
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-full transition-all text-sm font-semibold"
          >
            {showOverlay ? 'Hide Beard' : 'Show Beard'}
          </button>
        </div>

        {/* Style Label */}
        <div className="absolute bottom-4 left-4 bg-red-600 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-semibold">
          {styleName}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="mt-6 space-y-6">
          {/* Opacity Control */}
          <div className="bg-white rounded-lg p-4 shadow">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beard Opacity: {Math.round(overlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity * 100}
              onChange={(e) => setOverlayOpacity(e.target.value / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Scale Control */}
          <div className="bg-white rounded-lg p-4 shadow">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beard Size: {Math.round(overlayScale * 100)}%
            </label>
            <input
              type="range"
              min="70"
              max="130"
              value={overlayScale * 100}
              onChange={(e) => setOverlayScale(e.target.value / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Position Controls (for sketch mode) */}
          {overlayMode === 'sketch' && (
            <div className="bg-white rounded-lg p-4 shadow">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Position Adjustment
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Horizontal: {position.x}%
                  </label>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={position.x}
                    onChange={(e) => setPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Vertical: {position.y}%
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="40"
                    value={position.y}
                    onChange={(e) => setPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Color Selection (only for SVG mode) */}
          {overlayMode === 'svg' && (
            <div className="bg-white rounded-lg p-4 shadow">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Beard Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setBeardColor(preset.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      beardColor === preset.value
                        ? 'ring-2 ring-red-600 bg-gray-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{
                      borderLeft: `8px solid ${preset.value}`
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Reset Button */}
            <button
              onClick={() => {
                setOverlayOpacity(0.85);
                setOverlayScale(1);
                setBeardColor('#2C1810');
                setShowOverlay(true);
                setPosition({ x: 0, y: 15 });
                setOverlayMode(hasRealSketch(beardStyle) ? 'sketch' : 'svg');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Preview
            </button>

            {/* Save/Select Button */}
            {onSave && (
              <button
                onClick={() => onSave({ beardStyle, styleName, settings: { opacity: overlayOpacity, scale: overlayScale, color: beardColor, mode: overlayMode, position } })}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Select This Style
              </button>
            )}

            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `My ${styleName} Preview`,
                    text: 'Check out how I look with this beard style!',
                    url: window.location.href
                  });
                } else {
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
        </div>
      )}

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Tips */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <span className="font-semibold">Tip:</span> Adjust opacity and size to find the perfect fit for your face shape
      </div>
    </div>
  );
};

export default BeardStylePreview;
