-- =====================================================
-- TIER 4: STUBBLE & MINIMALIST - SQL SEED
-- Stilovi: Designer Stubble, Heavy Stubble, 5 O'Clock Shadow, Beardstache
-- =====================================================

BEGIN;

-- =====================================================
-- 1. BEARD STYLES - Osnovni podaci
-- =====================================================

INSERT INTO beard_styles (
    id, name, slug, tier, category,
    min_length_cm, max_length_cm, optimal_length_cm,
    maintenance_level, weekly_time_minutes,
    description, summary,
    dimensions, maintenance, design_rules, growth_timeline, assumptions,
    created_at, updated_at
) VALUES

-- DESIGNER STUBBLE
(
    13,
    'Designer Stubble',
    'designer-stubble',
    4,
    'stubble-minimalist',
    0.2, 0.4, 0.3,
    'medium',
    21.5,
    'Designer Stubble je pažljivo održavana facial hair opcija koja balansira između clean-shaven i full beard. Izgleda kao da se niste obrijali 2-3 dana, ali je zapravo pažljivo održavana dužina.',
    'Controlled 3-day stubble look - rugged ali groomed.',
    '{
        "length_mm": {
            "min": 2,
            "max": 4,
            "optimal": 3,
            "notes": "<2mm = 5 o''clock shadow; >4mm = heavy stubble"
        },
        "coverage": {
            "options": ["full face", "selective"],
            "uniformity_variance_mm": 0.5
        },
        "cheek_line": {
            "options": ["natural", "soft defined", "hard defined"]
        },
        "neckline": {
            "usually_defined": true,
            "position": "na ili 1 prst iznad Adam''s apple"
        },
        "volume_projection_percent": 3.5,
        "texture_requirements": {
            "fill_factor_min": 75,
            "stray_tolerance": "less visible at stubble length",
            "any_texture_works": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "full_stubble_days": 2.5,
            "neckline_days": 2.5,
            "cheek_line_days": 2.5
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Stubble trimmer sa preciznim settings (0.5 mm increments)",
            "Guard 2-3 mm",
            "Precision trimmer (0 mm)",
            "Razor za neckline"
        ],
        "products": {
            "stubble_oil": "optional za softness",
            "aftershave_balm": "za neckline area",
            "exfoliating_scrub": "2x sedmično"
        },
        "time_per_session_minutes": 6.5,
        "weekly_investment_minutes": 21.5
    }'::jsonb,
    '[
        "Uniformna dužina je ključ - designer znači intentional",
        "Trim regularly, not occasionally",
        "Neckline čini razliku - pretvara didn''t shave u chose stubble",
        "2-4 mm sweet spot - strict range",
        "Patchy is OK at this length",
        "Cheek line optional ali helpful",
        "Consistent texture - no random longer hairs",
        "Skin care matters - stubble exposes skin"
    ]'::jsonb,
    '{
        "total_days": 5,
        "minimum_growth_mm": 2,
        "phases": [
            {
                "name": "Initial Growth",
                "days": "1-3",
                "description": "5 o''clock shadow to approaching target."
            },
            {
                "name": "Target Achievement",
                "days": "4-5",
                "description": "Target length achieved. Define neckline, optional cheek line, first maintenance trim."
            },
            {
                "name": "Maintenance",
                "days": "6+",
                "description": "Trim to target length svakih 2-3 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_mm_daily": 0.4,
        "facial_hair_density": "any works - stubble masks patchiness",
        "skin_sensitivity": "may cause irritation for partners",
        "commitment": "medium - regular maintenance required",
        "equipment": "stubble trimmer with precise settings essential"
    }'::jsonb,
    NOW(), NOW()
),

