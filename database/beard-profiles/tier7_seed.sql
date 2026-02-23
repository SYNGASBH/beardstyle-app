-- =============================================
-- TIER 7: SPECIALTY & ARTISTIC BEARD STYLES
-- Verdi, Soul Patch, Chin Strap, Imperial, Hulihee
-- =============================================

-- =============================================
-- BEARD_STYLES TABLE INSERTS
-- =============================================

-- 25. Verdi
INSERT INTO beard_styles (
    id, name, slug, tier, category,
    min_length_cm, max_length_cm, optimal_length_cm,
    maintenance_level, weekly_time_minutes,
    description, summary,
    dimensions, maintenance, design_rules, growth_timeline, assumptions,
    created_at, updated_at
) VALUES (
    25,
    'Verdi',
    'verdi',
    7,
    'specialty',
    8.0,
    12.0,
    10.0,
    'high',
    75.0,
    'Verdi je distinguished, artistic full beard stil nazvan po Italian kompozitoru Giuseppe Verdiju. Karakterizira ga rounded, voluminous beard koji se drži relativno kratkim (do 10 cm), kombinovan sa prominent, separately styled mustache. Za razliku od natural full beard-a, Verdi zahtijeva redovno shaping i održavanje distinctivne separacije između brkova i brade.',
    'Umjetnički zaobljeni full beard sa separiranim stiliziranim brkovima, 8-12 cm dužine.',
    '{
        "beard_length_cm": {"min": 8, "max": 12, "optimal": 10},
        "beard_shape": "rounded, sculpted bottom",
        "cheek_coverage": "full, natural to slightly shaped",
        "mustache": {
            "style": "styled, waxed, prominent",
            "length_cm": {"min": 2, "max": 5},
            "separation": "distinctly separated from beard",
            "wax_required": true
        },
        "neckline": {
            "position": "1.5-2 prsta iznad Adams apple",
            "shape": "natural curve"
        },
        "volume_projection_percent": {"min": 25, "max": 40},
        "texture_requirements": {
            "fill_factor_min_percent": 85,
            "preferred_texture": "any"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "beard_shape": "svakih 7-10 dana",
            "mustache_styling": "svakih 3-5 dana",
            "cheek_line": "svakih 5-7 dana",
            "neckline": "svakih 5-7 dana"
        },
        "sessions_per_week": "3-4",
        "tools": ["trimmer sa guards 8-15 mm", "precision trimmer", "mustache wax", "beard scissors", "beard brush", "wide-tooth comb"],
        "products": ["beard oil 4-6 kapi", "beard balm", "mustache wax", "beard butter optional"],
        "time_per_session_minutes": {"min": 15, "max": 25},
        "weekly_total_minutes": {"min": 60, "max": 90}
    }'::jsonb,
    '[
        "Mustache mora biti SEPARATELY STYLED od beard-a",
        "Rounded bottom je essential - ni pointed ni square",
        "Mustache wax je recommended za proper separation",
        "Maximum 10 cm dužine - duže nije Verdi",
        "Cheeks mogu biti natural ili slightly shaped",
        "Overall impression treba biti cultivated i artistic",
        "Separation gap ispod nosa mora biti vidljiv",
        "Regular shaping maintains rounded silhouette"
    ]'::jsonb,
    '{
        "phases": [
            {
                "name": "Growth Phase",
                "duration_weeks": "8-10",
                "description": "Grow to 10 cm, allow full development"
            },
            {
                "name": "Shaping Phase",
                "duration_weeks": "2-3",
                "description": "Sculpt rounded shape, separate mustache"
            },
            {
                "name": "Refinement",
                "duration_weeks": "2-3",
                "description": "Perfect mustache styling, establish routine"
            }
        ],
        "total_time_weeks": {"min": 10, "max": 14},
        "minimum_growth_cm": 8
    }'::jsonb,
    '{
        "growth_rate_cm_per_month": {"min": 1.1, "max": 1.3},
        "density_requirement": "high on chin and cheeks",
        "mustache_density": "must support styled shape",
        "skill_level": "medium-high",
        "time_commitment": "significant",
        "product_investment": "moderate"
    }'::jsonb,
    NOW(),
    NOW()
);

