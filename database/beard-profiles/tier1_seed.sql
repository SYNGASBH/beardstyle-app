-- =====================================================
-- TIER 1: FULL BEARDS - SQL SEED FILE
-- Garibaldi, Bandholz, Ducktail, Yeard
-- =====================================================

-- First, ensure we have the required tables
-- (These should already exist from initial migration)

-- =====================================================
-- 1. GARIBALDI
-- =====================================================

INSERT INTO beard_styles (
    name,
    slug,
    category,
    subcategory,
    short_description,
    historical_context,
    dimensions,
    maintenance,
    growth_timeline,
    design_rules,
    detailed_profile,
    is_premium,
    difficulty_level,
    image_url
) VALUES (
    'Garibaldi',
    'garibaldi',
    'full',
    'natural_voluminous',
    'Masivna, prirodno voluminozna full beard sa širokom zaobljenom donjom konturom i integrisanim brkovima. Nazvana po italijanskom generalu Giuseppeu Garibaldiju.',
    'Stil nazvan po Giuseppeu Garibaldiju (1807-1882), italijanskom generalu i nacionalnom heroju. Garibaldi je nosio karakterističnu široku bradu koja je postala simbol revolucionarnog duha i muževnosti u 19. stoljeću.',
    '{
        "length_cm_min": 12,
        "length_cm_max": 20,
        "length_optimal_cm": 16.5,
        "width_cm_min": 18,
        "width_cm_max": 25,
        "bottom_contour": "wide_rounded",
        "contour_radius_cm": 12.5,
        "contour_arc_degrees": 160,
        "cheek_line": "natural_soft",
        "cheek_fade_type": "soft",
        "cheek_blend_cm": 3,
        "mustache_style": "integrated_natural",
        "mustache_length_past_corners_cm": 1.5,
        "mustache_separated": false,
        "volume_projection_percent_min": 40,
        "volume_projection_percent_max": 60,
        "depth_at_chin_cm_min": 4,
        "depth_at_chin_cm_max": 7,
        "fill_factor_percent": 85,
        "stray_hairs_allowed_cm": 1.5,
        "width_to_length_ratio": "wider_than_long"
    }',
    '{
        "trim_interval_days_bottom": 25,
        "trim_interval_days_cheeks": 18,
        "trim_interval_days_mustache": 6,
        "trim_interval_days_neckline": 14,
        "maintenance_level": "low",
        "sessions_per_week": 1.25,
        "time_per_session_minutes": 12,
        "weekly_time_investment_minutes": 25,
        "daily_grooming_minutes": 10,
        "required_tools": [
            "beard_scissors_5_6_inch",
            "trimmer_with_guards_12_25mm",
            "wide_tooth_comb",
            "boar_bristle_brush"
        ],
        "required_products": [
            "beard_oil_daily",
            "beard_wash_2x_weekly",
            "conditioner_weekly"
        ],
        "optional_products": [
            "beard_balm"
        ],
        "oil_drops_per_day": 8
    }',
    '{
        "total_weeks_min": 14,
        "total_weeks_max": 18,
        "minimum_growth_cm": 12,
        "phases": [
            {
                "phase": 1,
                "name": "Foundation",
                "weeks": "1-8",
                "description": "Potpuni no-touch period. Awkward phase - izdržati bez trimanja.",
                "expected_growth_cm": "8-10",
                "actions": ["Zero trimming", "Start beard oil from week 2", "Define neckline from week 4"]
            },
            {
                "phase": 2,
                "name": "Shaping",
                "weeks": "9-14",
                "description": "Početak Garibaldi shaping. Formiranje rounded bottom contour.",
                "expected_growth_cm": "12-15",
                "actions": ["Shape rounded bottom", "Allow natural width flare", "Fine-tune shape"]
            },
            {
                "phase": 3,
                "name": "Maintenance",
                "weeks": "15+",
                "description": "Steady state. Focus na health: oil, wash, conditioning.",
                "expected_growth_cm": "Maintain 15-18",
                "actions": ["Maintain target length", "Regular conditioning", "Trim every 3-4 weeks"]
            }
        ]
    }',
    ARRAY[
        'Širina mora premašiti dužinu – Garibaldi je "wide" stil',
        'Brkovi se moraju stapati sa bradom – nema vidljivog razmaka',
        'Donja kontura zaobljena, ne šiljata – continuous arc obavezan',
        'Cheek line: soft transition – hard line negira natural estetiku',
        'Dozvoljena "divljina" – do 10% stray hairs acceptable',
        'Minimum dužina 12 cm – ispod je Full Beard kategorija',
        'No wax na brkovima – waxed brkovi = Verdi, ne Garibaldi'
    ],
    'Garibaldi je masivna, prirodno voluminozna full beard varijanta nazvana po italijanskom generalu Giuseppeu Garibaldiju...',
    true,
    'intermediate',
    '/assets/sketches/garibaldi.svg'
);

