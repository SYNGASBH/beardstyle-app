import React, { useState } from 'react';

/**
 * SketchOverlay Component
 *
 * Renders Midjourney-generated sketch images as overlays on user photos.
 * Uses mix-blend-mode: multiply to make white backgrounds transparent.
 * Falls back to SVG placeholder for styles without real images.
 */

// Styles that have real Midjourney-generated WebP images
const AVAILABLE_SKETCHES = {
  'full-beard': '/assets/sketches/full-beard.webp',
  'ducktail': '/assets/sketches/ducktail.webp',
  'stubble-3day': '/assets/sketches/stubble-3day.webp',
  'stubble': '/assets/sketches/stubble-3day.webp', // alias for stubble
  'van-dyke': '/assets/sketches/van-dyke.webp',
  // Add more as they are generated:
  // 'goatee': '/assets/sketches/goatee.webp',
  // 'balbo': '/assets/sketches/balbo.webp',
  // etc.
};

// SVG fallback paths for styles without images
const SVG_FALLBACKS = {
  'full-beard': '/assets/sketches/full-beard.svg',
  'stubble': '/assets/sketches/stubble-3day.svg',
  'stubble-3day': '/assets/sketches/stubble-3day.svg',
  'van-dyke': '/assets/sketches/van-dyke.svg',
  'clean-shaven': '/assets/sketches/clean-shaven.svg',
  'short-boxed-beard': '/assets/sketches/short-boxed-beard.svg',
  'corporate-beard': '/assets/sketches/corporate-beard.svg',
  'goatee': '/assets/sketches/goatee.svg',
  'balbo': '/assets/sketches/balbo.svg',
  'circle-beard': '/assets/sketches/circle-beard.svg',
  'ducktail': '/assets/sketches/ducktail.svg',
  'garibaldi': '/assets/sketches/garibaldi.svg',
  'mutton-chops': '/assets/sketches/mutton-chops.svg',
  'anchor-beard': '/assets/sketches/anchor-beard.svg',
  'chin-strap': '/assets/sketches/chin-strap.svg',
  'beardstache': '/assets/sketches/beardstache.svg',
};

const SketchOverlay = ({
  style = 'full-beard',
  opacity = 0.85,
  scale = 1,
  position = { x: 0, y: 15 }, // Default: slightly below center for beard placement
  showBadge = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasRealSketch = AVAILABLE_SKETCHES[style] && !imageError;
  const imageSrc = hasRealSketch
    ? AVAILABLE_SKETCHES[style]
    : SVG_FALLBACKS[style] || '/assets/sketches/full-beard.svg';

  const handleImageError = () => {
    console.warn(`Sketch image failed to load: ${style}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        opacity: opacity,
      }}
    >
      {/* Sketch Image with mix-blend-mode */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}%, ${position.y}%) scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        <img
          src={imageSrc}
          alt={`${style} beard style sketch`}
          className={`w-full h-full transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: 'contain',
            // KEY: mix-blend-mode makes white background transparent!
            mixBlendMode: hasRealSketch ? 'multiply' : 'normal',
            filter: hasRealSketch ? 'none' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          draggable={false}
        />
      </div>

      {/* Badge indicating image type */}
      {showBadge && (
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            hasRealSketch
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {hasRealSketch ? '✏️ AI Sketch' : '📐 SVG'}
          </span>
        </div>
      )}

      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-4xl">🧔</div>
        </div>
      )}
    </div>
  );
};

// Export available sketches for external use
export const getAvailableSketches = () => Object.keys(AVAILABLE_SKETCHES);
export const hasRealSketch = (style) => !!AVAILABLE_SKETCHES[style];

export default SketchOverlay;