-- 26. Soul Patch
INSERT INTO beard_styles (
    id, name, slug, tier, category,
    min_length_cm, max_length_cm, optimal_length_cm,
    maintenance_level, weekly_time_minutes,
    description, summary,
    dimensions, maintenance, design_rules, growth_timeline, assumptions,
    created_at, updated_at
) VALUES (
    26,
    'Soul Patch',
    'soul-patch',
    7,
    'specialty',
    0.3,
    2.0,
    0.8,
    'low',
    17.5,
    'Soul Patch (aka flavor saver, jazz dot, ili mouche) je minimalist facial hair stil koji se sastoji od small patch dlaka direktno ispod donje usne. Populariziran u jazz i beatnik kulturi 1950-ih i 60-ih, ovaj stil je subtle statement koji zahtijeva minimal maintenance ali maximum precision u shaping-u.',
    'Minimalistički patch ispod donje usne, 1-3 cm širine, jazz/beatnik heritage.',
    '{
        "patch_width_cm": {"min": 1, "max": 3, "optimal": 1.5},
        "patch_height_cm": {"min": 1, "max": 2.5, "optimal": 1.5},
        "patch_length_cm": {"min": 0.3, "max": 2, "optimal": 0.8},
        "position": "centered below lower lip",
        "shape_options": ["triangular", "rectangular", "oval", "natural"],
        "chin_coverage": "minimal to none",
        "mustache": "none",
        "cheeks": "clean shaven",
        "all_other_areas": "clean shaven"
    }'::jsonb,
    '{
        "trim_intervals": {
            "patch_length": "svakih 5-7 dana",
            "patch_shape": "svakih 4-7 dana",
            "surrounding_shave": "svakih 1-2 dana"
        },
        "sessions_per_week": "3-4 (mostly surrounding shave)",
        "tools": ["precision trimmer", "detail edger", "razor", "magnifying mirror"],
        "products": ["shaving cream", "aftershave", "minimal beard oil optional"],
        "time_per_session_minutes": {"min": 3, "max": 8},
        "weekly_total_minutes": {"min": 10, "max": 25}
    }'::jsonb,
    '[
        "SAMO patch - ništa drugo na licu",
        "Pozicija mora biti CENTERED ispod donje usne",
        "Surrounding area mora biti CLEAN SHAVEN",
        "Shape treba biti consistent i intentional",
        "Patch ne smije se širiti na chin ili spojiti sa bilo čim",
        "Precision trimming je essential",
        "Daily surrounding shave maintains contrast",
        "Small size does not mean low attention to detail"
    ]'::jsonb,
    '{
        "phases": [
            {
                "name": "Initial Growth",
                "duration_weeks": "1-2",
                "description": "Define patch zone, shave around it"
            },
            {
                "name": "Shaping",
                "duration_weeks": "1",
                "description": "Perfect shape, establish boundaries"
            }
        ],
        "total_time_weeks": {"min": 1.5, "max": 3},
        "minimum_growth_cm": 0.3
    }'::jsonb,
    '{
        "growth_rate_cm_per_month": {"min": 1.1, "max": 1.3},
        "density_requirement": "focused area only",
        "precision_skill": "high",
        "time_commitment": "low",
        "maintenance_frequency": "daily shave around patch"
    }'::jsonb,
    NOW(),
    NOW()
);

