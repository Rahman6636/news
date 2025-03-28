import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewsFeed from './components/NewsFeed';
import Profile from './components/Profile';
import Auth from './components/Auth';

function App() {
  // "user" будет объектом или null, если не авторизован
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Попробуем взять из localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/" element={<NewsFeed user={user} />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            {user && <Route path="/profile" element={<Profile user={user} />} />}
            <Route path="*" element={<h2>Страница не найдена</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;