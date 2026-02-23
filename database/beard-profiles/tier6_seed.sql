-- =====================================================
-- TIER 6: SIDEBURNS & EXTENSIONS - SQL SEED
-- Stilovi: Mutton Chops, Friendly Mutton Chops, Chin Curtain
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

-- MUTTON CHOPS
(
    22,
    'Mutton Chops',
    'mutton-chops',
    6,
    'sideburns-extensions',
    4.0, 15.0, 8.0,
    'medium-high',
    55,
    'Mutton Chops su klasični, dramatic sideburn stil koji se proteže od linije kose niz obraze prema vilici, ali NE povezuje se preko brade. Victorian era statement look.',
    'Wide sideburns extending to jaw - Victorian classic, Wolverine style.',
    '{
        "vertical_length_cm": 14,
        "horizontal_width_cm": {
            "narrow": "5-7",
            "standard": "7-10",
            "wide": "10-12"
        },
        "bottom_boundary": "jawline ili blago ispod",
        "chin_gap": {
            "required": true,
            "width_cm": 9
        },
        "mustache": "NEMA ili odvojen",
        "shape": {
            "type": "flared/widening toward bottom",
            "silhouette": "lamb chop"
        },
        "density_requirements": {
            "fill_factor_min": 85
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "outer_edge_days": 6,
            "jawline_edge_days": 6,
            "cheek_line_days": 6,
            "chin_shave_days": 2.5,
            "upper_lip_shave_days": 2.5,
            "length_trim_days": 12
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Trimmer sa guards (10-20 mm)",
            "Precision trimmer (0 mm)",
            "Razor",
            "Beard scissors",
            "Wide-tooth comb"
        ],
        "products": {
            "beard_oil_drops": 5,
            "beard_balm": "za shaping i hold",
            "aftershave": "za shaved areas",
            "styling_balm": "optional"
        },
        "time_per_session_minutes": 15,
        "weekly_investment_minutes": 55
    }'::jsonb,
    '[
        "Chin MORA biti čist - connected = Friendly Mutton Chops",
        "Upper lip MORA biti čist",
        "Flare je characteristic - šire prema dolje",
        "Symmetry critical - identical chops",
        "Full cheek coverage required",
        "Width matters - thin isn''t mutton",
        "Clean edges - intentional not neglected",
        "Era-appropriate boldness - own it"
    ]'::jsonb,
    '{
        "total_weeks": 10,
        "dramatic_weeks": 14,
        "phases": [
            {
                "name": "Full Growth",
                "weeks": "1-6",
                "description": "Grow full face. No shaping yet."
            },
            {
                "name": "Shaping",
                "weeks": "7-8",
                "description": "Shave chin, upper lip. Define outer edges. Create flared shape."
            },
            {
                "name": "Development & Maintenance",
                "weeks": "9+",
                "description": "Continued growth, regular edge maintenance, chin/lip shaving."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "cheek_hair_density": "CRITICAL - must be thick on cheeks",
        "chin_lip_shaving": "regular maintenance required",
        "commitment": "medium-high",
        "styling_skill": "medium",
        "social_comfort": "must be OK with very distinctive look",
        "facial_hair_pattern": "full cheek growth required"
    }'::jsonb,
    NOW(), NOW()
),

