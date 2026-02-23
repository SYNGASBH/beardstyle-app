-- Kreiranje tabela
\i /docker-entrypoint-initdb.d/migrations/001_initial_schema.sql

-- Popunjavanje podataka
\i /docker-entrypoint-initdb.d/seeds/001_beard_styles_seed.sql