-- Garibaldi Face Shape Compatibility
INSERT INTO face_shape_compatibility (style_id, face_shape, compatibility_score, reason) VALUES
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'oval', 90, 'Idealna baza; Garibaldi dodaje width bez narušavanja proporcija.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'square', 95, 'Najbolji match. Rounded bottom softens angular jawline, width complements strong bone structure.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'round', 55, 'Oprez – wide Garibaldi može dodatno proširiti već okruglo lice. Preporučuje se uža varijanta.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'triangle', 85, 'Dobro balansira usku čelo/široku vilicu. Volume na bradi stvara vizualni ekvilibrij.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'diamond', 80, 'Može raditi ako se širina kontroliše. Wide cheekbones + wide beard zahtijeva pažljiv balans.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'oblong', 70, 'Dugo lice + duga brada može izgledati previše elongated. Držati bližu 12 cm granici.');

-- Garibaldi Lifestyle Tags
INSERT INTO lifestyle_tags (style_id, tag, is_suitable, notes) VALUES
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'professional', true, 'Prihvatljivo u kreativnim industrijama, tech, academia. Konzervativni corporate može biti previše.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'casual', true, 'Prirodni izgled se uklapa u casual kontekste.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'formal', true, 'Groomed Garibaldi je distinguished; osigurati neat edges.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'athletic', false, 'Dužina može smetati kod nekih sportova; swimming problematičan.'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 'creative', true, 'Često preferiran u dizajnu, muzici, umjetnosti.');

