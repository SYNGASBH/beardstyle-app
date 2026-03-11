/**
 * useVisualizationStore.js
 *
 * Zustand store for realistic beard visualization (Korak 4).
 *
 * Tracks the full lifecycle of a Replicate inpainting request:
 *   idle → generating → done (imageUrl) | error
 *
 * Usage:
 *   const { generate, isGenerating, imageUrl, error, reset } = useVisualizationStore();
 *
 *   // Trigger generation (imageBase64 + maskBase64 come from detectAndGenerateMask)
 *   await generate(imageBase64, maskBase64, 'full-beard');
 */

import { create } from 'zustand';
import { stylesAPI } from '../services/api';

const useVisualizationStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  isGenerating:   false,
  imageUrl:       null,   // URL of the generated image returned by Replicate
  styleSlug:      null,   // which style was last generated
  error:          null,
  isMock:         false,  // true when backend returned mock data

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Run the full pipeline: send imageBase64 + maskBase64 to backend,
   * wait for Replicate, store the result URL.
   *
   * @param {string} imageBase64 - User photo (base64 or data-URL)
   * @param {string} maskBase64  - Beard mask from detectAndGenerateMask()
   * @param {string} styleSlug   - e.g. 'full-beard', 'stubble'
   */
  generate: async (imageBase64, maskBase64, styleSlug) => {
    // Don't double-fire
    if (get().isGenerating) return;

    set({ isGenerating: true, error: null, imageUrl: null, styleSlug, isMock: false });

    try {
      const response = await stylesAPI.generateRealistic(imageBase64, maskBase64, styleSlug);
      const { imageUrl, isMock } = response.data;

      set({
        isGenerating: false,
        imageUrl,
        isMock: isMock ?? false,
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
  reset: () => set({ isGenerating: false, imageUrl: null, error: null, styleSlug: null, isMock: false }),
}));

export default useVisualizationStore;
