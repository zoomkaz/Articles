import React, { useEffect, useRef, useState } from 'react'
import './css/ArticlesList.css'
import { ArticlesType } from '../../main/Main'
import axios from 'axios'
import { useClickAway } from 'react-use'

const ArticlesList = () => {

  const [articles, setArticles] = useState<ArticlesType[]>()
  const [links, setLinks] = useState([''])
  const [first, setFirst] = useState('')
  const [prev, setPrev] = useState('')
  const [next, setNext] = useState('')
  const [last, setLast] = useState('')
  const [lastNum, setLastNum] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentId, setCurrentId] = useState(0)

  useEffect(() => {
    axios.get(`http://localhost:3333/articles?_page=1&_limit=5`)
      .then(res => {
        const arts = res.data;
        setArticles(arts)
        setArticlesCopy(arts)
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
        const arts = res.data;
        setArticles(arts)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const goPrev = () => {
    axios.get(`${prev}`)
      .then(res => {
        const arts = res.data;
        setArticles(arts)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const goNext = () => {
    axios.get(`${next}`)
      .then(res => {
        const arts = res.data;
        setArticles(arts)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const goLast = () => {
    axios.get(`${last}`)
      .then(res => {
        const arts = res.data;
        setArticles(arts)
        setLinks(res.headers.link.split(','))
      })
      .catch(e => alert(e))
  }

  const showChange = (id: number) => {
    const edit = document.getElementById(`${id}`) ?? document.createElement('div');
    const parent = document.getElementById(`${id}-parent`) ?? document.createElement('div');

    if (edit.style.display === 'flex') {
      edit.style.display = 'none';
      parent.style.borderBottomLeftRadius = '12px';
      parent.style.borderBottomRightRadius = '12px';
    } else {
      edit.style.display = 'flex';
      parent.style.borderBottomLeftRadius = '0px';
      parent.style.borderBottomRightRadius = '0px';
    }
  }

  const setImg = (id: any) => {
    let image = document.getElementById(`image-${id}`);
    let file = (document.getElementById(`file-${id}`) as HTMLInputElement);

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

  const saveChanges = (id: any) => {
    const img = document.getElementById(`image-${id}`) ?? document.createElement('img');
    const title = document.getElementById(`title-${id}`) ?? document.createElement('textarea');
    const text = document.getElementById(`text-${id}`) ?? document.createElement('textarea');

    axios.get(`http://localhost:3333/articles/${id}`)
      .then(res => {
        const oldImg = res.data.mainImg;
        const oldTitle = res.data.title;
        const oldText = res.data.text;

        const newImg = (img as HTMLImageElement).src.trim() && (img as HTMLImageElement).src.trim() !== 'http://localhost:3000/admin' ? (img as HTMLImageElement).src : oldImg;
        const newTitle = (title as HTMLTextAreaElement).value.trim() ? (title as HTMLTextAreaElement).value : oldTitle;
        const newText = (text as HTMLTextAreaElement).value.trim() ? (text as HTMLTextAreaElement).value : oldText;

        axios.patch(`http://localhost:3333/articles/${id}`, {
          mainImg: newImg,
          title: newTitle,
          text: newText
        }, { headers: { "Content-Type": "application/json" } })
          .then(res => {
            document.location.reload()
          })
          .catch(e => alert(e))

      })
      .catch(e => alert(e))
  }

  const question = (id: number) => {
    showModal ? setShowModal(false) : setShowModal(true);
    setCurrentId(id);
  }

  const deleteArticle = (id: number) => {
    setShowModal(false)
    const border = document.getElementById(`admin_container`) ?? document.createElement('div')
    axios.delete(`http://localhost:3333/articles/${id}`)
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
  }

  const modal = <>
    <div id="overlay"></div>
    <div id="popup" className="popup">
      <div className="popup__content">
        <h2 className="popup__title">
          Вы действительно хотите удалить статью?
        </h2>
        <div className="btn-container">
          <button id="no-btn" className="popup__button" onClick={() => question(currentId)}>
            Нет
          </button>
          <button id="yes-btn" className="popup__button" onClick={() => deleteArticle(currentId)}>
            Да
          </button>
        </div>
      </div>
    </div>
  </>

  const [articlesCopy, setArticlesCopy] = useState<ArticlesType[]>()
  const [titles, setTitles] = useState<string[]>([])
  const [currentTitles, setCurrentTitles] = useState<string[]>([])
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const temp: string[] = []
    articles?.map(elem => temp.push(elem.title))
    setTitles(temp)
  }, [articles])

  const search = (e: any) => {
    const pattern = new RegExp(`${e.target.value}`, 'i')
    const temp = titles.filter(elem => elem.match(pattern))
    e.target.value ? setCurrentTitles(temp) : setCurrentTitles([])
  }

  const setInputValue = (e: any) => {
    (document.getElementById('input') as HTMLInputElement).value = e.target.textContent;
    const temp = articles?.filter(elem => elem.title === e.target.textContent)
    setArticles(temp)
    setCurrentTitles([])
  }

  useClickAway(ref, () => {
    setIsActive(false);
  });

  const open = () => {
    setIsActive(!isActive);
  };

  const output = <div className='output admin-output-art' style={isActive ? { display: "block" } : { display: "none" }}>
    {currentTitles.map((elem: any, index: number) => <div key={index} onClick={setInputValue}>{elem}</div>)}
  </div>

  const reset = () => {
    setArticles(articlesCopy);
    (document.getElementById('input') as HTMLInputElement).value = '';
  }


  return (
    <>
      {showModal ? modal : <></>}
      <div className="article-list" id='admin_container'>
        <div className='article-list-top' ref={ref}>
          <h1>Список статей</h1>
          <input type="text" placeholder='Найти статью' className='admin-art-input' id='input' onChange={search} onClick={open} />
          <div className="reset admin-art-reset" onClick={reset}>X</div>
          {currentTitles.length > 0 ? output : <></>}
        </div>
        {articles?.map((elem: any, index: number) => {
          const currentTitle = elem.title.split(' ').length > 8 ? elem.title.split(' ').slice(0, 8).join(' ') + '...' : elem.title;
          const currentText = elem.text.split(' ').length > 20 ? elem.text.split(' ').slice(0, 20).join(' ') + '...' : elem.text;
          return <div key={index}>
            <div className='mini_article' onClick={() => showChange(elem.id)} id={`${elem.id}-parent`}>
              <img src={elem.mainImg} alt='mini pic' className='mini_img' />
              <div className='mini_right'>
                <div className='mini_title'>{currentTitle} <span className='edit'></span> <span className='delete' onClick={() => question(elem.id)}></span></div>
                <div className='mini_text'>{currentText}</div>
              </div>
            </div>
            <div className='mini_article-edit' id={elem.id}>
              <label className="input-file">
                <input type="file" id={`file-${elem.id}`} name='file' onChange={() => setImg(elem.id)} />
                <span>Изображение</span>
                <img src="" id={`image-${elem.id}`} alt='ooo' style={{ maxWidth: "600px", maxHeight: "300px", display: "none" }} />
              </label>
              <textarea placeholder='Новый заголовок' id={`title-${elem.id}`}></textarea>
              <textarea placeholder='Новый текст' id={`text-${elem.id}`}></textarea>
              <button className='save' onClick={() => saveChanges(elem.id)}>Сохранить</button>
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

export default ArticlesList