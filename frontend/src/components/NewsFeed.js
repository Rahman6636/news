import React, { useEffect, useState } from 'react';

function NewsFeed({ user }) {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleAddNews = (e) => {
    e.preventDefault();
    // Минимальная проверка ввода
    if (!title.trim() || !description.trim()) {
      alert('Заполните заголовок и описание');
      return;
    }

    // Отправляем запрос на сервер
    fetch('http://localhost:3001/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        image_url: imageUrl,
        description,
        author_id: user.id, // автор – это текущий пользователь
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.newsId) {
          // Успешно добавлено – обновляем ленту
          const newNewsItem = {
            id: data.newsId,
            title,
            image_url: imageUrl,
            description,
            author_id: user.id,
            author_name: user.username,
            created_at: new Date().toISOString()
          };
          setNews([newNewsItem, ...news]);
          // Сброс формы
          setTitle('');
          setImageUrl('');
          setDescription('');
        } else {
          alert(data.message || 'Ошибка при добавлении новости');
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Лента новостей</h2>

      {user && (
        <div>
          <h3>Добавить новость</h3>
          <form onSubmit={handleAddNews}>
            <div>
              <label>Заголовок:</label><br />
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div>
              <label>Ссылка на картинку:</label><br />
              <input 
                type="text" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
              />
            </div>
            <div>
              <label>Описание:</label><br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit">Добавить</button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {news.map(item => (
          <div key={item.id} style={{ border: '1px solid #000', marginBottom: '10px', padding: '10px' }}>
            <h3>{item.title}</h3>
            {item.image_url && <img src={item.image_url} alt="news" style={{ maxWidth: '200px', display: 'block' }} />}
            <p>{item.description}</p>
            <small>Автор: {item.author_name} | Дата: {new Date(item.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsFeed;