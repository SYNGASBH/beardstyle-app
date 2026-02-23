-- =====================================================
-- TIER 2: MEDIUM LENGTH BEARDS (5–10 cm) - SQL SEED
-- Stilovi: Corporate Beard, Boxed Beard, Short Boxed, Balbo
-- =====================================================

-- Napomena: Ovaj seed file pretpostavlja da postoje tabele:
-- beard_styles, face_shape_compatibility, style_transitions,
-- lifestyle_tags, style_lifestyle_tags, style_comparisons

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

-- CORPORATE BEARD
(
    5,
    'Corporate Beard',
    'corporate-beard',
    2,
    'medium-length',
    2.0, 5.0, 3.5,
    'high',
    65,
    'Corporate Beard je profesionalno orijentisan, medium-length stil dizajniran za poslovne okoline. Karakterišu ga precizne linije, čiste ivice, kontrolirana dužina i groomed appearance koji signalizira profesionalizam bez žrtvovanja muževnog izgleda.',
    'Profesionalni stil sa preciznim linijama za poslovne okoline.',
    '{
        "length": {
            "min_cm": 2,
            "max_cm": 5,
            "optimal_cm": 3.5,
            "notes": "<2 cm prelazi u heavy stubble; >5 cm počinje izgledati casual"
        },
        "uniformity": {
            "variance_mm": 3,
            "critical": true,
            "notes": "Sides = Chin = Cheeks u dužini"
        },
        "bottom_contour": {
            "shape": "blago zaobljena prateći natural jawline",
            "neckline": "1-2 prsta iznad Adam''s apple, clean shaven ispod",
            "edge_type": "oštra granica"
        },
        "cheek_line": {
            "type": "hard line ili very tight fade",
            "blend_distance_mm": 5,
            "position": "na ili 1 cm ispod jagodične kosti",
            "symmetry": "kritična"
        },
        "mustache": {
            "style": "trimani na istu dužinu kao brada",
            "lip_clearance_mm": 2.5,
            "integration": "connected, groomed"
        },
        "volume_projection_percent": 15,
        "depth_cm": 2.25,
        "texture_requirements": {
            "fill_factor_min": 90,
            "stray_tolerance": "zero"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "full_beard_days": 4,
            "cheek_line_days": 2.5,
            "neckline_days": 2.5,
            "mustache_days": 2.5,
            "strays": "daily check"
        },
        "sessions_per_week": 4.5,
        "tools": [
            "Quality trimmer sa preciznim guards (3-12 mm range)",
            "Precision trimmer/edger (0 mm blade)",
            "Detail scissors",
            "Fine-tooth comb",
            "Magnifying mirror"
        ],
        "products": {
            "beard_oil_drops": 4,
            "beard_balm": "za flyaway control",
            "beard_wash_weekly": 3,
            "aftershave_balm": "za neckline post-shave"
        },
        "time_per_session_minutes": 12.5,
        "weekly_investment_minutes": 65,
        "daily_touchup_minutes": 2.5
    }'::jsonb,
    '[
        "Uniformna dužina je non-negotiable – isti guard setting svuda",
        "Linije moraju biti oštre – daily maintenance za perfection",
        "Neckline mora biti vidljivo definisan – clean shave ispod svaki put",
        "Zero tolerance za strays – daily inspection",
        "Brkovi ne prelaze usnu – maintain 2-3 mm clearance",
        "Simetrija je obavezna – koristi referentne tačke (nos, uši)",
        "Products za control, ne za volume",
        "Brightness/health matters – oil za zdravi sjaj"
    ]'::jsonb,
    '{
        "total_weeks": 5,
        "minimum_growth_cm": 3,
        "phases": [
            {
                "name": "Initial Growth",
                "weeks": "1-3",
                "description": "Sedmica 1: ~1 cm, awkward stubble phase. Sedmica 2: ~2 cm, počinje izgledati kao growing beard. Sedmica 3: ~3 cm, minimum corporate length dostignut."
            },
            {
                "name": "Shaping & Refinement",
                "weeks": "4-5",
                "description": "Sedmica 4: reaching 3.5-4 cm, full corporate shaping. Sedmica 5: optimal length achieved, fine-tune simetriju."
            },
            {
                "name": "Maintenance",
                "weeks": "6+",
                "description": "Steady state. Trim length svakih 3-5 dana, line maintenance svakih 2-3 dana."
            }
        ],
        "timing_tip": "Počni growth za vikend ili godišnji odmor"
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "office_environment": true,
        "grooming_access": "daily",
        "hair_density": "medium-to-high preferred",
        "maintenance_commitment": "10-15 min daily",
        "notes": "Ako cheeks ne connect, razmotriti modified corporate (goatee + stubble cheeks)"
    }'::jsonb,
    NOW(), NOW()
),