-- HEAVY STUBBLE
(
    14,
    'Heavy Stubble',
    'heavy-stubble',
    4,
    'stubble-minimalist',
    0.4, 0.6, 0.5,
    'medium',
    20,
    'Heavy Stubble je almost-beard facial hair opcija na 4-6 mm dužine. Pruža rugged izgled bez full beard maintenance-a, često citirana kao jedna od najatrraktivnijih facial hair opcija.',
    'Almost-beard stubble - rugged shadow bez full commitment.',
    '{
        "length_mm": {
            "min": 4,
            "max": 6,
            "optimal": 5,
            "notes": "<4mm = designer stubble; >6mm = short beard"
        },
        "coverage": "full face preferred",
        "uniformity_variance_mm": 1,
        "cheek_line": {
            "options": ["natural", "soft defined"],
            "hard_line_uncommon": true
        },
        "neckline": {
            "typically_defined": true,
            "can_be_natural": "za very rugged look"
        },
        "volume_projection_percent": 7.5,
        "texture_requirements": {
            "fill_factor_min": 80,
            "individual_hairs_visible": true,
            "texture_differences_apparent": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "full_stubble_days": 3.5,
            "neckline_days": 3.5,
            "cheek_line_days": 3.5
        },
        "sessions_per_week": 2.5,
        "tools": [
            "Stubble/beard trimmer sa adjustable guards",
            "Guard 4-5 mm",
            "Precision trimmer (0 mm)",
            "Razor za neckline"
        ],
        "products": {
            "light_beard_oil_drops": 1.5,
            "stubble_softener": "optional",
            "aftershave_balm": "za neckline area"
        },
        "time_per_session_minutes": 8,
        "weekly_investment_minutes": 20
    }'::jsonb,
    '[
        "4-6 mm range je defining boundary",
        "Natural look is the goal",
        "Neckline optional ali helpful",
        "Let texture show - natural texture becomes visible",
        "Patchy areas more visible - consider if density supports",
        "Consistent length over perfect lines",
        "Less frequent is fine - tolerates 3-4 day cycles",
        "Softening products help - 5mm stubble can be prickly"
    ]'::jsonb,
    '{
        "total_days": 10,
        "minimum_growth_mm": 4,
        "phases": [
            {
                "name": "Initial Growth",
                "days": "1-6",
                "description": "5 o''clock to designer stubble to approaching heavy stubble."
            },
            {
                "name": "Target Achievement",
                "days": "7-10",
                "description": "Heavy stubble achieved. Define neckline, first maintenance trim."
            },
            {
                "name": "Maintenance",
                "days": "11+",
                "description": "Trim to 5mm svakih 3-4 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_mm_daily": 0.4,
        "facial_hair_density": "80%+ preferred - patchy shows more",
        "commitment": "low-medium",
        "skin_comfort": "less irritating than shorter stubble",
        "equipment": "quality trimmer with precise guard settings"
    }'::jsonb,
    NOW(), NOW()
),

-- 5 O'CLOCK SHADOW
(
    15,
    '5 O''Clock Shadow',
    'five-oclock-shadow',
    4,
    'stubble-minimalist',
    0.05, 0.2, 0.125,
    'high',
    27.5,
    '5 O''Clock Shadow je najkraća forma facial hair-a koja se smatra stilom - subtilna sjenka koja se pojavljuje nekoliko sati nakon brijanja. Barely there look koji dodaje hint muževnosti.',
    'Subtilna sjenka - barely there masculine hint.',
    '{
        "length_mm": {
            "min": 0.5,
            "max": 2,
            "optimal": 1.25,
            "notes": "<0.5mm = clean shaven; >2mm = designer stubble"
        },
        "coverage": "full face, uniforman",
        "uniformity_variance_mm": 0.3,
        "cheek_line": "natural/undefined",
        "neckline": "natural ili very soft",
        "volume_projection_percent": 1,
        "texture_requirements": {
            "fill_factor_min": 70,
            "individual_hairs_nearly_invisible": true,
            "color_creates_shadow_effect": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "option_a": "shave morning, natural shadow by evening",
            "option_b": "trim to 1mm svakih 1-2 dana"
        },
        "sessions_per_week": 5,
        "tools": [
            "High-precision trimmer sa 0.5-1 mm setting",
            "Electric shaver",
            "Foil shaver",
            "Razor (option A approach)"
        ],
        "products": {
            "pre_shave_oil": "za smooth skin",
            "post_shave_balm": "daily use",
            "moisturizer": "essential",
            "exfoliating_scrub": "3x sedmično"
        },
        "time_per_session_minutes": 5.5,
        "weekly_investment_minutes": 27.5
    }'::jsonb,
    '[
        "0.5-2 mm range je strict",
        "Uniformity is everything",
        "Avoid defined lines - natural boundaries only",
        "Daily attention required",
        "Natural timing option - shave morning, shadow by evening",
        "Trimmer precision essential",
        "Skin condition matters",
        "Patchy is less obvious - shadow effect evens out"
    ]'::jsonb,
    '{
        "approaches": [
            {
                "name": "Natural Timing",
                "description": "Clean shave morning, natural 5 o''clock shadow by evening"
            },
            {
                "name": "Maintained Trim",
                "description": "Trim to 1mm daily ili svaki drugi dan"
            }
        ],
        "total_time": "hours to 2-3 days",
        "minimum_growth_mm": 0.5
    }'::jsonb,
    '{
        "growth_rate_mm_daily": 0.4,
        "facial_hair_color": "darker shows better; light/gray less visible",
        "skin_sensitivity": "daily shaving may cause irritation",
        "commitment": "high - daily attention",
        "equipment": "precision trimmer ili quality razor essential",
        "skin_care": "non-negotiable"
    }'::jsonb,
    NOW(), NOW()
),

-- BEARDSTACHE
(
    16,
    'Beardstache',
    'beardstache',
    4,
    'stubble-minimalist',
    0.8, 2.0, 1.2,
    'medium-high',
    45,
    'Beardstache kombinuje prominent mustache sa light stubble na ostatku lica. Hybrid stil koji nudi unique visual contrast između dominant brkova i minimalne brade.',
    'Prominent mustache + light stubble contrast hybrid.',
    '{
        "mustache_length_mm": {
            "short": "8-12",
            "medium": "12-18",
            "full": "18+",
            "optimal": 13.5
        },
        "stubble_length_mm": {
            "min": 2,
            "max": 5,
            "optimal": 3.5
        },
        "contrast_ratio": {
            "minimum": "3:1",
            "example": "12mm mustache with 4mm stubble"
        },
        "mustache_styles": ["natural full", "chevron", "horseshoe", "handlebar"],
        "cheek_line": "usually natural na stubble",
        "neckline": "defined na stubble portion",
        "volume_projection": {
            "stubble_percent": 4,
            "mustache_percent": 22.5
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "stubble_days": 3.5,
            "mustache_length_days": 10.5,
            "mustache_shape_days": 4,
            "neckline_days": 3.5
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Stubble trimmer sa 3-4 mm guard",
            "Precision trimmer",
            "Mustache scissors",
            "Mustache comb",
            "Razor"
        ],
        "products": {
            "mustache_wax": "za styling i hold",
            "light_beard_oil_drops": 2.5,
            "stubble_softener": "optional",
            "aftershave": "za neckline area"
        },
        "time_per_session_minutes": 12.5,
        "weekly_investment_minutes": 45
    }'::jsonb,
    '[
        "Mustache must dominate - 3:1 ratio minimum",
        "Stubble is accent, not feature",
        "Maintain contrast - regular stubble trimming essential",
        "Mustache styling matters",
        "Transition zone clean - not graduated",
        "Neckline on stubble portion - define normally",
        "Mustache lip line is visible - keep groomed",
        "Embrace the contrast - sharp contrast is the aesthetic"
    ]'::jsonb,
    '{
        "total_weeks": 4,
        "minimum_mustache_mm": 10,
        "phases": [
            {
                "name": "Full Growth",
                "weeks": "1-3",
                "description": "Let everything grow uniformly. Approaching target mustache length."
            },
            {
                "name": "Differentiation",
                "weeks": "4",
                "description": "FIRST BEARDSTACHE SHAPING: Trim face back to 4mm, keep mustache long, create contrast."
            },
            {
                "name": "Maintenance",
                "weeks": "5+",
                "description": "Stubble trim svakih 3-4 dana to maintain 4mm. Mustache trim svakih 1-2 sedmice."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "mustache_growth": "must be able to grow visible mustache",
        "stubble_density": "any works - stubble is subtle",
        "commitment": "medium-high - different maintenance for different areas",
        "styling_skill": "some mustache styling helpful",
        "confidence": "required - distinctive look attracts attention"
    }'::jsonb,
    NOW(), NOW()
);

-- =====================================================
-- 2. FACE SHAPE COMPATIBILITY
-- =====================================================

INSERT INTO face_shape_compatibility (beard_style_id, face_shape, score, explanation) VALUES
-- Designer Stubble
(13, 'oval', 95, 'Idealno. Stubble adds subtle texture bez disrupting balance.'),
(13, 'square', 90, 'Odličan. Subtle shadow enhances angular features.'),
(13, 'round', 90, 'Odličan. Stubble adds definition bez adding width.'),
(13, 'triangle', 85, 'Dobro. Subtle enhancement, doesn''t over-emphasize.'),
(13, 'diamond', 90, 'Odličan. Works with all facial structures.'),
(13, 'oblong', 85, 'Dobro. Stubble doesn''t add length. Safe choice.'),