-- Garibaldi Transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, instructions, intermediate_steps) VALUES
(NULL, (SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 16, 'medium', 'Sedmica 1–6: Zero trimming, samo neckline od sedmice 4. Sedmica 7–10: Maintain shape, ukloniti samo strays. Sedmica 11–14: Formirati rounded bottom contour. Sedmica 15+: Maintenance mode.', '[{"week": 4, "action": "Define neckline"}, {"week": 7, "action": "Remove strays only"}, {"week": 11, "action": "Form rounded contour"}]');

-- =====================================================
-- 2. BANDHOLZ
-- =====================================================

INSERT INTO beard_styles (
    name,
    slug,
    category,
    subcategory,
    short_description,
    historical_context,
    dimensions,
    maintenance,
    growth_timeline,
    design_rules,
    detailed_profile,
    is_premium,
    difficulty_level,
    image_url
) VALUES (
    'Bandholz',
    'bandholz',
    'full',
    'ultra_long_natural',
    'Ultra-duga, potpuno prirodna full beard varijanta. Minimalna intervencija, maksimalna dužina, prihvatanje prirodne teksture i oblika. Yeard+ pristup.',
    'Stil nazvan po Ericu Bandholzu, osnivaču Beardbrand kompanije. Popularizirao je "yeard+" pristup i beard positivity pokret od 2012. godine.',
    '{
        "length_cm_min": 20,
        "length_cm_max": 40,
        "length_optimal_cm": 30,
        "width_cm_min": 15,
        "width_cm_max": 25,
        "bottom_contour": "natural_any",
        "contour_radius_cm": null,
        "contour_arc_degrees": null,
        "cheek_line": "natural_only",
        "cheek_fade_type": "natural",
        "cheek_blend_cm": null,
        "mustache_style": "integrated_full_natural",
        "mustache_length_past_corners_cm": 4,
        "mustache_separated": false,
        "mustache_wax_allowed": false,
        "volume_projection_percent_min": 50,
        "volume_projection_percent_max": 80,
        "depth_at_chin_cm_min": 5,
        "depth_at_chin_cm_max": 10,
        "fill_factor_percent": null,
        "stray_hairs_allowed_cm": null,
        "trimming_philosophy": "almost_none"
    }',
    '{
        "trim_interval_days_bottom": null,
        "trim_interval_days_cheeks": null,
        "trim_interval_days_mustache": 35,
        "trim_interval_days_neckline": 35,
        "split_end_trim_months": 3,
        "maintenance_level": "very_low",
        "sessions_per_week": 0.5,
        "time_per_session_minutes": 8,
        "weekly_time_investment_minutes": 17,
        "daily_grooming_minutes": 15,
        "required_tools": [
            "wide_tooth_comb",
            "boar_bristle_brush",
            "sharp_scissors_split_ends_only"
        ],
        "required_products": [
            "beard_oil_heavy_2x_daily",
            "beard_butter_daily",
            "beard_wash_2x_weekly",
            "deep_conditioner_weekly"
        ],
        "optional_products": [
            "overnight_argan_oil_treatment"
        ],
        "oil_drops_per_day": 12
    }',
    '{
        "total_weeks_min": 65,
        "total_weeks_max": 100,
        "total_months_min": 15,
        "total_months_max": 24,
        "minimum_growth_cm": 20,
        "phases": [
            {
                "phase": 1,
                "name": "Initial Growth",
                "months": "1-6",
                "description": "Awkward phase, zero trimming. Start oil routine immediately.",
                "expected_growth_cm": "6-8",
                "actions": ["Zero trimming", "Start oil immediately", "Begin brushing routine month 4"]
            },
            {
                "phase": 2,
                "name": "Building Length",
                "months": "7-12",
                "description": "Approaching Yeard. Increase oil quantity, first split end assessment.",
                "expected_growth_cm": "12-16",
                "actions": ["Continue growth", "First split end micro-trim month 9", "Deep conditioning"]
            },
            {
                "phase": 3,
                "name": "Bandholz Territory",
                "months": "13-18",
                "description": "Entering official Bandholz range at 20+ cm.",
                "expected_growth_cm": "18-24",
                "actions": ["Health focus", "Minimal intervention", "Celebrate milestones"]
            },
            {
                "phase": 4,
                "name": "Terminal Length",
                "months": "24+",
                "description": "Individual genetics determine maximum. Focus on breakage prevention.",
                "expected_growth_cm": "25-35+",
                "actions": ["Prevent breakage", "Split end management", "Maintenance mode"]
            }
        ]
    }',
    ARRAY[
        'Nema bottom contour trimanja – non-negotiable Bandholz principle',
        'Length minimum 20 cm – ispod je Garibaldi ili long beard',
        'Brkovi moraju biti natural – nema wax, nema handlebar styling',
        'Cheeks ostaju natural – defined cheek lines su antitetičke filozofiji',
        'Health over shape – prioritet je hydration, conditioning, preventing breakage',
        'Split end maintenance dozvoljeno – micro-dusting <0.5 cm svaka 3-4 mjeseca',
        'Neckline je opcionalan – purist: no neckline; moderate: minimal',
        'Prihvati asimetriju – prirodni rast rijetko je simetričan'
    ],
    'Bandholz je ultra-duga, potpuno prirodna full beard varijanta nazvana po Ericu Bandholzu...',
    true,
    'advanced',
    '/assets/sketches/garibaldi.svg'
);

