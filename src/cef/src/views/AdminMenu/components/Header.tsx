import '../assets/styles/compiled-css/Header.css'
import { FC, useState } from "react";

interface IHeader {
  activeMenu: string,
  onMenuChange: (menu: string) => void,
}

const Header: FC<IHeader> = ({ activeMenu, onMenuChange }) => {
  const [hoveredBlock, setHoveredBlock] = useState<string>('')

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
      </div>
    </>
  )
}

export default Header