-- Heavy Stubble
(14, 'oval', 95, 'Idealno. Heavy stubble adds masculine texture bez distortion.'),
(14, 'square', 95, 'Odličan. Enhances angular features with rugged appeal.'),
(14, 'round', 85, 'Dobro. Adds some definition, full beard might help more.'),
(14, 'triangle', 85, 'Dobro. Subtle enhancement, doesn''t over-emphasize jaw.'),
(14, 'diamond', 90, 'Odličan. Works well with pronounced cheekbones.'),
(14, 'oblong', 85, 'Dobro. Doesn''t add significant length. Safe choice.'),

-- 5 O'Clock Shadow
(15, 'oval', 95, 'Idealno. Subtle enhancement bez distortion.'),
(15, 'square', 95, 'Odličan. Shadow enhances jawline subtly.'),
(15, 'round', 85, 'Dobro. Adds hint of definition. Less impact than fuller styles.'),
(15, 'triangle', 90, 'Odličan. Subtle, doesn''t emphasize jaw too much.'),
(15, 'diamond', 95, 'Idealno. Complements all features subtly.'),
(15, 'oblong', 90, 'Odličan. Doesn''t add length at all.'),

-- Beardstache
(16, 'oval', 90, 'Odličan. Mustache emphasis works well with balanced face.'),
(16, 'square', 85, 'Dobro. Mustache adds horizontal element. Stubble doesn''t hide jaw.'),
(16, 'round', 80, 'OK. Horizontal mustache might add width. Consider if desired.'),
(16, 'triangle', 85, 'Dobro. Draws attention to upper face, away from wide jaw.'),
(16, 'diamond', 90, 'Odličan. Mustache balances narrow chin effectively.'),
(16, 'oblong', 85, 'Dobro. Horizontal mustache can break vertical length.');

-- =====================================================
-- 3. STYLE TRANSITIONS
-- =====================================================

INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps, notes) VALUES
-- Designer Stubble transitions
(13, 14, 0.5, 'easy', '["Let grow from 3mm to 5mm", "Maintain neckline during growth", "Adjust maintenance schedule"]', 'Designer Stubble to Heavy Stubble'),
(13, 15, 0, 'easy', '["Trim from 3mm to 1mm", "Increase maintenance frequency", "More subtle look"]', 'Designer Stubble to 5 O''Clock Shadow'),
(13, 7, 3, 'easy', '["Let grow to 30+ mm", "Maintain lines during growth", "Shape when target reached"]', 'Designer Stubble to Short Boxed'),
(NULL, 13, 0.7, 'easy', '["Dan 1-3: Let it grow", "Dan 4-5: First trim to target, define lines", "Ongoing: Maintain every 2-3 days"]', 'Clean Shaven to Designer Stubble'),

-- Heavy Stubble transitions
(14, 13, 0, 'easy', '["Trim from 5mm to 3mm", "More frequent maintenance required", "Cleaner look"]', 'Heavy Stubble to Designer Stubble'),
(14, 7, 4, 'easy', '["Let grow past 6mm", "At 10+ mm: entering beard territory", "Transition to beard maintenance"]', 'Heavy Stubble to Short Boxed'),
(14, 16, 3, 'medium', '["Keep face at 5mm or reduce", "Let mustache grow out", "When mustache 10+ mm: beardstache territory"]', 'Heavy Stubble to Beardstache'),
(NULL, 14, 1.4, 'easy', '["Dan 1-6: Let it grow", "Dan 7-10: First trim to even, define neckline", "Ongoing: Maintain every 3-4 days"]', 'Clean Shaven to Heavy Stubble'),

-- 5 O'Clock Shadow transitions
(15, 13, 0.3, 'easy', '["Let grow from 1mm to 3mm", "Decrease maintenance frequency", "More visible stubble"]', '5 O''Clock Shadow to Designer Stubble'),
(15, NULL, 0, 'easy', '["Shave completely", "Return to clean-shaven routine"]', '5 O''Clock Shadow to Clean Shaven'),
(NULL, 15, 0.3, 'easy', '["Stop shaving ili shave in morning", "By evening ili next day: shadow visible", "Maintain with daily/every-other-day trim"]', 'Clean Shaven to 5 O''Clock Shadow'),

