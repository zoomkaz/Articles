import React, { useEffect, useState } from 'react'
import './css/Profile.css'
import { useLocation } from 'react-use'
import axios from 'axios'
import { Link } from 'react-router-dom'

export interface UserDataType {
  id: number,
  name: string,
  email: string,
  password: string,
  admin: boolean,
  userImg: string
}

const Profile = () => {
  const [userData, setUserData] = useState<UserDataType>({
    id: 0,
    name: '',
    email: '',
    password: '',
    admin: false,
    userImg: ''
  })
  const [nameEditActive, setNameEditActive] = useState(false)
  const [emailEditActive, setEmailEditActive] = useState(false)
  const [showBtn, setShowBtn] = useState(false)

  const state = useLocation()
  const userId = state.state.usr


  useEffect(() => {
    axios.get(`http://localhost:3030/users/${userId}`)
      .then(res => {
        setUserData(res.data)
      })
      .catch(e => alert(e))
  }, [userId])

  const showNameEdit = () => {
    const nameEdit = document.getElementById('name-edit');
    const nameEditClick = document.getElementById('name-edit_click') ?? document.createElement('div');
    const eStyle = nameEditClick.style;

    if (nameEdit) {
      if (nameEditActive) {
        nameEdit.style.display = 'none';
        eStyle.backgroundColor = 'inherit';
        eStyle.borderBottomLeftRadius = '12px';
        eStyle.borderBottomRightRadius = '12px';
        setNameEditActive(false);
      } else {
        nameEdit.style.display = 'flex';
        eStyle.backgroundColor = 'rgba(0, 0, 0, 0.06)';
        eStyle.borderBottomLeftRadius = '0px';
        eStyle.borderBottomRightRadius = '0px';
        setNameEditActive(true);
      }
    }
  }

  const saveName = (e: any) => {
    const newName = e.target.parentElement.children[0].children[0].value.trim();
    const border = document.getElementById('border');
    if (newName && newName.length > 3) {
      axios.patch(`http://localhost:3030/users/${userId}`, {
        name: newName
      }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          if (res.status === 200 && border) {
            border.style.boxShadow = '0 0 10px 5px lightgreen';
            setTimeout(() => {
              border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
              setTimeout(() => {
                document.location.reload();
              }, 500);
            }, 2000);
          } else if (border) {
            border.style.boxShadow = '0 0 10px 5px red';
            setTimeout(() => {
              border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
            }, 2000);
          }
        })
        .catch(e => alert(e))
    } else if (border) {
      border.style.boxShadow = '0 0 10px 5px red';
      setTimeout(() => {
        border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
      }, 2000);
    }
  }

  const showEmailEdit = () => {
    const emailEdit = document.getElementById('email-edit');
    const emailEditClick = document.getElementById('email-edit_click') ?? document.createElement('div');
    const eStyle = emailEditClick.style;

    if (emailEdit) {
      if (emailEditActive) {
        emailEdit.style.display = 'none';
        eStyle.backgroundColor = 'inherit';
        eStyle.borderBottomLeftRadius = '12px';
        eStyle.borderBottomRightRadius = '12px';
        setEmailEditActive(false);
      } else {
        emailEdit.style.display = 'flex';
        eStyle.backgroundColor = 'rgba(0, 0, 0, 0.06)';
        eStyle.borderBottomLeftRadius = '0px';
        eStyle.borderBottomRightRadius = '0px';
        setEmailEditActive(true);
      }
    }
  }

  const validateEmail = (email: string) => {
    return email.match(/^[\w]{1}[\w.]*@[\w-]+\.[a-z]{2,4}$/i) ? true : false;
  }

  const saveEmail = (e: any) => {
    const newEmail = e.target.parentElement.children[0].children[0].value.trim();
    const border = document.getElementById('border');
    if (validateEmail(newEmail)) {
      if (newEmail) {
        axios.patch(`http://localhost:3030/users/${userId}`, {
          email: newEmail
        }, { headers: { "Content-Type": "application/json" } })
          .then(res => {
            if (res.status === 200 && border) {
              border.style.boxShadow = '0 0 10px 5px lightgreen';
              setTimeout(() => {
                border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
                setTimeout(() => {
                  document.location.reload();
                }, 500);
              }, 2000);
            } else if (border) {
              border.style.boxShadow = '0 0 10px 5px red';
              setTimeout(() => {
                border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
              }, 2000);
            }
          })
          .catch(e => alert(e))
      }
    } else {
      if (border) {
        border.style.boxShadow = '0 0 10px 5px red';
        setTimeout(() => {
          border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
        }, 2000);
      }
    }
  }

  const savePassword = (e: any) => {
    const password = e.target.parentElement.children[0].value;
    const confirmPassword = e.target.parentElement.children[1].value;
    const border = document.getElementById('border');

    if (password.length > 5 && password === confirmPassword) {
      axios.patch(`http://localhost:3030/users/${userId}`, {
        password: password
      }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          if (res.status === 200 && border) {
            border.style.boxShadow = '0 0 10px 5px lightgreen';
            setTimeout(() => {
              border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
              setTimeout(() => {
                document.location.reload();
              }, 500);
            }, 2000);
          } else if (border) {
            border.style.boxShadow = '0 0 10px 5px red';
            setTimeout(() => {
              border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
            }, 2000);
          }
        })
        .catch(e => alert(e))
    } else if (border) {
      border.style.boxShadow = '0 0 10px 5px red';
      setTimeout(() => {
        border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
      }, 2000);
    }
  }

  const setImg = () => {
    let image = document.getElementById(`image`);
    let file = (document.getElementById(`file`) as HTMLInputElement);
    setShowBtn(true)
    const border = document.querySelector(`.input-file`) ?? document.createElement('div');
    (border as HTMLDivElement).style.border = '1px solid grey';

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

  const savePhoto = (e: any) => {
    const img = e.target.parentElement.children[2].src;
    const border = document.getElementById('border');

    if (img && img !== 'http://localhost:3000/admin') {
      axios.patch(`http://localhost:3030/users/${userId}`, {
        userImg: img
      }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          if (res.status === 200 && border) {
            border.style.boxShadow = '0 0 10px 5px lightgreen';
            setTimeout(() => {
              border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
              setTimeout(() => {
                document.location.reload();
              }, 500);
            }, 2000);
          } else if (border) {
            border.style.boxShadow = '0 0 10px 5px red';
            setTimeout(() => {
              border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
            }, 2000);
          }
        })
        .catch(e => alert(e))
    } else if (border) {
      border.style.boxShadow = '0 0 10px 5px red';
      setTimeout(() => {
        border.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.06)';
      }, 2000);
    }
  }

  return (
    <>
      <Link to={'/'}><div className='back back-profile'></div></Link>
      <div className='profile_container' id='border'>
        <h1>Ваши данные</h1>
        <div className="userdata_container">
          <img src={userData.userImg} alt="user-pic" />
          <label className="input-file profile-img">
            <input type="file" id={`file`} name='file' onChange={setImg} />
            <span>Фото</span>
            <img src="" id={`image`} alt='ooo' style={{ maxWidth: "600px", maxHeight: "300px", display: "none" }} />
            {showBtn ? <button className='save-img' onClick={savePhoto}>Сохранить фото</button> : <></>}
          </label>
          <div className="profile_username" id='name-edit_click' onClick={showNameEdit}>Имя пользователя: <span>{userData.name}</span></div>
          <div className="profile_new-username" id='name-edit'>
            <label htmlFor="username">Новое имя пользователя:
              <input type="text" id="username" placeholder='username' />
            </label>
            <button className='profile_save' onClick={saveName}>Сохранить</button>
          </div>
          <div className="profile_email" id='email-edit_click' onClick={showEmailEdit}>E-mail: <span>{userData.email}</span></div>
          <div className="profile_new-email" id='email-edit'>
            <label htmlFor="email">Новый E-mail пользователя:
              <input type="text" id="email" placeholder='email' />
            </label>
            <button className='profile_save' onClick={saveEmail}>Сохранить</button>
          </div>
          <div className='profile_tags'>Привелегии: <span>{userData.admin ? 'Администратор' : 'Пользователь'}</span></div>
          <div className="profile_pass">
            <input type="password" placeholder='Новый пароль' />
            <input type="password" placeholder='Подтвердите пароль' />
            <button className='profile_save' onClick={savePassword}>Сохранить</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile