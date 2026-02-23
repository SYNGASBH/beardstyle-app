-- =====================================================
-- TIER 3: GOATEES & PARTIAL BEARDS - SQL SEED
-- Stilovi: Van Dyke, Goatee, Anchor, Circle Beard
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

-- VAN DYKE
(
    9,
    'Van Dyke',
    'van-dyke',
    3,
    'goatee-partial',
    4.0, 10.0, 6.0,
    'high',
    65,
    'Van Dyke je klasični, umjetnički beard stil nazvan po flamanskom slikaru Anthonyju van Dycku. Karakterizira ga odvojena kombinacija pointed goatee-a i brkova, sa potpuno čistim obrazima.',
    'Umjetnički stil sa odvojenim pointed goatee-om i styled brkovima.',
    '{
        "goatee_length": {
            "min_cm": 4,
            "max_cm": 10,
            "optimal_cm": 6,
            "notes": "<4 cm prelazi u stubble; >10 cm je extended"
        },
        "goatee_width_cm": 6,
        "bottom_contour": {
            "shape": "pointed",
            "point_angle_degrees": 40,
            "centered": true
        },
        "cheek_area": "potpuno čista - dealbreaker",
        "sideburn_gap_cm": 4,
        "mustache": {
            "separation": "ne dodiruje goatee - čist gap",
            "gap_width_cm": 1.25,
            "style": "handlebar, chevron, pencil, ili natural",
            "wax_allowed": true,
            "length": "varira - 0.5 cm do 3+ cm za handlebar"
        },
        "soul_patch": {
            "optional": true,
            "width_cm": 1.25
        },
        "volume_projection_percent": 17.5,
        "depth_cm": 3.5,
        "texture_requirements": {
            "fill_factor_min": 90,
            "cheek_stray_tolerance": "zero",
            "preferred": "straight-to-wavy"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "goatee_shape_days": 6,
            "point_definition_days": 6,
            "cheek_shave_days": 2.5,
            "mustache_days": 4,
            "gap_maintenance_days": 3.5
        },
        "sessions_per_week": 4.5,
        "tools": [
            "Precision trimmer (0 mm blade)",
            "Razor/safety razor",
            "Trimmer sa guards (4-12 mm)",
            "Beard scissors",
            "Fine-tooth comb",
            "Mustache wax",
            "Mustache comb"
        ],
        "products": {
            "beard_oil_drops": 3,
            "mustache_wax": "za styling",
            "beard_balm": "za goatee hold",
            "shaving_cream": "za cheek area",
            "aftershave_balm": "za cheek area"
        },
        "time_per_session_minutes": 15,
        "weekly_investment_minutes": 65
    }'::jsonb,
    '[
        "Brkovi i brada moraju biti ODVOJENI - non-negotiable",
        "Point mora biti centered i defined",
        "Obrazi moraju biti potpuno čisti - clean shave svakih 2-3 dana",
        "Goatee je narrow, ne wide - chin coverage, ne jaw",
        "Brkovi su statement element - often styled",
        "Simetrija je kritična",
        "Gap mora biti vidljiv (min 5mm)",
        "Maintain artistic intention - mora izgledati namjerno"
    ]'::jsonb,
    '{
        "total_weeks": 6,
        "minimum_growth_cm": 4,
        "phases": [
            {
                "name": "Full Face Growth",
                "weeks": "1-4",
                "description": "Grow entire face - NO shaving. Reaching ~4 cm."
            },
            {
                "name": "Initial Shaping",
                "weeks": "5-6",
                "description": "MAJOR SHAPING: Shave cheeks, define goatee, create point, separate mustache, create gap."
            },
            {
                "name": "Maintenance",
                "weeks": "7+",
                "description": "Cheek shaving svakih 2-3 dana, goatee trim svakih 5-7 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "cheek_hair": "ability to grow full cheeks required",
        "chin_growth": "strong chin growth za defined point",
        "maintenance_commitment": "cheek shaving svakih 2-3 dana",
        "styling_skill": "moderate-to-high",
        "mustache_growth": "mora biti sposoban za growth odvojenih brkova"
    }'::jsonb,
    NOW(), NOW()
),