-- FRIENDLY MUTTON CHOPS
(
    23,
    'Friendly Mutton Chops',
    'friendly-mutton-chops',
    6,
    'sideburns-extensions',
    4.0, 15.0, 8.0,
    'medium',
    42.5,
    'Friendly Mutton Chops uključuju mustache koji povezuje oba chopa preko gornje usne. Friendly dolazi od toga što connected brkovi čine lice prijateljskijim. Civil War era classic.',
    'Wide sideburns + connected mustache - Civil War era, Burnside style.',
    '{
        "vertical_length_cm": 14,
        "horizontal_width_chops_cm": 8.5,
        "mustache": {
            "status": "OBAVEZAN, CONNECTED",
            "connects": "lijevi i desni chop",
            "style": "full ili Chevron"
        },
        "chin": {
            "status": "CLEAN",
            "gap_cm": 6
        },
        "shape": {
            "type": "connected U-shape",
            "chops_flare": true
        },
        "density_requirements": {
            "fill_factor_min": 85,
            "thick_mustache_required": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "outer_chop_edges_days": 6,
            "jawline_edge_days": 6,
            "mustache_lip_line_days": 4,
            "chin_shave_days": 2.5,
            "length_trim_days": 12
        },
        "sessions_per_week": 3,
        "tools": [
            "Trimmer sa guards (10-20 mm)",
            "Precision trimmer (0 mm)",
            "Razor za chin",
            "Beard scissors",
            "Wide-tooth comb"
        ],
        "products": {
            "beard_oil_drops": 6.5,
            "beard_balm": "za shaping",
            "aftershave": "za chin area"
        },
        "time_per_session_minutes": 12.5,
        "weekly_investment_minutes": 42.5
    }'::jsonb,
    '[
        "Mustache MORA biti connected - ovo je friendly element",
        "Chin MORA biti čist - connected = Full Beard",
        "Chops moraju biti substantial - thin = Horseshoe area",
        "Flare characteristic preserved",
        "Seamless mustache-chop connection",
        "Symmetry essential",
        "Mustache style integrated with chop density",
        "Chin gap clearly defined"
    ]'::jsonb,
    '{
        "total_weeks": 10,
        "dramatic_weeks": 14,
        "phases": [
            {
                "name": "Full Growth",
                "weeks": "1-6",
                "description": "Grow full face including mustache."
            },
            {
                "name": "Shaping",
                "weeks": "7-8",
                "description": "Shave chin only. Keep mustache connected. Define edges, create flare."
            },
            {
                "name": "Maintenance",
                "weeks": "9+",
                "description": "Regular edge maintenance. Chin shaving ongoing."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "cheek_mustache_density": "must be thick on both",
        "chin_shaving": "regular maintenance",
        "commitment": "medium",
        "styling_skill": "medium",
        "connection_ability": "mustache must connect naturally",
        "facial_hair_pattern": "full cheek and lip growth required"
    }'::jsonb,
    NOW(), NOW()
),

-- CHIN CURTAIN
(
    24,
    'Chin Curtain',
    'chin-curtain',
    6,
    'sideburns-extensions',
    3.0, 15.0, 6.0,
    'medium',
    45,
    'Chin Curtain prati liniju vilice od uha do uha, pokrivajući chin ali ostavljajući gornju usnu čistom. Lincoln Beard, Amish Beard, Donegal varijante.',
    'Jawline beard without mustache - Lincoln/Amish style.',
    '{
        "horizontal_coverage": "od uha do uha",
        "chin_coverage": "potpuno",
        "length_cm": {
            "short": "3-5",
            "medium": "5-10",
            "long_amish": "10-15+"
        },
        "width_cm": {
            "narrow": "3-4",
            "medium": "4-6",
            "wide": "6-8"
        },
        "mustache": "NEMA - defining characteristic",
        "cheek_coverage": "minimal ili none",
        "sideburns": {
            "options": ["connected", "separate"],
            "both_valid": true
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "length_days": 10.5,
            "jawline_edge_days": 6,
            "upper_lip_shave_days": 1.5,
            "cheek_shave_days": 2.5
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Trimmer sa guards (4-15+ mm)",
            "Precision trimmer (0 mm)",
            "Razor za mustache i cheeks",
            "Beard scissors",
            "Comb"
        ],
        "products": {
            "beard_oil_drops": 4.5,
            "beard_balm": "za shaping if styling",
            "aftershave": "za shaved areas"
        },
        "time_per_session_minutes": 12.5,
        "weekly_investment_minutes": 45
    }'::jsonb,
    '[
        "Mustache MORA biti odsutan - connected = Full Beard",
        "Jawline to jawline connection - must connect ear to ear",
        "Cheeks MORAJU biti čisti",
        "Width substantial - too thin = Chin Strap",
        "Upper lip shave non-negotiable",
        "Symmetry important",
        "Length choice - short ili long, but consistent",
        "Ear connection required"
    ]'::jsonb,
    '{
        "short_weeks": 6,
        "long_weeks": 18,
        "phases": [
            {
                "name": "Full Growth",
                "weeks": "1-4",
                "description": "Grow full face for easier shaping."
            },
            {
                "name": "Shaping",
                "weeks": "5-6",
                "description": "Shave mustache, cheeks. Define jawline edges. Create curtain shape."
            },
            {
                "name": "Maintenance ili Growth",
                "weeks": "7+",
                "description": "If short: maintenance mode. If Amish-length: continue growing."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "jaw_hair_density": "must grow along jawline",
        "mustache_discipline": "regular shaving required",
        "commitment": "medium",
        "styling_skill": "low-medium",
        "connection_ability": "hair must connect ear to ear",
        "cultural_awareness": "understand Amish/religious associations"
    }'::jsonb,
    NOW(), NOW()
);

