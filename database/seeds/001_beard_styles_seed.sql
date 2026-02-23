-- Seed Data for Beard Style Advisor
-- Version: 1.0.0

-- ============================================
-- FACE TYPES SEED DATA
-- ============================================

INSERT INTO face_types (name, description, characteristics, image_url) VALUES
('Oval', 
 'Ravnomjerne proporcije sa blagim zaobljenjima', 
 '{"forehead": "average", "jawline": "rounded", "face_length": "1.5x width", "versatility": "high"}',
 '/assets/face-types/oval.svg'),

('Round', 
 'Okruglo lice sa punim obrazima', 
 '{"forehead": "wide", "jawline": "soft", "face_length": "similar to width", "versatility": "medium"}',
 '/assets/face-types/round.svg'),

('Square', 
 'Široka vilica sa oštrijim uglovima', 
 '{"forehead": "wide", "jawline": "strong angular", "face_length": "similar to width", "versatility": "high"}',
 '/assets/face-types/square.svg'),

('Rectangle', 
 'Izduženo lice sa ravnim linijama', 
 '{"forehead": "wide", "jawline": "angular", "face_length": "significantly longer than width", "versatility": "medium"}',
 '/assets/face-types/rectangle.svg'),

('Heart', 
 'Široko čelo i uska vilica', 
 '{"forehead": "wide", "jawline": "narrow pointed", "face_length": "average", "versatility": "medium"}',
 '/assets/face-types/heart.svg'),

('Diamond', 
 'Usko čelo, široki jagodični, uska vilica', 
 '{"forehead": "narrow", "jawline": "narrow", "cheekbones": "wide", "face_length": "average", "versatility": "medium"}',
 '/assets/face-types/diamond.svg'),

('Triangle', 
 'Usko čelo, široka vilica', 
 '{"forehead": "narrow", "jawline": "wide angular", "face_length": "average", "versatility": "medium"}',
 '/assets/face-types/triangle.svg');

-- ============================================
-- TAGS SEED DATA
-- ============================================

INSERT INTO tags (name, category) VALUES
-- Lifestyle tags
('Corporate', 'lifestyle'),
('Casual', 'lifestyle'),
('Creative', 'lifestyle'),
('Outdoor', 'lifestyle'),
('Formal', 'lifestyle'),

-- Maintenance tags
('Low Maintenance', 'maintenance'),
('Medium Maintenance', 'maintenance'),
('High Maintenance', 'maintenance'),

-- Style tags
('Classic', 'style'),
('Modern', 'style'),
('Rugged', 'style'),
('Hipster', 'style'),
('Professional', 'style'),
('Artistic', 'style'),
('Trendy', 'style'),

-- Age tags
('Young', 'age'),
('Mature', 'age'),
('Timeless', 'age');

-- ============================================
-- BEARD STYLES SEED DATA
-- ============================================

-- Style 1: Clean Shaven
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Clean Shaven',
    'clean-shaven',
    'Klasičan izgled bez brade. Idealno za profesionalne sredine i toplo vrijeme.',
    'high',
    'corporate',
    0,
    ARRAY[1, 2, 3, 4, 5, 6, 7],
    '/assets/styles/clean-shaven.jpg',
    90,
    'Brijanje svakih 1-2 dana. Koristi kvalitetnu pjenu i nakon brijanja losion.'
);

-- Style 2: Stubble (3-day)
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Stubble (3-Day Shadow)',
    'stubble-3day',
    'Kratka neobrijana brada od 3-5 dana. Casual i muževan izgled.',
    'low',
    'casual',
    0,
    ARRAY[1, 2, 3, 4, 5],
    '/assets/styles/stubble.jpg',
    95,
    'Održavaj dužinu sa trimerom na 3-5mm. Definiši linije vrata i obraza.'
);

-- Style 3: Short Boxed Beard
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Short Boxed Beard',
    'short-boxed',
    'Kratka, uredna brada sa definisanim konturama. Profesionalna i moderna.',
    'medium',
    'corporate',
    3,
    ARRAY[1, 3, 4],
    '/assets/styles/short-boxed.jpg',
    88,
    'Trimuj na 6-12mm. Oštri uglovi na obrazima. Redovno održavanje linija.'
);

