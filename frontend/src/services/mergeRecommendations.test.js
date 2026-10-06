import { mergeRecommendations } from './mergeRecommendations';
import { BEARD_STYLES } from '../data/beardStyles';
import identity from '../data/styleIdentity.json';
import technical from '../data/styles.json';

test('every identity is represented exactly once in the gallery', () => {
  expect(BEARD_STYLES.map(s => s.id)).toEqual(identity.map(s => s.id));
  expect(technical.styles.map(s => s.id).sort()).toEqual(identity.map(s => s.slug).sort());
});

test.each(identity)('$slug recommendations keep the correct style', style => {
  const result = mergeRecommendations({ faceShape: 'oval', recommendedStyles: [{
    slug: style.slug, styleName: style.slug, matchScore: 90,
  }] });
  expect(result.beardStyles[0].id).toBe(style.id);
  expect(result.beardStyles[0].imageUrl).toBe(style.imageUrl);
  expect(result.beardStyles[0].matched).toBe(true);
});
