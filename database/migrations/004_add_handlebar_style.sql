-- Migration 004: Add Handlebar beard style
-- Date: 2026-02-14

-- Add Handlebar style (only if not exists)
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
SELECT
  'Handlebar',
  'handlebar',
  'Upečatljivi brkovi sa karakterističnim savijenim krajevima prema gore. Klasičan vintage stil koji zahtijeva redovno oblikovanje voskom.',
  'high',
  'artistic',
  6,
  ARRAY[1,3,4,6],
  '/assets/styles/handlebar.jpg',
  80,
  'Nanosi vosak za brkove svaki dan. Oblikuj krajeve prema gore koristeći toplu tehniku. Trimuj bradu na 1-2cm da brkovi dominiraju. Redovno posjećuj berbera za precizno oblikovanje.'
WHERE NOT EXISTS (SELECT 1 FROM beard_styles WHERE slug = 'handlebar');

-- Add tags for Handlebar
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT bs.id, t.id
FROM beard_styles bs, tags t
WHERE bs.slug = 'handlebar'
  AND t.name IN ('Creative', 'High Maintenance', 'Classic', 'Artistic', 'Mature', 'Hipster')
  AND NOT EXISTS (
    SELECT 1 FROM beard_style_tags bst
    WHERE bst.beard_style_id = bs.id AND bst.tag_id = t.id
  );