-- Bandholz Face Shape Compatibility
INSERT INTO face_shape_compatibility (style_id, face_shape, compatibility_score, reason) VALUES
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'oval', 85, 'Funkcionira dobro; dužina može elongirati, ali width kompenzira.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'square', 90, 'Odličan match. Strong jawline dobija epic frame.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'round', 65, 'Može raditi ako brada raste vertikalno. Width može dodatno zaokružiti lice.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'triangle', 80, 'Dužina balansira širu donju polovicu.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'diamond', 75, 'Zavisi od rasta. Wide cheekbones + large beard može biti overwhelming.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'oblong', 60, 'Rizično – duga brada na dugom licu može biti disproporcijalno.');

-- Bandholz Lifestyle Tags
INSERT INTO lifestyle_tags (style_id, tag, is_suitable, notes) VALUES
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'professional', false, 'Prihvatljivo samo u vrlo kreativnim industrijama ili startups. Traditional corporate: previše.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'casual', true, 'Natural look fits relaxed contexts. Može privući pažnju/komentare.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'formal', false, 'Mora biti well-groomed. Može izgledati distinguished ili out-of-place.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'athletic', false, 'Dužina može biti safety hazard. Swimming praktično nemoguć.'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), 'creative', true, 'Often celebrated in art, music, craft beer, etc.');

-- Bandholz Transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, instructions, intermediate_steps) VALUES
(NULL, (SELECT id FROM beard_styles WHERE slug = 'bandholz'), 70, 'hard', 'Month 1-6: Zero trimming, establish grooming routine. Month 7-12: Continue growth, first split end trim. Month 13-18: Enter Bandholz territory, health maintenance. Month 18+: Maintenance mode.', '[{"month": 6, "action": "Halfway checkpoint"}, {"month": 9, "action": "First split end trim"}, {"month": 15, "action": "Official Bandholz"}]'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), (SELECT id FROM beard_styles WHERE slug = 'bandholz'), 35, 'easy', 'Prestati trimati donju konturu. Dozvoliti natural shape development. Na 20+ cm: official Bandholz status.', '[{"week": 10, "action": "Stop bottom trimming"}, {"week": 25, "action": "Hit 20cm threshold"}]');

-- =====================================================
-- 3. DUCKTAIL
-- =====================================================

