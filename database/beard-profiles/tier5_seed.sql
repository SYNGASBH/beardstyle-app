-- =====================================================
-- TIER 5: MUSTACHE STYLES - SQL SEED
-- Stilovi: Chevron, Handlebar, Pencil, Horseshoe, Walrus
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

-- CHEVRON
(
    17,
    'Chevron Mustache',
    'chevron-mustache',
    5,
    'mustache',
    1.0, 2.0, 1.5,
    'medium',
    37.5,
    'Chevron je klasični, thick mustache stil koji prekriva cijelu gornju usnu u obliku obrnutog slova V. Populariziran 1970-ih i 80-ih, sinonim za muževnost i autoritet.',
    'Klasični thick mustache u obliku obrnutog V - Tom Selleck style.',
    '{
        "horizontal_length_cm": 10,
        "vertical_height_mm": 15,
        "lip_coverage": {
            "classic": "prekriva gornju usnu",
            "modified": "just above lip line"
        },
        "shape": {
            "type": "inverted V ili trapezoid",
            "angle_degrees": 17.5
        },
        "ends": {
            "position": "na ili blago preko uglova usana",
            "style": "natural ili blago trimmed"
        },
        "connection_to_beard": "none - standalone",
        "density_requirements": {
            "fill_factor_min": 95,
            "note": "thick, full, uniform density required"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "lip_line_clearance_days": 4,
            "width_days": 6,
            "overall_shape_days": 8.5,
            "face_shave_days": 2
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Mustache scissors",
            "Fine-tooth mustache comb",
            "Precision trimmer",
            "Razor"
        ],
        "products": {
            "mustache_wax": "optional za extra hold",
            "beard_oil_drops": 2.5,
            "aftershave": "za shaved face"
        },
        "time_per_session_minutes": 10,
        "weekly_investment_minutes": 37.5
    }'::jsonb,
    '[
        "Thick is non-negotiable - sparse nije Chevron",
        "No wax styling - natural shape only",
        "Lip coverage defines it - treba touch ili prekrivati usnu",
        "Keep ends neat, not styled",
        "Face must be clean - standalone mustache",
        "Width follows lips - stays within lip width + 0.5-1 cm",
        "Inverted V shape - širi na vrhu, uži na krajevima",
        "Regular trimming required - overgrown postaje Walrus"
    ]'::jsonb,
    '{
        "total_weeks": 8,
        "minimum_growth_mm": 10,
        "phases": [
            {
                "name": "Initial Growth",
                "weeks": "1-4",
                "description": "Basic mustache forming. Grow full face first, then shave keeping mustache."
            },
            {
                "name": "Shaping",
                "weeks": "5-8",
                "description": "Chevron shape becoming possible. Define ends, lip line management."
            },
            {
                "name": "Maintenance",
                "weeks": "9+",
                "description": "Lip clearance trim svakih 3-5 dana, shape maintenance svakih 7-10 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "mustache_density": "CRITICAL - must be thick",
        "face_shaving": "regular face shaving required",
        "commitment": "medium",
        "styling_skill": "low - no wax required",
        "genetic_requirement": "thick mustache growth essential"
    }'::jsonb,
    NOW(), NOW()
),