-- 27. Chin Strap
INSERT INTO beard_styles (
    id, name, slug, tier, category,
    min_length_cm, max_length_cm, optimal_length_cm,
    maintenance_level, weekly_time_minutes,
    description, summary,
    dimensions, maintenance, design_rules, growth_timeline, assumptions,
    created_at, updated_at
) VALUES (
    27,
    'Chin Strap',
    'chin-strap',
    7,
    'specialty',
    1.0,
    3.0,
    1.5,
    'high',
    52.5,
    'Chin Strap je precision-styled facial hair koji formira thin line duž jawline, od uha do uha, prolazeći preko chin-a. Za razliku od šireg Chin Curtain-a, Chin Strap je deliberately thin - često samo 1-2 cm širine. Ovaj stil naglašava jawline i pruža defined, modern izgled koji je popularan u urban i hip-hop kulturi.',
    'Tanka precizna linija duž jawline, 0.5-2 cm širine, urban modern stil.',
    '{
        "strap_width_cm": {"ultra_thin": "0.5-1", "standard": "1-1.5", "wide": "1.5-2"},
        "strap_length_cm": {"short": "1-1.5", "medium": "1.5-2.5", "long": "2.5-3"},
        "path": "ear to ear via chin, following jawline precisely",
        "mustache": "usually none, clean upper lip",
        "cheeks": "clean shaven above strap",
        "sideburns": "variable, can connect or start at ear",
        "edge_definition": "CRITICAL - sharp clean lines"
    }'::jsonb,
    '{
        "trim_intervals": {
            "strap_width": "svakih 2-3 dana CRITICAL",
            "edge_definition": "svakih 2-3 dana",
            "cheek_lip_shave": "svakih 1-2 dana",
            "length": "svakih 5-7 dana"
        },
        "sessions_per_week": "4-5",
        "tools": ["precision trimmer 0mm ESSENTIAL", "detail edger", "razor", "fine-tooth comb", "magnifying mirror"],
        "products": ["precision shave gel", "aftershave balm", "minimal conditioning"],
        "time_per_session_minutes": {"min": 10, "max": 15},
        "weekly_total_minutes": {"min": 45, "max": 60}
    }'::jsonb,
    '[
        "Width must be THIN - >2 cm = Chin Curtain territory",
        "Precision is everything - blurry edges destroy aesthetic",
        "Daily ili every-other-day maintenance required",
        "Symmetry critical - both sides must be identical",
        "Follow jawline precisely - no artificial angles",
        "Clean above and below - strap should be isolated",
        "Consistent width throughout - no thicker/thinner sections",
        "Upper lip usually clean - mustache changes look significantly"
    ]'::jsonb,
    '{
        "phases": [
            {
                "name": "Initial Growth",
                "duration_weeks": "1-2",
                "description": "Define strap zone, begin shaving around it"
            },
            {
                "name": "Refinement",
                "duration_weeks": "1",
                "description": "Perfect width and edges"
            },
            {
                "name": "Maintenance",
                "duration_weeks": "ongoing",
                "description": "High-frequency edge definition"
            }
        ],
        "total_time_weeks": {"min": 2, "max": 3},
        "minimum_growth_cm": 1
    }'::jsonb,
    '{
        "growth_rate_cm_per_month": {"min": 1.1, "max": 1.3},
        "jawline_hair_requirement": "must grow along jawline",
        "precision_skill": "high - steady hand required",
        "commitment": "HIGH - near-daily maintenance",
        "equipment": "quality precision trimmer essential"
    }'::jsonb,
    NOW(),
    NOW()
);

