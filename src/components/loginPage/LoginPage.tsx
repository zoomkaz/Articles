import React, { useEffect, useState } from 'react'
import './css/LoginPage.css'
import axios from 'axios';

const LoginPage = () => {

  const [lastId, setLastId] = useState(0)

  useEffect(() => {
    axios.get(`http://localhost:3030/users`)
      .then(res => {
        const lastid = res.data[res.data.length - 1].id;
        setLastId(lastid)
      })
      .catch(e => alert(e))
  }, [])

  const signUpBtn = () => {
    const container = document.getElementById('container');
    container?.classList.add("right-panel-active");
  }
  const signInBtn = () => {
    const container = document.getElementById('container');
    container?.classList.remove("right-panel-active");
  }

  const validateEmail = (email: string) => {
    return email.match(/^[\w]{1}[\w.]*@[\w-]+\.[a-z]{2,4}$/i) ? true : false;
  }

  const signUp = (e: any) => {
    e.preventDefault()
    const error = document.getElementById('error1');
    const name = e.target.form[0].value.trim()
    const email = e.target.form[1].value.trim()
    const password = e.target.form[2].value.trim()
    const id = lastId + 1;
    if (name && email && password && password.length > 5 && name.length > 3 && validateEmail(email)) {
      error?.classList.remove('active');
      axios.post('http://localhost:3030/register', { id: id, name: name, email: email, password: password, admin: false, userImg: '' })
        .then(res => {
          localStorage.setItem("token", res.data.accessToken)
          localStorage.setItem("username", res.data.user.name)
          localStorage.setItem("userid", res.data.user.id)
          document.location.href = '/'
        })
        .catch(e => {
          if (e.response.data === 'Email format is invalid') {
            error ? error.textContent = 'Неверный email. Попробуйте ещё раз.' : <></>
            error?.classList.add('active')
          } else {
            error?.classList.remove('active')
            error ? error.textContent = `Проверьте правильность введённых данных. Длина пароля должна быть больше пяти символов. Длина имени больше трёх символов.` : <></>
            alert(e.response.data)
          }
        })
    } else {
      error ? error.textContent = `Проверьте правильность введённых данных. Длина пароля должна быть больше пяти символов. Длина имени больше трёх символов.` : <></>
      error?.classList.add('active');
    }
  }

  const signIn = (e: any) => {
    e.preventDefault()
    const error = document.getElementById('error2');
    const email = e.target.form[0].value.trim()
    const password = e.target.form[1].value.trim()
    if (email && password && password.length > 5) {
      error?.classList.remove('active');
      axios.post('http://localhost:3030/login', { email: email, password: password })
        .then(res => {
          localStorage.setItem("token", res.data.accessToken)
          localStorage.setItem("username", res.data.user.name)
          localStorage.setItem("userid", res.data.user.id)

          res.data.user?.admin ? localStorage.setItem("admin", 'true') : <></>

          document.location.href = '/'
        })
        .catch(e => {
          if (e.response.data === 'Cannot find user') {
            error ? error.textContent = 'Пользователь не найден. Зарегистрируйтесь.' : <></>
            error?.classList.add('active')
          } else if (e.response.data === 'Incorrect password') {
            error ? error.textContent = 'Неверный пароль. Попробуйте ещё раз.' : <></>
            error?.classList.add('active')
          } else if (e.response.data === 'Email format is invalid') {
            error ? error.textContent = 'Неверный email. Попробуйте ещё раз.' : <></>
            error?.classList.add('active')
          } else {
            error?.classList.remove('active')
            error ? error.textContent = 'Проверьте правильность введённых данных.' : <></>
            alert(e.response.data)
          }
        })
    } else {
      error ? error.textContent = 'Проверьте правильность введённых данных.' : <></>
      error?.classList.add('active');
    }
  }

  return (
    <div className="container" id="container">
      <div className="form-container sign-up-container">
        <form action="#">
          <h1>Создать аккаунт</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button onClick={signUp}>Зарегистрироваться</button>
          <span className='error' id='error1'>
            Проверьте правильность введённых данных.<br />
            Длина пароля должна быть больше пяти символов.<br />
            Длина имени больше трёх символов.
          </span>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form action="#">
          <h1>Войти</h1>
          <input type="email" placeholder="Email (admin@example.com)" />
          <input type="password" placeholder="Password (admin123)" />
          <button onClick={signIn}>Войти</button>
          <span className='error' id='error2'>
            Проверьте правильность введённых данных.
          </span>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>С возвращением!</h1>
            <p>Чтобы поддерживать с нами связь, пожалуйста, войдите в систему, указав свои личные данные</p>
            <button className="ghost" id="signIn" onClick={signInBtn}>Войти</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Привет, Друг!</h1>
            <p>Введите свои личные данные и начните путешествие вместе с нами</p>
            <button className="ghost" id="signUp" onClick={signUpBtn}>Зарегистрироваться</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage