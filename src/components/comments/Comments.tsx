import React, { useEffect, useState } from 'react'
import './css/Comments.css'
import axios from 'axios';

export interface CommentsPropType {
  articleId: number,
  comments: object[]
}

const Comments = ({ comments, articleId }: CommentsPropType) => {

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    localStorage.getItem("admin") ? setIsAdmin(true) : setIsAdmin(false);
  }, [])

  const send = (e: any) => {
    const error = document.getElementById("error3")
    const text = e.target.parentElement[0].value.trim();
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = `${day}.${month}.${year}`
    const userName = localStorage.getItem("username")
    const userId = localStorage.getItem("userid")

    if (localStorage.getItem("token")) {
      if (text && text.length > 5) {
        error?.classList.remove('active');

        axios.get(`http://localhost:3030/users/${userId}`)
          .then(res => {
            const img = res.data.userImg;
            localStorage.setItem("userImg", img);
          })
          .then(() => {
            const userImg = localStorage.getItem("userImg")
            const newCommentId = comments.length ? (comments[comments?.length - 1] as any)?.id + 1 : 1;
            const newComment = {
              id: newCommentId,
              date: date,
              text: text,
              userName: userName,
              userId: userId,
              userImg: userImg
            }
            comments.push(newComment)

            axios.patch(`http://localhost:3333/articles/${articleId}`, {
              comments: comments
            }, { headers: { "Content-Type": "application/json" } })
              .then(() => document.location.reload())
              .catch(e => alert(e.message))
          })
          .catch(e => alert(e))
      } else {
        error?.classList.add('active')
        error ? error.textContent = 'Длина комментария должна быть больше пяти символов.' : <></>
      }
    } else {
      error?.classList.add('active')
      error ? error.textContent = 'Оставлять комментарии могут только авторизованные пользователи.' : <></>
    }
  }

  const deleteComment = (comment: any) => {
    const newCommentList = comments.filter((com: any) => com.id !== comment.id);

    axios.patch(`http://localhost:3333/articles/${articleId}`, {
      comments: newCommentList
    }, { headers: { "Content-Type": "application/json" } })
      .then(res => {
        document.location.reload()
      })
      .catch(e => alert(e))
  }


  return (
    <div className='comments_container'>
      <div className='comments-title'>Комментарии <span>{comments.length}</span></div>
      <form className='comment-form'>
        <div className='comment-avatar'></div>
        <textarea className='comment-form_text' placeholder='Комментировать'></textarea>
        <div className='comment-send' onClick={send}></div>
      </form>
      <span className="error" id='error3'>Длина комментария должна быть больше пяти символов.</span>
      <div className='comments'>
        {
          comments.slice().reverse().map((comment: any, index) => {
            return <div key={index} className='comment-card'>
              <div className="comment-top-side">
                {
                  comment.userImg ?
                    <img src={comment.userImg} alt="main" className='comment-img' />
                    :
                    <div className="comment-ava">{comment.userName[0].toUpperCase()}</div>
                }
                <div className='comment_username'>{comment.userName}</div>
                <div className="comment-date">{comment.date}</div>
                {isAdmin ? <div className="delete" onClick={() => deleteComment(comment)}></div> : <></>}
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default Comments