import React, { useEffect, useRef, useState } from 'react'
import './css/UsersList.css'
import axios from 'axios';
import { useClickAway } from 'react-use';

const UsersList = () => {

  const [users, setUsers] = useState<object[]>([])
  const [links, setLinks] = useState([''])
  const [first, setFirst] = useState('')
  const [prev, setPrev] = useState('')
  const [next, setNext] = useState('')
  const [last, setLast] = useState('')
  const [lastNum, setLastNum] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentId, setCurrentId] = useState(0)


  useEffect(() => {
    axios.get(`http://localhost:3030/users?_page=1&_limit=3`)
      .then(res => {
        const usrs = res.data;
        setUsers(usrs)
        setUsersCopy(usrs)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }, [])

  useEffect(() => {
    links.forEach((link: any) => {
      const l1 = link.split(';')[0]
      const l2 = link.split(';')[1]?.split('=')[1].slice(1, -1)

      if (links.length === 3) {
        if (l2 === `prev`) {
          setNext('')
        } else if (l2 === `next`) {
          setPrev('')
        }
      }

      if (l2 === `first`) {
        setFirst(l1.slice(1, -1))
      } else if (l2 === `prev`) {
        setPrev(l1.slice(2, -1))
      } else if (l2 === `next`) {
        setNext(l1.slice(2, -1))
      } else if (l2 === `last`) {
        setLast(l1.slice(2, -1))
        setLastNum(l1.split('=')[1][0])
      }
    })
  }, [links])

  const goFirst = () => {
    axios.get(`${first}`)
      .then(res => {
        const usrs = res.data;
        setUsers(usrs)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const goPrev = () => {
    axios.get(`${prev}`)
      .then(res => {
        const usrs = res.data;
        setUsers(usrs)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const goNext = () => {
    axios.get(`${next}`)
      .then(res => {
        const usrs = res.data;
        setUsers(usrs)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const goLast = () => {
    axios.get(`${last}`)
      .then(res => {
        const usrs = res.data;
        setUsers(usrs)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const question = (id: number, isAdmin: boolean) => {
    if (showModal) {
      setShowModal(false)
    } else if (isAdmin) {
      setShowModal(false)
      alert('Нельзя удалить администратора')
    } else {
      setShowModal(true)
    }
    setCurrentId(id);
  }

  const deleteUser = (id: number) => {
    setShowModal(false)
    const border = document.getElementById(`admin_user-container`) ?? document.createElement('div')

    axios.get(`http://localhost:3333/articles?userId=${id}`)
      .then(res => {
        const usersArticles = res.data;
        usersArticles.forEach((elem: any, index: number) => {
          setTimeout(() => {
            axios.delete(`http://localhost:3333/articles/${elem.id}`)
              .catch(e => alert(e))
          }, index * 100);
          if (index + 1 === usersArticles.length) {
            setTimeout(() => {
              axios.delete(`http://localhost:3030/users/${id}`)
                .then(res => {
                  if (res.status === 200) {
                    border.style.boxShadow = `0 0 10px 5px lightgreen`;
                    setTimeout(() => {
                      border.style.boxShadow = `none`;
                      setTimeout(() => {
                        document.location.reload()
                      }, 500);
                    }, 1000);
                  } else {
                    border.style.boxShadow = `0 0 10px 5px red`;
                    setTimeout(() => {
                      border.style.boxShadow = `none`;
                    }, 1000);
                  }
                })
                .catch(e => alert(e))
            }, (index + 1) * 100);
          }
        })
      })
      .catch(e => alert(e))
  }

  const modal = <>
    <div id="overlay"></div>
    <div id="popup" className="popup">
      <div className="popup__content">
        <h2 className="popup__title">
          Вы действительно хотите удалить пользователя?
        </h2>
        <div className="btn-container">
          <button id="no-btn" className="popup__button" onClick={() => question(currentId, false)}>
            Нет
          </button>
          <button id="yes-btn" className="popup__button" onClick={() => deleteUser(currentId)}>
            Да
          </button>
        </div>
      </div>
    </div>
  </>

  const [usersCopy, setUsersCopy] = useState<object[]>([])
  const [names, setNames] = useState<string[]>([])
  const [currentNames, setCurrentNames] = useState<string[]>([])
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const temp: string[] = []
    users?.map((elem: any) => temp.push(elem.name))
    setNames(temp)
  }, [users])

  const search = (e: any) => {
    const pattern = new RegExp(`${e.target.value}`, 'i')
    const temp = names.filter(elem => elem.match(pattern))
    e.target.value ? setCurrentNames(temp) : setCurrentNames([])
  }

  const setInputValue = (e: any) => {
    (document.getElementById('input2') as HTMLInputElement).value = e.target.textContent;
    const temp = users?.filter((elem: any) => elem.name === e.target.textContent)
    setUsers(temp)
    setCurrentNames([])
  }

  useClickAway(ref, () => {
    setIsActive(false);
  });

  const open = () => {
    setIsActive(!isActive);
  };

  const output = <div className='output admin-output-art' style={isActive ? { display: "block" } : { display: "none" }}>
    {currentNames.map((elem: any, index: number) => <div key={index} onClick={setInputValue}>{elem}</div>)}
  </div>

  const reset = () => {
    setUsers(usersCopy);
    (document.getElementById('input2') as HTMLInputElement).value = '';
  }

  return (
    <>
      {showModal ? modal : <></>}
      <div className="article-list users-list" id='admin_user-container'>
        <div className='article-list-top' ref={ref}>
          <h1>Список пользователей</h1>
          <input type="text" placeholder='Найти пользователя' className='admin-art-input admin-users' id='input2' onChange={search} onClick={open} />
          <div className="reset admin-art-reset" onClick={reset}>X</div>
          {currentNames.length > 0 ? output : <></>}
        </div>
        {users?.map((elem: any, index: number) => {
          return <div key={index}>
            <div className='mini_article users-info' id={`${elem.id}-parent`}>
              {elem.userImg ? <img src={elem.userImg} alt="user pic" className='user-pic' /> : <div className="no-img">{elem.name[0].toUpperCase()}</div>}
              <div className='user-name'>{elem.name}</div>
              <div className='delete' onClick={() => question(elem.id, elem.admin)}></div>
            </div>
          </div>
        })}
        <div className="paginate">
          {first ? <button onClick={goFirst}>1</button> : <></>}
          {prev ? <button onClick={goPrev} className='prev'></button> : <></>}
          {next ? <button onClick={goNext} className='next'></button> : <></>}
          {last ? <button onClick={goLast}>{lastNum}</button> : <></>}
        </div>
      </div>
    </>
  )
}

export default UsersList