-- HANDLEBAR
(
    18,
    'Handlebar Mustache',
    'handlebar-mustache',
    5,
    'mustache',
    1.0, 2.5, 1.5,
    'high',
    85,
    'Handlebar je iconic, styled mustache poznat po upturned ili horizontally-extended krajevima. Zahtijeva redovno styling sa waxom i značajan commitment.',
    'Iconic styled mustache sa upturned/extended krajevima - Victorian era style.',
    '{
        "total_width_cm": {
            "short": "10-12",
            "medium": "12-16",
            "long": "16-20+"
        },
        "central_height_mm": 11.5,
        "ends": {
            "extension_past_lip_cm": 3.5,
            "styles": ["classic upturned", "horizontal", "hungarian", "imperial", "petit"],
            "must_taper_to_point": true
        },
        "philtrum_area": "usually visible",
        "lip_coverage": "minimal u centru",
        "connection_to_beard": "traditionally none"
    }'::jsonb,
    '{
        "trim_intervals": {
            "end_shaping": "daily styling",
            "center_trim_days": 6,
            "stray_hairs_days": 2.5,
            "face_shave_days": 2
        },
        "sessions_per_week": 7,
        "tools": [
            "Mustache wax (firm hold) - ESSENTIAL",
            "Fine mustache comb",
            "Mustache scissors",
            "Blow dryer (optional)",
            "Precision trimmer"
        ],
        "products": {
            "strong_hold_wax": "daily, multiple applications",
            "training_wax": "za softer hold",
            "mustache_oil": "za conditioning",
            "aftershave": "za face"
        },
        "time_per_session_minutes": 15,
        "weekly_investment_minutes": 85
    }'::jsonb,
    '[
        "Wax is mandatory - bez waxa nije handlebar",
        "Ends must extend past lip corners",
        "Points required - ends taper to points",
        "Direction is a choice - upturned, horizontal, ili downturn",
        "Center should be neat",
        "Face should be clean",
        "Training required - hair must be trained",
        "Patience essential - true handlebar takes 3-6 months"
    ]'::jsonb,
    '{
        "total_months": 4,
        "minimum_growth_cm": 2,
        "phases": [
            {
                "name": "Foundation Growth",
                "months": "1-2",
                "description": "Basic mustache forming. Begin wax training in month 2."
            },
            {
                "name": "Extension Growth",
                "months": "3-4",
                "description": "Ends extending past corners. Daily wax training. Basic handlebar possible."
            },
            {
                "name": "Full Development",
                "months": "5-6+",
                "description": "Dramatic handlebar possible. Maintenance mode."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "mustache_density": "medium-to-high required",
        "commitment": "very high - daily styling mandatory",
        "styling_skill": "medium-high - requires learning curve",
        "product_investment": "ongoing wax purchases",
        "patience": "essential - takes months"
    }'::jsonb,
    NOW(), NOW()
),

-- PENCIL
(
    19,
    'Pencil Mustache',
    'pencil-mustache',
    5,
    'mustache',
    0.8, 1.2, 1.0,
    'very-high',
    65,
    'Pencil je thin, precisely trimmed mustache koji formira tanku liniju iznad gornje usne. Populariziran u Hollywood Golden Age-u 1930-ih i 40-ih.',
    'Ultra-thin precise line mustache - Hollywood Golden Age elegance.',
    '{
        "line_width_mm": {
            "ultra_thin": "2-3",
            "standard": "3-4",
            "thick_pencil": "4-5",
            "max": 5
        },
        "horizontal_length_cm": 8,
        "position": {
            "gap_from_lip_mm": 3,
            "follows": "natural lip contour"
        },
        "shape": {
            "options": ["straight line", "subtle arc"],
            "edges": "sharp, defined all sides"
        },
        "philtrum": {
            "options": ["continuous", "split"],
            "both_valid": true
        },
        "ends": {
            "style": "sharp cut ili tapered point",
            "no_extension": true
        },
        "connection": "none - clean face mandatory"
    }'::jsonb,
    '{
        "trim_intervals": {
            "precision_trim_days": 1.5,
            "edge_definition": "daily",
            "face_shave_days": 1.5
        },
        "sessions_per_week": 6,
        "tools": [
            "Precision trimmer (0.5 mm setting) - ESSENTIAL",
            "Detail razor ili straight razor",
            "Magnifying mirror",
            "Fine mustache comb",
            "Eyebrow/mustache scissors"
        ],
        "products": {
            "precision_shave_gel": "za clean edges",
            "aftershave": "za face",
            "light_mustache_oil": "optional"
        },
        "time_per_session_minutes": 11.5,
        "weekly_investment_minutes": 65
    }'::jsonb,
    '[
        "Thinness is defining - if wider than 5mm, not pencil",
        "Precision required daily - one day without trim = lost definition",
        "Symmetry is paramount - asymmetric immediately obvious",
        "Edges must be sharp - blurry edges destroy aesthetic",
        "Position is exact - 2-4 mm above lip",
        "Face must be clean",
        "No styling products needed - relies on cutting precision",
        "Continuous ili split - choose one, be consistent"
    ]'::jsonb,
    '{
        "total_weeks": 4,
        "phases": [
            {
                "name": "Initial Growth",
                "weeks": "1-3",
                "description": "Grow full mustache first."
            },
            {
                "name": "Shaping",
                "weeks": "4",
                "description": "Trim down to thin line. Define position above lip. Create sharp edges."
            },
            {
                "name": "Precision Maintenance",
                "weeks": "5+",
                "description": "Daily ili every-other-day trimming. Continuous precision required."
            }
        ],
        "note": "Quicker to achieve than thick styles, but hardest to maintain"
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "mustache_density": "any works - thin style accommodates sparse",
        "commitment": "VERY HIGH - daily precision",
        "precision_skill": "HIGH - steady hand required",
        "equipment": "quality precision trimmer essential",
        "social_readiness": "must be prepared for attention"
    }'::jsonb,
    NOW(), NOW()
),

