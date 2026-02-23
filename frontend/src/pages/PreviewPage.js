import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { stylesAPI, userAPI } from '../services/api';
import useAuthStore from '../context/useAuthStore';

// Image mapping for style slugs
const STYLE_IMAGE_MAP = {
  'stubble': 'stubble-3day',
  'stubble-3-day': 'stubble-3day',
  'short-boxed': 'short-boxed-beard',
  'corporate': 'corporate-beard',
  'anchor': 'anchor-beard',
};

// Get style slug from style object
const getStyleSlug = (style) => {
  const slug = style?.slug || style?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') || '';
  return slug;
};

// Get image sources with fallback chain
const getImageSources = (style) => {
  const slug = getStyleSlug(style);
  const styleSlug = STYLE_IMAGE_MAP[slug] || slug;
  const dbImage = style?.image_url;

  // Priority: DB image > WebP > SVG > fallback
  return [
    dbImage,
    `/assets/sketches/${styleSlug}.webp`,
    `/assets/sketches/${slug}.webp`,
    `/assets/sketches/${styleSlug}.svg`,
    `/assets/sketches/${slug}.svg`,
    `/assets/sketches/full-beard.svg`
  ].filter(Boolean);
};

// Style Image Component with fallback
const StyleImage = ({ style, className = '', size = 'large' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sources = getImageSources(style);

  useEffect(() => {
    setCurrentIndex(0);
    setImageLoaded(false);
  }, [style?.id, style?.slug]);

  const handleError = () => {
    if (currentIndex < sources.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setImageLoaded(false);
    }
  };

  const sizeClasses = size === 'small' ? 'w-16 h-16' : 'w-full h-full';
  const isSvg = sources[currentIndex]?.endsWith('.svg');

  return (
    <img
      src={sources[currentIndex]}
      alt={style?.name || 'Beard style'}
      className={`${sizeClasses} ${isSvg ? 'object-contain p-2' : 'object-cover'} ${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setImageLoaded(true)}
      onError={handleError}
    />
  );
};

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { styleId, slug } = useParams();
  const { isAuthenticated } = useAuthStore();

  const [recommendations, setRecommendations] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [stylesLoading, setStylesLoading] = useState(true);
  const [stylesError, setStylesError] = useState(null);

  const loadPopularStyles = useCallback(async () => {
    setStylesLoading(true);
    setStylesError(null);
    try {
      const response = await stylesAPI.getPopular(12);
      const styles = response.data?.styles || [];
      setRecommendations(styles);
      if (styles.length > 0) {
        setSelectedStyle(styles[0]);
      } else {
        setStylesError('Nema dostupnih stilova.');
      }
    } catch (err) {
      console.error('Error loading styles:', err);
      setStylesError('Greška pri učitavanju stilova. Pokušajte ponovo.');
      setRecommendations([]);
    } finally {
      setStylesLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const response = await userAPI.getFavorites();
      const favorites = response.data.favorites || response.data || [];
      const favSet = new Set(favorites.map(fav => fav.beard_style_id));
      setFavorites(favSet);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setFavorites(new Set());
    }
  }, []);

  // Load specific style if styleId or slug is provided
  useEffect(() => {
    const loadSpecificStyle = async () => {
      try {
        if (styleId) {
          // Load by ID
          const response = await stylesAPI.getById(styleId);
          setSelectedStyle(response.data);
        } else if (slug) {
          // Load by slug
          const response = await stylesAPI.getBySlug(slug);
          setSelectedStyle(response.data);
        }
      } catch (err) {
        console.error('Error loading specific style:', err);
      }
    };

    if (styleId || slug) {
      loadSpecificStyle();
      loadPopularStyles(); // Also load related styles
    } else if (location.state?.recommendations) {
      setRecommendations(location.state.recommendations);
      if (location.state.recommendations.length > 0) {
        setSelectedStyle(location.state.recommendations[0]);
      }
    } else {
      // If no recommendations passed, load popular styles
      loadPopularStyles();
    }

    if (isAuthenticated) {
      loadFavorites();
    }
  }, [styleId, slug, location.state, isAuthenticated, loadPopularStyles, loadFavorites]);

  const handleToggleFavorite = async (styleId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (favorites.has(styleId)) {
        await userAPI.removeFavorite(styleId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(styleId);
          return newSet;
        });
      } else {
        await userAPI.addFavorite(styleId, '');
        setFavorites(prev => new Set([...prev, styleId]));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMaintenanceLevelLabel = (level) => {
    const labels = {
      low: { text: 'Nisko', color: 'text-green-600 bg-green-50' },
      medium: { text: 'Srednje', color: 'text-yellow-600 bg-yellow-50' },
      high: { text: 'Visoko', color: 'text-red-600 bg-red-50' }
    };
    return labels[level] || labels.medium;
  };

  const getStyleCategoryLabel = (category) => {
    const labels = {
      corporate: { text: 'Korporativno', icon: '💼' },
      casual: { text: 'Casual', icon: '👔' },
      artistic: { text: 'Artistički', icon: '🎨' },
      modern: { text: 'Moderno', icon: '✨' },
      rugged: { text: 'Rustikalno', icon: '🏔️' },
      trendy: { text: 'Trendi', icon: '🔥' }
    };
    return labels[category] || { text: category, icon: '⭐' };
  };

  if (stylesLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Učitavanje stilova...</h2>
          <p className="text-gray-600">Molimo sačekajte</p>
        </div>
      </div>
    );
  }

  if (stylesError || !selectedStyle) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-lg mb-4">{stylesError || 'Stilovi nisu učitani.'}</p>
          <button
            onClick={loadPopularStyles}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering with selectedStyle:', selectedStyle);

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {location.state?.recommendations ? 'Preporučeni Stilovi' : 'Popularni Stilovi'}
            </h1>
            <Link
              to="/gallery"
              className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold"
            >
              Pregledaj sve →
            </Link>
          </div>
          {location.state?.recommendations && (
            <p className="text-gray-600">
              Na osnovu vašeg upitnika, pronašli smo {recommendations.length} stilova koji vam savršeno odgovaraju!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main preview - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Style image */}
              <div className="relative aspect-square max-h-[500px] mx-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <StyleImage style={selectedStyle} size="large" className="max-h-full max-w-full" />
                </div>
                {selectedStyle.recommendation_score && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                    {Math.round(selectedStyle.recommendation_score)}% Match
                  </div>
                )}
                <button
                  onClick={() => handleToggleFavorite(selectedStyle.id)}
                  disabled={loading}
                  className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {favorites.has(selectedStyle.id) ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Style details */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedStyle.name}
                    </h2>
                    <p className="text-gray-600">{selectedStyle.description}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMaintenanceLevelLabel(selectedStyle.maintenance_level).color}`}>
                    Održavanje: {getMaintenanceLevelLabel(selectedStyle.maintenance_level).text}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-600">
                    {getStyleCategoryLabel(selectedStyle.style_category).icon} {getStyleCategoryLabel(selectedStyle.style_category).text}
                  </span>
                  {selectedStyle.growth_time_weeks > 0 && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-50 text-purple-600">
                      ⏱️ {selectedStyle.growth_time_weeks} sedmica rasta
                    </span>
                  )}
                </div>

                {/* Tags */}
                {selectedStyle.tags && Array.isArray(selectedStyle.tags) && selectedStyle.tags.filter(t => t).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Karakteristike:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStyle.tags.filter(tag => tag).map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {selectedStyle.instructions && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Uputstva za održavanje:</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedStyle.instructions}
                    </p>
                  </div>
                )}

                {/* Recommended face types */}
                {selectedStyle.recommended_face_type_names && selectedStyle.recommended_face_type_names.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Preporučeno za oblik lica:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStyle.recommended_face_type_names.filter(name => name).map((facetype, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                          👤 {facetype}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-8 pt-6 border-t">
                  <Link
                    to="/upload"
                    className="w-full block text-center py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                  >
                    📸 Probaj ovaj stil sa svojom slikom
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {location.state?.recommendations ? 'Ostale preporuke' : 'Drugi stilovi'}
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {recommendations.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedStyle?.id === style.id
                        ? 'bg-red-50 border-2 border-red-600'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <StyleImage style={style} size="small" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 mb-1">
                          {style.name}
                        </div>
                        <div className="text-sm text-gray-600 truncate mb-2">
                          {style.description}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${getMaintenanceLevelLabel(style.maintenance_level).color}`}>
                            {getMaintenanceLevelLabel(style.maintenance_level).text}
                          </span>
                          {style.recommendation_score && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                              {Math.round(style.recommendation_score)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Link
                  to="/questionnaire"
                  className="w-full block text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all"
                >
                  🔄 Pokrenite upitnik ponovo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
