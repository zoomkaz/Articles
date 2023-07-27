import React, { useEffect, useState } from 'react'
import './css/Header.css'
import { NavLink, Link } from 'react-router-dom'

const Header = () => {
  const [auth, setAuth] = useState(false)
  const [username, setUserName] = useState('')

  useEffect(() => {
    localStorage.getItem("token") ? setAuth(true) : setAuth(false)
    if (localStorage.getItem("username")) {
      const name = localStorage.getItem("username")
      setUserName(name ? name : '')
    }
  }, [])

  const disconnect = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("userid")
    localStorage.removeItem("admin")
    localStorage.removeItem("userImg")
    setAuth(false)
    document.location.href = '/'
  }

  return (
    <div className='header'>
      <Link to={'/'}><div className='logo'>Классный Логотип</div></Link>
      <div className='right_container'>
        {auth ? <NavLink to={'/new_article'} state={username}><div className='add'></div></NavLink> : <></>}
        {auth ? <button className='login' onClick={disconnect}>Выйти</button> : <Link to={'/login'}><button className='login'>Войти</button></Link>}
      </div>
    </div>
  )
}

export default Header