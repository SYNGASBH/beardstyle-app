/**
 * Beard Style Prompt Generator
 *
 * Combines locked prompt with style-specific prompt blocks
 * for AI image generation (Midjourney, DALL-E, Stable Diffusion)
 */

const fs = require('fs');
const path = require('path');

// Load batch data
const batchDataPath = path.join(__dirname, '..', 'data', 'beard-styles-batch.json');
const batchData = JSON.parse(fs.readFileSync(batchDataPath, 'utf8'));

/**
 * Generate full prompt for a specific style
 * @param {string} styleId - Style ID (e.g., 'full-beard')
 * @returns {object} - Full prompt and negative prompt
 */
function generatePrompt(styleId) {
  const style = batchData.styles.find(s => s.id === styleId);

  if (!style) {
    throw new Error(`Style not found: ${styleId}`);
  }

  const fullPrompt = `${batchData.locked_prompt}

${style.prompt_block_3}`;

  return {
    styleId: style.id,
    styleName: style.name,
    prompt: fullPrompt,
    negative_prompt: batchData.negative_prompt,
    metadata: {
      maintenance_level: style.maintenance.level,
      growth_weeks: style.growth_weeks,
      difficulty: style.difficulty,
      face_shapes_ideal: style.face_shapes_ideal
    }
  };
}

/**
 * Generate prompts for all styles
 * @returns {array} - Array of all prompts
 */
function generateAllPrompts() {
  return batchData.styles.map(style => generatePrompt(style.id));
}

/**
 * Generate prompts for test phase (first 3 styles)
 * @returns {array} - Array of test prompts
 */
function generateTestPrompts() {
  return batchData.generation_order.phase_1_test.map(id => generatePrompt(id));
}

/**
 * Generate prompts for batch phase (remaining styles)
 * @returns {array} - Array of batch prompts
 */
function generateBatchPrompts() {
  return batchData.generation_order.phase_2_batch.map(id => generatePrompt(id));
}

/**
 * Export prompts to text files for easy copy-paste
 * @param {string} outputDir - Output directory
 */
function exportPromptsToFiles(outputDir = './prompts') {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Export all prompts
  const allPrompts = generateAllPrompts();

  allPrompts.forEach(promptData => {
    const filename = `${promptData.styleId}.txt`;
    const content = `=== ${promptData.styleName} ===

POSITIVE PROMPT:
${promptData.prompt}

---

NEGATIVE PROMPT:
${promptData.negative_prompt}

---

METADATA:
- Maintenance: ${promptData.metadata.maintenance_level}
- Growth Time: ${promptData.metadata.growth_weeks} weeks
- Difficulty: ${promptData.metadata.difficulty}
- Ideal Face Shapes: ${promptData.metadata.face_shapes_ideal.join(', ')}
`;

    fs.writeFileSync(path.join(outputDir, filename), content);
    console.log(`✓ Exported: ${filename}`);
  });

  // Export master file with all prompts
  const masterContent = allPrompts.map(p => `
================================================================================
${p.styleName.toUpperCase()} (${p.styleId})
================================================================================

POSITIVE PROMPT:
${p.prompt}

NEGATIVE PROMPT:
${p.negative_prompt}

`).join('\n');

  fs.writeFileSync(path.join(outputDir, '_ALL_PROMPTS.txt'), masterContent);
  console.log(`\n✓ Master file exported: _ALL_PROMPTS.txt`);

  // Export JSON version
  fs.writeFileSync(
    path.join(outputDir, '_all_prompts.json'),
    JSON.stringify(allPrompts, null, 2)
  );
  console.log(`✓ JSON file exported: _all_prompts.json`);
}

/**
 * Get Midjourney-formatted prompt
 * @param {string} styleId - Style ID
 * @returns {string} - Midjourney-ready prompt
 */
function getMidjourneyPrompt(styleId) {
  const { prompt, negative_prompt } = generatePrompt(styleId);

  // Midjourney format with parameters
  return `${prompt} --style raw --no ${negative_prompt.split(', ').slice(0, 10).join(', ')} --ar 1:1 --v 6`;
}

/**
 * Get DALL-E formatted prompt
 * @param {string} styleId - Style ID
 * @returns {string} - DALL-E-ready prompt
 */
function getDallEPrompt(styleId) {
  const { prompt } = generatePrompt(styleId);

  // DALL-E prefers positive-only, descriptive prompts
  return prompt;
}

/**
 * Get Stable Diffusion formatted prompt
 * @param {string} styleId - Style ID
 * @returns {object} - SD-ready prompt object
 */
function getStableDiffusionPrompt(styleId) {
  const { prompt, negative_prompt } = generatePrompt(styleId);

  return {
    prompt: prompt,
    negative_prompt: negative_prompt,
    width: 800,
    height: 800,
    steps: 30,
    cfg_scale: 7.5,
    sampler: "DPM++ 2M Karras"
  };
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const styleId = args[1];

  switch (command) {
    case 'single':
      if (!styleId) {
        console.error('Usage: node generate-prompts.js single <style-id>');
        process.exit(1);
      }
      console.log(JSON.stringify(generatePrompt(styleId), null, 2));
      break;

    case 'test':
      console.log('=== TEST PHASE PROMPTS ===\n');
      generateTestPrompts().forEach(p => {
        console.log(`--- ${p.styleName} ---`);
        console.log(p.prompt);
        console.log('\n');
      });
      break;

    case 'all':
      console.log(JSON.stringify(generateAllPrompts(), null, 2));
      break;

    case 'export':
      const outputDir = styleId || './prompts';
      exportPromptsToFiles(outputDir);
      break;

    case 'midjourney':
      if (!styleId) {
        console.error('Usage: node generate-prompts.js midjourney <style-id>');
        process.exit(1);
      }
      console.log(getMidjourneyPrompt(styleId));
      break;

    case 'list':
      console.log('Available styles:');
      batchData.styles.forEach(s => {
        console.log(`  - ${s.id}: ${s.name} (${s.name_bs})`);
      });
      break;

    default:
      console.log(`
Beard Style Prompt Generator

Usage:
  node generate-prompts.js <command> [options]

Commands:
  list                    List all available styles
  single <style-id>       Generate prompt for single style
  test                    Generate prompts for test phase (3 styles)
  all                     Generate all prompts as JSON
  export [output-dir]     Export all prompts to text files
  midjourney <style-id>   Get Midjourney-formatted prompt

Examples:
  node generate-prompts.js list
  node generate-prompts.js single full-beard
  node generate-prompts.js export ./my-prompts
  node generate-prompts.js midjourney stubble-3day
`);
  }
}

module.exports = {
  generatePrompt,
  generateAllPrompts,
  generateTestPrompts,
  generateBatchPrompts,
  exportPromptsToFiles,
  getMidjourneyPrompt,
  getDallEPrompt,
  getStableDiffusionPrompt
};
