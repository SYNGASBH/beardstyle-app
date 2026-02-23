-- =============================================
-- MASTER SEED FILE - ALL BEARD STYLES
-- 29 Beard Styles across 7 Tiers
-- =============================================
--
-- This file combines all tier seed files into one master seed.
-- Run this to populate the complete beard style database.
--
-- Tier 1: Full Beards (4 styles) - Garibaldi, Bandholz, Ducktail, Yeard
-- Tier 2: Medium Length (4 styles) - Corporate, Boxed, Short Boxed, Balbo
-- Tier 3: Goatees & Partial (4 styles) - Van Dyke, Goatee, Anchor, Circle Beard
-- Tier 4: Stubble & Minimalist (4 styles) - Designer Stubble, Heavy Stubble, 5 O'Clock, Beardstache
-- Tier 5: Mustache Styles (5 styles) - Chevron, Handlebar, Pencil, Horseshoe, Walrus
-- Tier 6: Sideburns & Extensions (3 styles) - Mutton Chops, Friendly Mutton Chops, Chin Curtain
-- Tier 7: Specialty & Artistic (5 styles) - Verdi, Soul Patch, Chin Strap, Imperial, Hulihee
--
-- =============================================

-- =============================================
-- SCHEMA CREATION (if not exists)
-- =============================================

CREATE TABLE IF NOT EXISTS beard_styles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 7),
    category VARCHAR(50) NOT NULL,
    min_length_cm DECIMAL(4,1),
    max_length_cm DECIMAL(4,1),
    optimal_length_cm DECIMAL(4,1),
    maintenance_level VARCHAR(20) NOT NULL CHECK (maintenance_level IN ('very_low', 'low', 'medium', 'high', 'very_high')),
    weekly_time_minutes DECIMAL(5,1),
    description TEXT NOT NULL,
    summary VARCHAR(500),
    dimensions JSONB,
    maintenance JSONB,
    design_rules JSONB,
    growth_timeline JSONB,
    assumptions JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS face_shape_compatibility (
    id SERIAL PRIMARY KEY,
    style_id INTEGER REFERENCES beard_styles(id) ON DELETE CASCADE,
    face_shape VARCHAR(20) NOT NULL CHECK (face_shape IN ('oval', 'square', 'round', 'triangle', 'diamond', 'oblong')),
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
    explanation TEXT,
    UNIQUE(style_id, face_shape)
);

CREATE TABLE IF NOT EXISTS style_transitions (
    id SERIAL PRIMARY KEY,
    from_style_id INTEGER REFERENCES beard_styles(id) ON DELETE CASCADE,
    to_style_id INTEGER REFERENCES beard_styles(id) ON DELETE CASCADE,
    duration_weeks DECIMAL(4,2),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    steps JSONB,
    UNIQUE(from_style_id, to_style_id)
);

CREATE TABLE IF NOT EXISTS lifestyle_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS style_lifestyle_tags (
    id SERIAL PRIMARY KEY,
    style_id INTEGER REFERENCES beard_styles(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES lifestyle_tags(id) ON DELETE CASCADE,
    relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
    UNIQUE(style_id, tag_id)
);

CREATE TABLE IF NOT EXISTS style_comparisons (
    id SERIAL PRIMARY KEY,
    style_id_1 INTEGER REFERENCES beard_styles(id) ON DELETE CASCADE,
    style_id_2 INTEGER REFERENCES beard_styles(id) ON DELETE CASCADE,
    comparison_aspect VARCHAR(50) NOT NULL,
    style_1_value TEXT,
    style_2_value TEXT,
    UNIQUE(style_id_1, style_id_2, comparison_aspect)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beard_styles_tier ON beard_styles(tier);
CREATE INDEX IF NOT EXISTS idx_beard_styles_category ON beard_styles(category);
CREATE INDEX IF NOT EXISTS idx_beard_styles_maintenance ON beard_styles(maintenance_level);
CREATE INDEX IF NOT EXISTS idx_face_shape_style ON face_shape_compatibility(style_id);
CREATE INDEX IF NOT EXISTS idx_face_shape_shape ON face_shape_compatibility(face_shape);
CREATE INDEX IF NOT EXISTS idx_transitions_from ON style_transitions(from_style_id);
CREATE INDEX IF NOT EXISTS idx_transitions_to ON style_transitions(to_style_id);

-- =============================================
-- LIFESTYLE TAGS (Master List)
-- =============================================

INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
-- Professional contexts
(1, 'Corporate', 'corporate', 'professional'),
(2, 'Business Professional', 'business-professional', 'professional'),
(3, 'Creative Industries', 'creative-industries', 'professional'),
-- Occasions
(4, 'Formal Events', 'formal-events', 'occasion'),
(5, 'Casual', 'casual', 'occasion'),
-- Aesthetics
(6, 'Vintage', 'vintage', 'aesthetic'),
(7, 'Distinguished', 'distinguished', 'aesthetic'),
(8, 'Artistic', 'artistic', 'aesthetic'),
-- Lifestyle
(9, 'Athletic', 'athletic', 'lifestyle'),
(10, 'Casual', 'casual', 'lifestyle'),
(11, 'Urban', 'urban', 'lifestyle'),
-- Maintenance
(12, 'Low Maintenance', 'low-maintenance', 'maintenance'),
(13, 'Hip-Hop', 'hip-hop', 'cultural'),
(14, 'Precision', 'precision', 'aesthetic'),
-- Additional
(15, 'Outdoorsman', 'outdoorsman', 'lifestyle'),
(16, 'Rugged', 'rugged', 'aesthetic'),
(17, 'Natural', 'natural', 'aesthetic'),
(18, 'Minimalist', 'minimalist', 'aesthetic'),
(19, 'Classic', 'classic', 'aesthetic'),
(20, 'Modern', 'modern', 'aesthetic'),
(21, 'Conservative', 'conservative', 'professional'),
(22, 'Biker', 'biker', 'lifestyle'),
(23, 'Victorian', 'victorian', 'aesthetic'),
(24, 'Historical', 'historical', 'cultural'),
(25, 'Western', 'western', 'cultural'),
(26, 'Retro', 'retro', 'aesthetic'),
(27, 'Hollywood', 'hollywood', 'cultural'),
(28, 'Military', 'military', 'professional'),
(29, 'Academia', 'academia', 'professional'),
(30, 'Entertainment', 'entertainment', 'professional'),
(31, 'Theatrical', 'theatrical', 'personality'),
(32, 'Aristocratic', 'aristocratic', 'aesthetic'),
(33, 'Beard Competition', 'beard-competition', 'occasion'),
(34, 'Hawaiian Heritage', 'hawaiian-heritage', 'cultural'),
(35, 'Steampunk', 'steampunk', 'aesthetic'),
(36, 'Beatnik', 'beatnik', 'cultural'),
(37, 'Jazz Culture', 'jazz-culture', 'cultural')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;

-- =============================================
-- TIER 1: FULL BEARDS
-- =============================================
\echo 'Loading Tier 1: Full Beards...'
\i tier1_seed.sql

-- =============================================
-- TIER 2: MEDIUM LENGTH
-- =============================================
\echo 'Loading Tier 2: Medium Length...'
\i tier2_seed.sql

-- =============================================
-- TIER 3: GOATEES & PARTIAL
-- =============================================
\echo 'Loading Tier 3: Goatees & Partial...'
\i tier3_seed.sql

-- =============================================
-- TIER 4: STUBBLE & MINIMALIST
-- =============================================
\echo 'Loading Tier 4: Stubble & Minimalist...'
\i tier4_seed.sql

-- =============================================
-- TIER 5: MUSTACHE STYLES
-- =============================================
\echo 'Loading Tier 5: Mustache Styles...'
\i tier5_seed.sql

-- =============================================
-- TIER 6: SIDEBURNS & EXTENSIONS
-- =============================================
\echo 'Loading Tier 6: Sideburns & Extensions...'
\i tier6_seed.sql

-- =============================================
-- TIER 7: SPECIALTY & ARTISTIC
-- =============================================
\echo 'Loading Tier 7: Specialty & Artistic...'
\i tier7_seed.sql

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

\echo '============================================='
\echo 'BEARD STYLES DATABASE POPULATION COMPLETE'
\echo '============================================='

-- Count by tier
SELECT
    tier,
    COUNT(*) as style_count,
    STRING_AGG(name, ', ' ORDER BY id) as styles
FROM beard_styles
GROUP BY tier
ORDER BY tier;

-- Count by category
SELECT
    category,
    COUNT(*) as count
FROM beard_styles
GROUP BY category
ORDER BY count DESC;

-- Face shape compatibility count
SELECT COUNT(*) as total_face_shape_entries FROM face_shape_compatibility;

-- Transitions count
SELECT COUNT(*) as total_transitions FROM style_transitions;

-- Summary
SELECT
    (SELECT COUNT(*) FROM beard_styles) as total_styles,
    (SELECT COUNT(*) FROM face_shape_compatibility) as face_shape_entries,
    (SELECT COUNT(*) FROM style_transitions) as transitions,
    (SELECT COUNT(*) FROM lifestyle_tags) as lifestyle_tags,
    (SELECT COUNT(*) FROM style_lifestyle_tags) as style_tag_associations;

\echo 'Database ready for use!'
