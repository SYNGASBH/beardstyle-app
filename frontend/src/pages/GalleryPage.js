import React, { useState, useEffect, useCallback } from 'react';
import { stylesAPI, userAPI } from '../services/api';
import useAuthStore from '../context/useAuthStore';
import BeardStyleCard from '../components/BeardStyleCard';

const GalleryPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [styles, setStyles] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    category: '',
    maintenanceLevel: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const loadStyles = useCallback(async () => {
    try {
      // Load all styles, filtering is done client-side
      const response = await stylesAPI.getAll({});
      const allStyles = response.data.styles || response.data || [];
      setStyles(allStyles);
    } catch (err) {
      console.error('Error loading styles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const response = await userAPI.getFavorites();
      const favs = response.data.favorites || response.data || [];
      const favSet = new Set(favs.map(fav => fav.beard_style_id));
      setFavorites(favSet);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }, []);

  useEffect(() => {
    loadStyles();
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, loadStyles, loadFavorites]);

  const handleToggleFavorite = async (styleId) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

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
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', maintenanceLevel: '', search: '' });
  };

  const filteredStyles = styles.filter(style => {
    if (filters.category && style.style_category !== filters.category) return false;
    if (filters.maintenanceLevel && style.maintenance_level !== filters.maintenanceLevel) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return style.name.toLowerCase().includes(searchLower) ||
             style.description.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const hasActiveFilters = filters.category || filters.maintenanceLevel || filters.search;

  // Categories with icons
  const categories = [
    { value: '', label: 'Sve kategorije', icon: '🧔' },
    { value: 'corporate', label: 'Corporate', icon: '💼' },
    { value: 'casual', label: 'Casual', icon: '😎' },
    { value: 'artistic', label: 'Artistic', icon: '🎨' },
    { value: 'modern', label: 'Modern', icon: '✨' },
    { value: 'rugged', label: 'Rugged', icon: '🪓' },
    { value: 'trendy', label: 'Trendy', icon: '🔥' },
  ];

  // Maintenance levels
  const maintenanceLevels = [
    { value: '', label: 'Svi nivoi', icon: '⚙️' },
    { value: 'low', label: 'Nisko odrzavanje', icon: '⚡' },
    { value: 'medium', label: 'Srednje odrzavanje', icon: '⏱️' },
    { value: 'high', label: 'Visoko odrzavanje', icon: '✂️' },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-secondary-50 to-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
            <span className="text-3xl">🧔</span>
          </div>
          <div className="text-xl font-semibold text-secondary-900 mb-2">Ucitavanje stilova...</div>
          <div className="text-secondary-500">Molimo sacekajte</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">✂️</span>
            <h1 className="text-4xl md:text-5xl font-bold">Galerija Stilova</h1>
          </div>
          <p className="text-primary-100 text-lg md:text-xl max-w-2xl">
            Istrazite nasu kolekciju od {styles.length} profesionalnih stilova brade.
            Pronadjite savrseni stil za vase lice.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Search & Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-secondary-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Pretrazite stilove brade..."
              className="w-full pl-12 pr-4 py-4 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-secondary-600 mb-2">Kategorija</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Maintenance Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-secondary-600 mb-2">Odrzavanje</label>
              <select
                value={filters.maintenanceLevel}
                onChange={(e) => handleFilterChange('maintenanceLevel', e.target.value)}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer"
              >
                {maintenanceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.icon} {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle & Clear */}
            <div className="flex items-end gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-secondary-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-secondary-600 hover:text-secondary-900 bg-secondary-100 hover:bg-secondary-200 rounded-xl transition-all font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Ocisti filtere
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-secondary-600">
            Prikazano <span className="font-semibold text-secondary-900">{filteredStyles.length}</span> od <span className="font-semibold text-secondary-900">{styles.length}</span> stilova
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                  {categories.find(c => c.value === filters.category)?.icon} {filters.category}
                  <button onClick={() => handleFilterChange('category', '')} className="ml-1 hover:text-primary-900">×</button>
                </span>
              )}
              {filters.maintenanceLevel && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                  {maintenanceLevels.find(l => l.value === filters.maintenanceLevel)?.icon} {filters.maintenanceLevel}
                  <button onClick={() => handleFilterChange('maintenanceLevel', '')} className="ml-1 hover:text-amber-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Styles Grid */}
        {filteredStyles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-secondary-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-2">Nema rezultata</h3>
            <p className="text-secondary-500 mb-6">Pokusajte sa drugim filterima ili pretragom</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resetuj filtere
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 pb-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredStyles.map((style, index) => (
              <div
                key={style.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BeardStyleCard
                  style={style}
                  onFavoriteToggle={handleToggleFavorite}
                  isFavorite={favorites.has(style.id)}
                  showScore={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
