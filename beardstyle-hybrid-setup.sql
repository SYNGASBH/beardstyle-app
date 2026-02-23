-- ============================================================================
-- BEARDSTYLE HYBRID GRAPHITE SYSTEM - KOMPLETAN SQL SETUP
-- ============================================================================
-- Kreirano za BeardStyle aplikaciju
-- Hybrid Graphite Pencil + Digital Shading tehnika
-- Standardizirana muška lice template sa varijabilnom bradom
-- ============================================================================

-- ============================================================================
-- 1. NOVA TABELA ZA HYBRID GRAPHITE STILOVE
-- ============================================================================

CREATE TABLE beard_styles_hybrid (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  style_name VARCHAR(50) NOT NULL, -- 'mutton_chops', 'full_beard', 'van_dyke', etc
  description TEXT NOT NULL,
  technique VARCHAR(50) DEFAULT 'graphite_hybrid',
  image_url VARCHAR(255) NOT NULL,
  image_url_thumbnail VARCHAR(255), -- Za brže loading u galeriji
  face_template_version VARCHAR(10) DEFAULT 'v1', -- Za tracking konzistencije
  beard_density VARCHAR(20), -- '8-12cm_full', '6-8cm_medium', '3-5cm_light'
  beard_length_cm INTEGER, -- Specifična dužina u cm
  coverage_area VARCHAR(100), -- 'cheeks_chin', 'full_face', 'chin_only', etc
  neckline_style VARCHAR(50), -- 'natural', 'shaped', 'clean'
  mustache_style VARCHAR(50), -- 'connected', 'separate', 'none'
  prompt_used TEXT NOT NULL, -- Spremi cijeli Midjourney prompt za reproducibility
  midjourney_image_id VARCHAR(100), -- Za tracking Midjourney generiranih slika
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_by VARCHAR(100) DEFAULT 'amel' -- Za audit trail
);

-- ============================================================================
-- 2. TABELA ZA RAZLIČITE VARIJACIJE ISTOG STILA
-- ============================================================================

CREATE TABLE beard_style_variants (
  id SERIAL PRIMARY KEY,
  beard_style_id INTEGER NOT NULL REFERENCES beard_styles_hybrid(id) ON DELETE CASCADE,
  variant_number INTEGER NOT NULL, -- v1, v2, v3, etc
  image_url VARCHAR(255) NOT NULL,
  image_url_thumbnail VARCHAR(255),
  quality_score INTEGER, -- 1-10 rating za svaku varijantu
  notes TEXT, -- Npr. "Bolje definirane linije", "Idealna simetrija"
  selected BOOLEAN DEFAULT false, -- Koja je verzija odabrana za kolekciju
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(beard_style_id, variant_number)
);

-- ============================================================================
-- 3. TABELA ZA PROMPT TEMPLATE - LAKO AŽURIRANJE
-- ============================================================================

CREATE TABLE beard_prompt_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL UNIQUE, -- 'hybrid_graphite_v1', 'hybrid_graphite_v2'
  base_prompt TEXT NOT NULL,
  composition_section TEXT NOT NULL,
  camera_section TEXT NOT NULL,
  style_section TEXT NOT NULL,
  beard_section TEXT NOT NULL,
  color_section TEXT NOT NULL,
  midjourney_parameters VARCHAR(100), -- '--ar 1:1 --v 6', etc
  version VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- ============================================================================
-- 4. TABELA ZA KOLEKCIJE STILOVA (GROUPING)
-- ============================================================================

