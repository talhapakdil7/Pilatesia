-- Pilatesia PostgreSQL schema (multi-studio)
-- This file is kept for reference; Docker Compose now uses PostgreSQL.

DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS warmup_moves CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS studios CASCADE;

CREATE TABLE studios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    studio_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (email, studio_id),
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    studio_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_name VARCHAR(255),
    start_time TIMESTAMP,
    duration INT,
    capacity INT,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    remaining_cred INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE warmup_moves (
    id SERIAL PRIMARY KEY,
    studio_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_studio ON users(studio_id);
CREATE INDEX idx_lessons_studio ON lessons(studio_id);
CREATE INDEX idx_lessons_start ON lessons(start_time);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_lesson ON reservations(lesson_id);
CREATE INDEX idx_warmup_moves_studio ON warmup_moves(studio_id);