-- GOATEE
(
    10,
    'Goatee',
    'goatee',
    3,
    'goatee-partial',
    1.0, 8.0, 3.0,
    'medium',
    27.5,
    'Goatee je minimalistički, chin-focused beard stil koji pokriva samo bradu bez pokrivanja obraza ili, u čistoj formi, bez brkova. Jedan od najstarijih i najprepoznatljivijih facial hair stilova.',
    'Minimalistički chin-focused stil - čist, jednostavan, versatilan.',
    '{
        "length": {
            "short_cm": "1-3",
            "medium_cm": "3-5",
            "long_cm": "5-8",
            "optimal_cm": 3
        },
        "width": {
            "narrow_cm": "3-4",
            "medium_cm": "4-5",
            "wide_cm": "5-7",
            "notes": "ne prelazi na jawline"
        },
        "bottom_contour": {
            "options": ["rounded", "pointed", "natural"],
            "notes": "shape choice je personalizacija"
        },
        "cheek_area": "čista - nema dlaka",
        "mustache": {
            "status": "OPCIONALNO",
            "if_connected": "becomes Circle Beard",
            "if_separated": "becomes Van Dyke variant"
        },
        "soul_patch": {
            "often_present": true,
            "width_cm": 1.25
        },
        "volume_projection_percent": 10,
        "depth_cm": 2.5,
        "texture_requirements": {
            "fill_factor_min": 85,
            "stray_tolerance": "minimal on cheeks",
            "any_texture_works": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "goatee_length_days": 7.5,
            "goatee_shape_days": 6,
            "cheek_maintenance_days": 3,
            "mustache_days": 4
        },
        "sessions_per_week": 2.5,
        "tools": [
            "Precision trimmer (0 mm blade)",
            "Trimmer sa guards (2-10 mm)",
            "Razor",
            "Beard scissors",
            "Fine-tooth comb"
        ],
        "products": {
            "beard_oil_drops": 2,
            "beard_balm": "optional",
            "shaving_cream": "za cheek area",
            "aftershave": "za cheek area"
        },
        "time_per_session_minutes": 7.5,
        "weekly_investment_minutes": 27.5
    }'::jsonb,
    '[
        "Fokus na chin, ne jaw - čim se proširuje na jawline, postaje Balbo/extended",
        "Obrazi moraju biti čisti",
        "Shape consistency - rounded, pointed, ili natural - održavaj konzistentno",
        "Centering je kritičan - mora biti centered na bradi",
        "Brkovi su opcioni element",
        "Width proportional to chin",
        "Edge definition matters - defined edges čine goatee intentional",
        "Length appropriate to width"
    ]'::jsonb,
    '{
        "total_weeks": 4,
        "minimum_growth_cm": 2,
        "phases": [
            {
                "name": "Initial Growth",
                "weeks": "1-2",
                "description": "Grow entire face OR define zone immediately. Define boundaries, shave cheeks."
            },
            {
                "name": "Shaping",
                "weeks": "3-4",
                "description": "Target length achieved. Refine shape, define edges, consider mustache."
            },
            {
                "name": "Maintenance",
                "weeks": "5+",
                "description": "Cheek maintenance svakih 2-4 dana, goatee trim svakih 5-10 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "chin_hair_density": "mora biti dovoljna - patchy chin problematično",
        "cheek_maintenance": "ability to maintain clean or stubble cheeks",
        "commitment": "low-to-medium (2-3 sessiona sedmično)",
        "styling_skill": "low - jedan od easiest stilova"
    }'::jsonb,
    NOW(), NOW()
),

