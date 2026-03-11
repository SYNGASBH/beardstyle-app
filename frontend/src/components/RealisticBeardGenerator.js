/**
 * RealisticBeardGenerator.js
 *
 * UI component that wires together all 4 steps:
 *   1. detectAndGenerateMask  (generateBeardMask.js  — Korak 1)
 *   2+3. stylesAPI.generateRealistic → backend → Replicate  (Korak 2+3)
 *   4.  useVisualizationStore + loading/result UI            (Korak 4)
 *
 * Props:
 *   userPhoto   {string}  - URL or base64 of the uploaded user photo
 *   style       {Object}  - beard style object with at least { slug, name }
 *   onClose     {Function} (optional) - callback to close/hide this panel
 */

import React, { useRef, useState, useCallback } from 'react';
import { detectAndGenerateMask, generateFallbackMask } from '../utils/generateBeardMask';
import useVisualizationStore from '../context/useVisualizationStore';

const RealisticBeardGenerator = ({ userPhoto, style, onClose }) => {
  const imgRef = useRef(null);
  const [maskStatus, setMaskStatus] = useState('idle'); // 'idle'|'masking'|'done'|'failed'

  const { generate, isGenerating, imageUrl, error, reset, isMock } = useVisualizationStore();

  const handleGenerate = useCallback(async () => {
    if (!imgRef.current || !style?.slug) return;

    reset();

    // ── Step 1: Generate mask from face landmarks ────────────────────────────
    setMaskStatus('masking');
    let maskBase64;
    try {
      maskBase64 = await detectAndGenerateMask(imgRef.current, {
        neckPad:   0.06,
        blur:      8,
        maskColor: 'white',
      });
    } catch (_) {
      maskBase64 = null;
    }

    if (!maskBase64) {
      // WebGL/MediaPipe nije dostupan — koristimo fallback mask (statična elipsa brade)
      const img = imgRef.current;
      maskBase64 = generateFallbackMask(
        img.naturalWidth  || img.width  || 512,
        img.naturalHeight || img.height || 512,
      );
      setMaskStatus('failed'); // još uvijek pokazujemo warning korisniku
    } else {
      setMaskStatus('done');
    }

    // ── Step 2+3: Convert userPhoto URL → base64, call backend ──────────────
    let imageBase64 = userPhoto;

    // If userPhoto is a URL (not already base64), fetch it as base64
    if (userPhoto && !userPhoto.startsWith('data:') && !userPhoto.startsWith('data:')) {
      try {
        const response = await fetch(userPhoto);
        const blob     = await response.blob();
        imageBase64    = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (_) {
        // keep original URL — backend will handle the error
      }
    }

    // ── Step 4: Zustand action → API call → store result ────────────────────
    await generate(imageBase64, maskBase64 || '', style.slug);
  }, [userPhoto, style, generate, reset]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const isWorking = maskStatus === 'masking' || isGenerating;

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

      {/* Style badge */}
      <p className="text-sm text-gray-500 mb-4">
        Stil: <span className="font-semibold text-gray-800">{style?.name}</span>
      </p>

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

      {/* Result or placeholder */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
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
                ? 'Analiziram lice…'
                : 'AI generiše sliku (30–60s)…'}
            </p>
          </div>
        )}
      </div>

      {/* Mask warning */}
      {maskStatus === 'failed' && !isGenerating && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
          Lice nije detektovano — generisanje će se nastaviti bez precizne maske.
        </p>
      )}

      {/* Mock badge */}
      {isMock && imageUrl && (
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mb-3">
          Test mod: prikazuje se demo slika. Dodaj REPLICATE_API_TOKEN za pravo generisanje.
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={isWorking || !userPhoto}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                     text-white font-bold rounded-lg transition-colors"
        >
          {isWorking ? 'Generišem…' : imageUrl ? 'Generiši ponovo' : 'Generiši'}
        </button>

        {imageUrl && (
          <a
            href={imageUrl}
            download={`beard-${style?.slug}.png`}
            className="px-4 py-3 border border-gray-300 hover:border-gray-400 rounded-lg text-gray-700
                       font-semibold transition-colors text-center"
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
    </div>
  );
};

export default RealisticBeardGenerator;
