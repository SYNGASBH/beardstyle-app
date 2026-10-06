const fs = require('fs');
const path = require('path');
const { catalog, requireStyle } = require('../utils/styleIdentity');
const Replicate = require('./replicateService');

describe('style identity across generation engines', () => {
  test.each(catalog.map(s => [s.id, s]))('%s resolves aliases and a real mock asset', (id, style) => {
    for (const alias of [id, style.slug, ...style.aliases]) {
      expect(requireStyle(alias)).toBe(style);
      expect(Replicate.getStyleConfig(alias)).toEqual(Replicate.getStyleConfig(id));
      expect(Replicate.getEditPrompt(alias)).toEqual(Replicate.getEditPrompt(id));
      expect(Replicate.getEditPrompt(alias)).not.toContain('well-groomed "');
      const mock = Replicate.getMockVisualization(alias);
      expect(fs.existsSync(path.resolve(__dirname, '../../../frontend/public', '.' + mock.imageUrl))).toBe(true);
    }
  });
  test('chin strap and beardstache do not turn into anchor and Verdi', () => {
    expect(Replicate.getEditPrompt('chin-strap')).toContain('no mustache');
    expect(Replicate.getEditPrompt('beardstache')).toContain('2-3 mm stubble');
    expect(Replicate.getEditPrompt('chin-strap')).not.toEqual(Replicate.getEditPrompt('sidro'));
    expect(Replicate.getEditPrompt('beardstache')).not.toEqual(Replicate.getEditPrompt('verdi'));
  });
  test('unknown styles fail clearly instead of generating a different beard', () => {
    expect(() => Replicate.getStyleConfig('unknown')).toThrow('Unknown beard style');
  });
  test('OpenAI key is unnecessary for importing or using mock DALL-E', () => {
    const previousKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      const Dalle = require('./dalleService');
      expect(Dalle.getMockVisualization({ id: 'puna-brada' }).imageUrl).toBe('/assets/sketches/full-beard.webp');
    } finally {
      if (previousKey !== undefined) process.env.OPENAI_API_KEY = previousKey;
    }
  });
});
