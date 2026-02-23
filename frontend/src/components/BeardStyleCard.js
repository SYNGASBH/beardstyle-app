import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} BeardStyle
 * @property {string|number} id - Unique identifier
 * @property {string} name - Style name
 * @property {string} [slug] - URL-friendly slug
 * @property {string} [description] - Style description
 * @property {string} [style_category] - Category (corporate, casual, etc.)
 * @property {'low'|'medium'|'high'} [maintenance_level] - Maintenance level
 * @property {number} [growth_time_weeks] - Growth time in weeks
 * @property {string[]} [tags] - Associated tags
 * @property {number} [recommendation_score] - Match percentage
 */

/**
 * @typedef {Object} BeardStyleCardProps
 * @property {BeardStyle} style - Beard style data
 * @property {(id: string|number) => void} [onFavoriteToggle] - Favorite toggle callback
 * @property {boolean} [isFavorite] - Whether style is favorited
 * @property {boolean} [showScore] - Whether to show recommendation score
 */

// Constants - moved outside component to prevent recreation on each render
const PLACEHOLDER_IMAGE = '/assets/sketches/full-beard.svg';

const STYLE_SLUG_MAP = {
  'full-beard': 'full-beard',
  'stubble': 'stubble',
  'stubble-3-day': 'stubble',
  'goatee': 'goatee',
  'corporate-beard': 'corporate-beard',
  'corporate': 'corporate-beard',
  'van-dyke': 'van-dyke',
  'balbo': 'balbo',
  'circle-beard': 'circle-beard',
  'ducktail': 'ducktail',
  'garibaldi': 'garibaldi',
  'mutton-chops': 'mutton-chops',
  'anchor-beard': 'anchor-beard',
  'anchor': 'anchor-beard',
  'chin-strap': 'chin-strap',
  'beardstache': 'beardstache',
  'clean-shaven': 'clean-shaven',
  'short-boxed-beard': 'short-boxed-beard',
  'short-boxed': 'short-boxed-beard',
  'handlebar': 'handlebar',
};

const STYLE_IMAGE_MAP = {
  'stubble': 'stubble-3day',
  'stubble-3-day': 'stubble-3day',
  'short-boxed': 'short-boxed-beard',
  'corporate': 'corporate-beard',
  'anchor': 'anchor-beard',
};

const MAINTENANCE_BADGES = {
  low: {
    text: 'Nisko održavanje',
    color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: '⚡'
  },
  medium: {
    text: 'Srednje održavanje',
    color: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: '⏱️'
  },
  high: {
    text: 'Visoko održavanje',
    color: 'bg-rose-50 text-rose-700 border border-rose-200',
    icon: '✂️'
  }
};

const CATEGORY_ICONS = {
  corporate: '💼',
  casual: '😎',
  artistic: '🎨',
  modern: '✨',
  rugged: '🪓',
  trendy: '🔥',
  classic: '👔'
};

// Helper functions - moved outside component
const getStyleSlug = (style) => {
  const slug = style?.slug || style?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') || '';
  return STYLE_SLUG_MAP[slug] || slug;
};

const getImageSources = (style) => {
  const slug = getStyleSlug(style);
  const styleSlug = STYLE_IMAGE_MAP[slug] || slug;

  const dbImage = style?.image_url;

  // Priority: DB image > WebP sketches > SVG sketches > fallback
  return [
    dbImage,
    `/assets/sketches/${styleSlug}.webp`,
    `/assets/sketches/${slug}.webp`,
    `/assets/sketches/${styleSlug}.svg`,
    `/assets/sketches/${slug}.svg`,
    PLACEHOLDER_IMAGE
  ].filter(Boolean);
};

const getMaintenanceLevelBadge = (level) => {
  return MAINTENANCE_BADGES[level] || MAINTENANCE_BADGES.medium;
};

const getCategoryIcon = (category) => {
  return CATEGORY_ICONS[category] || '🧔';
};

/**
 * Beard Style Card Component
 * Displays a beard style with image, details, and actions
 * @param {BeardStyleCardProps} props
 */
const BeardStyleCard = ({ style, onFavoriteToggle, isFavorite = false, showScore = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Initialize with first available image
  useEffect(() => {
    const sources = getImageSources(style);
    setCurrentImageUrl(sources[0]);
    setImageLoaded(false);
    setImageError(false);
  }, [style]);

  // Handle image load error - try next source
  const handleImageError = useCallback(() => {
    const sources = getImageSources(style);
    const currentIndex = sources.indexOf(currentImageUrl);

    if (currentIndex < sources.length - 1) {
      setCurrentImageUrl(sources[currentIndex + 1]);
      setImageLoaded(false);
    } else {
      setImageError(true);
      setImageLoaded(true);
    }
  }, [style, currentImageUrl]);

  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(style.id);
  }, [onFavoriteToggle, style.id]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const maintenanceBadge = getMaintenanceLevelBadge(style?.maintenance_level);
  const styleCategory = style?.style_category || 'Classic';
  const styleTags = style?.tags || [];
  const growthTime = style?.growth_time_weeks || 0;

  return (
    <div className="group bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 border border-secondary-100">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-100 via-secondary-50 to-secondary-100 animate-pulse" />
        )}

        <img
          src={currentImageUrl}
          alt={`${style?.name || 'Beard style'} - stil brade`}
          loading="lazy"
          className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${
            currentImageUrl.endsWith('.svg') ? 'object-contain p-4' : 'object-cover'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Top overlay with score/favorite */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          {/* Favorite button */}
          {onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
              aria-pressed={isFavorite}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-lg scale-110'
                  : 'bg-white/80 text-secondary-400 hover:bg-white hover:text-rose-500 hover:scale-110'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {/* Score badge */}
          {showScore && style?.recommendation_score && (
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg backdrop-blur-md flex items-center gap-2">
              <span className="text-accent-400" aria-hidden="true">★</span>
              <span>{Math.round(style.recommendation_score)}% Match</span>
            </div>
          )}
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-200/80 via-slate-100/40 to-transparent" aria-hidden="true" />

        {/* Category badge on image */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white shadow-md text-secondary-700 text-xs font-medium">
            <span aria-hidden="true">{getCategoryIcon(style?.style_category)}</span>
            <span className="capitalize">{styleCategory}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-secondary-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {style?.name || 'Nepoznati stil'}
        </h3>

        {/* Description */}
        <p className="text-secondary-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {style?.description || 'Opis nije dostupan.'}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Maintenance badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${maintenanceBadge.color}`}>
            <span aria-hidden="true">{maintenanceBadge.icon}</span>
            {maintenanceBadge.text}
          </span>

          {/* Growth time */}
          {growthTime > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {growthTime} sedmica
            </span>
          )}
        </div>

        {/* Tags */}
        {styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5" role="list" aria-label="Tagovi">
            {styleTags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                role="listitem"
                className="px-2.5 py-1 bg-secondary-50 text-secondary-600 rounded-md text-xs font-medium hover:bg-secondary-100 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
            {styleTags.length > 3 && (
              <span className="px-2.5 py-1 bg-secondary-100 text-secondary-500 rounded-md text-xs font-medium">
                +{styleTags.length - 3} više
              </span>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Link
          to={`/styles/${style?.slug || style?.id}`}
          className="group/btn flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          aria-label={`Pogledaj detalje za ${style?.name || 'stil'}`}
        >
          <span>Pogledaj detalje</span>
          <svg
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(BeardStyleCard);
