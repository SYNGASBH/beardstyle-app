-- Migration: AI Face Analysis Table
-- Version: 1.1.0
-- Description: Adds table for storing Claude AI face analysis results

-- ============================================
-- AI FACE ANALYSIS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_face_analysis (
    id SERIAL PRIMARY KEY,
    upload_id INT REFERENCES user_uploads(id) ON DELETE CASCADE,

    -- Face Shape Analysis
    face_shape VARCHAR(50) NOT NULL, -- oval, round, square, rectangle, heart, diamond, triangle
    face_shape_confidence DECIMAL(5,2), -- Confidence score 0-100

    -- Facial Characteristics (stored as JSONB)
    facial_characteristics JSONB, -- foreheadWidth, jawlineStructure, chinShape, etc.

    -- AI Recommendations
    recommended_styles JSONB, -- Array of style recommendations with scores

    -- Styling Advice
    styling_advice JSONB, -- emphasize, minimize, lengthGuidance

    -- Maintenance Guide
    maintenance_guide JSONB, -- trimmingFrequency, recommendedProducts, etc.

    -- Additional Info
    additional_notes TEXT,
    raw_analysis JSONB, -- Store full raw AI response for reference

    -- Metadata
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50) DEFAULT 'claude-3-5-sonnet-20241022',

    -- Constraints
    UNIQUE(upload_id) -- One analysis per upload
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_ai_analysis_upload ON ai_face_analysis(upload_id);
CREATE INDEX idx_ai_analysis_face_shape ON ai_face_analysis(face_shape);
CREATE INDEX idx_ai_analysis_confidence ON ai_face_analysis(face_shape_confidence);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE ai_face_analysis IS 'Stores Claude AI analysis results for face shape and beard style recommendations';
COMMENT ON COLUMN ai_face_analysis.facial_characteristics IS 'JSON object with detailed facial features: foreheadWidth, jawlineStructure, chinShape, etc.';
COMMENT ON COLUMN ai_face_analysis.recommended_styles IS 'JSON array of AI-recommended beard styles with match scores and reasoning';
COMMENT ON COLUMN ai_face_analysis.styling_advice IS 'JSON object with styling guidance: what to emphasize, minimize, length recommendations';
COMMENT ON COLUMN ai_face_analysis.maintenance_guide IS 'JSON object with maintenance tips: frequency, products, techniques';
COMMENT ON COLUMN ai_face_analysis.raw_analysis IS 'Full JSON response from Claude API for debugging and future enhancements';
