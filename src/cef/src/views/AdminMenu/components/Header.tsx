import '../assets/styles/compiled-css/Header.css'
<<<<<<< HEAD
import { FC, useState } from "react";
=======
import {FC, useEffect, useState} from "react";
import { rce } from "../../../modules/rce.ts";
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

interface IHeader {
  activeMenu: string,
  onMenuChange: (menu: string) => void,
}

const Header: FC<IHeader> = ({ activeMenu, onMenuChange }) => {
<<<<<<< HEAD
  const [hoveredBlock, setHoveredBlock] = useState<string>('')
=======
  const [focusHelpKey, setFocusHelpKey] = useState<string | null>(null)
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

  const pages = [
    {
      key: 'console',
      name: 'Console',
    },
    {
      key: 'reports',
      name: 'Репорты',
    },
    {
      key: 'vehicles',
      name: 'Транспорт',
    },
    {
      key: 'players',
      name: 'Игроки'
    },
    {
      key: 'fractions',
      name: 'Фракции',
    },
    {
      key: 'homes',
      name: 'Дома'
    },
    {
      key: 'logs',
      name: 'Логи'
    }
  ]

<<<<<<< HEAD
  return (
    <>
      <div className="header-amenu">
        { pages.map(page => (
          <div className='section-block'>
            { hoveredBlock === page.key && <span className="name-section">{ page.name }</span> }
            <div
              key={page.key}
              className={`block-icon ${activeMenu === page.key ? 'active' : ''}`}
              onClick={() => onMenuChange(page.key)}
              onMouseEnter={() => setHoveredBlock(page.key)}
              onMouseLeave={() => setHoveredBlock('')}
            >
              <img src={`assets/img/admin-menu/sections/${page.key}.svg`} />
            </div>
          </div>
        )) }
=======
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Numpad4') {
        event.preventDefault();
        setFocusHelpKey('left')
      }
      else if (event.code === 'Numpad6') {
        event.preventDefault();
        setFocusHelpKey('right')
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Numpad4' || event.code === 'Numpad6') {
        setFocusHelpKey(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleCloseAMenu = () => {
    rce.triggerClient('closeAMenu')
  }

  return (
    <>
      <div className="header-amenu">
        <div className="block-h">
          <div className="block">
            <span className="help-key" id={focusHelpKey === 'left' ? 'helpFocus' : ''}>NUM.4</span>
            <div className="links-text">
              { pages.map(page => (
                  <span
                      key={page.key}
                      className={`text ${activeMenu === page.key ? 'active' : ''}`}
                      onClick={() => onMenuChange(page.key)}>
                  { page.name }
             </span>
              )) }
            </div>
            <span className="help-key" id={focusHelpKey === 'right' ? 'helpFocus' : ''}>NUM.6</span>
          </div>
          <span className="close" onClick={handleCloseAMenu}>ESC</span>
        </div>
        <div className="line"></div>
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
      </div>
    </>
  )
}

export default Header