-- =====================================================
-- 2. FACE SHAPE COMPATIBILITY
-- =====================================================

INSERT INTO face_shape_compatibility (beard_style_id, face_shape, score, explanation) VALUES
-- Mutton Chops
(22, 'oval', 85, 'Dobro. Chops add width interest bez too much distortion.'),
(22, 'square', 90, 'Odličan. Wide chops complement strong angular features.'),
(22, 'round', 65, 'Oprez. Wide chops may add more width to already round face.'),
(22, 'triangle', 85, 'Dobro. Chops balance wider jaw by adding upper face width.'),
(22, 'diamond', 80, 'OK. Works with cheekbones but adds side width.'),
(22, 'oblong', 90, 'Odličan. Horizontal width helps balance long face.'),

-- Friendly Mutton Chops
(23, 'oval', 85, 'Dobro. Connected frame adds interest.'),
(23, 'square', 90, 'Odličan. Complements strong features well.'),
(23, 'round', 70, 'Oprez. Adds width, but connected line helps frame.'),
(23, 'triangle', 85, 'Dobro. Upper face width balances jaw.'),
(23, 'diamond', 80, 'OK. Works with cheekbones.'),
(23, 'oblong', 90, 'Odličan. Horizontal emphasis helps long face.'),

-- Chin Curtain
(24, 'oval', 90, 'Odličan. Chin Curtain frames balanced face well.'),
(24, 'square', 85, 'Dobro. Emphasizes jawline, might be too much angular emphasis.'),
(24, 'round', 95, 'Idealno. Curtain adds definition i elongates round face.'),
(24, 'triangle', 80, 'OK. Additional jaw emphasis may not be ideal.'),
(24, 'diamond', 90, 'Odličan. Adds chin width, balances cheekbones.'),
(24, 'oblong', 80, 'OK. Doesn''t add length, but jaw emphasis variable.');

-- =====================================================
-- 3. STYLE TRANSITIONS
-- =====================================================

INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps, notes) VALUES
-- Mutton Chops transitions
(22, 23, 5, 'easy', '["Grow mustache", "Connect to chops", "Same chop maintenance"]', 'Mutton Chops to Friendly Mutton Chops'),
(22, 1, 8, 'easy', '["Stop shaving chin", "Stop shaving upper lip", "Let connect", "Full beard"]', 'Mutton Chops to Full Beard'),
(NULL, 22, 9, 'medium', '["Sedmica 1-6: Grow full face", "Sedmica 7: Shave chin/lip, shape chops", "Sedmica 8+: Refine and maintain"]', 'Clean Shaven to Mutton Chops'),

-- Friendly Mutton Chops transitions
(23, 22, 0, 'easy', '["Shave mustache", "Keep chops", "Regular Mutton Chops"]', 'Friendly to Regular Mutton Chops'),
(23, 1, 7, 'easy', '["Stop shaving chin", "Let connect", "Full beard develops"]', 'Friendly Mutton Chops to Full Beard'),
(1, 23, 0, 'easy', '["Shave chin only", "Keep mustache and cheeks", "Define chop edges"]', 'Full Beard to Friendly Mutton Chops'),
(NULL, 23, 9, 'medium', '["Sedmica 1-6: Grow full face", "Sedmica 7: Shave chin only, keep mustache connected", "Sedmica 8+: Refine and maintain"]', 'Clean Shaven to Friendly Mutton Chops'),