INSERT INTO beard_styles (
    name,
    slug,
    category,
    subcategory,
    short_description,
    historical_context,
    dimensions,
    maintenance,
    growth_timeline,
    design_rules,
    detailed_profile,
    is_premium,
    difficulty_level,
    image_url
) VALUES (
    'Ducktail',
    'ducktail',
    'full',
    'tapered_pointed',
    'Elegantna full beard sa pointed, tapered donjom konturom koja podsjeća na rep patke. Kombinuje volumen full bearda sa sculpted, refined estetikom.',
    'Ducktail brada je dobila popularnost sredinom 20. stoljeća, posebno među Hollywood glumcima. Ponovo je postala popularna 2010-ih kao sofisticirana alternativa rounded full beard stilovima.',
    '{
        "length_cm_min": 8,
        "length_cm_max": 15,
        "length_optimal_cm": 11,
        "width_cm_min": 12,
        "width_cm_max": 18,
        "width_to_length_ratio_min": 1.2,
        "width_to_length_ratio_max": 1.5,
        "bottom_contour": "pointed_v_shape",
        "taper_angle_degrees_min": 30,
        "taper_angle_degrees_max": 45,
        "point_type": "soft_or_sharp",
        "point_alignment": "midline",
        "taper_start_cm_above_tip": 4,
        "cheek_line": "defined_fade",
        "cheek_fade_type": "gentle_to_medium",
        "cheek_start_position": "ear_level_or_1_2cm_below",
        "cheek_blend_cm": 2.25,
        "mustache_style": "integrated_groomed",
        "mustache_length_past_corners_cm": 1,
        "mustache_separated": false,
        "volume_projection_percent_min": 25,
        "volume_projection_percent_max": 40,
        "depth_at_point_cm_min": 3,
        "depth_at_point_cm_max": 6,
        "depth_at_jaw_cm_min": 2,
        "depth_at_jaw_cm_max": 4,
        "fill_factor_percent": 85
    }',
    '{
        "trim_interval_days_point": 8,
        "trim_interval_days_taper": 12,
        "trim_interval_days_cheeks": 8,
        "trim_interval_days_mustache": 6,
        "trim_interval_days_neckline": 8,
        "maintenance_level": "medium_high",
        "sessions_per_week": 2.5,
        "time_per_session_minutes": 17,
        "weekly_time_investment_minutes": 50,
        "daily_grooming_minutes": 10,
        "required_tools": [
            "precision_trimmer_no_guard",
            "trimmer_with_guards_6_12mm",
            "beard_scissors_5_inch",
            "fine_tooth_comb",
            "boar_bristle_brush"
        ],
        "required_products": [
            "beard_oil_daily",
            "beard_balm_daily",
            "beard_wash_2_3x_weekly"
        ],
        "optional_products": [
            "beard_wax_for_point_hold"
        ],
        "oil_drops_per_day": 6
    }',
    '{
        "total_weeks_min": 8,
        "total_weeks_max": 12,
        "minimum_growth_cm": 8,
        "phases": [
            {
                "phase": 1,
                "name": "Foundation",
                "weeks": "1-6",
                "description": "Growing phase sa minimal intervention. Define neckline, start soft cheek definition.",
                "expected_growth_cm": "6-8",
                "actions": ["Define neckline week 3", "Start soft cheek definition week 4", "Training downward growth"]
            },
            {
                "phase": 2,
                "name": "Initial Shaping",
                "weeks": "7-10",
                "description": "First point formation i taper. Establish V-shape.",
                "expected_growth_cm": "8-10",
                "actions": ["Form initial point", "Start tapering sides", "Refine cheek line", "Check side-to-chin ratio"]
            },
            {
                "phase": 3,
                "name": "Maintenance",
                "weeks": "11+",
                "description": "Target shape achieved. Regular trims every 7-10 days.",
                "expected_growth_cm": "Maintain 10-12",
                "actions": ["Keep point sharp", "Maintain taper", "Product routine established"]
            }
        ]
    }',
    ARRAY[
        'Point mora biti centriran – koristi midline lica kao guide',
        'Taper mora biti gradualan – smooth diagonal 30-45° od jaw do chin tip',
        'Širina se smanjuje prema dolje – max width na jaw line ili iznad',
        'Cheeks moraju biti cleaner – soft fade OK, ali ne wild natural',
        'Point sharpness konzistentna – soft ili sharp, maintain consistently',
        'Side length kraća od chin – chin point ≥ 1.5× side length na jaw',
        'Regular maintenance obavezan – 7-10 dana bez trim-a = lost shape'
    ],
    'Ducktail je elegantna full beard varijanta karakterizirana pointed, tapered donjom konturom...',
    true,
    'intermediate',
    '/assets/sketches/ducktail.svg'
);

-- Ducktail Face Shape Compatibility
INSERT INTO face_shape_compatibility (style_id, face_shape, compatibility_score, reason) VALUES
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'oval', 95, 'Idealno. Point dodaje interest bez narušavanja balansa.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'square', 85, 'Dobro. Point softens angular chin, taper complements strong jaw.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'round', 90, 'Odlično. Point i V-shape vizualno elongira i slims okruglo lice.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'triangle', 70, 'Oprez. Već pointed chin + pointed beard može biti previše.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'diamond', 80, 'Funkcioniše. Point balansira narrow chin, taper works sa cheekbones.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'oblong', 65, 'Rizično. Point može dodatno elongirati već dugo lice. Keep length shorter.');