-- ANCHOR
(
    11,
    'Anchor Beard',
    'anchor-beard',
    3,
    'goatee-partial',
    3.0, 7.0, 5.0,
    'very-high',
    85,
    'Anchor Beard je precision-styled beard koji kombinuje pointed chin beard sa thin mustache linijom, formirajući oblik brodskog sidra. Karakterističan po thin jawline extensions.',
    'Precision stil u obliku sidra sa thin jawline extensions.',
    '{
        "chin_beard_length": {
            "min_cm": 3,
            "max_cm": 7,
            "optimal_cm": 5
        },
        "chin_beard_shape": {
            "type": "pointed, inverted triangle",
            "point_angle_degrees": 37.5,
            "centered": true
        },
        "jawline_extensions": {
            "width_cm": 1,
            "description": "THIN lines duž jawline",
            "length": "od chin beard do mid-cheek ili dalje",
            "symmetry": "IDENTIČNE na obje strane"
        },
        "cheek_area": "potpuno čista iznad extensions",
        "soul_patch": {
            "connected": true,
            "width_cm": 1.5,
            "function": "stem of anchor shape"
        },
        "mustache": {
            "type": "thin line, odvojeni",
            "width_cm": 0.65,
            "style": "pencil ili thin natural",
            "gap_from_chin_cm": 1
        },
        "volume_projection_percent": 15,
        "depth_cm": 3,
        "texture_requirements": {
            "fill_factor_min": 95,
            "stray_tolerance": "ZERO",
            "preferred": "straight - curly problematičan za thin lines"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "chin_point_days": 6,
            "jawline_extensions_days": 4,
            "pencil_mustache_days": 2.5,
            "cheek_shave_days": 1.5,
            "neckline_days": 4,
            "gap_maintenance_days": 2.5
        },
        "sessions_per_week": 5.5,
        "tools": [
            "Precision trimmer (0 mm blade) - ESSENTIAL",
            "Detail trimmer sa ultra-thin head",
            "Straight razor ili safety razor",
            "Fine scissors",
            "Magnifying mirror",
            "Stencil/template (optional)"
        ],
        "products": {
            "beard_oil_drops": 1.5,
            "shaving_cream": "za frequent cheek shaving",
            "aftershave_balm": "za soothed skin",
            "precision_edge_gel": "za defined lines",
            "mustache_wax": "minimal za thin mustache"
        },
        "time_per_session_minutes": 20,
        "weekly_investment_minutes": 85
    }'::jsonb,
    '[
        "Extensions moraju biti THIN (0.5-1.5 cm max)",
        "Point mora biti oštro defined",
        "Extensions moraju biti IDENTIČNE - koristiti mjerne alate",
        "Mustache mora biti thin pencil style",
        "Gap između mustache i chin je obavezan",
        "Cheeks iznad extensions moraju biti ČISTI",
        "Extensions prate natural jawline curve",
        "Daily maintenance je non-negotiable",
        "Simetrija je KRITIČNA"
    ]'::jsonb,
    '{
        "total_weeks": 8,
        "minimum_growth_cm": 4,
        "skill_development_weeks": 3,
        "phases": [
            {
                "name": "Full Growth",
                "weeks": "1-4",
                "description": "Grow entire face. Planning phase - study jawline."
            },
            {
                "name": "Initial Anchor Shaping",
                "weeks": "5-6",
                "description": "MAJOR SHAPING: Define pointed chin, shave cheeks except extensions, create thin mustache, create gap."
            },
            {
                "name": "Precision Maintenance",
                "weeks": "7+",
                "description": "Daily touch-ups. Extensions require constant attention. Almost daily cheek shaving."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "jawline_definition": "clear natural jawline required",
        "cheek_shaving_frequency": "daily/near-daily comfortable",
        "precision_skill": "high hand-eye coordination",
        "weekly_time_minutes": "70-100 non-negotiable",
        "hair_texture": "straight preferred",
        "facial_hair_density": "high on chin i jawline",
        "patience": "mastering takes 4-8 weeks practice"
    }'::jsonb,
    NOW(), NOW()
),

