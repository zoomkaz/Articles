import React, { useEffect, useState } from 'react'
import './css/AddArticle.css'
import { useLocation } from 'react-use'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserDataType } from '../profile/Profile'

const AddArticle = () => {
  const [lastId, setLastId] = useState(0)
  const [userData, setUserData] = useState<UserDataType>({
    id: 0,
    name: '',
    email: '',
    password: '',
    admin: false,
    userImg: ''
  })

  const state = useLocation()
  const userName = state.state.usr

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    axios.get(`http://localhost:3030/users/${userId}`)
      .then(res => {
        const usr = res.data;
        setUserData(usr)
      })
      .catch(e => alert(e))
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:3333/articles`)
      .then(res => {
        const lastid = res.data[res.data.length - 1].id;
        setLastId(lastid)
      })
      .catch(e => alert(e))
  }, [])

  const setImg = () => {
    let image = document.getElementById("image");
    let file = (document.getElementById("file") as HTMLInputElement);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file.files ? file.files[0] : new Blob())
      reader.onload = () => {
        (image as HTMLImageElement).src = reader.result ? typeof reader.result === 'string' ? reader.result : '' : '';
        (image as HTMLImageElement).style.display = "block";
      }
    } catch (e) {
      console.log(e);
    }
  }

  const publish = () => {
    const form = document.getElementById('new_form')
    const mainImg = form?.children[0].children[2].attributes[0].value;
    const title = (form?.children[1] as HTMLInputElement).value;
    const text = (form?.children[2] as HTMLInputElement).value;
    const userId = localStorage.getItem("userid");

    const error = document.getElementById(`aside-error`) ?? document.createElement('div');

    if (mainImg?.trim() && title.trim() && text.trim()) {
      axios.post('http://localhost:3333/articles', {
        id: lastId + 1,
        userId: userId,
        title: title,
        mainImg: mainImg,
        text: text,
        views: 0,
        comments: []
      }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          document.location.href = '/'
        })
    } else {
      error.style.display = 'block';
      setTimeout(() => {
        error.style.display = 'none';
      }, 4000);
    }

  }

  return (
    <div>
      <header className='small_header'>
        <Link to={'/'}><div className='back'></div></Link>
        <div className='about_author'>
          {userData.userImg ? <img src={userData.userImg} alt="user pic" className='user_pic' /> : <div className="user-no-img">{userData.name[0]?.toUpperCase()}</div>}
          <div className='author_name'>{userName}</div>
        </div>
        <button className='publish' onClick={publish}>Опубликовать</button>
      </header>
      <div className='main'>
        <div className="aside-error" id='aside-error'>Поля не должны быть пустыми и изображение должно быть выбрано.</div>
        <form id='new_form' className='new_article_form'>
          <label className="input-file">
            <input type="file" id="file" name='file' onChange={setImg} />
            <span>Главное изображение</span>
            <img src="" id="image" alt='ooo' style={{ maxWidth: "600px", display: "none" }} />
          </label>
          <textarea placeholder='Заголовок' className='title_input' ></textarea>
          <textarea placeholder='Текст' className='text_input' ></textarea>
        </form>
      </div>
    </div>
  )
}

export default AddArticle