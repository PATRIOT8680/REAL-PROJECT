import './assets/styles/compiled-css/Header.css'
import { FC } from "react";

interface IHeaderLogs {
  activeContainer: string,
  onContainerChange: (container: string) => void,
}

const HeaderLogs: FC<IHeaderLogs> = ({ activeContainer, onContainerChange }) => {

  const pages = [
    {
      key: 'economics',
      name: 'Экономика',
    },
    {
      key: 'reports',
      name: 'Репорты'
    }
  ]

  return (
    <div className="header-logs">
      { pages.map((item, key) => (
          <span
            key={key}
            className={`name-container ${item.key === activeContainer ? 'active' : ''}`}
            onClick={() => onContainerChange(item.key)}
          >
            {item.name}
            { item.key === activeContainer && ( <div className='line' /> ) }
          </span>
      )) }
    </div>
  )
}

export default HeaderLogs