-- BOXED BEARD
(
    6,
    'Boxed Beard',
    'boxed-beard',
    2,
    'medium-length',
    5.0, 10.0, 7.0,
    'medium-high',
    55,
    'Boxed Beard je strukturirana full beard varijanta sa čistim, geometrijskim linijama koje formiraju kutijasti oblik oko donje polovice lica. Naglašava angularne linije, definisane ivice i kontroliranu formu.',
    'Strukturirana brada sa geometrijskim linijama i angularnim oblikom.',
    '{
        "length": {
            "min_cm": 5,
            "max_cm": 10,
            "optimal_cm": 7,
            "notes": "<5 cm prelazi u Short Boxed; >10 cm ulazi u Full Beard/Garibaldi"
        },
        "width": {
            "ratio_to_jawline": 1.075,
            "side_profile": "vertikalne ili blago taperirane linije",
            "notes": "Nema dramatic flare"
        },
        "bottom_contour": {
            "shape": "squared-off, relativno ravna ili blago zaobljena",
            "corner_radius_cm": 1.5,
            "notes": "Horizontalna linija dominira"
        },
        "cheek_line": {
            "type": "medium-to-hard line",
            "blend_distance_cm": 0.5,
            "position": "razini sredine uha do 2 cm ispod jagodične kosti",
            "symmetry": "kritična"
        },
        "mustache": {
            "style": "full, connected",
            "lip_clearance_mm": 2,
            "length": "do uglova usana"
        },
        "volume_projection_percent": 32.5,
        "depth_cm": 3,
        "texture_requirements": {
            "fill_factor_min": 85,
            "stray_tolerance": "minimal"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "length_days": 6,
            "cheek_line_days": 4,
            "bottom_contour_days": 6,
            "neckline_days": 4,
            "mustache_days": 4
        },
        "sessions_per_week": 3.5,
        "tools": [
            "Trimmer sa guards (6-12 mm range)",
            "Precision trimmer/edger (0 mm blade)",
            "Beard scissors (5 inch)",
            "Fine-tooth comb",
            "Straight edge/template (optional)"
        ],
        "products": {
            "beard_oil_drops": 5,
            "beard_balm": "za hold i definition",
            "beard_wash_weekly": 2.5,
            "aftershave_balm": "za shaved areas"
        },
        "time_per_session_minutes": 15,
        "weekly_investment_minutes": 55
    }'::jsonb,
    '[
        "Linije moraju biti čiste i definirane",
        "Donja kontura je horizontalna, ne pointed",
        "Simetrija je non-negotiable",
        "Uniformna dužina preko cijele brade (±4 mm max)",
        "Corners blago zaobljeni (radius 1-2 cm)",
        "Cheek line konzistentna visina",
        "Neckline čist i definisan",
        "Regular maintenance obavezan (5-7 dana max)"
    ]'::jsonb,
    '{
        "total_weeks": 7,
        "minimum_growth_cm": 5,
        "phases": [
            {
                "name": "Foundation Growth",
                "weeks": "1-4",
                "description": "Sedmica 1-2: ~2 cm, define neckline early. Sedmica 3-4: ~4 cm, start defining cheek line."
            },
            {
                "name": "Initial Shaping",
                "weeks": "5-7",
                "description": "Sedmica 5: ~5 cm minimum, first full shaping. Sedmica 6-7: 6-7 cm, refine all lines."
            },
            {
                "name": "Maintenance",
                "weeks": "8+",
                "description": "Target shape achieved. Regular maintenance svakih 5-7 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "hair_density": "medium-to-high preferred",
        "texture": "straight-to-wavy ideal",
        "commitment": "3-4× sedmično maintenance",
        "uniform_growth": "required on cheeks, chin, jawline",
        "notes": "Steady hand ili brijač za line maintenance"
    }'::jsonb,
    NOW(), NOW()
),

