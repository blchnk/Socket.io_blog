import React, { useState } from 'react';
import useToggle from '../../hooks/useToggle';
import style from '../Post/Post.module.css';

export default function Post({ post, handleUpdatePost, handleDeletePost }) {
    const [postEdit, togglePostEdit] = useToggle(false);

    const [titleInput, setTitleInput] = useState(post.title);
    const [bodyInput, setBodyInput] = useState(post.body);

    return (
        <>
            <div className={style.postBody}>
                {
                    !postEdit ?
                        <h3 className={style.title}>{post.title}</h3>
                        :
                        <input
                            className={style.inputTitle}
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                        />
                }
                {
                    !postEdit
                        ?
                        <p className={style.body}>{post.body}</p>
                        :
                        <textarea
                            rows={5}
                            value={bodyInput}
                            onChange={(e) => setBodyInput(e.target.value)}
                        />
                }
                <div className={style.btnsWrapper}>
                    <button
                        className={style.btn}
                        onClick={() => {
                            handleUpdatePost(post.id, { title: titleInput, body: bodyInput });
                            togglePostEdit(false);
                        }}>
                        {!postEdit ? 'Обновить' : 'Сохранить'}
                    </button>
                    <button
                        className={style.btn}
                        onClick={() => handleDeletePost(post.id)}>Удалить</button>
                </div>
            </div>
        </>
    )
}
