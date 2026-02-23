const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class DalleService {
  /**
   * Generate beard style visualization using DALL-E
   * @param {string} imagePath - Path to user's face image
   * @param {Object} style - Beard style details
   * @param {Object} aiAnalysis - AI face analysis results
   * @returns {Promise<Object>} Generated image details
   */
  static async generateBeardVisualization(imagePath, style, aiAnalysis) {
    try {
      // Use mock data if explicitly enabled
      if (process.env.USE_MOCK_AI === 'true') {
        console.log('🎭 Using MOCK DALL-E generation');
        return this.getMockVisualization(style);
      }

      // Read user's face image
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Determine image type
      const ext = path.extname(imagePath).toLowerCase();
      const imageTypeMap = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
      };
      const mediaType = imageTypeMap[ext] || 'image/jpeg';

      // Create detailed prompt for beard visualization
      const prompt = this.createVisualizationPrompt(style, aiAnalysis);

      console.log(`🎨 Generating beard visualization for style: ${style.name}`);

      // Call DALL-E API with image variation/edit
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      const generatedImageUrl = response.data[0].url;

      // Download and save the generated image
      const savedImagePath = await this.downloadAndSaveImage(generatedImageUrl, imagePath);

      return {
        success: true,
        imageUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${savedImagePath}`,
        localPath: savedImagePath,
        model: 'dall-e-3',
        prompt: prompt,
        generatedAt: new Date().toISOString(),
        styleId: style.id,
        styleName: style.name
      };

    } catch (error) {
      console.error('DALL-E API error:', error);

      // Fallback to mock data if API fails
      console.log('⚠️ DALL-E API failed - falling back to mock visualization');
      return this.getMockVisualization(style);
    }
  }

  /**
   * Create detailed prompt for DALL-E beard visualization
   * Uses graphite pencil sketch style for neutral, professional appearance
   * @param {Object} style - Beard style details
   * @param {Object} aiAnalysis - AI face analysis
   * @returns {string} DALL-E prompt
   */
  static createVisualizationPrompt(style, aiAnalysis) {
    // Master prompt - graphite pencil sketch style
    const masterPrompt = `Technical graphite pencil sketch of a male beard style, front-facing view.
Minimalist illustration focused only on the beard shape and contours.
No facial features, no eyes, no hair, no emotions.
Clean white background.
Precise jawline, cheek line, neckline clearly visible.
Soft graphite shading to show beard density and volume.
Professional barber reference style, instructional illustration.
High contrast, sharp edges, realistic proportions.
No color, black and gray pencil only.
Centered composition.`;

    // Style-specific details
    const stylePrompts = {
      'stubble': 'Very short beard length, even distribution across jaw and cheeks. Soft, light graphite shading to indicate low density. Clean cheek line, natural neckline.',
      'full-beard': 'Medium to full length beard with natural volume. Dense graphite shading showing thickness and fullness. Clearly defined cheek line and strong jaw contour. Beard covers chin, jaw, and cheeks evenly.',
      'clean-shaven': 'Only jawline and neck outline visible. No beard hair, smooth skin indicated with very light shading. Instructional reference illustration showing jaw shape.',
      'short-boxed': 'Clearly defined sharp cheek line and straight neckline. Short, evenly trimmed beard with controlled volume. Medium graphite shading to show uniform density. Geometric, precise edges.',
      'corporate': 'Short to medium length beard with precise symmetry. Clean edges, conservative shape. Moderate shading, no rugged texture. Premium, polished appearance.',
      'goatee': 'Chin beard connected to mustache forming rounded shape. Clean shaven cheeks clearly visible. Medium graphite shading on chin area only. Clear separation between beard and cheek area.',
      'van-dyke': 'Pointed chin beard DISCONNECTED from styled mustache. Visible gap between mustache and chin beard. Elegant refined shape, clean shaven cheeks.',
      'balbo': 'Disconnected mustache and chin beard, NO sideburns. Floating chin beard with soul patch connecting to chin. Styled mustache above with gap between. Clean cheeks and jaw sides visible.',
      'circle': 'Rounded goatee connecting mustache and chin beard in circular shape. Clean shaven cheeks, smooth rounded contour. Symmetrical circular appearance.',
      'ducktail': 'Full beard with pointed bottom resembling duck tail shape. Longer at chin tapering to distinct point. Full coverage on sides with triangular bottom. Dense graphite shading showing thickness.',
      'garibaldi': 'Wide thick rounded full beard with impressive length. Natural untrimmed bottom edge, wild texture. Impressive volume and width, rounded bottom shape.',
      'mutton': 'Thick prominent sideburns extending down to jawline. NO chin beard - chin area is clean shaven. Wide flared sideburns, vintage style appearance.',
      'anchor': 'Anchor-shaped chin beard with thin soul patch. Pointed chin beard extending along jawline edges. Styled mustache completing the anchor shape. Clean cheeks.',
      'chin-strap': 'Thin beard line following jawline from ear to ear. No cheek coverage, clean defined stripe along jaw only. Connected to sideburns at both ends.',
      'beardstache': 'Prominent thick statement mustache as focal point. Full beard kept noticeably shorter than mustache. Mustache is the star of the look, bold masculine style.'
    };

    // Find matching style prompt
    let styleDetail = '';
    const styleLower = style.name.toLowerCase();
    for (const [key, value] of Object.entries(stylePrompts)) {
      if (styleLower.includes(key)) {
        styleDetail = value;
        break;
      }
    }

    // If no specific match, use generic based on maintenance level
    if (!styleDetail) {
      if (style.maintenance_level === 'Low') {
        styleDetail = 'Natural, slightly rugged beard style with organic shape. Medium density shading.';
      } else if (style.maintenance_level === 'High') {
        styleDetail = 'Precisely trimmed beard with sharp defined edges. Clean, geometric appearance.';
      } else {
        styleDetail = 'Well-maintained beard with balanced proportions. Professional, groomed appearance.';
      }
    }

    return `${masterPrompt}\n\nStyle: ${style.name}.\n${styleDetail}`;
  }

  /**
   * Download and save generated image
   * @param {string} imageUrl - DALL-E generated image URL
   * @param {string} originalImagePath - Original user image path for naming
   * @returns {Promise<string>} Local path to saved image
   */
  static async downloadAndSaveImage(imageUrl, originalImagePath) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      // Create unique filename for generated image
      const timestamp = Date.now();
      const originalName = path.basename(originalImagePath, path.extname(originalImagePath));
      const filename = `generated-${originalName}-${timestamp}.png`;
      const filepath = path.join('uploads', filename);

      // Save image to disk
      await fs.writeFile(filepath, response.data);

      console.log(`💾 Saved generated image: ${filepath}`);
      return filepath;

    } catch (error) {
      console.error('Error downloading/saving generated image:', error);
      throw new Error('Failed to save generated image');
    }
  }

  /**
   * Get mock visualization for testing
   * @param {Object} style - Beard style details
   * @returns {Object} Mock visualization data
   */
  static getMockVisualization(style) {
    return {
      success: true,
      imageUrl: `/assets/mock-beard-${style.slug || 'default'}.jpg`,
      localPath: `uploads/mock-${style.id}.jpg`,
      model: 'mock-dall-e',
      prompt: `Mock visualization for ${style.name}`,
      generatedAt: new Date().toISOString(),
      styleId: style.id,
      styleName: style.name,
      isMock: true
    };
  }

  /**
   * Check if DALL-E service is available
   * @returns {boolean} True if API key is configured
   */
  static isAvailable() {
    return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
  }
}

module.exports = DalleService;