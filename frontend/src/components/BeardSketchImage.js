import React, { useState } from 'react';
import './BeardSketchImage.css';

/**
 * BeardSketchImage Component
 *
 * Displays graphite-style technical beard illustrations with optional annotation toggle.
 * Supports three annotation levels: none, basic, advanced
 *
 * @param {Object} style - Beard style object with slug property
 * @param {string} annotationLevel - Initial annotation level ('none' | 'basic' | 'advanced')
 * @param {boolean} showAnnotationToggle - Whether to show the annotation toggle buttons
 * @param {string} className - Additional CSS class names
 * @param {Function} onLoad - Callback when image loads
 * @param {Function} onError - Callback when image fails to load
 */
const BeardSketchImage = ({
  style,
  annotationLevel = 'none',
  showAnnotationToggle = false,
  className = '',
  onLoad,
  onError
}) => {
  const [level, setLevel] = useState(annotationLevel);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const basePath = '/assets/sketches';

  const getSrc = () => {
    if (!style?.slug) return '';

    const suffix = level === 'none' ? '' :
                   level === 'basic' ? '-annotated' :
                   '-annotated-advanced';
    // Use image_url from database if available and no annotation, otherwise build path
    if (level === 'none' && style?.image_url) {
      return style.image_url;
    }
    return `${basePath}/${style.slug}${suffix}.webp`;
  };

  const getWebpSrc = () => {
    if (!style?.slug) return '';
    const suffix = level === 'none' ? '' :
                   level === 'basic' ? '-annotated' :
                   '-annotated-advanced';
    return `${basePath}/${style.slug}${suffix}.webp`;
  };

  const getFallbackSrc = () => {
    if (!style?.slug) return '';
    return style?.image_url || `${basePath}/${style.slug}.svg`;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    if (!imageError) {
      setImageError(true);
    }
    onError?.();
  };

  const annotationLabels = {
    none: 'Cista',
    basic: 'Osnovna',
    advanced: 'Detaljna'
  };

  return (
    <div className={`beard-sketch-container ${className}`}>
      {showAnnotationToggle && (
        <div className="annotation-toggle" role="group" aria-label="Annotation level">
          {Object.entries(annotationLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={level === key ? 'active' : ''}
              aria-pressed={level === key}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="beard-sketch-wrapper">
        {isLoading && (
          <div className="beard-sketch-loading">
            <div className="loading-spinner" />
          </div>
        )}

        <picture>
          <source
            srcSet={getWebpSrc()}
            type="image/webp"
          />
          <img
            src={imageError ? getFallbackSrc() : getSrc()}
            alt={`${style?.name || 'Beard'} style technical illustration`}
            loading="lazy"
            decoding="async"
            className={`beard-sketch ${isLoading ? 'loading' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
      </div>

      {level !== 'none' && (
        <div className="annotation-legend">
          <span className="legend-item">
            <span className="legend-color cheek-line" />
            Linija obraza
          </span>
          <span className="legend-item">
            <span className="legend-color neck-line" />
            Linija vrata
          </span>
          {level === 'advanced' && (
            <span className="legend-item">
              <span className="legend-color maintenance" />
              Zona odrzavanja
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BeardSketchImage;
