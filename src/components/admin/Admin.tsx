import React from 'react'
import './css/Admin.css'
import ArticlesList from './articlesList/ArticlesList'
import UsersList from './usersList/UsersList'
import { Link } from 'react-router-dom'

const Admin = () => {

  return (
    <div className='admin_container'>
      <Link to={'/'}><div className='back back-admin'></div></Link>
      <ArticlesList />
      <UsersList />
    </div>
  )
}

export default Admin