-- SHORT BOXED
(
    7,
    'Short Boxed Beard',
    'short-boxed-beard',
    2,
    'medium-length',
    3.0, 5.0, 4.0,
    'high',
    50,
    'Short Boxed Beard je kompaktna, strukturirana beard varijanta koja kombinuje prisutnost prave brade sa minimalnom dužinom i maksimalnom preciznošću. Kraća verzija Boxed Beard-a sa istim naglaskom na geometrijske linije.',
    'Kompaktna strukturirana brada sa maksimalnom preciznošću.',
    '{
        "length": {
            "min_cm": 3,
            "max_cm": 5,
            "optimal_cm": 4,
            "notes": "<3 cm prelazi u heavy stubble; >5 cm ulazi u Boxed Beard"
        },
        "width": {
            "ratio_to_jawline": 1.0,
            "side_profile": "vertikalne linije, prate jawline",
            "notes": "Nema flare - controlled, compact"
        },
        "bottom_contour": {
            "shape": "squared-off, čista linija",
            "corner_radius_cm": 1,
            "notes": "Prati natural jaw angle"
        },
        "cheek_line": {
            "type": "hard line",
            "position": "1-2 cm ispod jagodične kosti",
            "symmetry": "kritična",
            "stray_tolerance": "none"
        },
        "neckline": {
            "position": "1-2 prsta iznad Adam''s apple",
            "shape": "prati natural jaw curve",
            "below": "clean shaven"
        },
        "mustache": {
            "style": "full connected, ista dužina kao brada",
            "lip_clearance_mm": 2.5,
            "integration": "neat"
        },
        "volume_projection_percent": 20,
        "depth_cm": 2,
        "texture_requirements": {
            "fill_factor_min": 90,
            "stray_tolerance": "zero"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "length_days": 5,
            "cheek_line_days": 3,
            "neckline_days": 3,
            "mustache_days": 3,
            "strays": "daily check"
        },
        "sessions_per_week": 4.5,
        "tools": [
            "Trimmer sa guards (3-6 mm range)",
            "Precision trimmer (0 mm blade)",
            "Detail scissors",
            "Fine-tooth comb",
            "Magnifying mirror"
        ],
        "products": {
            "beard_oil_drops": 3,
            "beard_balm": "optional, za flyaway control",
            "beard_wash_weekly": 3,
            "aftershave_balm": "za neckline/cheek area"
        },
        "time_per_session_minutes": 10,
        "weekly_investment_minutes": 50
    }'::jsonb,
    '[
        "Uniformna dužina je kritična (±2 mm max)",
        "Linije moraju biti oštre - daily ili every-other-day maintenance",
        "Corners blago zaobljeni (radius 0.5-1.5 cm)",
        "Cheek line konzistentna i čista",
        "Neckline critical - clean shave ispod",
        "Brkovi iste dužine kao brada",
        "Zero tolerance za strays",
        "Frequent trimming essential (svakih 4-6 dana)"
    ]'::jsonb,
    '{
        "total_weeks": 5,
        "minimum_growth_cm": 3,
        "phases": [
            {
                "name": "Initial Growth",
                "weeks": "1-3",
                "description": "Sedmica 1: ~1 cm stubble, define neckline. Sedmica 2: ~2 cm heavy stubble, define cheek line. Sedmica 3: ~3 cm minimum length."
            },
            {
                "name": "Shaping & Refinement",
                "weeks": "4-5",
                "description": "Sedmica 4: reaching 3.5-4 cm, full shaping. Sedmica 5: optimal length (4 cm), fine-tune."
            },
            {
                "name": "Maintenance",
                "weeks": "6+",
                "description": "Steady state. Trim svakih 4-6 dana, line maintenance svakih 2-4 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "office_environment": true,
        "hair_density": "medium-to-high preferred",
        "maintenance_commitment": "8-12 min every other day",
        "facial_hair_pattern": "connected beard required - gaps visible at this length"
    }'::jsonb,
    NOW(), NOW()
),

