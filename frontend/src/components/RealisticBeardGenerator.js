/**
 * RealisticBeardGenerator.js
 *
 * UI component that wires together the full generation pipeline:
 *   1. Fetch per-style config (neckPad, maskBlur) from backend
 *   2. detectAndGenerateMask with style-specific neckPad
 *   3. Backend → Replicate inpainting with per-style parameters
 *   4. Display result with BeforeAfterSlider comparison
 *
 * Features:
 *   - Progressive preview: fast 512px preview, then full 1024px
 *   - Strength slider: user-controlled intensity (0.5-1.0)
 *   - Before/After comparison slider
 *   - Quality indicator badge
 *
 * Props:
 *   userPhoto   {string}  - URL or base64 of the uploaded user photo
 *   style       {Object}  - beard style object with at least { slug, name }
 *   onClose     {Function} (optional) - callback to close/hide this panel
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { detectAndGenerateMask, generateFallbackMask } from '../utils/generateBeardMask';
import useVisualizationStore from '../context/useVisualizationStore';
import BeforeAfterSlider from './BeforeAfterSlider';
import { stylesAPI } from '../services/api';

const RealisticBeardGenerator = ({ userPhoto, style, onClose }) => {
  const imgRef = useRef(null);
  const [maskStatus, setMaskStatus] = useState('idle'); // 'idle'|'masking'|'done'|'failed'
  const [showComparison, setShowComparison] = useState(false);
  const [strengthValue, setStrengthValue] = useState(null); // null = auto (use per-style default)
  const [styleConfig, setStyleConfig] = useState(null);
  const [generationQuality, setGenerationQuality] = useState(null); // 'preview'|'full'

  const { generate, isGenerating, imageUrl, error, reset, isMock, quality: storeQuality } = useVisualizationStore();

  // ── Fetch per-style config on style change ────────────────────────────────
  useEffect(() => {
    if (!style?.slug) return;
    setStyleConfig(null);

    stylesAPI.getGenerationConfig(style.slug)
      .then((res) => {
        setStyleConfig(res.data);
        // Don't override user's explicit strength choice
        if (strengthValue === null) {
          setStrengthValue(null); // auto = per-style default
        }
      })
      .catch(() => {
        // Fallback defaults if endpoint isn't available
        setStyleConfig({ neckPad: 0.06, maskBlur: 3, strength: 0.9, guidance_scale: 7.5 });
      });
  }, [style?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core generation logic ─────────────────────────────────────────────────
  const handleGenerate = useCallback(async (requestedQuality = 'full') => {
    if (!imgRef.current || !style?.slug) return;

    reset();
    setShowComparison(false);
    setGenerationQuality(requestedQuality);

    // ── Step 1: Generate mask with per-style neckPad ──────────────────────
    setMaskStatus('masking');
    const neckPad = styleConfig?.neckPad ?? 0.06;
    const maskBlur = styleConfig?.maskBlur ?? 0;

    let maskBase64;
    try {
      maskBase64 = await detectAndGenerateMask(imgRef.current, {
        neckPad,
        blur: maskBlur,
        maskColor: 'white',
      });
    } catch (_) {
      maskBase64 = null;
    }

    if (!maskBase64) {
      const img = imgRef.current;
      maskBase64 = generateFallbackMask(
        img.naturalWidth  || img.width  || 512,
        img.naturalHeight || img.height || 512,
      );
      setMaskStatus('failed');
    } else {
      setMaskStatus('done');
    }

    // ── Step 2: Convert userPhoto URL → base64 if needed ──────────────────
    let imageBase64 = userPhoto;
    if (userPhoto && !userPhoto.startsWith('data:')) {
      try {
        const response = await fetch(userPhoto);
        const blob     = await response.blob();
        imageBase64    = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (_) { /* keep original URL */ }
    }

    // ── Step 3: Call backend with quality + optional strength override ─────
    const strengthOverride = strengthValue !== null ? strengthValue : undefined;
    await generate(imageBase64, maskBase64 || '', style.slug, {
      quality: requestedQuality,
      strengthOverride,
    });
  }, [userPhoto, style, generate, reset, styleConfig, strengthValue]);

  // ── Auto-show comparison when image arrives ───────────────────────────────
  useEffect(() => {
    if (imageUrl && userPhoto) {
      // Small delay so the image renders first
      const timer = setTimeout(() => setShowComparison(true), 300);
      return () => clearTimeout(timer);
    }
  }, [imageUrl, userPhoto]);

  // ── Render ────────────────────────────────────────────────────────────────
  const isWorking = maskStatus === 'masking' || isGenerating;
  const effectiveStrength = strengthValue ?? styleConfig?.strength ?? 0.9;

  // Strength label
  const getStrengthLabel = (val) => {
    if (val < 0.65) return 'Suptilno';
    if (val < 0.80) return 'Umjereno';
    if (val < 0.92) return 'Izrazito';
    return 'Maksimalno';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Realistična vizualizacija
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Zatvori"
          >
            ×
          </button>
        )}
      </div>

      {/* Style badge + quality indicator */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm text-gray-500">
          Stil: <span className="font-semibold text-gray-800">{style?.name}</span>
        </p>
        {generationQuality && imageUrl && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            generationQuality === 'preview'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {generationQuality === 'preview' ? 'Brzi pregled' : 'Puni kvalitet'}
          </span>
        )}
      </div>

      {/* Hidden image used by detectAndGenerateMask */}
      {userPhoto && (
        <img
          ref={imgRef}
          src={userPhoto}
          alt=""
          crossOrigin="anonymous"
          className="hidden"
        />
      )}

      {/* ── Strength Slider ──────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">
            Intenzitet brade
          </label>
          <span className="text-xs text-gray-500">
            {getStrengthLabel(effectiveStrength)} ({Math.round(effectiveStrength * 100)}%)
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="100"
          step="5"
          value={Math.round(effectiveStrength * 100)}
          onChange={(e) => setStrengthValue(Number(e.target.value) / 100)}
          disabled={isWorking}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>Suptilno</span>
          <span>Maksimalno</span>
        </div>
      </div>

      {/* ── Result / Comparison ───────────────────────────────────────────── */}
      <div className="mb-4">
        {showComparison && imageUrl && userPhoto ? (
          <BeforeAfterSlider
            beforeSrc={userPhoto}
            afterSrc={imageUrl}
            styleName={style?.name}
            compact
            showControls={false}
          />
        ) : (
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${style?.name} vizualizacija`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-400 p-6">
                {isWorking ? null : (
                  <>
                    <div className="text-5xl mb-3">🪞</div>
                    <p className="text-sm">Klikni "Generiši" da vidiš kako bi izgledao sa ovim stilom</p>
                  </>
                )}
              </div>
            )}

            {/* Loading overlay */}
            {isWorking && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-700">
                  {maskStatus === 'masking'
                    ? 'Analiziram lice...'
                    : generationQuality === 'preview'
                      ? 'Brzi pregled (15-20s)...'
                      : 'AI generiše sliku (30-60s)...'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison toggle (when image is ready) */}
      {imageUrl && userPhoto && (
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full text-xs text-gray-500 hover:text-gray-700 mb-3 flex items-center justify-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          {showComparison ? 'Sakrij poredjenje' : 'Uporedi prije/poslije'}
        </button>
      )}

      {/* Mask warning */}
      {maskStatus === 'failed' && !isGenerating && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
          Lice nije detektovano — generisanje koristi aproksimativnu masku.
        </p>
      )}

      {/* Mock badge */}
      {isMock && imageUrl && (
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-3">
          Test mod: prikazuje se demo slika. Dodaj REPLICATE_API_TOKEN za pravo generisanje.
        </p>
      )}

      {/* Cache hit info */}
      {imageUrl && storeQuality?.cached && (
        <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-3">
          ⚡ Učitano iz keša — bez dodatnog troška.
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {/* ── Action Buttons ─────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        {/* Preview button (fast) */}
        <button
          onClick={() => handleGenerate('preview')}
          disabled={isWorking || !userPhoto}
          className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white text-sm font-bold rounded-lg transition-colors"
          title="Brzi pregled: 512px, ~15s"
        >
          {isWorking && generationQuality === 'preview' ? 'Generiše...' : '⚡ Brzi pregled'}
        </button>

        {/* Full quality button */}
        <button
          onClick={() => handleGenerate('full')}
          disabled={isWorking || !userPhoto}
          className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white text-sm font-bold rounded-lg transition-colors"
          title="Puni kvalitet: 1024px, ~55s"
        >
          {isWorking && generationQuality === 'full'
            ? 'Generiše...'
            : imageUrl && generationQuality === 'preview'
              ? '🎯 Puni kvalitet'
              : imageUrl
                ? 'Generiši ponovo'
                : '🎯 Generiši'}
        </button>

        {/* Download */}
        {imageUrl && (
          <a
            href={imageUrl}
            download={`beard-${style?.slug}.png`}
            className="px-3 py-2.5 border border-gray-300 hover:border-gray-400 rounded-lg text-gray-700
                       font-semibold transition-colors text-center flex items-center"
            title="Preuzmi sliku"
          >
            ↓
          </a>
        )}
      </div>

      {!userPhoto && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Prvo uploadaj svoju fotografiju
        </p>
      )}

      {/* Per-style info (debug/info) */}
      {styleConfig && (
        <div className="mt-3 text-xs text-gray-400 text-center">
          neckPad: {styleConfig.neckPad} · guidance: {styleConfig.guidance_scale} · blur: {styleConfig.maskBlur}px
        </div>
      )}
    </div>
  );
};

export default RealisticBeardGenerator;
