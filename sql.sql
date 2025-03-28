-- Создание базы (если не существует) и выбор её:
CREATE DATABASE IF NOT EXISTS news_db;
USE news_db;

-- Создаём таблицу пользователей:
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём таблицу новостей:
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),
  description TEXT NOT NULL,
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Наполним тестовыми данными
INSERT INTO users (username, password, email) VALUES
  ('user', '123', 'test@example.com'),
  ('admin', 'admin', 'admin@example.com');

INSERT INTO news (title, image_url, description, author_id)
VALUES
  ('Первая новость', 'https://i.imgur.com/pBr6V54.jpeg', 'Описание первой новости', 1),
  ('Вторая новость', 'https://i.imgur.com/XUuOLQk.jpeg', 'Описание второй новости', 2);