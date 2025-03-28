import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav>
      <Link to="/">Главная</Link> |{' '}
      {!user && <Link to="/auth">Войти / Регистрация</Link>}
      {user && (
        <>
          <Link to="/profile">Личный кабинет</Link> |{' '}
          <button onClick={onLogout}>Выход</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;