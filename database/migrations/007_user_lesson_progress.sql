-- Migration: User Lesson Progress
-- Version: 1.3.1
-- Description: Tracks completed lessons per user for Grooming Academy

CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id     VARCHAR(100) NOT NULL,
    lesson_id     VARCHAR(100) NOT NULL,
    completed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_progress_course ON user_lesson_progress(course_id);

COMMENT ON TABLE user_lesson_progress IS 'Tracks which academy lessons each user has completed';