-- Beardstache transitions
(16, 1, 8, 'easy', '["Stop trimming stubble", "Let face catch up to mustache", "At equal lengths: full beard"]', 'Beardstache to Full Beard'),
(16, NULL, 0, 'easy', '["Shave stubble clean", "Keep mustache", "Classic mustache achieved"]', 'Beardstache to Full Mustache'),
(16, 13, 0, 'easy', '["Trim mustache to stubble length", "Uniform stubble achieved"]', 'Beardstache to Designer Stubble'),
(NULL, 16, 4, 'medium', '["Sedmica 1-3: Grow full face", "Sedmica 4: Trim face to stubble, keep mustache", "Ongoing: Maintain contrast ratio"]', 'Clean Shaven to Beardstache');

-- =====================================================
-- 4. LIFESTYLE TAGS
-- =====================================================

INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
(36, 'Rugged Appeal', 'rugged-appeal', 'aesthetic'),
(37, 'Low Commitment', 'low-commitment', 'commitment'),
(38, 'Everyday Practical', 'everyday-practical', 'lifestyle'),
(39, 'Attractiveness Studies', 'attractiveness-studies', 'research'),
(40, 'Masculine Hint', 'masculine-hint', 'aesthetic'),
(41, 'Hybrid Style', 'hybrid-style', 'aesthetic'),
(42, 'Statement Look', 'statement-look', 'aesthetic')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. STYLE-LIFESTYLE TAG ASSOCIATIONS
-- =====================================================

INSERT INTO style_lifestyle_tags (beard_style_id, lifestyle_tag_id, relevance_score) VALUES
-- Designer Stubble
(13, 36, 90),  -- Rugged Appeal
(13, 37, 85),  -- Low Commitment
(13, 38, 95),  -- Everyday Practical
(13, 35, 90),  -- Universal Appeal
(13, 34, 90),  -- Versatile Style

-- Heavy Stubble
(14, 36, 95),  -- Rugged Appeal
(14, 39, 90),  -- Attractiveness Studies
(14, 37, 90),  -- Low Commitment
(14, 38, 90),  -- Everyday Practical
(14, 35, 85),  -- Universal Appeal

-- 5 O'Clock Shadow
(15, 40, 95),  -- Masculine Hint
(15, 35, 95),  -- Universal Appeal
(15, 37, 70),  -- Low Commitment (actually high maintenance)
(15, 21, 90),  -- Professional Image

-- Beardstache
(16, 41, 100), -- Hybrid Style
(16, 42, 95),  -- Statement Look
(16, 26, 85),  -- Artistic Style
(16, 36, 80);  -- Rugged Appeal

-- =====================================================
-- 6. STYLE COMPARISONS
-- =====================================================

INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_summary, key_differences, similarity_score) VALUES
(13, 14, 'Designer i Heavy Stubble su stubble stilovi različite dužine',
 '{"Designer Stubble": "2-4 mm, čistiji, more frequent maintenance", "Heavy Stubble": "4-6 mm, gušći, almost-beard effect, manje frequent maintenance", "shared": "Oba su maintained stubble looks sa optional lines"}',
 80),
(13, 15, 'Designer Stubble i 5 O''Clock Shadow su obje subtle opcije',
 '{"Designer Stubble": "2-4 mm, visible stubble, medium maintenance", "5 O''Clock Shadow": "0.5-2 mm, barely there shadow, high maintenance", "shared": "Oba su stubble-level facial hair"}',
 70),
(14, 16, 'Heavy Stubble i Beardstache koriste sličnu stubble dužinu',
 '{"Heavy Stubble": "Uniform 4-6 mm svuda, rugged", "Beardstache": "4 mm stubble + 12+ mm mustache, contrast", "shared": "Oba koriste stubble element"}',
 55),
(15, 13, '5 O''Clock Shadow je kraća verzija Designer Stubble-a',
 '{"5 O''Clock Shadow": "Najkraći facial hair stil, daily maintenance", "Designer Stubble": "Visible stubble, less demanding", "shared": "Oba su stubble-category styles"}',
 65),
(16, 14, 'Beardstache koristi stubble kao accent za mustache',
 '{"Beardstache": "Prominent mustache + stubble accent, hybrid", "Heavy Stubble": "Uniform stubble, no mustache emphasis", "shared": "Oba imaju stubble component"}',
 50);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Provjeri unesene stilove
-- SELECT id, name, tier, maintenance_level FROM beard_styles WHERE tier = 4 ORDER BY id;

-- Provjeri face shape compatibility
-- SELECT bs.name, fsc.face_shape, fsc.score
-- FROM face_shape_compatibility fsc
-- JOIN beard_styles bs ON fsc.beard_style_id = bs.id
-- WHERE bs.tier = 4 ORDER BY bs.id, fsc.score DESC;