-- 28. Imperial
INSERT INTO beard_styles (
    id, name, slug, tier, category,
    min_length_cm, max_length_cm, optimal_length_cm,
    maintenance_level, weekly_time_minutes,
    description, summary,
    dimensions, maintenance, design_rules, growth_timeline, assumptions,
    created_at, updated_at
) VALUES (
    28,
    'Imperial',
    'imperial',
    7,
    'specialty',
    3.0,
    7.0,
    5.0,
    'very_high',
    105.0,
    'Imperial Beard je distinguished, aristocratic stil koji kombinuje prominent upward-curling mustache sa pointed chin beard (goatee). Nazvan po europskoj aristokraciji 19. vijeka, posebno carovima poput Napoleona III i Franz Josefa I. Karakterističan je po elaborate mustache styling-u koji zahtijeva wax i precizno oblikovanje.',
    'Aristokratski stil sa upward-curling brkovima i pointed goatee, 19. vijek heritage.',
    '{
        "mustache": {
            "style": "upward-curling ends, waxed",
            "length_cm": {"min": 3, "max": 8},
            "thickness_cm": {"min": 1, "max": 2},
            "curl_angle_degrees": {"min": 30, "max": 90},
            "wax_required": true
        },
        "chin_beard": {
            "length_cm": {"min": 2, "max": 5},
            "width_cm": {"min": 2, "max": 4},
            "shape": "pointed or slightly rounded",
            "connection_to_mustache": "NO - separated"
        },
        "gap_mustache_chin_cm": {"min": 0.5, "max": 2},
        "cheeks": "completely clean shaven",
        "sideburns": "minimal or none"
    }'::jsonb,
    '{
        "trim_intervals": {
            "mustache_shaping": "svakih 3-5 dana",
            "curl_rewaxing": "DNEVNO 1-2x",
            "chin_beard_trim": "svakih 5-7 dana",
            "cheek_shave": "svakih 1-2 dana",
            "gap_maintenance": "svakih 3-5 dana"
        },
        "sessions_per_week": "daily waxing + 3-4 trim sessions",
        "tools": ["mustache wax strong hold ESSENTIAL", "precision trimmer", "fine scissors", "fine-tooth comb", "hair dryer low heat", "razor"],
        "products": ["mustache wax 1-2 daily CRITICAL", "beard oil 2-3 kapi", "shaving cream", "aftershave"],
        "time_per_session_minutes": {"daily_waxing": "10-15", "trim_sessions": "15-20"},
        "weekly_total_minutes": {"min": 90, "max": 120}
    }'::jsonb,
    '[
        "Mustache curls must be UPWARD - defines Imperial",
        "Wax is NON-NEGOTIABLE - daily application required",
        "Chin beard must be SEPARATED from mustache",
        "Cheeks must be CLEAN - contrast and definition",
        "Symmetry CRITICAL - both curls identical",
        "Pointed chin preferred for authentic look",
        "Mustache is FOCAL POINT - chin complements",
        "Curl maintenance is daily commitment"
    ]'::jsonb,
    '{
        "phases": [
            {
                "name": "Full Growth",
                "duration_weeks": "4",
                "description": "Grow full, practice wax technique"
            },
            {
                "name": "Shaping & Training",
                "duration_weeks": "4",
                "description": "Shape chin, define gap, intensive curl training"
            },
            {
                "name": "Mature Imperial",
                "duration_weeks": "4",
                "description": "Curls well-trained, styling routine"
            }
        ],
        "total_time_weeks": {"min": 8, "max": 12},
        "minimum_mustache_length_cm": 4,
        "curl_training_weeks": "3-4"
    }'::jsonb,
    '{
        "growth_rate_cm_per_month": {"min": 1.1, "max": 1.3},
        "mustache_density": "high - needs thick growth for curl support",
        "hair_texture": "straighter holds curls better",
        "wax_tolerance": "must be comfortable with daily product use",
        "time_commitment_weekly_minutes": "90-120",
        "skill_development_weeks": "3-4 to master curl technique"
    }'::jsonb,
    NOW(),
    NOW()
);

