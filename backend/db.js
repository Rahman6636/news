const mysql = require('mysql2');

// Создаём подключение:
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',  // ваш пароль
  database: 'news_db'
});

module.exports = pool.promise(); 
// будем использовать промисы (async/await)