-- BALBO
(
    8,
    'Balbo',
    'balbo',
    2,
    'medium-length',
    3.0, 8.0, 5.0,
    'high',
    65,
    'Balbo je distinctive, sculptured beard stil koji kombinuje tri odvojena elementa: brkove, soul patch, i bradu na bradi - ali bez povezivanja sa sideburns. Nazvan po italijanskom maršalu Italu Balbu.',
    'Sculptured stil sa odvojenim brkovima i floating chin beard efektom.',
    '{
        "chin_beard_length": {
            "min_cm": 3,
            "max_cm": 8,
            "optimal_cm": 5,
            "notes": "<3 cm prelazi u extended goatee; >8 cm gubi proportioned look"
        },
        "chin_beard_width_cm": 11,
        "chin_beard_extension": "1-3 cm iza uglova usana na svakoj strani",
        "bottom_contour": {
            "shape": "rounded ili slightly pointed",
            "rounded_radius_cm": 5,
            "pointed_angle_degrees": 60
        },
        "cheek_area": {
            "status": "POTPUNO ČISTA",
            "notes": "dealbreaker za Balbo klasifikaciju"
        },
        "sideburn_gap": {
            "minimum_cm": 3,
            "notes": "floating efekt je ključna karakteristika"
        },
        "mustache": {
            "separation": "ne dodiruje bradu - postoji gap",
            "style": "natural full ili shaped",
            "length": "do 1 cm preko uglova usana",
            "wax_allowed": true
        },
        "soul_patch": {
            "present": "opcionalno, često prisutno",
            "width_cm": 1.5,
            "length_cm": 1.5,
            "function": "bridge između mustache i brade"
        },
        "volume_projection_percent": 22.5,
        "depth_cm": 3,
        "texture_requirements": {
            "fill_factor_min": 90,
            "cheek_stray_tolerance": "zero"
        }
    }'::jsonb,
    '{
        "trim_intervals": {
            "chin_beard_days": 8.5,
            "cheek_shave_days": 2.5,
            "mustache_days": 6,
            "gap_maintenance_days": 4,
            "bottom_contour_days": 8.5,
            "neckline_days": 6
        },
        "sessions_per_week": 4.5,
        "tools": [
            "Precision trimmer (0 mm blade)",
            "Razor ili safety razor",
            "Trimmer sa guards (4-10 mm)",
            "Beard scissors",
            "Fine-tooth comb",
            "Mustache wax (optional)"
        ],
        "products": {
            "beard_oil_drops": 3,
            "beard_balm": "za hold i definition",
            "shaving_cream": "za cheek shaving",
            "aftershave_balm": "za cheek area",
            "mustache_wax": "optional"
        },
        "time_per_session_minutes": 15,
        "weekly_investment_minutes": 65
    }'::jsonb,
    '[
        "Obrazi moraju biti potpuno čisti - clean shave svakih 2-3 dana",
        "Gap između braka i brade - mora postojati vidljiv gap ili tanka bridge",
        "Beard ne dodiruje sideburns - minimum 2 cm gap",
        "Širina pokriva jaw, ne samo chin - extend 1-3 cm iza uglova usana",
        "Brkovi su styling element - može se stilizirati zasebno",
        "Simetrija je apsolutno kritična",
        "Donja kontura defined ali ne extreme",
        "Soul patch kao bridge ako postoji"
    ]'::jsonb,
    '{
        "total_weeks": 6,
        "minimum_growth_cm": 4,
        "phases": [
            {
                "name": "Full Growth",
                "weeks": "1-4",
                "description": "Grow everything - full face. Nema shaving. Reaching ~4 cm shapeable length."
            },
            {
                "name": "Initial Shaping",
                "weeks": "5-6",
                "description": "MAJOR SHAPING: Shave cheeks, create gap, define edges, create mustache/beard separation."
            },
            {
                "name": "Maintenance",
                "weeks": "7+",
                "description": "Cheek shaving svakih 2-3 dana, chin beard trim svakih 7-10 dana."
            }
        ]
    }'::jsonb,
    '{
        "growth_rate_cm_monthly": 1.2,
        "cheek_hair": "ability to grow full cheeks required for initial phase",
        "maintenance_commitment": "cheek shaving svakih 2-3 dana",
        "styling_skill": "moderate required za symmetry i edge definition",
        "chin_growth": "mora biti dovoljna za width",
        "weekly_time_minutes": "50-80 non-negotiable"
    }'::jsonb,
    NOW(), NOW()
);