-- 29. Hulihee
INSERT INTO beard_styles (
    id, name, slug, tier, category,
    min_length_cm, max_length_cm, optimal_length_cm,
    maintenance_level, weekly_time_minutes,
    description, summary,
    dimensions, maintenance, design_rules, growth_timeline, assumptions,
    created_at, updated_at
) VALUES (
    29,
    'Hulihee',
    'hulihee',
    7,
    'specialty',
    8.0,
    15.0,
    12.0,
    'high',
    75.0,
    'Hulihee je dramatic, theatrical beard style originalno povezan sa Hawaiianskim kraljevstvom 19. vijeka, posebno kraljem Kalākaua. Karakteriziraju ga massive sideburns koji se šire prema van u wing-like formacije, dok je chin area clean-shaven. Essentially "inverse beard" - volume tamo gdje većina stilova nema.',
    'Dramatični wing-like sideburns sa clean chin, Hawaiian kraljevski heritage.',
    '{
        "sideburns": {
            "width_top_cm": {"min": 3, "max": 5},
            "width_bottom_cm": {"min": 8, "max": 15},
            "length_vertical_cm": {"min": 8, "max": 12},
            "shape": "wing-like, fan expansion",
            "volume": "MAXIMUM - thick, full, bushy",
            "direction": "outward flare, away from face"
        },
        "cheek_coverage": "extensive, merges with sideburns",
        "chin": "CLEAN SHAVEN - critical characteristic",
        "mustache": "variable - present or absent, if present connected to sideburns",
        "jawline": "partially covered, upper jaw from sideburns",
        "volume_projection_percent": {"min": 40, "max": 60}
    }'::jsonb,
    '{
        "trim_intervals": {
            "wing_shaping": "svakih 7-14 dana",
            "chin_shaving": "svakih 1-2 dana CRITICAL",
            "mustache_if_present": "svakih 5-7 dana",
            "neckline": "svakih 5-7 dana",
            "volume_control": "svakih 7-10 dana"
        },
        "sessions_per_week": "chin daily + 2-3 trim sessions",
        "tools": ["trimmer sa guards 6-15mm", "razor CRITICAL", "beard brush", "wide-tooth comb", "scissors", "blow dryer optional"],
        "products": ["beard oil 5-8 kapi daily", "beard balm", "volume spray optional", "shaving cream", "aftershave"],
        "time_per_session_minutes": {"min": 15, "max": 25},
        "weekly_total_minutes": {"min": 60, "max": 90}
    }'::jsonb,
    '[
        "Wings must EXPAND OUTWARD - dramatic flare essential",
        "Chin must be COMPLETELY CLEAN - daily maintenance",
        "Volume is EVERYTHING - thin sideburns are not Hulihee",
        "Symmetry in wing size - both sides must expand equally",
        "Width must be DRAMATIC - if people dont notice, not wide enough",
        "Train hair OUTWARD - requires direction training",
        "Embrace the theatrical - subtlety defeats purpose",
        "Cheek coverage connects to wings seamlessly"
    ]'::jsonb,
    '{
        "phases": [
            {
                "name": "Full Sideburn Growth",
                "duration_weeks": "8",
                "description": "Grow full face, train outward direction daily"
            },
            {
                "name": "Wing Formation",
                "duration_weeks": "4",
                "description": "Shave chin, shape wing outlines"
            },
            {
                "name": "Dramatic Expansion",
                "duration_weeks": "4+",
                "description": "Maximum expansion, full theatrical effect"
            }
        ],
        "total_time_weeks": {"min": 12, "max": 16},
        "minimum_sideburn_length_cm": 8,
        "full_theatrical_length_cm": 12
    }'::jsonb,
    '{
        "growth_rate_cm_per_month": {"min": 1.1, "max": 1.3},
        "sideburn_density": "HIGH - must grow thick full sideburns",
        "cheek_coverage": "must grow hair on cheeks",
        "growth_direction": "ability to train hair outward",
        "social_confidence": "must be comfortable with distinctive appearance",
        "professional_context": "limited workplace acceptability",
        "hair_texture": "wavy/curly ideal for natural volume"
    }'::jsonb,
    NOW(),
    NOW()
);

-- =============================================
-- FACE_SHAPE_COMPATIBILITY INSERTS
-- =============================================

