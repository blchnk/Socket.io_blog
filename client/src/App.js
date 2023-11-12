import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Post from './components/Post/Post';
import style from './App.module.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });

  const http = 'http://localhost';
  const port = '3000';

  const socket = io(`${http}:${port}`);

  useEffect(() => {
    socket.emit('getAllPosts'); // вызываем emmit всех постов

    // Получаем существующие посты при загрузке
    socket.on('allPosts', (posts) => {
      console.log('Получен список всех постов:', posts);
      setPosts(posts)
    });

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server', socket.id);
    });

    // Обработчик нового поста от сервера
    socket.on('newPost', (newPost) => {
      setPosts((prevPosts) => [...prevPosts, newPost]);
    });

    // Очищаем слушатели при размонтировании компонента
    return () => {
      socket.off('newPost');
      socket.off('updatePost');
      socket.off('deletePost');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [newPost]);

  socket.on('deletePost', (deletedPost) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPost.id));
  });

  socket.on('updatePost', (updatedPost) => {
    setPosts(updatedPost)
  });

  const handleCreatePost = () => {
    socket.emit('createPost', newPost);

    // Очищаем форму после создания поста
    setNewPost({ title: '', body: '' });
  };

  const handleUpdatePost = async (id, updatedData) => {
    console.log('handleUpdate');
    socket.emit('updatePost', { id, updatedData });
  };

  const handleDeletePost = async (postId) => {
    socket.emit('deletePost', postId);
  };

  return (
    <>
      <h1>Блог</h1>
      <div>
        <h2>Создать новый пост</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <input
            style={{ padding: '0.5rem', border: '1px solid' }}
            type="text"
            placeholder="Заголовок"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Содержание"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
        </div>
        <button style={{ padding: '1rem' }} onClick={handleCreatePost}>Создать пост</button>
      </div>
      <div className={style.postsBody}>
        <h2>Список постов</h2>
        <div className={style.postsList}>
          {posts.map((post) => (
            <Post
              post={post}
              key={post.id}
              handleUpdatePost={handleUpdatePost}
              handleDeletePost={handleDeletePost}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
