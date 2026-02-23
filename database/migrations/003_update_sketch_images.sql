-- ============================================
-- Migration: Update beard style images to WebP sketches
-- Version: 003
-- Date: 2024
-- ============================================

-- Update all beard styles to use new graphite sketch WebP images
-- Old: /assets/styles/*.jpg
-- New: /assets/sketches/*.webp

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

-- Add thumbnail_url column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'beard_styles' AND column_name = 'thumbnail_url'
    ) THEN
        ALTER TABLE beard_styles ADD COLUMN thumbnail_url VARCHAR(500);
    END IF;
END $$;

-- Update thumbnail URLs
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/clean-shaven-thumb.webp' WHERE slug = 'clean-shaven';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/stubble-3day-thumb.webp' WHERE slug = 'stubble-3day';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/short-boxed-beard-thumb.webp' WHERE slug = 'short-boxed';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/full-beard-thumb.webp' WHERE slug = 'full-beard';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/goatee-thumb.webp' WHERE slug = 'goatee';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/van-dyke-thumb.webp' WHERE slug = 'van-dyke';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/balbo-thumb.webp' WHERE slug = 'balbo';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/circle-beard-thumb.webp' WHERE slug = 'circle-beard';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/ducktail-thumb.webp' WHERE slug = 'ducktail';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/garibaldi-thumb.webp' WHERE slug = 'garibaldi';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/mutton-chops-thumb.webp' WHERE slug = 'mutton-chops';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/anchor-beard-thumb.webp' WHERE slug = 'anchor-beard';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/chin-strap-thumb.webp' WHERE slug = 'chin-strap';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/beardstache-thumb.webp' WHERE slug = 'beardstache';
UPDATE beard_styles SET thumbnail_url = '/assets/thumbnails/corporate-beard-thumb.webp' WHERE slug = 'corporate-beard';

-- Add annotated_url column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'beard_styles' AND column_name = 'annotated_url'
    ) THEN
        ALTER TABLE beard_styles ADD COLUMN annotated_url VARCHAR(500);
    END IF;
END $$;

-- Note: Annotated URLs will be added after annotation images are created
-- Pattern: /assets/sketches/{slug}-annotated.webp

-- ============================================
-- Verification query (run manually to check)
-- ============================================
-- SELECT slug, image_url, thumbnail_url FROM beard_styles ORDER BY id;
