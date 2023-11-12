const { db } = require('../db');

const initializeSocketControllers = (io) => {
    io.on('connection', (socket) => {
        socket.on('connect', () => {
            console.log('Client connected');
        });

        // Получение списка всех постов
        socket.on('getAllPosts', async () => {
            try {
                const allPosts = await db('posts').select();
                socket.emit('allPosts', allPosts);
            } catch (error) {
                console.error('Ошибка при получении списка постов:', error);
            }
        });

        // Создание нового поста
        socket.on('createPost', async (newPost) => {
            try {
                const [postId] = await db('posts').insert(newPost);

                // Получаем созданный пост из базы данных
                const createdPost = await db('posts').where({ id: postId }).first();

                // Отправляем новый пост всем подключенным клиентам
                socket.emit('newPost', createdPost);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        });

        // Обновление поста
        socket.on('updatePost', async (updatedPost) => {
            try {
                const { id, updatedData } = updatedPost;

                await db('posts').where({ id: id }).update({ title: updatedData.title, body: updatedData.body });

                const updatedPosts = await db('posts');
                socket.emit('updatePost', updatedPosts);
            } catch (error) {
                console.error('Error updating post:', error);
            }
        });

        // Удаление поста
        socket.on('deletePost', async (postId) => {
            try {
                await db('posts').where({ id: postId }).del();
                socket.emit('deletePost', { id: postId });
            } catch (error) {
                console.error('Error deleting post: ', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { initializeSocketControllers };

