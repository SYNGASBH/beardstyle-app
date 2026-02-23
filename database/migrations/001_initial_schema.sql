-- Database Schema for Beard Style Advisor
-- Version: 1.0.0
-- Created: 2024

-- ============================================
-- DROP TABLES (if exist for clean setup)
-- ============================================

DROP TABLE IF EXISTS session_styles CASCADE;
DROP TABLE IF EXISTS salon_sessions CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS user_questionnaires CASCADE;
DROP TABLE IF EXISTS user_uploads CASCADE;
DROP TABLE IF EXISTS beard_style_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS beard_styles CASCADE;
DROP TABLE IF EXISTS face_types CASCADE;
DROP TABLE IF EXISTS salon_customers CASCADE;
DROP TABLE IF EXISTS salon_accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- SALON ACCOUNTS TABLE
-- ============================================

CREATE TABLE salon_accounts (
    id SERIAL PRIMARY KEY,
    salon_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    license_number VARCHAR(100),
    subscription_tier VARCHAR(50) DEFAULT 'basic', -- basic, premium, enterprise
    subscription_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_salon_email ON salon_accounts(email);

-- ============================================
-- FACE TYPES TABLE
-- ============================================

CREATE TABLE face_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- oval, round, square, rectangle, heart, diamond, triangle
    description TEXT,
    characteristics JSONB, -- Store detailed characteristics as JSON
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BEARD STYLES TABLE
-- ============================================

CREATE TABLE beard_styles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    maintenance_level VARCHAR(20), -- low, medium, high
    style_category VARCHAR(50), -- corporate, casual, artistic, rugged, etc.
    growth_time_weeks INT, -- Estimated time to grow
    recommended_face_types INT[], -- Array of face_type IDs
    image_url VARCHAR(500),
    overlay_svg TEXT, -- SVG path for overlay on user image
    popularity_score INT DEFAULT 0,
    instructions TEXT, -- How to maintain/trim
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_beard_styles_slug ON beard_styles(slug);
CREATE INDEX idx_beard_styles_category ON beard_styles(style_category);

-- ============================================
-- TAGS TABLE (for filtering)
-- ============================================

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50), -- lifestyle, professional, casual, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BEARD STYLE TAGS (Many-to-Many)
-- ============================================

CREATE TABLE beard_style_tags (
    beard_style_id INT REFERENCES beard_styles(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (beard_style_id, tag_id)
);

-- ============================================
-- USER UPLOADS TABLE
-- ============================================

CREATE TABLE user_uploads (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INT, -- in bytes
    detected_face_type INT REFERENCES face_types(id),
    ai_confidence DECIMAL(5,2), -- Confidence score if using AI detection
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_uploads_user ON user_uploads(user_id);

-- ============================================
-- USER QUESTIONNAIRES TABLE
-- ============================================

CREATE TABLE user_questionnaires (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    upload_id INT REFERENCES user_uploads(id),
    face_shape VARCHAR(50), -- User's selection or AI detected
    lifestyle VARCHAR(50), -- corporate, casual, creative, outdoor
    maintenance_preference VARCHAR(20), -- low, medium, high
    age_range VARCHAR(20), -- 18-25, 26-35, 36-50, 50+
    current_style VARCHAR(100), -- What they currently have
    style_goals TEXT, -- Free text about what they want
    additional_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questionnaire_user ON user_questionnaires(user_id);

-- ============================================
-- USER FAVORITES TABLE
-- ============================================

CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    beard_style_id INT REFERENCES beard_styles(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, beard_style_id)
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);

-- ============================================
-- SALON CUSTOMERS TABLE
-- ============================================

CREATE TABLE salon_customers (
    id SERIAL PRIMARY KEY,
    salon_id INT REFERENCES salon_accounts(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL, -- Optional link to user account
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    notes TEXT,
    last_visit TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_salon_customers ON salon_customers(salon_id);

-- ============================================
-- SALON SESSIONS TABLE (Collaborative)
-- ============================================

CREATE TABLE salon_sessions (
    id SERIAL PRIMARY KEY,
    salon_id INT REFERENCES salon_accounts(id) ON DELETE CASCADE,
    customer_id INT REFERENCES salon_customers(id) ON DELETE CASCADE,
    session_code VARCHAR(20) UNIQUE NOT NULL, -- 6-digit code for customer to join
    upload_id INT REFERENCES user_uploads(id),
    questionnaire_id INT REFERENCES user_questionnaires(id),
    current_style_id INT REFERENCES beard_styles(id), -- Currently selected style
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    stylist_notes TEXT,
    customer_feedback TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_salon_sessions_code ON salon_sessions(session_code);
CREATE INDEX idx_salon_sessions_salon ON salon_sessions(salon_id);

-- ============================================
-- SESSION STYLES TABLE (History of changes)
-- ============================================

CREATE TABLE session_styles (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES salon_sessions(id) ON DELETE CASCADE,
    beard_style_id INT REFERENCES beard_styles(id) ON DELETE CASCADE,
    changed_by VARCHAR(20), -- 'salon' or 'customer'
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_styles ON session_styles(session_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salon_accounts_updated_at BEFORE UPDATE ON salon_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beard_styles_updated_at BEFORE UPDATE ON beard_styles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'End users of the application (B2C customers)';
COMMENT ON TABLE salon_accounts IS 'Salon/barber shop accounts (B2B customers)';
COMMENT ON TABLE beard_styles IS 'Catalog of beard styles with recommendations';
COMMENT ON TABLE salon_sessions IS 'Collaborative styling sessions between salon and customer';
COMMENT ON TABLE session_styles IS 'Audit trail of style changes during salon session';
