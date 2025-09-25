import '../assets/styles/compiled-css/Header.css'
import {FC, useEffect, useState} from "react";
import { rce } from "../../../modules/rce.ts";

interface IHeader {
  activeMenu: string,
  onMenuChange: (menu: string) => void,
}

const Header: FC<IHeader> = ({ activeMenu, onMenuChange }) => {
  const [focusHelpKey, setFocusHelpKey] = useState<string | null>(null)

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
    }
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ControlLeft') {
        event.preventDefault();
        setFocusHelpKey('left')
      }
      else if (event.code === 'ControlRight') {
        event.preventDefault();
        setFocusHelpKey('right')
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
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
      </div>
    </>
  )
}

export default Header