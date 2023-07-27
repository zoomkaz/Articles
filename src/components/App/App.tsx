import React from 'react';
import './css/App.css';
import Header from '../header/Header';
import Main from '../main/Main';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../loginPage/LoginPage';
import FullArticlesPage from '../fullArticlesPage/FullArticlesPage';
import AddArticle from '../addArticle/AddArticle';
import Profile from '../profile/Profile';
import Admin from '../admin/Admin';

const App = () => {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={(<><Header /> <Main /></>)} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/new_article' element={<AddArticle />} />
        <Route path='/articles/:id' element={(<><Header /><FullArticlesPage /></>)} />
        <Route path='/users/:id' element={(<><Header /><Profile /></>)} />
        <Route path='/admin' element={(<><Header /><Admin /></>)} />
      </Routes>
    </div>
  );
}

export default App;
