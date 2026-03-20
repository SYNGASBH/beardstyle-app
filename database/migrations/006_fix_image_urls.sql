-- Migration: Fix image_url paths to match actual sketch files
-- Version: 1.3.0
-- Description: DB had /assets/styles/*.jpg but actual files are /assets/sketches/*.webp

UPDATE beard_styles SET image_url = '/assets/sketches/clean-shaven.webp' WHERE slug = 'clean-shaven';
UPDATE beard_styles SET image_url = '/assets/sketches/stubble-3day.webp' WHERE slug = 'stubble-3day';
UPDATE beard_styles SET image_url = '/assets/sketches/short-boxed-beard.webp' WHERE slug = 'short-boxed';
UPDATE beard_styles SET image_url = '/assets/sketches/full-beard.webp' WHERE slug = 'full-beard';
UPDATE beard_styles SET image_url = '/assets/sketches/goatee.webp' WHERE slug = 'goatee';
UPDATE beard_styles SET image_url = '/assets/sketches/van-dyke.webp' WHERE slug = 'van-dyke';
UPDATE beard_styles SET image_url = '/assets/sketches/balbo.webp' WHERE slug = 'balbo';
UPDATE beard_styles SET image_url = '/assets/sketches/circle-beard.webp' WHERE slug = 'circle-beard';
UPDATE beard_styles SET image_url = '/assets/sketches/ducktail.webp' WHERE slug = 'ducktail';
UPDATE beard_styles SET image_url = '/assets/sketches/garibaldi.webp' WHERE slug = 'garibaldi';
UPDATE beard_styles SET image_url = '/assets/sketches/mutton-chops.webp' WHERE slug = 'mutton-chops';
UPDATE beard_styles SET image_url = '/assets/sketches/anchor-beard.webp' WHERE slug = 'anchor-beard';
UPDATE beard_styles SET image_url = '/assets/sketches/chin-strap.webp' WHERE slug = 'chin-strap';
UPDATE beard_styles SET image_url = '/assets/sketches/beardstache.webp' WHERE slug = 'beardstache';
UPDATE beard_styles SET image_url = '/assets/sketches/corporate-beard.webp' WHERE slug = 'corporate-beard';
UPDATE beard_styles SET image_url = '/assets/sketches/handlebar.webp' WHERE slug = 'handlebar';