-- =====================================================
-- 2. FACE SHAPE COMPATIBILITY
-- =====================================================

INSERT INTO face_shape_compatibility (beard_style_id, face_shape, score, explanation) VALUES
-- Corporate Beard
(5, 'oval', 95, 'Savršen match. Corporate beard frame-uje već balansirano lice bez distorzije.'),
(5, 'square', 90, 'Odličan. Čiste linije komplementiraju angular features. Strong professional look.'),
(5, 'round', 80, 'Dobro funkcionira. Defined lines dodaju strukture okruglom licu.'),
(5, 'triangle', 85, 'Dobro. Brada balansira široku vilicu. Keep length moderate.'),
(5, 'diamond', 85, 'Radi dobro. Beard adds definition to narrow chin while lines work with cheekbones.'),
(5, 'oblong', 75, 'OK, ali pažljivo. Vertical length može elongirati. Držati na 2-3 cm.'),

-- Boxed Beard
(6, 'oval', 90, 'Odličan match. Angular beard adds structure to balanced face.'),
(6, 'square', 95, 'Idealno. Boxed shape komplementira angular jawline. Strong, masculine look.'),
(6, 'round', 85, 'Dobro. Angular lines dodaju definition i vizualno izdužuju okruglo lice.'),
(6, 'triangle', 80, 'Funkcionira. Brada balansira široku vilicu. Pažnja na width.'),
(6, 'diamond', 85, 'Radi dobro. Angular beard complements cheekbones while adding chin definition.'),
(6, 'oblong', 70, 'OK, ali oprez. Boxed shape može dodatno elongirati. Keep length 5-6 cm.'),

-- Short Boxed
(7, 'oval', 95, 'Savršen match. Short Boxed adds structure bez disrupting natural balance.'),
(7, 'square', 95, 'Odličan. Angular beard complements angular face. Clean, masculine look.'),
(7, 'round', 85, 'Dobro. Angular lines add definition to round face.'),
(7, 'triangle', 85, 'Funkcionira dobro. Adds balance without adding too much width.'),
(7, 'diamond', 90, 'Radi odlično. Angular beard works with cheekbones, adds chin definition.'),
(7, 'oblong', 80, 'OK. Short length doesn''t add too much vertical elongation. Keep at 3-4 cm.'),

-- Balbo
(8, 'oval', 90, 'Odličan. Balbo''s width adds interest bez disrupting balanced proportions.'),
(8, 'square', 85, 'Dobro. Wide chin beard complements strong jaw. Gap adds definition.'),
(8, 'round', 80, 'Funkcionira. Width on chin can elongate visually. Clean cheeks help define.'),
(8, 'triangle', 75, 'OK, ali pažljivo. Wide jaw + wide Balbo može biti previše.'),
(8, 'diamond', 95, 'Savršeno. Balbo adds chin width to balance prominent cheekbones.'),
(8, 'oblong', 70, 'Risky. Width helps, ali length can elongate further. Keep chin beard 3-4 cm.');

-- =====================================================
-- 3. STYLE TRANSITIONS
-- =====================================================

INSERT INTO style_transitions (from_style_id, to_style_id, duration_weeks, difficulty, steps, notes) VALUES
-- Corporate Beard transitions
(5, 1, 8, 'medium', '["Prestati trimati dužinu", "Dozvoliti natural growth", "Na 12+ cm formirati rounded contour", "Softening cheek line"]', 'Corporate to Garibaldi - growing out'),
(5, 6, 4, 'easy', '["Let length grow to 5-10 cm", "Maintain defined lines", "Allow more volume", "Same angular shape"]', 'Corporate to Boxed - growing out'),
(5, 7, 0, 'easy', '["Adjust length to match", "Same style essentially", "Maintain defined lines"]', 'Corporate to Short Boxed - virtually identical'),
(NULL, 5, 5, 'easy-medium', '["Week 1: Let it grow, plan for awkward phase", "Week 2: Define neckline early", "Week 3: Define cheek lines when length allows", "Week 4: Shape to uniform length", "Week 5: Perfect symmetry, establish routine"]', 'Clean Shaven to Corporate'),