-- Verdi (id: 25)
INSERT INTO face_shape_compatibility (style_id, face_shape, score, explanation) VALUES
(25, 'oval', 90, 'Odličan. Rounded beard complements balanced oval. Classic artistic match.'),
(25, 'square', 80, 'Dobro. Rounded Verdi softens angular features. Works well.'),
(25, 'round', 75, 'OK. Round beard on round face - consider chin length for elongation.'),
(25, 'triangle', 85, 'Dobro. Rounded fullness balances wider jaw without emphasizing point.'),
(25, 'diamond', 95, 'Idealno. Rounded beard adds chin definition, complements cheekbones beautifully.'),
(25, 'oblong', 85, 'Dobro. Rounded shape doesnt add length. Width helps balance.');

-- Soul Patch (id: 26)
INSERT INTO face_shape_compatibility (style_id, face_shape, score, explanation) VALUES
(26, 'oval', 90, 'Odličan. Subtle accent works perfectly on balanced face.'),
(26, 'square', 85, 'Dobro. Small accent doesnt interfere with strong jaw.'),
(26, 'round', 80, 'OK. Provides minimal vertical element but limited impact on shape.'),
(26, 'triangle', 85, 'Dobro. Doesnt add to jaw width. Safe minimal choice.'),
(26, 'diamond', 90, 'Odličan. Subtle chin accent, complements cheekbones.'),
(26, 'oblong', 75, 'Oprez. Vertical element may slightly add length. Consider carefully.');

-- Chin Strap (id: 27)
INSERT INTO face_shape_compatibility (style_id, face_shape, score, explanation) VALUES
(27, 'oval', 85, 'Dobro. Adds jawline definition to balanced face.'),
(27, 'square', 95, 'Idealno. Emphasizes already strong jawline. Best match.'),
(27, 'round', 90, 'Odličan. Creates jawline definition where theres little.'),
(27, 'triangle', 75, 'Oprez. May over-emphasize already strong jaw.'),
(27, 'diamond', 90, 'Odličan. Adds chin definition, works with cheekbones.'),
(27, 'oblong', 80, 'OK. Horizontal element helps, but consider face length.');

-- Imperial (id: 28)
INSERT INTO face_shape_compatibility (style_id, face_shape, score, explanation) VALUES
(28, 'oval', 90, 'Odličan. Balanced canvas for elaborate mustache. Works beautifully.'),
(28, 'square', 85, 'Dobro. Strong jaw complements aristocratic vibe.'),
(28, 'round', 80, 'OK. Horizontal mustache adds width - use moderate curl length.'),
(28, 'triangle', 75, 'Oprez. Wide jaw + horizontal mustache može biti too much.'),
(28, 'diamond', 95, 'Idealno. Cheekbones + elaborate mustache = perfect aristocratic look.'),
(28, 'oblong', 70, 'Risky. Vertical chin beard adds length. Consider shorter goatee.');

-- Hulihee (id: 29)
INSERT INTO face_shape_compatibility (style_id, face_shape, score, explanation) VALUES
(29, 'oval', 75, 'Oprez. Wings add significant width to balanced face.'),
(29, 'square', 70, 'Risky. Already wide jaw + wings = very wide appearance.'),
(29, 'round', 65, 'Problematic. Adds more width to already wide face. Not recommended.'),
(29, 'triangle', 60, 'Difficult. Emphasizes already wide jaw significantly.'),
(29, 'diamond', 85, 'Dobro. Cheekbones balance wings. Most compatible narrow face.'),
(29, 'oblong', 95, 'Idealno! Horizontal expansion balances long face. Best match.');

-- =============================================
-- STYLE_TRANSITIONS INSERTS
-- =============================================

-- Verdi transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps) VALUES
(25, 1, 4, 'easy', '["Let beard grow longer", "Stop shaping rounded bottom", "Allow natural full development", "Reduce mustache separation styling"]'),
(25, 5, 2, 'easy', '["Trim to shorter length", "Maintain rounded shape", "More frequent maintenance", "Keep or reduce mustache styling"]'),
(25, 9, 3, 'medium', '["Shave cheeks and sides", "Form pointed chin shape", "Adjust mustache to Van Dyke style", "Different separation aesthetic"]'),
(1, 25, 4, 'medium', '["Trim to 10cm max", "Shape rounded bottom", "Style mustache separately", "Regular shaping routine"]');

