import React, { useEffect, useState } from 'react';

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
  const [userNews, setUserNews] = useState([]);

  useEffect(() => {
    // Получаем данные пользователя и его новости
    fetch(`http://localhost:3001/api/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData(data.user);
          setUserNews(data.news);
        }
      })
      .catch(err => console.error(err));
  }, [user]);

  if (!userData) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Личный кабинет</h2>
      <p><strong>Имя пользователя:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Дата регистрации:</strong> {new Date(userData.created_at).toLocaleString()}</p>

      <h3>Мои новости</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '5px' }}>ID</th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>Заголовок</th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>Дата</th>
          </tr>
        </thead>
        <tbody>
          {userNews.map(n => (
            <tr key={n.id}>
              <td style={{ border: '1px solid #000', padding: '5px' }}>{n.id}</td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                <a href={`/#news-${n.id}`} >
                  {n.title}
                </a>
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {new Date(n.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Profile;