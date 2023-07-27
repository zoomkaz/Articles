import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import ArticleCard from '../articleCard/ArticleCard';
import './css/Main.css'
import { useClickAway } from "react-use";
import { NavLink } from 'react-router-dom';

export interface ArticlesType {
  id: number,
  title: string,
  mainImg: string,
  text: string,
  views: number,
  userId: string,
  comments: object[]
}

const Main = () => {
  const [articles, setArticles] = useState<ArticlesType[]>()
  const [articlesCopy, setArticlesCopy] = useState<ArticlesType[]>()
  const [showReset, setShowReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState<string[]>([])
  const [currentTitles, setCurrentTitles] = useState<string[]>([])
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:3333/articles')
      .then(data => {
        const artics = data.data;
        setArticles(artics)
        setArticlesCopy(artics)
      })
      .then(() => setLoading(false))

    const userid = localStorage.getItem("userid")
    userid ? setUserId(userid) : <></>

  }, [])

  useEffect(() => {
    axios.get(`http://localhost:3030/users/${userId}`)
      .then(res => {
        res.data?.admin ? setIsAdmin(res.data.admin) : <></>
      })
      .catch(e => alert(e))
  }, [userId])

  useEffect(() => {
    const temp: string[] = []
    articles?.map(elem => temp.push(elem.title))
    setTitles(temp)
  }, [articles])

  const showPopular = () => {
    const temp = articles?.filter(elem => elem.views > 100)
    setArticles(temp)
    setShowReset(true)
  }

  const reset = () => {
    setArticles(articlesCopy);
    setShowReset(false);
    (document.getElementById('input') as HTMLInputElement).value = '';
  }

  const search = (e: any) => {
    const pattern = new RegExp(`${e.target.value}`, 'i')
    const temp = titles.filter(elem => elem.match(pattern))
    e.target.value ? setCurrentTitles(temp) : setCurrentTitles([])
  }

  const setInputValue = (e: any) => {
    (document.getElementById('input') as HTMLInputElement).value = e.target.textContent;
    const temp = articles?.filter(elem => elem.title === e.target.textContent)
    setArticles(temp)
    setShowReset(true)
    setCurrentTitles([])
  }

  useClickAway(ref, () => {
    setIsActive(false);
  });

  const open = () => {
    setIsActive(!isActive);
  };

  const output = <div className='output' style={isActive ? { display: "block" } : { display: "none" }}>
    {currentTitles.map((elem, index) => <div key={index} onClick={setInputValue}>{elem}</div>)}
  </div>

  return (
    <>
      <button className='popular' onClick={showPopular}>Популярные статьи</button>
      {userId ? <NavLink to={`/users/${userId}`} state={userId}><button className='profile'>Профиль</button></NavLink> : <></>}
      {isAdmin ? <NavLink to={`/admin`}><button className='admin'>Админ панель</button></NavLink> : <></>}
      {showReset ? <button className='reset' onClick={reset}>Сбросить</button> : <></>}
      <div className='articles_container' ref={ref}>
        <input type="text" placeholder='Найти статью' id='input' onChange={search} onClick={open} />
        {currentTitles.length > 0 ? output : <></>}
        {loading ? <div className='loading'>Loading</div> : articles?.map(elem => <ArticleCard key={elem.id} {...elem} />)}
      </div>
    </>
  )
}

export default Main