-- Soul Patch transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps) VALUES
(26, 10, 3, 'easy', '["Let chin area grow around patch", "Expand to full chin coverage", "Shape goatee boundaries", "Patch becomes part of goatee"]'),
(26, 12, 4, 'easy', '["Grow mustache", "Expand chin coverage", "Connect mustache to chin", "Full circle develops"]'),
(26, 0, 0.14, 'easy', '["Shave patch", "Clean shaven achieved", "One session only"]'),
(10, 26, 1, 'easy', '["Shave goatee except patch zone", "Define small patch only", "Higher precision maintenance"]');

-- Chin Strap transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps) VALUES
(27, 24, 4, 'easy', '["Let strap grow wider", "At 3+ cm width: Curtain territory", "Lower precision requirement", "Different aesthetic emerges"]'),
(27, 10, 4, 'easy', '["Let chin area grow fuller", "Shave jawline portions", "Focus on chin only", "Different shape emerges"]'),
(27, 1, 10, 'easy', '["Stop shaving cheeks", "Grow mustache", "Let fill in everywhere", "Full beard develops"]'),
(24, 27, 1, 'medium', '["Narrow curtain to thin strap", "Increase precision requirements", "Higher maintenance begins"]');

-- Imperial transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps) VALUES
(28, 9, 1, 'easy', '["Stop curling mustache", "Trim to simpler shape", "Reduce wax usage", "Lower maintenance"]'),
(28, 18, 1, 'easy', '["Shave chin beard", "Keep mustache curls", "Focus on mustache only", "Similar maintenance"]'),
(28, 10, 2, 'easy', '["Stop curling mustache", "Let chin grow simpler", "Remove elaborate styling", "Basic goatee remains"]'),
(9, 28, 6, 'medium', '["Grow mustache longer for curls", "Learn waxing and curl technique", "Maintain pointed chin", "Transition to elaborate curl style"]');

-- Hulihee transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps) VALUES
(29, 22, 1, 'easy', '["Trim wing expansion", "Create more contained shape", "Less dramatic width", "Similar maintenance"]'),
(29, 1, 8, 'easy', '["Stop shaving chin", "Let chin grow", "Trim sideburns to beard proportion", "Full beard develops"]'),
(29, 23, 1, 'easy', '["Trim wings to standard size", "Add or keep mustache connection", "Transition to Friendly Mutton Chops"]'),
(22, 29, 6, 'medium', '["Grow sideburns wider and longer", "Train extreme outward expansion", "Maximize volume and flare", "Dramatic wings develop"]');

-- =============================================
-- LIFESTYLE_TAGS AND ASSOCIATIONS
-- =============================================

-- Additional lifestyle tags for Tier 7
INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
(31, 'Theatrical', 'theatrical', 'personality'),
(32, 'Aristocratic', 'aristocratic', 'aesthetic'),
(33, 'Beard Competition', 'beard-competition', 'occasion'),
(34, 'Hawaiian Heritage', 'hawaiian-heritage', 'cultural'),
(35, 'Steampunk', 'steampunk', 'aesthetic'),
(36, 'Beatnik', 'beatnik', 'cultural'),
(37, 'Jazz Culture', 'jazz-culture', 'cultural')
ON CONFLICT (id) DO NOTHING;

-- Verdi lifestyle associations
INSERT INTO style_lifestyle_tags (style_id, tag_id, relevance_score) VALUES
(25, 4, 90),   -- formal-events
(25, 3, 85),  -- creative-industries
(25, 32, 95), -- aristocratic
(25, 8, 90),  -- artistic
(25, 6, 85),  -- vintage
(25, 7, 80);  -- distinguished