-- HORSESHOE
(
    20,
    'Horseshoe Mustache',
    'horseshoe-mustache',
    5,
    'mustache',
    0.8, 2.0, 1.2,
    'medium-high',
    45,
    'Horseshoe kombinuje full mustache sa vertikalnim ekstenzijama koje se spuštaju niz strane usta prema bradi, formirajući oblik potkove. Biker mustache iconic.',
    'Full mustache + vertical extensions forming horseshoe shape - biker classic.',
    '{
        "horizontal_segment": {
            "width_cm": 10,
            "thickness_mm": 11.5
        },
        "vertical_extensions": {
            "length_cm": 5.5,
            "width_mm": 15,
            "follow": "line od uglova usana prema bradi"
        },
        "chin_gap": {
            "required": true,
            "description": "čista brada - gap između lijevog i desnog kraka"
        },
        "shape": "inverted U",
        "end_options": ["square cut", "tapered", "natural"],
        "cheek_area": "clean - no sideburns connection"
    }'::jsonb,
    '{
        "trim_intervals": {
            "vertical_extensions_days": 6,
            "mustache_lip_line_days": 4,
            "edge_definition_days": 4,
            "face_shave_days": 2
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Trimmer sa guards (5-10 mm)",
            "Precision trimmer (0 mm)",
            "Mustache scissors",
            "Razor",
            "Comb"
        ],
        "products": {
            "mustache_oil_drops": 3,
            "styling_balm": "optional",
            "aftershave": "za shaved areas"
        },
        "time_per_session_minutes": 12.5,
        "weekly_investment_minutes": 45
    }'::jsonb,
    '[
        "Vertical extensions mandatory - bez njih, samo mustache",
        "Chin must be clean - extensions završavaju prije spajanja",
        "Extensions should be substantial - width 10+ mm",
        "Symmetry is critical - both extensions identical",
        "Face is clean besides horseshoe",
        "Extensions follow jawline curve",
        "Square ili tapered ends - consistent choice",
        "Minimum extension length 3 cm"
    ]'::jsonb,
    '{
        "total_weeks": 10,
        "phases": [
            {
                "name": "Foundation",
                "weeks": "1-4",
                "description": "Let full face grow ili target areas. Mustache developing, extensions beginning."
            },
            {
                "name": "Extension Development",
                "weeks": "5-8",
                "description": "Begin shaping horseshoe. Clear chin area. Extensions 2-4 cm."
            },
            {
                "name": "Full Development",
                "weeks": "9-12",
                "description": "Extensions 4-6+ cm. Dramatic horseshoe achieved. Maintenance mode."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "mustache_density": "must grow substantial hair at lip corners",
        "commitment": "medium-high",
        "styling_skill": "medium",
        "social_comfort": "must be comfortable with distinctive look",
        "cultural_awareness": "understand biker/tough guy associations"
    }'::jsonb,
    NOW(), NOW()
),

