-- Migration: Beard Analyses (user saved results)
-- Version: 1.2.0
-- Description: Stores the user's final selection from ResultsScreen onSave

CREATE TABLE IF NOT EXISTS beard_analyses (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    face_shape    VARCHAR(50) NOT NULL,            -- resolved key: oval, round, square, heart, diamond, oblong, triangle
    recommended_style_id VARCHAR(100) NOT NULL,     -- beardStyles.js id e.g. 'puna-brada', 'ducktail'
    confidence_score     DECIMAL(5,4),              -- 0.0000 – 1.0000 (normalized)
    image_url            TEXT,                       -- URL of the uploaded/analyzed image
    raw_result           JSONB,                      -- full mergeRecommendations() output for replay
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_beard_analyses_user    ON beard_analyses(user_id);
CREATE INDEX idx_beard_analyses_shape   ON beard_analyses(face_shape);
CREATE INDEX idx_beard_analyses_created ON beard_analyses(created_at DESC);

COMMENT ON TABLE beard_analyses IS 'User-saved analysis results from ResultsScreen (onSave)';
COMMENT ON COLUMN beard_analyses.recommended_style_id IS 'The beard style ID the user selected/confirmed';
COMMENT ON COLUMN beard_analyses.raw_result IS 'Full JSON snapshot of mergeRecommendations() output for future reference';
