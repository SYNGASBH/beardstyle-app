/**
 * useVisualizationStore.js
 *
 * Zustand store for realistic beard visualization (Korak 4).
 *
 * Tracks the full lifecycle of a Replicate inpainting request:
 *   idle → generating → done (imageUrl) | error
 *
 * Supports:
 *   - Progressive quality ('preview' / 'full')
 *   - Strength override from user slider
 *   - Cache hit detection
 *   - Hair color detection result
 *
 * Usage:
 *   const { generate, isGenerating, imageUrl, error, reset } = useVisualizationStore();
 *   await generate(imageBase64, maskBase64, 'full-beard', { quality: 'preview' });
 */

import { create } from 'zustand';
import { stylesAPI } from '../services/api';

const useVisualizationStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  isGenerating:      false,
  imageUrl:          null,      // URL of the generated image returned by Replicate
  styleSlug:         null,      // which style was last generated
  error:             null,
  isMock:            false,     // true when backend returned mock data
  quality:           null,      // { quality: 'preview'|'full', cached: boolean }
  detectedHairColor: null,      // detected from backend (e.g. 'dark brown')
  parameters:        null,      // { strength, guidance_scale, num_inference_steps, targetSize }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Run the full pipeline: send imageBase64 + maskBase64 to backend,
   * wait for Replicate, store the result URL.
   *
   * @param {string} imageBase64    - User photo (base64 or data-URL)
   * @param {string} maskBase64     - Beard mask from detectAndGenerateMask()
   * @param {string} styleSlug      - e.g. 'full-beard', 'stubble'
   * @param {Object} [options]
   * @param {string} [options.quality='full']      - 'preview' or 'full'
   * @param {number} [options.strengthOverride]     - User-controlled 0.5-1.0
   */
  generate: async (imageBase64, maskBase64, styleSlug, options = {}) => {
    // Don't double-fire
    if (get().isGenerating) return;

    const { quality = 'full', strengthOverride } = options;

    set({
      isGenerating: true,
      error: null,
      imageUrl: null,
      styleSlug,
      isMock: false,
      quality: null,
      detectedHairColor: null,
      parameters: null,
    });

    try {
      const response = await stylesAPI.generateRealistic(
        imageBase64, maskBase64, styleSlug, { quality, strengthOverride }
      );

      const {
        imageUrl,
        isMock,
        quality: resultQuality,
        cached,
        detectedHairColor,
        parameters,
      } = response.data;

      set({
        isGenerating: false,
        imageUrl,
        isMock: isMock ?? false,
        quality: { quality: resultQuality || quality, cached: cached ?? false },
        detectedHairColor: detectedHairColor || null,
        parameters: parameters || null,
      });
    } catch (err) {
      // Backend errorHandler vraća { error: { message, status, stack } } — izvuci string
      const errData = err.response?.data?.error;
      const message =
        (typeof errData === 'object' ? errData?.message : errData) ||
        err.message ||
        'Generisanje nije uspjelo. Pokušajte ponovo.';

      set({ isGenerating: false, error: message });
    }
  },

  /** Clear result and error — call before starting a new generation */
  reset: () => set({
    isGenerating: false,
    imageUrl: null,
    error: null,
    styleSlug: null,
    isMock: false,
    quality: null,
    detectedHairColor: null,
    parameters: null,
  }),
}));

export default useVisualizationStore;
