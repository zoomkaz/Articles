import React, { useEffect, useState } from 'react'
import './css/FullArticlesPage.css'
import { useLocation } from 'react-use'
import axios from 'axios'
import Comments from '../comments/Comments'
import { Link } from 'react-router-dom'

export interface ArticlePropType {
  id: number,
  mainImg: string,
  views: number,
  title: string,
  text: string,
  userId: string,
  comments: []
}

const FullArticlesPage = () => {
  const [userName, setUserName] = useState('')
  const [article, setArticle] = useState<ArticlePropType>({
    id: 0,
    mainImg: '',
    views: 0,
    text: '',
    title: '',
    userId: '',
    comments: []
  })

  const state = useLocation()
  const artId = state.state.usr

  useEffect(() => {
    axios.get(`http://localhost:3333/articles/${artId}`)
      .then(res => {
        const art = res.data;
        setArticle(art)
        axios.get(`http://localhost:3030/users/${res.data.userId}`)
          .then(res => {
            const name = res.data.name;
            setUserName(name)
          })
      })
  }, [artId])

  const ending = (number: number, txt: string[], cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];


  return (
    <div className='full-article_container'>
      <Link to={'/'}><div className='back back-full'></div></Link>
      <div className='full-author'>{userName}</div>
      <div className='full-title'>{article?.title}</div>
      <div className='full-views'>{article?.views} {ending(article?.views ?? 0, ['просмотр', 'просмотра', 'просмотров'])}</div>
      <img src={article?.mainImg} alt="main img" />
      <div className='full-text'>{article?.text}</div>
      <Comments comments={article.comments} articleId={article.id} />
    </div>
  )
}

export default FullArticlesPage