-- WALRUS
(
    21,
    'Walrus Mustache',
    'walrus-mustache',
    5,
    'mustache',
    1.5, 3.0, 2.2,
    'low',
    20,
    'Walrus je massive, bushy mustache koji potpuno prekriva gornju usnu. Epitome mustache maximalism - veći, gušći, neglected-looking.',
    'Massive bushy mustache covering entire lip - Mark Twain style.',
    '{
        "horizontal_width_cm": 12.5,
        "vertical_length_mm": 22.5,
        "lip_coverage": {
            "status": "POTPUNO",
            "drape_over_lip_mm": 10
        },
        "shape": {
            "type": "natural, bushy, drooping",
            "no_defined_shape": true,
            "gravity_dictates": true
        },
        "ends": "natural, not styled",
        "density_requirements": {
            "fill_factor_min": 95,
            "must_be_thick": true
        },
        "connection_to_beard": "traditionally none"
    }'::jsonb,
    '{
        "trim_intervals": {
            "shape_trim_weeks": 3,
            "nostril_clearance_weeks": 1.5,
            "face_shave_days": 2
        },
        "sessions_per_week": 1.5,
        "tools": [
            "Beard scissors",
            "Wide-tooth comb",
            "Trimmer za nostril clearance",
            "Razor"
        ],
        "products": {
            "beard_oil_drops": 5,
            "beard_balm": "za conditioning",
            "no_styling_products": true
        },
        "time_per_session_minutes": 7.5,
        "weekly_investment_minutes": 20
    }'::jsonb,
    '[
        "Size is non-negotiable - must completely cover lip",
        "No styling - natural, bushy look",
        "Drape, don''t shape - let gravity work",
        "Minimal trimming - only functional reasons",
        "Density required - sparse can''t be Walrus",
        "Face clean - highlights impact",
        "Patience essential - takes months",
        "Eating adaptation required"
    ]'::jsonb,
    '{
        "total_months": 6,
        "phases": [
            {
                "name": "Foundation",
                "months": "1-3",
                "description": "Grow without trimming. Starting to cover lip by month 3."
            },
            {
                "name": "Walrus Development",
                "months": "4-6",
                "description": "True lip coverage achieved. Full Walrus development."
            },
            {
                "name": "Maximum Walrus",
                "months": "7+",
                "description": "Maximum natural length. Epic Walrus. Maintenance mode."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "mustache_density": "CRITICAL - must be very thick",
        "terminal_length": "must reach 3+ cm minimum",
        "commitment": "low maintenance, high patience",
        "lifestyle_adaptation": "must accept eating/drinking changes",
        "styling_skill": "none required",
        "social_comfort": "must be OK with distinctive appearance"
    }'::jsonb,
    NOW(), NOW()
);

-- =====================================================
-- 2. FACE SHAPE COMPATIBILITY
-- =====================================================

INSERT INTO face_shape_compatibility (beard_style_id, face_shape, score, explanation) VALUES
-- Chevron
(17, 'oval', 95, 'Idealno. Chevron adds horizontal interest bez disrupting balance.'),
(17, 'square', 90, 'Odličan. Thick mustache complements strong features.'),
(17, 'round', 75, 'Oprez. Horizontal Chevron može dodatno proširiti okruglo lice.'),
(17, 'triangle', 90, 'Odličan. Draws attention upward, away from wide jaw.'),
(17, 'diamond', 85, 'Dobro. Works with angular features.'),
(17, 'oblong', 90, 'Odličan. Horizontal element breaks vertical length.'),

-- Handlebar
(18, 'oval', 90, 'Odličan. Handlebar adds character bez disrupting balance.'),
(18, 'square', 95, 'Idealno. Strong mustache complements strong features.'),
(18, 'round', 70, 'Oprez. Horizontal extension may add visual width.'),
(18, 'triangle', 85, 'Dobro. Draws attention upward.'),
(18, 'diamond', 90, 'Odličan. Works with angular features.'),
(18, 'oblong', 85, 'Dobro. Horizontal element helps.'),

-- Pencil
(19, 'oval', 95, 'Idealno. Pencil adds refined detail bez distortion.'),
(19, 'square', 85, 'Dobro. Thin pencil softens strong features subtly.'),
(19, 'round', 80, 'OK. Thin horizontal line, minimal width impact.'),
(19, 'triangle', 90, 'Odličan. Draws attention to middle face.'),
(19, 'diamond', 90, 'Odličan. Complements angular features with refinement.'),
(19, 'oblong', 85, 'Dobro. Horizontal element, minimal length addition.'),