-- Ducktail Lifestyle Tags
INSERT INTO lifestyle_tags (style_id, tag, is_suitable, notes) VALUES
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'professional', true, 'Jedan od najprihvatljivijih full beard stilova za office. Groomed appearance.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'casual', true, 'Works well; versatile style.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'formal', true, 'Elegant, refined look. Excellent for weddings, galas, etc.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'athletic', true, 'Length is manageable; minimal interference.'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), 'creative', true, 'Adds edge without being too extreme.');

-- Ducktail Transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, instructions, intermediate_steps) VALUES
(NULL, (SELECT id FROM beard_styles WHERE slug = 'ducktail'), 10, 'medium', 'Week 1-4: Grow out, establish neckline. Week 5-6: Start cheek definition. Week 7-9: Form point, taper sides. Week 10+: Refine and maintain.', '[{"week": 3, "action": "Define neckline"}, {"week": 5, "action": "Cheek definition"}, {"week": 7, "action": "Form point"}]'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), (SELECT id FROM beard_styles WHERE slug = 'ducktail'), 3, 'medium', 'Significant bulk removal from sides. Reshape rounded bottom to pointed. Define cheek line more. May need to shorten if Garibaldi was very long.', '[{"session": 1, "action": "Remove side bulk"}, {"session": 2, "action": "Form point"}, {"session": 3, "action": "Fine-tune"}]');

-- =====================================================
-- 4. YEARD
-- =====================================================

