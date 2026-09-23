-- Kreiranje tabela
\i /docker-entrypoint-initdb.d/migrations/001_initial_schema.sql

-- Popunjavanje podataka
\i /docker-entrypoint-initdb.d/seeds/001_beard_styles_seed.sql

-- Migracije (nakon seeda: 003, 004 i 006 mijenjaju seed podatke)
\i /docker-entrypoint-initdb.d/migrations/002_ai_analysis_table.sql
\i /docker-entrypoint-initdb.d/migrations/003_update_sketch_images.sql
\i /docker-entrypoint-initdb.d/migrations/004_add_handlebar_style.sql
\i /docker-entrypoint-initdb.d/migrations/005_beard_analyses.sql
\i /docker-entrypoint-initdb.d/migrations/006_fix_image_urls.sql
\i /docker-entrypoint-initdb.d/migrations/007_user_lesson_progress.sql
\i /docker-entrypoint-initdb.d/migrations/008_user_subscription.sql