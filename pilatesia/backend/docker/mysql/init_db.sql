-- Pilatesia MySQL schema (multi-studio)
-- Bu dosya MySQL container ilk başlatılışında tabloları oluşturmak için kullanılır.

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS warmup_moves;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS studios;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE studios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studio_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_email_studio (email, studio_id),
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studio_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_name VARCHAR(255),
    start_time DATETIME,
    duration INT,
    capacity INT,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    remaining_cred INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE warmup_moves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studio_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_users_studio ON users(studio_id);
CREATE INDEX idx_lessons_studio ON lessons(studio_id);
CREATE INDEX idx_lessons_start ON lessons(start_time);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_lesson ON reservations(lesson_id);
CREATE INDEX idx_warmup_moves_studio ON warmup_moves(studio_id);