INSERT INTO beard_styles (
    name,
    slug,
    category,
    subcategory,
    short_description,
    historical_context,
    dimensions,
    maintenance,
    growth_timeline,
    design_rules,
    detailed_profile,
    is_premium,
    difficulty_level,
    image_url
) VALUES (
    'Yeard',
    'yeard',
    'full',
    'time_based_milestone',
    'Time-based beard milestone: jedna puna godina (year + beard = yeard) rasta bez trimanja dužine. Definisan metodologijom, ne oblikom.',
    'Termin "yeard" populariziran je u online beard zajednicama 2010-ih. Predstavlja celebration of patience i commitment, often documented sa monthly progress photos.',
    '{
        "length_cm_min": 12,
        "length_cm_max": 16,
        "length_typical_cm": 14,
        "length_slow_growth_cm": 11,
        "length_fast_growth_cm": 18,
        "width_cm": "natural_varies",
        "bottom_contour": "natural_undefined",
        "cheek_line": "natural_or_minimal",
        "cheek_options": ["purist_natural", "modified_neckline_only", "groomed_neckline_and_soft_cheeks"],
        "mustache_style": "natural_growth",
        "mustache_trimming": "functional_only_eating",
        "mustache_length_past_lips_cm": 1.5,
        "volume_projection_percent_min": 35,
        "volume_projection_percent_max": 55,
        "fill_factor_percent": "genetics_dependent",
        "definition_type": "time_based_not_dimension_based"
    }',
    '{
        "trim_interval_days_length": null,
        "length_trimming_allowed": false,
        "trim_interval_days_cheeks": null,
        "cheeks_trimming_optional": true,
        "trim_interval_days_mustache": 35,
        "mustache_functional_trim_only": true,
        "trim_interval_days_neckline": 35,
        "neckline_optional": true,
        "split_end_controversy": "purists_say_no_moderates_allow",
        "maintenance_level": "very_low",
        "sessions_per_week": 0.75,
        "time_per_session_minutes": 8,
        "weekly_time_investment_minutes": 15,
        "daily_grooming_minutes": 10,
        "required_tools": [
            "wide_tooth_comb",
            "boar_bristle_brush",
            "scissors_functional_mustache_only"
        ],
        "required_products": [
            "beard_oil_increasing_with_length",
            "beard_butter_from_month_4",
            "beard_wash_2x_weekly",
            "conditioner_weekly"
        ],
        "oil_drops_per_day_start": 6,
        "oil_drops_per_day_end": 10
    }',
    '{
        "total_months": 12,
        "total_weeks": 52,
        "definition": "exactly_12_months_no_length_trim",
        "phases": [
            {
                "phase": 1,
                "name": "Early Growth / Awkward Phase",
                "months": "1-3",
                "description": "Barely visible progress, peak awkward phase, social pressure to trim.",
                "expected_growth_cm": "3-4",
                "actions": ["Zero trimming", "Start oil immediately", "Resist social pressure"]
            },
            {
                "phase": 2,
                "name": "The Hump / Establishing Foundation",
                "months": "4-6",
                "description": "Starting to look intentional. Past the worst awkward phase.",
                "expected_growth_cm": "6.5-8",
                "actions": ["Add beard balm", "Neckline decision", "Halfway celebration at month 6"]
            },
            {
                "phase": 3,
                "name": "Building Momentum",
                "months": "7-9",
                "description": "Noticeable length. Training beard direction with brushing.",
                "expected_growth_cm": "9.5-12",
                "actions": ["Increase oil", "Deep conditioning", "Start thinking post-yeard plans"]
            },
            {
                "phase": 4,
                "name": "Final Stretch",
                "months": "10-12",
                "description": "Home stretch. Celebration day approaching.",
                "expected_growth_cm": "12-16",
                "actions": ["Stay committed", "Photo documentation", "CELEBRATE at month 12"]
            }
        ],
        "post_yeard_options": ["continue_to_bandholz", "reshape_to_styled_look", "start_again"]
    }',
    ARRAY[
        'Zero length trimming za 12 mjeseci – definicija yearda',
        'Vrijeme je jedini standard – ne mjeri se u centimetrima',
        'Neckline je opcionalan – purist: no neckline; groomed: maintained',
        'Cheek line: tvoj izbor – groomed yeard ili purist yeard, oba valid',
        'Split end controversy – purists: no; moderates: <0.5 cm micro-dusting',
        'Dokumentiraj journey – monthly progress pics su traditional',
        'End date matters – Day 365 je celebration, prije toga nije yeard',
        'Post-yeard decision – Continue, Reshape, ili Start again'
    ],
    'Yeard je time-based beard milestone koji predstavlja jednu punu godinu rasta bez trimanja dužine...',
    true,
    'advanced',
    '/assets/sketches/full-beard.svg'
);

-- Yeard Face Shape Compatibility
INSERT INTO face_shape_compatibility (style_id, face_shape, compatibility_score, reason) VALUES
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'oval', 85, 'Generally works well. Natural growth complements balanced proportions.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'square', 85, 'Good foundation. Strong jaw + natural beard = distinguished.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'round', 70, 'Mixed results. Natural growth may add or reduce roundness depending on pattern.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'triangle', 80, 'Usually works. Natural length adds balance to wide jaw.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'diamond', 75, 'Depends on growth pattern. Results vary.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'oblong', 65, 'Risky. Additional length on already long face may be unflattering.');

-- Yeard Lifestyle Tags
INSERT INTO lifestyle_tags (style_id, tag, is_suitable, notes) VALUES
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'professional', false, 'Varies by month. Month 1-3: Awkward. Month 4-6: Questionable. Month 7-12: Depends on industry.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'casual', true, 'Works throughout journey.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'formal', false, 'Early months: tough. Later months: can be groomed for events.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'athletic', true, 'Early: Yes. Later: Varies. Length becomes factor from month 8+.'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), 'creative', true, 'Supportive environment is critical for yeard success.');