-- Horseshoe
(20, 'oval', 85, 'Dobro. Horseshoe adds character, dramatic vertical element.'),
(20, 'square', 95, 'Idealno. Vertical extensions complement strong jaw.'),
(20, 'round', 75, 'OK. Vertical lines help elongate, but dramatic style.'),
(20, 'triangle', 80, 'Dobro. Draws attention away from wide jaw somewhat.'),
(20, 'diamond', 85, 'Dobro. Verticals add chin presence.'),
(20, 'oblong', 70, 'Oprez. Vertical extensions may elongate further.'),

-- Walrus
(21, 'oval', 85, 'Dobro. Large walrus on balanced face works.'),
(21, 'square', 90, 'Odličan. Massive mustache complements strong features.'),
(21, 'round', 70, 'Oprez. Large horizontal element may add perceived width.'),
(21, 'triangle', 85, 'Dobro. Draws attention to center of face.'),
(21, 'diamond', 80, 'OK. Works with angular features.'),
(21, 'oblong', 80, 'OK. Doesn''t add length, but large element on long face is bold.');

-- =====================================================
-- 3. STYLE TRANSITIONS
-- =====================================================

INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps, notes) VALUES
-- Chevron transitions
(17, 18, 8, 'medium', '["Stop trimming ends", "Let ends grow past lip corners", "Begin wax training", "Style ends outward"]', 'Chevron to Handlebar'),
(17, 21, 8, 'easy', '["Stop trimming lip line", "Let grow over lip completely", "Allow natural drape", "Less maintenance"]', 'Chevron to Walrus'),
(17, 20, 6, 'easy-medium', '["Keep Chevron, stop trimming corners", "Let corners grow down", "Shape extensions as they develop"]', 'Chevron to Horseshoe'),
(NULL, 17, 8, 'easy-medium', '["Sedmica 1-4: Grow full face, then shave keeping mustache", "Sedmica 5-6: Begin shaping Chevron", "Sedmica 7-8: Refine, establish maintenance"]', 'Clean Shaven to Chevron'),

-- Handlebar transitions
(18, 17, 0, 'easy', '["Stop waxing", "Trim ends to lip-width", "Let natural shape develop", "Lower maintenance"]', 'Handlebar to Chevron'),
(18, 1, 10, 'easy', '["Stop shaving face", "Maintain handlebar styling", "Grow beard", "Combined look"]', 'Handlebar to Full Beard with Handlebar'),
(NULL, 18, 16, 'hard', '["Mjesec 1-2: Grow full mustache, begin wax training", "Mjesec 3-4: Develop handlebar shape", "Ongoing: Daily styling maintenance"]', 'Clean Shaven to Handlebar'),

-- Pencil transitions
(19, 17, 5, 'easy', '["Stop trimming to thin line", "Let grow wider", "When 10+ mm: Chevron territory", "Lower maintenance"]', 'Pencil to Chevron'),
(19, 18, 14, 'medium-hard', '["Let ends grow", "Let center thicken slightly", "Begin wax training", "Transition to handlebar styling"]', 'Pencil to Handlebar'),
(NULL, 19, 4, 'medium', '["Sedmica 1-3: Grow full mustache", "Sedmica 4: Shape to pencil thin line", "Ongoing: Daily precision maintenance"]', 'Clean Shaven to Pencil'),

-- Horseshoe transitions
(20, 17, 0, 'easy', '["Shave vertical extensions", "Keep mustache only", "Lower maintenance"]', 'Horseshoe to Chevron'),
(20, NULL, 6, 'easy-medium', '["Thin out extensions dramatically", "Let length grow longer", "Create thin, drooping strands"]', 'Horseshoe to Fu Manchu'),
(20, 1, 10, 'easy', '["Stop shaving chin", "Stop shaving cheeks", "Let connect", "Full beard achieved"]', 'Horseshoe to Full Beard'),
(NULL, 20, 10, 'medium', '["Sedmica 1-4: Grow full mustache + corner areas", "Sedmica 5-8: Begin horseshoe shaping", "Sedmica 9-12: Develop full extensions"]', 'Clean Shaven to Horseshoe'),

