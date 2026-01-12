import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './assets/styles/compiled-css/Index.css'

import svg_logo from './assets/img/logotype.svg'
import logo_text from './assets/img/logo-text.svg'

const svgA = (active: boolean) => (
  <svg className={`svgA ${active ? 'active' : ''}`} width="51" height="64" viewBox="0 0 51 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.1865 4.0047C11.6599 1.67452 13.7087 0 16.0865 0H45.8823C49.0436 0 51.4115 2.89721 50.7822 5.9953L39.8135 59.9953C39.3401 62.3255 37.2913 64 34.9135 64H5.11773C1.95637 64 -0.411505 61.1028 0.217795 58.0047L11.1865 4.0047Z" fill="white" fillOpacity="0.02" />
    <path d="M16.0869 0.5H45.8818C48.6381 0.5 50.7249 2.94696 50.3379 5.63477L50.292 5.89551L39.3232 59.8955C38.8973 61.9927 37.0531 63.5 34.9131 63.5H5.11816C2.36194 63.5 0.275058 61.053 0.662109 58.3652L0.708008 58.1045L11.6768 4.10449C12.0894 2.07288 13.8326 0.594295 15.8867 0.503906L16.0869 0.5Z" stroke="white" stroke-opacity="0.05" />
  </svg>
)

const svgB = (active: boolean) => (
  <svg className={`svgB ${active ? 'active' : ''}`} width="51" height="64" viewBox="0 0 51 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.1865 4.0047C11.6599 1.67452 13.7087 0 16.0865 0H45.8823C49.0436 0 51.4115 2.89721 50.7822 5.9953L39.8135 59.9953C39.3401 62.3255 37.2913 64 34.9135 64H5.11773C1.95637 64 -0.411505 61.1028 0.217795 58.0047L11.1865 4.0047Z" fill="#FF0C46" />
  </svg>
)

const Welcome = () => {
  const [activeGroups, setActiveGroups] = useState([false, false, false])
  const [activeExit, setActiveExit] = useState(false)
  const { t } = useTranslation('welcome')

  useEffect(() => {
    const timer = setTimeout(() => setActiveExit(true),  5000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return(
    <>
      <div className={`welcome-page ${activeExit ? 'exit' : ''}`}>
        <svg className='svg' id='one-ellipse' width="846" height="822" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="423" cy="411" rx="423" ry="411" fill="#ffca58" fillOpacity="0.1" />
        </svg>
        <svg className='svg' id='two-ellipse' width="917" height="891" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="458.5" cy="445.5" rx="458.5" ry="445.5" fill="#ffca58" fillOpacity="0.1" />
        </svg>

        <img className='logo-bg' src={svg_logo} />
        <img className='logo-text' src={logo_text} />

        <div className="content">
          <div className="header-welcome">
            <span className="title">Добро пожаловать</span>
            <div className="progress-line" style={{ animationDuration: '5s' }}></div>
            <span className="subtitle">
              Ты входишь в мир, где главное — уважение к ролям и живая история.
              На нашем сервере ценится реализм, сюжет и честная игра без хаоса.
              Каждое твое действие влияет на развитие событий — будь то простой разговор или масштабный сценарий.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Welcome