-- Soul Patch lifestyle associations
INSERT INTO style_lifestyle_tags (style_id, tag_id, relevance_score) VALUES
(26, 37, 95), -- jazz-culture
(26, 36, 95), -- beatnik
(26, 3, 85),  -- creative-industries
(26, 10, 90), -- casual
(26, 8, 85),  -- artistic
(26, 12, 80); -- low-maintenance

-- Chin Strap lifestyle associations
INSERT INTO style_lifestyle_tags (style_id, tag_id, relevance_score) VALUES
(27, 11, 95), -- urban
(27, 9, 90),  -- athletic
(27, 13, 85), -- hip-hop
(27, 14, 90), -- precision
(27, 3, 80),  -- creative-industries
(27, 10, 85); -- casual

-- Imperial lifestyle associations
INSERT INTO style_lifestyle_tags (style_id, tag_id, relevance_score) VALUES
(28, 32, 95), -- aristocratic
(28, 6, 95),  -- vintage
(28, 35, 90), -- steampunk
(28, 4, 85),  -- formal-events
(28, 8, 90),  -- artistic
(28, 7, 95);  -- distinguished

-- Hulihee lifestyle associations
INSERT INTO style_lifestyle_tags (style_id, tag_id, relevance_score) VALUES
(29, 31, 95), -- theatrical
(29, 33, 95), -- beard-competition
(29, 34, 100), -- hawaiian-heritage
(29, 8, 85),  -- artistic
(29, 6, 85),  -- vintage
(29, 4, 70);  -- formal-events (conditional)

-- =============================================
-- STYLE_COMPARISONS INSERTS
-- =============================================

-- Verdi comparisons
INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_aspect, style_1_value, style_2_value) VALUES
(25, 1, 'length', '8-12 cm max', '15-20+ cm'),
(25, 1, 'shape', 'rounded, sculpted', 'natural rounded'),
(25, 1, 'mustache', 'separately styled, prominent', 'integrated'),
(25, 9, 'beard_type', 'full rounded', 'pointed goatee'),
(25, 9, 'cheeks', 'full coverage', 'clean'),
(25, 9, 'maintenance', 'medium-high', 'high');

-- Soul Patch comparisons
INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_aspect, style_1_value, style_2_value) VALUES
(26, 10, 'coverage', 'minimal patch only', 'full chin'),
(26, 10, 'size', '1-3 cm width', '3-6 cm width'),
(26, 10, 'maintenance', 'low', 'medium'),
(26, 12, 'mustache', 'none', 'connected'),
(26, 12, 'coverage', 'patch only', 'circle around mouth');

-- Chin Strap comparisons
INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_aspect, style_1_value, style_2_value) VALUES
(27, 24, 'width', '0.5-2 cm thin', '3-8 cm wide'),
(27, 24, 'precision', 'very high', 'medium'),
(27, 24, 'maintenance', 'high', 'medium'),
(27, 10, 'path', 'jawline ear to ear', 'chin only'),
(27, 10, 'style', 'urban modern', 'minimalist');

-- Imperial comparisons
INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_aspect, style_1_value, style_2_value) VALUES
(28, 9, 'mustache', 'elaborate curled waxed', 'styled variable'),
(28, 9, 'wax_required', 'yes heavy', 'optional'),
(28, 9, 'vibe', 'aristocratic', 'artistic'),
(28, 18, 'chin_beard', 'pointed goatee', 'none'),
(28, 18, 'focus', 'mustache + chin', 'mustache only');

-- Hulihee comparisons
INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_aspect, style_1_value, style_2_value) VALUES
(29, 22, 'sideburn_size', 'MASSIVE wings 8-15cm', 'large 4-8cm'),
(29, 22, 'expansion', 'dramatic outward flare', 'moderate'),
(29, 22, 'volume', 'maximum', 'high'),
(29, 1, 'chin', 'clean shaven', 'full coverage'),
(29, 1, 'focus', 'sideburns', 'full face');

-- =============================================
-- END OF TIER 7 SEED DATA
-- =============================================
