import React, { useEffect, useState } from 'react'
import './css/ArticleCard.css'
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export interface ArticleCardPropsType {
  id: number,
  title: string,
  mainImg: string,
  text: string,
  views: number,
  userId: string,
  comments: object[]
}

const ArticleCard = ({
  id,
  title,
  mainImg,
  text,
  views,
  userId,
  comments
}: ArticleCardPropsType) => {

  const currentTitle = title.split(' ').length > 8 ? title.split(' ').slice(0, 8).join(' ') + '...' : title;
  const currentText = text.split(' ').length > 20 ? text.split(' ').slice(0, 20).join(' ') + '...' : text;
  const [userName, setUserName] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:3030/users/${userId}`)
      .then(res => {
        const name = res.data.name
        setUserName(name)
      })
  }, [userId])

  const setView = () => {
    const newViews = views + 1;
    axios.patch(`http://localhost:3333/articles/${id}`, {
      views: newViews
    }, { headers: { "Content-Type": "application/json" } })
      .catch(e => alert(e.message))
  }

  return (
    <NavLink to={`/articles/${id}`} state={id}>
      <div className='card' id={id?.toString()} onClick={setView}>
        <img src={mainImg} alt="Article Pic" />
        <div className='card_right-side'>
          <div className='author-name'>{userName}</div>
          <h3 className='title'>{currentTitle}</h3>
          <h5 className='text'>{currentText}</h5>
          <div className='social'>
            <div className='icons'>
              <div className='like'></div>
              <div className='dislike'></div>
              <div className='comment'>
                <span>{comments.length}</span>
              </div>

            </div>
            <div className='view_container'>
              <div className='quantity_views'>{views}</div>
              <div className='view'></div>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default ArticleCard