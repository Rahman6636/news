import React, { useState } from 'react';

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      // Регистрация
      fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Пользователь успешно зарегистрирован') {
            alert('Регистрация прошла успешно. Теперь можно авторизоваться.');
            setIsRegister(false);
          } else {
            alert(data.message);
          }
        })
        .catch(err => console.error(err));
    } else {
      // Авторизация
      fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            onLogin(data.user);
            window.location = '/';
          } else {
            alert(data.message || 'Ошибка при авторизации');
          }
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя:</label><br />
          <input 
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        {isRegister && (
          <div>
            <label>Email:</label><br />
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
        )}
        <div>
          <label>Пароль:</label><br />
          <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'У меня уже есть аккаунт' : 'Перейти к регистрации'}
      </button>
    </div>
  );
}

export default Auth;