-- Style 4: Full Beard
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Full Beard',
    'full-beard',
    'Klasična puna brada. Vremeplovana i muževna.',
    'medium',
    'casual',
    8,
    ARRAY[1, 2, 4, 7],
    '/assets/styles/full-beard.jpg',
    92,
    'Redovno četkaj i koristi ulje za bradu. Trimuj krajeve mjesečno.'
);

-- Style 5: Goatee
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Goatee',
    'goatee',
    'Brada samo na bradi i ispod usana. Casual i artistički.',
    'medium',
    'artistic',
    3,
    ARRAY[1, 2, 5, 6],
    '/assets/styles/goatee.jpg',
    75,
    'Precizno održavanje ivica. Obrij obraze i vrat čisto.'
);

-- Style 6: Van Dyke
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Van Dyke',
    'van-dyke',
    'Kombinacija goateeja i mustafa. Sofisticiran i artistički.',
    'high',
    'artistic',
    4,
    ARRAY[1, 4, 5],
    '/assets/styles/van-dyke.jpg',
    70,
    'Zahtijeva preciznost. Mustaće i goatee odvojeni. Dnevno održavanje.'
);

-- Style 7: Balbo
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Balbo',
    'balbo',
    'Brada bez spojenih mustaća. Moderna i urbana.',
    'high',
    'modern',
    4,
    ARRAY[1, 3, 4],
    '/assets/styles/balbo.jpg',
    68,
    'Oštri uglovi. Mustaće odvojene od brade. Precizno brijanje.'
);

-- Style 8: Circle Beard
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Circle Beard',
    'circle-beard',
    'Kružna brada - goatee spojeno sa mustafama. Versatilan i popularan.',
    'medium',
    'modern',
    3,
    ARRAY[1, 2, 3, 5],
    '/assets/styles/circle-beard.jpg',
    85,
    'Održavaj kružni oblik. Obrij obraze. Trimuj na jednu dužinu.'
);

-- Style 9: Ducktail
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Ducktail',
    'ducktail',
    'Puna brada sa špicim krajem. Ikonski i muževan stil.',
    'medium',
    'rugged',
    10,
    ARRAY[1, 3, 4, 7],
    '/assets/styles/ducktail.jpg',
    72,
    'Pusti da raste duže na bradi. Oblikuj špic. Koristi balzam.'
);

-- Style 10: Garibaldi
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Garibaldi',
    'garibaldi',
    'Široka, puna brada sa zaobljenim dnom. Robusna i prirodna.',
    'low',
    'rugged',
    12,
    ARRAY[1, 3, 4],
    '/assets/styles/garibaldi.jpg',
    65,
    'Minimalno trimovanje. Prirodan rast. Zaoblji dno na 15-20cm.'
);

-- Style 11: Mutton Chops
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Mutton Chops',
    'mutton-chops',
    'Zaliske spojene sa mustafama, bez brade. Jedinstven i smeo stil.',
    'high',
    'artistic',
    6,
    ARRAY[3, 4],
    '/assets/styles/mutton-chops.jpg',
    55,
    'Obrij bradu čisto. Pusti zaliske da rastu. Oblikuj ivice.'
);

-- Style 12: Anchor Beard
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Anchor Beard',
    'anchor-beard',
    'Brada u obliku sidra sa tankom linijom duž vilice. Precizna i moderna.',
    'high',
    'artistic',
    5,
    ARRAY[1, 4, 5],
    '/assets/styles/anchor-beard.jpg',
    62,
    'Precizno održavanje linija. Tanka linija duž vilice. Soul patch ispod usana.'
);

-- Style 13: Chin Strap
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Chin Strap',
    'chin-strap',
    'Tanka linija brade duž vilice bez mustaća. Definisan i urbani.',
    'high',
    'modern',
    3,
    ARRAY[1, 2, 5],
    '/assets/styles/chin-strap.jpg',
    58,
    'Održavaj tanku liniju (3-5mm). Obrij obraze i mustaće. Precizne ivice.'
);

-- Style 14: Beardstache
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Beardstache',
    'beardstache',
    'Istaknute mustaće sa kraćom bradom. Trendy i pažnje privlačan.',
    'medium',
    'trendy',
    4,
    ARRAY[1, 3, 4],
    '/assets/styles/beardstache.jpg',
    78,
    'Duže mustaće (10-15mm), kraća brada (3-5mm). Koristi vosak za mustaće.'
);