-- CIRCLE BEARD
(
    12,
    'Circle Beard',
    'circle-beard',
    3,
    'goatee-partial',
    2.0, 6.0, 3.0,
    'medium',
    32.5,
    'Circle Beard kombinuje goatee sa connected mustache, formirajući kružni ili ovalni oblik oko usta. Poznat i kao door knocker - jedan od najuniverzalnijih facial hair opcija.',
    'Goatee sa connected mustache u kružnom obliku oko usta.',
    '{
        "goatee_length": {
            "short_cm": "2-3",
            "medium_cm": "3-4",
            "long_cm": "4-6",
            "optimal_cm": 3.25
        },
        "circle_width_cm": 7,
        "width_margin": "0.5-2 cm šire od uglova usana na svakoj strani",
        "bottom_contour": {
            "shape": "rounded ili natural",
            "radius_cm": 4,
            "notes": "follows natural chin curve"
        },
        "connection_zone": {
            "status": "OBAVEZNO connected",
            "width_cm": 1.25,
            "point": "corners of mouth area",
            "no_gap": "ovo razlikuje od Van Dyke"
        },
        "cheek_area": "čista ili uniform stubble",
        "mustache": {
            "style": "connected, natural-to-styled",
            "options": ["natural full", "chevron", "shaped"],
            "length_beyond_corners_cm": 1,
            "lip_clearance_mm": 1.5
        },
        "neckline": {
            "options": ["defined", "natural"],
            "position": "1-2 prsta iznad Adam''s apple"
        },
        "volume_projection_percent": 15,
        "depth_cm": 2.5,
        "texture_requirements": {
            "fill_factor_min": 85,
            "stray_tolerance": "minimal outside boundary",
            "any_texture_works": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "goatee_length_days": 7.5,
            "circle_boundary_days": 5.5,
            "mustache_days": 4,
            "cheek_maintenance_days": 3,
            "neckline_days": 6
        },
        "sessions_per_week": 2.5,
        "tools": [
            "Trimmer sa guards (3-8 mm)",
            "Precision trimmer (0 mm blade)",
            "Razor",
            "Beard scissors",
            "Comb"
        ],
        "products": {
            "beard_oil_drops": 3,
            "beard_balm": "optional",
            "shaving_cream": "za cheek area",
            "aftershave": "za cheek area"
        },
        "time_per_session_minutes": 10,
        "weekly_investment_minutes": 32.5
    }'::jsonb,
    '[
        "Mustache MORA biti connected - defining characteristic",
        "Shape treba biti circular/oval - smooth, rounded boundaries",
        "Obrazi moraju biti čisti - highlight the circle",
        "Proportional width - ne previše široko",
        "Connection mora biti solid - ne thin/weak",
        "Symmetry is important",
        "Rounded bottom - ne pointed",
        "Consistent density - mustache i goatee slična density"
    ]'::jsonb,
    '{
        "total_weeks": 4,
        "minimum_growth_cm": 2,
        "phases": [
            {
                "name": "Initial Growth",
                "weeks": "1-2",
                "description": "Grow full face OR define zone early. Define circle boundaries, shave cheeks."
            },
            {
                "name": "Shaping",
                "weeks": "3-4",
                "description": "Target length achieved. Refine circular shape, perfect connection points."
            },
            {
                "name": "Maintenance",
                "weeks": "5+",
                "description": "Cheek maintenance svakih 2-4 dana, circle trim svakih 5-10 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "chin_and_mustache_growth": "must be able to grow connected areas",
        "connection_ability": "natural connection possible required",
        "commitment": "medium (2-3 sessiona sedmično)",
        "styling_skill": "low-to-medium - accessible for beginners",
        "uniform_growth": "around mouth required"
    }'::jsonb,
    NOW(), NOW()
);

-- =====================================================
-- 2. FACE SHAPE COMPATIBILITY
-- =====================================================

INSERT INTO face_shape_compatibility (beard_style_id, face_shape, score, explanation) VALUES
-- Van Dyke
(9, 'oval', 90, 'Odličan. Pointed goatee adds interest bez disrupting balanced proportions.'),
(9, 'square', 85, 'Dobro. Point softens angular chin. Adds artistic flair to strong features.'),
(9, 'round', 95, 'Idealno. Point elongates round face vizualno. Best match za Van Dyke.'),
(9, 'triangle', 70, 'Oprez. Već pointed chin + pointed goatee može biti too much point.'),
(9, 'diamond', 90, 'Radi odlično. Point balances narrow chin, complements cheekbones.'),
(9, 'oblong', 65, 'Risky. Point može dodatno elongirati već dugo lice. Consider rounded style.'),

-- Goatee
(10, 'oval', 90, 'Odličan. Goatee adds subtle interest bez disrupting balance.'),
(10, 'square', 80, 'Dobro. Softens angular chin subtly. Keep rounded shape.'),
(10, 'round', 95, 'Idealno. Goatee elongates round face, adds definition. Best match.'),
(10, 'triangle', 70, 'Oprez. Pointed goatee na pointed chin može biti too much.'),
(10, 'diamond', 85, 'Radi dobro. Adds chin definition, balances cheekbones.'),
(10, 'oblong', 75, 'OK ali pažljivo. Keep short (2-3 cm) da ne elongira dalje.'),

-- Anchor
(11, 'oval', 85, 'Dobro. Extensions frame balanced face nicely.'),
(11, 'square', 95, 'Idealno. Extensions emphasize strong jawline. Best match.'),
(11, 'round', 80, 'Radi. Extensions add definition, point elongates.'),
(11, 'triangle', 70, 'Oprez. Extensions emphasize already wide jaw. Consider alternatives.'),
(11, 'diamond', 90, 'Odličan. Extensions balance cheekbones, point adds chin.'),
(11, 'oblong', 65, 'Risky. Pointed chin adds more length. Extensions OK but point problematic.'),