-- Boxed Beard transitions
(6, 5, 0, 'easy', '["Trim length to 2-5 cm", "Maintain same angular shape", "Keep all lines defined"]', 'Boxed to Corporate - trimming down'),
(6, 7, 0, 'easy', '["Trim length to 3-5 cm", "Maintain same angular shape", "Keep all lines defined"]', 'Boxed to Short Boxed - trimming down'),
(6, 3, 5, 'medium', '["Let chin grow longer than sides", "Gradually form pointed bottom", "Taper sides inward", "May need 8+ cm chin length"]', 'Boxed to Ducktail'),
(6, 1, 10, 'easy-medium', '["Stop bottom contour trimming", "Let shape go natural", "Allow width expansion", "At 12+ cm: shape rounded contour"]', 'Boxed to Garibaldi'),
(NULL, 6, 7, 'medium', '["Sedmica 1-2: Grow, define neckline", "Sedmica 3-4: Define cheek line", "Sedmica 5-6: Shape squared bottom, achieve uniformity", "Sedmica 7+: Refine and maintain"]', 'Clean Shaven to Boxed'),

-- Short Boxed transitions
(7, 6, 5, 'easy', '["Let length grow to 5-10 cm", "Maintain lines during growth", "Same shape, more volume"]', 'Short Boxed to Boxed'),
(7, 5, 0, 'easy', '["Adjust length to 2-5 cm range", "Maintain defined lines", "Same maintenance frequency"]', 'Short Boxed to Corporate'),
(7, 3, 7, 'medium', '["Let chin grow longer than sides", "At 6+ cm chin: start tapering", "Form pointed bottom", "Significant transformation"]', 'Short Boxed to Ducktail'),
(NULL, 7, 5, 'easy-medium', '["Sedmica 1: Grow, define neckline", "Sedmica 2: Define cheek line", "Sedmica 3: First shaping", "Sedmica 4-5: Refine, start maintenance"]', 'Clean Shaven to Short Boxed'),

-- Balbo transitions
(8, 1, 8, 'easy', '["Stop shaving cheeks", "Let sideburns connect to chin", "Stop separating mustache", "At 5+ cm cheeks: full beard territory"]', 'Balbo to Full Beard/Garibaldi'),
(8, NULL, 0, 'easy', '["Narrow chin beard", "Remove jawline coverage", "Focus on chin point", "Maintain separation"]', 'Balbo to Van Dyke'),
(1, 8, 1, 'medium', '["Shave cheeks completely", "Create gap from sideburns", "Separate mustache from chin", "Define chin beard edges"]', 'Full Beard to Balbo'),
(NULL, 8, 6, 'medium-hard', '["Sedmica 1-4: Grow full beard, no shaping", "Sedmica 5: Major shaping - shave cheeks, create gaps", "Sedmica 6: Refine edges and symmetry", "Sedmica 7+: High-maintenance routine"]', 'Clean Shaven to Balbo');

-- =====================================================
-- 4. LIFESTYLE TAGS
-- =====================================================

INSERT INTO lifestyle_tags (id, name, slug, category) VALUES
(15, 'Corporate Office', 'corporate-office', 'work'),
(16, 'Client Meetings', 'client-meetings', 'work'),
(17, 'Job Interviews', 'job-interviews', 'work'),
(18, 'Conservative Industries', 'conservative-industries', 'work'),
(19, 'Black Tie Events', 'black-tie-events', 'formal'),
(20, 'Detail-Oriented', 'detail-oriented', 'personality'),
(21, 'Professional Image', 'professional-image', 'lifestyle'),
(22, 'Structured Look', 'structured-look', 'aesthetic'),
(23, 'High Maintenance Willing', 'high-maintenance-willing', 'commitment'),
(24, 'Stylish Grooming', 'stylish-grooming', 'lifestyle'),
(25, 'Distinguished Look', 'distinguished-look', 'aesthetic')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. STYLE-LIFESTYLE TAG ASSOCIATIONS
-- =====================================================