-- Style 15: Corporate Beard
INSERT INTO beard_styles (name, slug, description, maintenance_level, style_category, growth_time_weeks, recommended_face_types, image_url, popularity_score, instructions)
VALUES (
    'Corporate Beard',
    'corporate-beard',
    'Kratka, uredno održavana brada. Savršena za poslovno okruženje.',
    'medium',
    'corporate',
    4,
    ARRAY[1, 3, 4],
    '/assets/styles/corporate-beard.jpg',
    87,
    'Trimuj na 6-9mm. Oštri uglovi. Dnevno četkanje. Koristi ulje za sjaj.'
);

-- ============================================
-- BEARD STYLE TAGS (Many-to-Many Relations)
-- ============================================

-- Clean Shaven tags
INSERT INTO beard_style_tags (beard_style_id, tag_id) 
SELECT 1, id FROM tags WHERE name IN ('Corporate', 'Professional', 'High Maintenance', 'Timeless');

-- Stubble tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 2, id FROM tags WHERE name IN ('Casual', 'Low Maintenance', 'Modern', 'Young');

-- Short Boxed Beard tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 3, id FROM tags WHERE name IN ('Corporate', 'Professional', 'Medium Maintenance', 'Classic');

-- Full Beard tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 4, id FROM tags WHERE name IN ('Casual', 'Rugged', 'Medium Maintenance', 'Timeless');

-- Goatee tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 5, id FROM tags WHERE name IN ('Artistic', 'Casual', 'Medium Maintenance', 'Classic');

-- Van Dyke tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 6, id FROM tags WHERE name IN ('Artistic', 'Formal', 'High Maintenance', 'Classic');

-- Balbo tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 7, id FROM tags WHERE name IN ('Modern', 'Trendy', 'High Maintenance', 'Young');

-- Circle Beard tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 8, id FROM tags WHERE name IN ('Modern', 'Professional', 'Medium Maintenance', 'Timeless');

-- Ducktail tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 9, id FROM tags WHERE name IN ('Rugged', 'Casual', 'Medium Maintenance', 'Mature');

-- Garibaldi tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 10, id FROM tags WHERE name IN ('Rugged', 'Outdoor', 'Low Maintenance', 'Mature');

-- Mutton Chops tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 11, id FROM tags WHERE name IN ('Artistic', 'Creative', 'High Maintenance', 'Classic');

-- Anchor Beard tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 12, id FROM tags WHERE name IN ('Artistic', 'Modern', 'High Maintenance', 'Young');

-- Chin Strap tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 13, id FROM tags WHERE name IN ('Modern', 'Casual', 'High Maintenance', 'Young');

-- Beardstache tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 14, id FROM tags WHERE name IN ('Trendy', 'Hipster', 'Medium Maintenance', 'Young');

-- Corporate Beard tags
INSERT INTO beard_style_tags (beard_style_id, tag_id)
SELECT 15, id FROM tags WHERE name IN ('Corporate', 'Professional', 'Medium Maintenance', 'Timeless');

-- ============================================
-- DEMO USERS (for testing)
-- ============================================

-- Password: demo123 (bcrypt hash)
INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES
('amel@syngasbh.com', '$2b$10$rZ7YvXOGqX1rHJqHJ7WqBOw8TGz.p5K5S5PXJ1KJX1zKJ5K5K5K5K', 'Amel', 'Demo', '+387 61 234 567'),
('demo@example.com', '$2b$10$rZ7YvXOGqX1rHJqHJ7WqBOw8TGz.p5K5S5PXJ1KJX1zKJ5K5K5K5K', 'Demo', 'User', '+387 62 123 456');

-- Demo Salon Account
INSERT INTO salon_accounts (salon_name, email, password_hash, phone, city, country, subscription_tier) VALUES
('Frizerski Salon Premium', 'salon@example.com', '$2b$10$rZ7YvXOGqX1rHJqHJ7WqBOw8TGz.p5K5S5PXJ1KJX1zKJ5K5K5K5K', '+387 33 123 456', 'Sarajevo', 'Bosnia and Herzegovina', 'premium');