-- Circle Beard
(12, 'oval', 95, 'Idealno. Circle complements balanced proportions perfectly.'),
(12, 'square', 85, 'Dobro. Rounded circle softens angular features.'),
(12, 'round', 80, 'OK. Rounded circle on round face može biti redundant.'),
(12, 'triangle', 85, 'Dobro. Circle adds balance to chin area bez emphasizing point.'),
(12, 'diamond', 90, 'Odličan. Circle adds chin definition, works with cheekbones.'),
(12, 'oblong', 85, 'Dobro. Circular shape doesn''t add length. Safe choice for long faces.');

-- =====================================================
-- 3. STYLE TRANSITIONS
-- =====================================================

INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps, notes) VALUES
-- Van Dyke transitions
(9, 12, 3, 'easy', '["Let mustache grow toward goatee", "Connect at corners", "Round off goatee point", "Lower maintenance once connected"]', 'Van Dyke to Circle Beard'),
(9, 1, 8, 'easy', '["Stop shaving cheeks", "Let cheeks fill in", "Connect mustache to beard", "At 5+ cm cheeks: full beard"]', 'Van Dyke to Full Beard'),
(9, 10, 1, 'easy', '["Remove styled mustache", "Keep goatee", "Or just stop separating", "Lower maintenance"]', 'Van Dyke to Goatee'),
(NULL, 9, 6, 'medium-hard', '["Sedmica 1-4: Grow full beard", "Sedmica 5: Shave cheeks, create point, separate mustache", "Sedmica 6: Refine point, style mustache"]', 'Clean Shaven to Van Dyke'),

-- Goatee transitions
(10, 12, 3, 'easy', '["Grow mustache if not present", "Connect mustache to goatee at corners", "Shape circular connection"]', 'Goatee to Circle Beard'),
(10, 9, 3, 'easy-medium', '["Grow styled mustache", "Keep mustache SEPARATED from goatee", "Form pointed shape", "Higher maintenance"]', 'Goatee to Van Dyke'),
(10, 1, 10, 'easy', '["Stop shaving cheeks", "Let full face grow", "Connect mustache when desired", "Shape full beard at 5+ cm"]', 'Goatee to Full Beard'),
(NULL, 10, 4, 'easy', '["Sedmica 1-2: Grow, define zone", "Sedmica 3: Shape goatee", "Sedmica 4+: Maintenance mode"]', 'Clean Shaven to Goatee'),

-- Anchor transitions
(11, 9, 1, 'easy', '["Shave jawline extensions", "Keep pointed chin", "Can grow fuller mustache", "Lower maintenance"]', 'Anchor to Van Dyke'),
(11, 10, 1, 'easy', '["Shave extensions", "Shave thin mustache", "Keep chin beard only", "Much lower maintenance"]', 'Anchor to Goatee'),
(11, NULL, 2, 'easy-medium', '["Shave pointed chin beard", "Extend thin line to full chin strap", "Remove mustache"]', 'Anchor to Chin Strap'),
(NULL, 11, 8, 'hard', '["Sedmica 1-4: Grow full beard", "Sedmica 5: Form anchor shape, shave cheeks except thin extensions", "Sedmica 6: Refine thin extensions, point", "Sedmica 7-8: Learn precision maintenance"]', 'Clean Shaven to Anchor'),

-- Circle Beard transitions
(12, 9, 4, 'medium', '["Create gap between mustache and goatee", "Form pointed chin shape", "Style mustache separately", "Higher maintenance begins"]', 'Circle Beard to Van Dyke'),
(12, 10, 1, 'easy', '["Remove mustache", "Keep goatee portion", "Lower maintenance"]', 'Circle Beard to Goatee'),
(12, 1, 10, 'easy', '["Stop shaving cheeks", "Let full face grow", "At 5+ cm: shape full beard"]', 'Circle Beard to Full Beard'),
(NULL, 12, 4, 'easy', '["Sedmica 1-2: Grow, define zone", "Sedmica 3: Shape circular boundary", "Sedmica 4+: Maintenance mode"]', 'Clean Shaven to Circle Beard');

-- =====================================================
-- 4. LIFESTYLE TAGS
-- =====================================================

INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
(26, 'Artistic Style', 'artistic-style', 'aesthetic'),
(27, 'Vintage Aesthetics', 'vintage-aesthetics', 'aesthetic'),
(28, 'Academic/Research', 'academic-research', 'work'),
(29, 'Entertainment/Media', 'entertainment-media', 'work'),
(30, 'Minimalist', 'minimalist', 'aesthetic'),
(31, 'Low Maintenance', 'low-maintenance', 'commitment'),
(32, 'Precision Obsessed', 'precision-obsessed', 'personality'),
(33, 'Nautical/Maritime', 'nautical-maritime', 'lifestyle'),
(34, 'Versatile Style', 'versatile-style', 'aesthetic'),
(35, 'Universal Appeal', 'universal-appeal', 'aesthetic')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. STYLE-LIFESTYLE TAG ASSOCIATIONS
-- =====================================================

INSERT INTO style_lifestyle_tags (beard_style_id, lifestyle_tag_id, relevance_score) VALUES
-- Van Dyke
(9, 26, 95),  -- Artistic Style
(9, 27, 90),  -- Vintage Aesthetics
(9, 28, 85),  -- Academic/Research
(9, 29, 85),  -- Entertainment/Media
(9, 25, 90),  -- Distinguished Look
(9, 20, 90),  -- Detail-Oriented

-- Goatee
(10, 30, 95),  -- Minimalist
(10, 31, 90),  -- Low Maintenance
(10, 34, 95),  -- Versatile Style
(10, 35, 95),  -- Universal Appeal
(10, 21, 85),  -- Professional Image

-- Anchor
(11, 32, 100), -- Precision Obsessed
(11, 33, 90),  -- Nautical/Maritime
(11, 23, 100), -- High Maintenance Willing
(11, 26, 85),  -- Artistic Style
(11, 20, 95),  -- Detail-Oriented

-- Circle Beard
(12, 34, 95),  -- Versatile Style
(12, 35, 100), -- Universal Appeal
(12, 21, 90),  -- Professional Image
(12, 31, 80),  -- Low Maintenance
(12, 30, 75);  -- Minimalist

-- =====================================================
-- 6. STYLE COMPARISONS
-- =====================================================

INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_summary, key_differences, similarity_score) VALUES
(9, 10, 'Van Dyke je styled verzija Goatee-a',
 '{"Van Dyke": "Pointed goatee + styled separated mustache, high maintenance", "Goatee": "Minimalist chin coverage, mustache optional, low maintenance", "shared": "Oba su chin-focused sa clean cheeks"}',
 65),
(9, 12, 'Van Dyke ima separated mustache dok Circle Beard ima connected',
 '{"Van Dyke": "Separated styled mustache, pointed goatee, artistic", "Circle Beard": "Connected mustache, rounded goatee, casual", "shared": "Oba su goatee-based styles sa clean cheeks"}',
 55),
(9, 8, 'Van Dyke i Balbo oba imaju separated mustache ali različitu width',
 '{"Van Dyke": "Narrow goatee (4-8 cm), pointed, chin-only coverage", "Balbo": "Wide coverage (8-14 cm), includes jawline, floating effect", "shared": "Oba imaju separated mustache i clean cheeks"}',
 60),
(10, 12, 'Goatee i Circle Beard su blisko povezani stilovi',
 '{"Goatee": "Chin only, mustache optional, minimalist", "Circle Beard": "Goatee + connected mustache, circular shape", "shared": "Oba su chin-focused sa clean cheeks, Circle is Goatee evolution"}',
 80),
(11, 9, 'Anchor i Van Dyke oba su precision pointed stilovi',
 '{"Anchor": "Pointed chin + thin jawline extensions + pencil mustache, very high maintenance", "Van Dyke": "Pointed goatee + styled separated mustache, no extensions, high maintenance", "shared": "Oba imaju pointed chin i separated mustache"}',
 55),
(11, 12, 'Anchor i Circle Beard su različiti po precision i complexity',
 '{"Anchor": "Thin extensions, pointed chin, pencil mustache, very high precision", "Circle Beard": "Rounded connected style, no extensions, medium maintenance", "shared": "Oba su partial beards sa clean cheeks"}',
 30);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Provjeri unesene stilove
-- SELECT id, name, tier, maintenance_level FROM beard_styles WHERE tier = 3 ORDER BY id;

-- Provjeri face shape compatibility
-- SELECT bs.name, fsc.face_shape, fsc.score
-- FROM face_shape_compatibility fsc
-- JOIN beard_styles bs ON fsc.beard_style_id = bs.id
-- WHERE bs.tier = 3 ORDER BY bs.id, fsc.score DESC;