-- Yeard Transitions
INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, instructions, intermediate_steps) VALUES
(NULL, (SELECT id FROM beard_styles WHERE slug = 'yeard'), 52, 'hard', 'Day 1: Commit. Set calendar for day 365. Month 1-3: Survive awkward phase. Month 4-6: Establish routine. Month 7-9: Build length. Month 10-12: Final push. Day 365: Celebrate.', '[{"month": 3, "action": "Survive awkward phase"}, {"month": 6, "action": "Halfway celebration"}, {"month": 12, "action": "YEARD ACHIEVED"}]'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), (SELECT id FROM beard_styles WHERE slug = 'bandholz'), 26, 'easy', 'Day 366: Decide to continue. Maintain health routine. Continue no-trim philosophy. At 20+ cm: Bandholz achieved.', '[{"month": 15, "action": "Continue growth"}, {"month": 18, "action": "Hit 20cm for Bandholz"}]'),
((SELECT id FROM beard_styles WHERE slug = 'yeard'), (SELECT id FROM beard_styles WHERE slug = 'garibaldi'), 1, 'easy', 'Day 365+: Decision to reshape. Shape rounded bottom contour. Define width parameters. Begin Garibaldi maintenance routine.', '[{"session": 1, "action": "Shape rounded contour"}, {"session": 2, "action": "Define width"}]');

-- =====================================================
-- STYLE COMPARISONS
-- =====================================================

INSERT INTO style_comparisons (style_id, compared_to_style_id, comparison_points) VALUES
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), (SELECT id FROM beard_styles WHERE slug = 'bandholz'), '{
    "length": "Garibaldi 12-20 cm; Bandholz 20-40+ cm",
    "bottom_contour": "Garibaldi – defined wide rounded; Bandholz – natural any shape",
    "trimming": "Garibaldi – minimal shaping; Bandholz – almost none",
    "time_to_achieve": "Garibaldi 10-15 months; Bandholz 18-36 months",
    "overall_vibe": "Garibaldi – distinguished wild; Bandholz – epic natural"
}'),
((SELECT id FROM beard_styles WHERE slug = 'garibaldi'), (SELECT id FROM beard_styles WHERE slug = 'ducktail'), '{
    "length": "Garibaldi 12-20 cm; Ducktail 8-15 cm",
    "bottom_contour": "Garibaldi – wide rounded U-shape; Ducktail – pointed V-shape",
    "width": "Garibaldi – wider than long; Ducktail – tapered narrower at bottom",
    "cheeks": "Garibaldi – natural/soft; Ducktail – defined fade",
    "maintenance": "Garibaldi – low; Ducktail – medium-high"
}'),
((SELECT id FROM beard_styles WHERE slug = 'ducktail'), (SELECT id FROM beard_styles WHERE slug = 'yeard'), '{
    "definition": "Ducktail – shape-based; Yeard – time-based",
    "trimming_allowed": "Ducktail – regular required; Yeard – none allowed",
    "shape_control": "Ducktail – highly controlled; Yeard – accept natural outcome",
    "maintenance": "Ducktail – medium-high; Yeard – very low",
    "end_result": "Ducktail – predictable pointed; Yeard – varies by genetics"
}'),
((SELECT id FROM beard_styles WHERE slug = 'bandholz'), (SELECT id FROM beard_styles WHERE slug = 'yeard'), '{
    "definition": "Bandholz – length-based (20+ cm); Yeard – time-based (12 months)",
    "relationship": "Yeard is often a phase on the way to Bandholz",
    "continuation": "Yeard at month 12 can become Bandholz by month 18+",
    "trimming": "Both: almost none allowed",
    "philosophy": "Both embrace natural growth, minimal intervention"
}');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_beard_styles_category ON beard_styles(category);
CREATE INDEX IF NOT EXISTS idx_beard_styles_slug ON beard_styles(slug);
CREATE INDEX IF NOT EXISTS idx_beard_styles_difficulty ON beard_styles(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_beard_styles_premium ON beard_styles(is_premium);