-- Walrus transitions
(21, 17, 0, 'easy', '["Trim lip line clear", "Shape to Chevron dimensions", "Regular maintenance begins"]', 'Walrus to Chevron'),
(21, 18, 2, 'medium', '["Trim center if needed", "Train ends outward", "Begin wax styling"]', 'Walrus to Handlebar'),
(NULL, 21, 20, 'easy', '["Mjesec 1-3: Grow without trimming", "Mjesec 4-6: Continue, minimal intervention", "Ongoing: Maintenance only"]', 'Clean Shaven to Walrus');

-- =====================================================
-- 4. LIFESTYLE TAGS
-- =====================================================

INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
(43, 'Classic Authority', 'classic-authority', 'aesthetic'),
(44, '70s-80s Aesthetic', 'seventies-eighties', 'era'),
(45, 'Victorian Era', 'victorian-era', 'era'),
(46, 'Hollywood Golden Age', 'hollywood-golden-age', 'era'),
(47, 'Biker Culture', 'biker-culture', 'lifestyle'),
(48, 'Old Frontier', 'old-frontier', 'era'),
(49, 'Daily Grooming Ritual', 'daily-grooming-ritual', 'commitment'),
(50, 'Statement Facial Hair', 'statement-facial-hair', 'aesthetic')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. STYLE-LIFESTYLE TAG ASSOCIATIONS
-- =====================================================

INSERT INTO style_lifestyle_tags (beard_style_id, lifestyle_tag_id, relevance_score) VALUES
-- Chevron
(17, 43, 95),  -- Classic Authority
(17, 44, 95),  -- 70s-80s Aesthetic
(17, 21, 85),  -- Professional Image
(17, 38, 90),  -- Everyday Practical

-- Handlebar
(18, 45, 95),  -- Victorian Era
(18, 26, 95),  -- Artistic Style
(18, 49, 100), -- Daily Grooming Ritual
(18, 50, 95),  -- Statement Facial Hair

-- Pencil
(19, 46, 95),  -- Hollywood Golden Age
(19, 32, 100), -- Precision Obsessed
(19, 25, 90),  -- Distinguished Look
(19, 27, 95),  -- Vintage Aesthetics

-- Horseshoe
(20, 47, 100), -- Biker Culture
(20, 50, 95),  -- Statement Facial Hair
(20, 36, 90),  -- Rugged Appeal
(20, 42, 90),  -- Statement Look

-- Walrus
(21, 48, 95),  -- Old Frontier
(21, 25, 90),  -- Distinguished Look
(21, 31, 90),  -- Low Maintenance
(21, 50, 85);  -- Statement Facial Hair

-- =====================================================
-- 6. STYLE COMPARISONS
-- =====================================================

INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_summary, key_differences, similarity_score) VALUES
(17, 18, 'Chevron i Handlebar su thick mustache stilovi',
 '{"Chevron": "Natural thick, no wax, 70s-80s look", "Handlebar": "Styled with wax, extended ends, Victorian", "shared": "Both thick mustache styles"}',
 55),
(17, 21, 'Chevron i Walrus su thick natural mustache stilovi',
 '{"Chevron": "Trimmed, controlled, lip partially covered", "Walrus": "Massive, untrimmed, lip completely covered", "shared": "Both thick, natural, no wax styling"}',
 65),
(18, 19, 'Handlebar i Pencil su styled precision stilovi',
 '{"Handlebar": "Wax styled, thick, extended", "Pencil": "Precision cut, thin line, no wax", "shared": "Both require high maintenance and skill"}',
 40),
(19, 17, 'Pencil i Chevron su kontrastni pristup thickness',
 '{"Pencil": "Ultra-thin line, precision cut, 1930s-40s", "Chevron": "Thick block, natural, 1970s-80s", "shared": "Both classic mustache styles, no wax"}',
 30),
(20, 21, 'Horseshoe i Walrus su massive mustache stilovi',
 '{"Horseshoe": "Full mustache + vertical extensions, biker", "Walrus": "Massive horizontal drape, frontier", "shared": "Both large, dramatic mustache styles"}',
 50);

COMMIT;
