const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ===========================
// 1) Получение всех новостей
// ===========================
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT news.*, users.username AS author_name FROM news JOIN users ON news.author_id = users.id ORDER BY news.created_at DESC');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера при получении новостей' });
  }
});

// ======================
// 2) Добавление новости
// ======================
app.post('/api/news', async (req, res) => {
  const { title, image_url, description, author_id } = req.body;

  if (!title || !description || !author_id) {
    return res.status(400).json({ message: 'Все поля (title, description, author_id) обязательны' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO news (title, image_url, description, author_id) VALUES (?, ?, ?, ?)',
      [title, image_url || '', description, author_id]
    );
    return res.json({ message: 'Новость успешно добавлена', newsId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера при добавлении новости' });
  }
});

// ============================
// 3) Регистрация пользователя
// ============================
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Минимальная проверка
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    // Проверка, не занят ли логин
    const [rows] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует' });
    }

    // Добавляем
    await db.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email]
    );
    return res.json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// ============================
// 4) Авторизация пользователя
// ============================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Необходимо указать логин и пароль' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    // Возвращаем данные о пользователе
    const user = rows[0];
    return res.json({ 
      message: 'Авторизация успешна', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  }
});

// ===================
// 5) Личный кабинет
// ===================
app.get('/api/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Данные о пользователе
    const [users] = await db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    const user = users[0];

    // Список новостей пользователя
    const [news] = await db.query(
      'SELECT * FROM news WHERE author_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return res.json({ user, news });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Запуск сервера
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});