INSERT INTO style_lifestyle_tags (beard_style_id, lifestyle_tag_id, relevance_score) VALUES
-- Corporate Beard
(5, 15, 100),  -- Corporate Office - primary purpose
(5, 16, 95),   -- Client Meetings
(5, 17, 95),   -- Job Interviews
(5, 18, 95),   -- Conservative Industries
(5, 19, 90),   -- Black Tie Events
(5, 20, 85),   -- Detail-Oriented
(5, 21, 100),  -- Professional Image

-- Boxed Beard
(6, 15, 90),   -- Corporate Office
(6, 16, 90),   -- Client Meetings
(6, 17, 90),   -- Job Interviews
(6, 22, 95),   -- Structured Look
(6, 23, 85),   -- High Maintenance Willing
(6, 19, 85),   -- Black Tie Events

-- Short Boxed
(7, 15, 100),  -- Corporate Office - ideal
(7, 17, 95),   -- Job Interviews
(7, 18, 95),   -- Conservative Industries
(7, 20, 90),   -- Detail-Oriented
(7, 21, 95),   -- Professional Image
(7, 23, 90),   -- High Maintenance Willing

-- Balbo
(8, 24, 95),   -- Stylish Grooming
(8, 25, 90),   -- Distinguished Look
(8, 19, 85),   -- Black Tie Events
(8, 23, 100),  -- High Maintenance Willing
(8, 20, 95);   -- Detail-Oriented

-- =====================================================
-- 6. STYLE COMPARISONS
-- =====================================================

INSERT INTO style_comparisons (style_id_1, style_id_2, comparison_summary, key_differences, similarity_score) VALUES
(5, 7, 'Corporate i Short Boxed su gotovo identični stilovi',
 '{"Corporate": "Focus na professional/office appearance, može biti blago kraći (2-5 cm)", "Short Boxed": "Isti oblik, focus na structured geometric look (3-5 cm)", "shared": "Oba su office-appropriate sa defined linijama"}',
 92),
(5, 6, 'Corporate je kraća, strožija verzija Boxed Beard-a',
 '{"Corporate": "2-5 cm, maximum precision, zero tolerance za strays", "Boxed": "5-10 cm, više volumena i beard presence", "shared": "Oba naglašavaju angular, defined linije"}',
 78),
(6, 7, 'Boxed i Short Boxed su isti oblik, različita veličina',
 '{"Boxed": "5-10 cm, više volumena, medium-high maintenance", "Short Boxed": "3-5 cm, kompaktniji, high maintenance", "shared": "Identičan angular, boxed shape"}',
 88),
(6, 1, 'Boxed je structured verzija Garibaldija',
 '{"Boxed": "Angular, defined linije, squared bottom, 5-10 cm", "Garibaldi": "Rounded, natural, wide flare, 12-20 cm", "shared": "Oba su full beard stilovi"}',
 55),
(8, 5, 'Balbo i Corporate imaju visoko održavanje, različite forme',
 '{"Balbo": "Floating chin beard, clean cheeks, separated mustache", "Corporate": "Full connected beard, defined lines", "shared": "Oba zahtijevaju high maintenance i precision"}',
 45),
(8, 1, 'Balbo je sculptured verzija sa clean cheeks za razliku od Garibaldija',
 '{"Balbo": "Floating chin beard, clean shaved cheeks, separated elements", "Garibaldi": "Full coverage, rounded, integrated mustache", "shared": "Oba su distinctive, statement stilovi"}',
 30);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Provjeri unesene stilove
-- SELECT id, name, tier, maintenance_level FROM beard_styles WHERE tier = 2 ORDER BY id;

-- Provjeri face shape compatibility
-- SELECT bs.name, fsc.face_shape, fsc.score
-- FROM face_shape_compatibility fsc
-- JOIN beard_styles bs ON fsc.beard_style_id = bs.id
-- WHERE bs.tier = 2 ORDER BY bs.id, fsc.score DESC;

-- Provjeri transitions
-- SELECT
--   COALESCE(from_s.name, 'Clean Shaven') as from_style,
--   COALESCE(to_s.name, 'Other') as to_style,
--   st.duration_weeks,
--   st.difficulty
-- FROM style_transitions st
-- LEFT JOIN beard_styles from_s ON st.from_style_id = from_s.id
-- LEFT JOIN beard_styles to_s ON st.to_style_id = to_s.id
-- WHERE from_s.tier = 2 OR to_s.tier = 2;