CREATE TABLE beard_style_collections (
  id SERIAL PRIMARY KEY,
  collection_name VARCHAR(100) NOT NULL UNIQUE, -- 'Classic Collection', 'Modern Collection'
  description TEXT,
  collection_type VARCHAR(50), -- 'density', 'length', 'coverage', 'era'
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 5. JUNCTION TABELA - STILOVI U KOLEKCIJAMA
-- ============================================================================

CREATE TABLE beard_style_in_collection (
  collection_id INTEGER NOT NULL REFERENCES beard_style_collections(id) ON DELETE CASCADE,
  beard_style_id INTEGER NOT NULL REFERENCES beard_styles_hybrid(id) ON DELETE CASCADE,
  sort_order INTEGER,
  PRIMARY KEY(collection_id, beard_style_id)
);

-- ============================================================================
-- 6. INDEKSI ZA PERFORMANSU
-- ============================================================================

CREATE INDEX idx_beard_styles_hybrid_style_name ON beard_styles_hybrid(style_name);
CREATE INDEX idx_beard_styles_hybrid_technique ON beard_styles_hybrid(technique);
CREATE INDEX idx_beard_styles_hybrid_beard_density ON beard_styles_hybrid(beard_density);
CREATE INDEX idx_beard_styles_hybrid_featured ON beard_styles_hybrid(featured) WHERE featured = true;
CREATE INDEX idx_beard_styles_hybrid_active ON beard_styles_hybrid(is_active) WHERE is_active = true;
CREATE INDEX idx_beard_style_variants_beard_style_id ON beard_style_variants(beard_style_id);
CREATE INDEX idx_beard_style_in_collection_collection_id ON beard_style_in_collection(collection_id);

-- ============================================================================
-- 7. SAMPLE DATA - MUTTON CHOPS KOLEKCIJA
-- ============================================================================

-- Prvo kreiraj prompt template
INSERT INTO beard_prompt_templates (
  template_name,
  base_prompt,
  composition_section,
  camera_section,
  style_section,
  beard_section,
  color_section,
  midjourney_parameters,
  version,
  notes
) VALUES (
  'hybrid_graphite_standard_v1',
  'Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck. The face structure must remain identical across all generations. Only the beard shape is allowed to change.',
  'Crop horizontally just below the nose. Show only lower nostrils, mustache area, lips, chin, jawline and neckline. No eyes. No forehead. No upper face. No ears. No hair on head.',
  'Perfectly frontal orthographic view. Zero perspective distortion. No tilt. No rotation. Perfect bilateral symmetry. Nose anchor: Lower nostrils barely visible and identically positioned.',
  'Professional graphite mechanical pencil illustration. 0.3-0.5 mm controlled line weight. Clean precise technical linework. Defined outer silhouette. Controlled beard edge contour. Blueprint technical atlas aesthetic. Instructional barber diagram style. Non-artistic.',
  'Connected mustache flowing seamlessly into beard. High density coverage from cheeks to chin. Balanced lower contour. Visible layered strand texture. Heavy layered crosshatch for volume and depth. Natural neckline visible below beard mass.',
  'Neutral grayscale only. Pure white background (#FFFFFF). Flat clinical lighting. No dramatic shadow.',
  '--ar 1:1 --v 6',
  'v1',
  'Standard Hybrid Graphite template sa ortografskom projekcijom i klinički lighting'
);

-- Kreiraj kolekciju
INSERT INTO beard_style_collections (collection_name, description, collection_type, featured)
VALUES (
  'Mutton Chops Collection',
  'Klasični Mutton Chops stilovi - gusta brada sa zaobljenim образima i oštrim točkama na uglovima čeljusti',
  'coverage',
  true
);

-- Insertaj glavnu Mutton Chops sliku
INSERT INTO beard_styles_hybrid (
  name,
  style_name,
  description,
  technique,
  image_url,
  image_url_thumbnail,
  face_template_version,
  beard_density,
  beard_length_cm,
  coverage_area,
  neckline_style,
  mustache_style,
  prompt_used,
  midjourney_image_id,
  featured
) VALUES (
  'Mutton Chops Classic - Hybrid v1',
  'mutton_chops',
  'Klasični Mutton Chops - 10-12cm gusta brada sa zaobljenim образima, oštrih točaka na uglovima čeljusti, seamlessly povezani brkovi. Ideal za vintage aesthetic i bold ljude.',
  'graphite_hybrid',
  '/images/hybrid/mutton-chops-classic-v1.png',
  '/images/hybrid/mutton-chops-classic-v1-thumb.png',
  'v1',
  '10-12cm_full',
  11,
  'cheeks_chin',
  'natural',
  'connected',
  'Create an extreme close-up technical illustration showing ONLY the lower third of a standardized male face template, cropped tightly from the bottom of the nose to the neck. The face structure must remain identical across all generations. Only the beard shape is allowed to change. Composition: Crop horizontally just below the nose. Show only lower nostrils, mustache area, lips, chin, jawline and neckline. No eyes. No forehead. No upper face. No ears. No hair on head. Camera: Perfectly frontal orthographic view. Zero perspective distortion. No tilt. No rotation. Perfect bilateral symmetry. Nose anchor: Lower nostrils barely visible and identically positioned. Style: Professional graphite mechanical pencil illustration. 0.3-0.5 mm controlled line weight. Clean precise technical linework. Defined outer silhouette. Controlled beard edge contour. Blueprint technical atlas aesthetic. Instructional barber diagram style. Non-artistic. Beard: Mutton Chops style - 10-12cm dense full beard with natural rounded contour on cheeks, tapering to sharp pointed ends at jaw angles. Connected mustache flowing seamlessly into beard. High density coverage from cheeks to chin. Balanced lower contour. Visible layered strand texture. Heavy layered crosshatch for volume and depth. Natural neckline visible below beard mass. Color: Neutral grayscale only. Pure white background (#FFFFFF). Flat clinical lighting. No dramatic shadow. --ar 1:1 --v 6',
  'mj_mutton_chops_v1_001',
  true
);

-- ============================================================================
-- 8. VARIJACIJE - MULTIPLE VERZIJE ISTOG STILA
-- ============================================================================

INSERT INTO beard_style_variants (beard_style_id, variant_number, image_url, quality_score, notes, selected)
VALUES (
  (SELECT id FROM beard_styles_hybrid WHERE name = 'Mutton Chops Classic - Hybrid v1'),
  1,
  '/images/hybrid/mutton-chops-classic-v1.png',
  9,
  'Perfektna simetrija, idealne oštre točke na čeljusti',
  true
);

INSERT INTO beard_style_variants (beard_style_id, variant_number, image_url, quality_score, notes, selected)
VALUES (
  (SELECT id FROM beard_styles_hybrid WHERE name = 'Mutton Chops Classic - Hybrid v1'),
  2,
  '/images/hybrid/mutton-chops-classic-v2.png',
  8,
  'Malo veća gustina, više teksture u linijama'
);

INSERT INTO beard_style_variants (beard_style_id, variant_number, image_url, quality_score, notes, selected)
VALUES (
  (SELECT id FROM beard_styles_hybrid WHERE name = 'Mutton Chops Classic - Hybrid v1'),
  3,
  '/images/hybrid/mutton-chops-classic-v3.png',
  7,
  'Drugačiji neckline pristup'
);

-- ============================================================================
-- 9. DODAJ STIL U KOLEKCIJU
-- ============================================================================

INSERT INTO beard_style_in_collection (collection_id, beard_style_id, sort_order)
VALUES (
  (SELECT id FROM beard_style_collections WHERE collection_name = 'Mutton Chops Collection'),
  (SELECT id FROM beard_styles_hybrid WHERE name = 'Mutton Chops Classic - Hybrid v1'),
  1
);

-- ============================================================================
-- 10. QUERIES ZA KORIŠTENJE U APLIKACIJI
-- ============================================================================

-- Query 1: Uzmi sve dostupne Hybrid Graphite stilove
-- SELECT * FROM beard_styles_hybrid WHERE is_active = true ORDER BY featured DESC, created_at DESC;

-- Query 2: Uzmi određeni stil sa svim varijacijama
-- SELECT bsh.*, bsv.* 
-- FROM beard_styles_hybrid bsh
-- LEFT JOIN beard_style_variants bsv ON bsh.id = bsv.beard_style_id
-- WHERE bsh.style_name = 'mutton_chops'
-- ORDER BY bsv.variant_number;

-- Query 3: Uzmi kolekciju sa svim stilovima
-- SELECT bsc.*, bsh.*
-- FROM beard_style_collections bsc
-- LEFT JOIN beard_style_in_collection bsic ON bsc.id = bsic.collection_id
-- LEFT JOIN beard_styles_hybrid bsh ON bsic.beard_style_id = bsh.id
-- WHERE bsc.collection_name = 'Mutton Chops Collection'
-- ORDER BY bsic.sort_order;

-- Query 4: Uzmi samo najbolje varijacije (selected = true)
-- SELECT bsh.*, bsv.*
-- FROM beard_styles_hybrid bsh
-- LEFT JOIN beard_style_variants bsv ON bsh.id = bsv.beard_style_id
-- WHERE bsv.selected = true
-- ORDER BY bsh.featured DESC, bsh.view_count DESC;

-- Query 5: Ažuriraj view count
-- UPDATE beard_styles_hybrid SET view_count = view_count + 1 WHERE id = $1;

-- ============================================================================
-- 11. UTILITY FUNKCIJE
-- ============================================================================

-- Funkcija za ažuriranje updated_at timestamp-a
CREATE OR REPLACE FUNCTION update_beard_styles_hybrid_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger za updated_at
CREATE TRIGGER trigger_update_beard_styles_hybrid_timestamp
BEFORE UPDATE ON beard_styles_hybrid
FOR EACH ROW
EXECUTE FUNCTION update_beard_styles_hybrid_timestamp();

-- ============================================================================
-- NAPOMENE ZA RAZVOJ
-- ============================================================================
/*
1. DODAVANJE NOVOG STILA:
   - Prvo generiraj u Midjourney sa prompt template
   - Spremi sve varijacije u /public/images/hybrid/[style-name]/
   - Insertaj u beard_styles_hybrid
   - Insertaj varijacije u beard_style_variants
   - Ako trebаš - kreiraj novu kolekciju ili dodaj u existing

2. PROMPT MANAGEMENT:
   - Čuva sve prompte u bazi za audit trail
   - Ako trebаš drugačiji prompt - kreiraj novu verziju u beard_prompt_templates
   - Update query koji koristi novi template

3. PERFORMANSA:
   - Svi indeksi su optimizirani za čitanje (SELECT)
   - Za galeriju koristi thumbnail slike
   - Lazy load varijacije samo kada korisnik klikne na stil

4. SKALABILNOST:
   - Struktura je spremna za hundreds stilova
   - View count za analytics
   - Featured flag za promociju
   - Kolekcije za tematske grupacije

*/