-- Chin Curtain transitions
(24, 1, 5, 'easy', '["Grow mustache", "Let cheeks fill if desired", "Connect", "Full beard"]', 'Chin Curtain to Full Beard'),
(24, NULL, 0, 'easy', '["Trim width to thin line", "Same shape, less width", "Chin Strap achieved"]', 'Chin Curtain to Chin Strap'),
(24, NULL, 14, 'easy', '["Stop trimming length", "Maintain mustache clean", "Let grow naturally", "Long Amish style"]', 'Chin Curtain to Amish Long'),
(1, 24, 0, 'easy', '["Shave mustache", "Shave cheeks", "Define jawline coverage"]', 'Full Beard to Chin Curtain'),
(NULL, 24, 6, 'medium', '["Sedmica 1-4: Grow full face", "Sedmica 5: Shave mustache i cheeks, define curtain", "Sedmica 6+: Refine and maintain ili grow"]', 'Clean Shaven to Chin Curtain');

-- =====================================================
-- 4. LIFESTYLE TAGS
-- =====================================================

INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
(51, 'Victorian Era Style', 'victorian-era-style', 'era'),
(52, 'Civil War Era', 'civil-war-era', 'era'),
(53, 'Historical Reenactment', 'historical-reenactment', 'lifestyle'),
(54, 'Religious/Traditional', 'religious-traditional', 'lifestyle'),
(55, 'Bold Statement', 'bold-statement', 'aesthetic'),
(56, 'Wolverine Look', 'wolverine-look', 'pop-culture')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. STYLE-LIFESTYLE TAG ASSOCIATIONS
-- =====================================================

INSERT INTO style_lifestyle_tags (beard_style_id, lifestyle_tag_id, relevance_score) VALUES
-- Mutton Chops
(22, 51, 95),  -- Victorian Era Style
(22, 55, 100), -- Bold Statement
(22, 56, 95),  -- Wolverine Look
(22, 53, 85),  -- Historical Reenactment
(22, 50, 95),  -- Statement Facial Hair

-- Friendly Mutton Chops
(23, 52, 95),  -- Civil War Era
(23, 55, 90),  -- Bold Statement
(23, 53, 90),  -- Historical Reenactment
(23, 51, 85),  -- Victorian Era Style

-- Chin Curtain
(24, 54, 95),  -- Religious/Traditional
(24, 52, 85),  -- Civil War Era (Lincoln)
(24, 53, 90),  -- Historical Reenactment
(24, 25, 85);  -- Distinguished Look

-- =====================================================
-- 6. STYLE COMPARISONS
-- =====================================================

INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_summary, key_differences, similarity_score) VALUES
(22, 23, 'Mutton Chops i Friendly verzija razlikuju se po mustache',
 '{"Mutton Chops": "Clean upper lip, disconnected chops, Victorian", "Friendly Mutton Chops": "Connected mustache forms U-shape, Civil War era", "shared": "Both have wide flared chops, clean chin"}',
 85),
(22, 24, 'Mutton Chops i Chin Curtain su kontrastni cheek vs jaw stilovi',
 '{"Mutton Chops": "Wide cheek coverage, clean chin, no mustache", "Chin Curtain": "Jawline coverage, clean cheeks, no mustache", "shared": "Both have no mustache, distinctive Victorian-era looks"}',
 40),
(23, 24, 'Friendly Mutton Chops i Chin Curtain imaju različite coverage zone',
 '{"Friendly Mutton Chops": "Cheeks + connected mustache, clean chin", "Chin Curtain": "Jawline + chin, clean cheeks and lip", "shared": "Both are distinctive period styles"}',
 35),
(22, 1, 'Mutton Chops su dramatic alternative to Full Beard',
 '{"Mutton Chops": "Cheeks only, clean chin and lip, Victorian drama", "Full Beard": "Full coverage, integrated look", "shared": "Both require substantial cheek growth"}',
 45);

COMMIT;
