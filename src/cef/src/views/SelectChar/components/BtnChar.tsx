import '../assets/styles/compiled-css/BtnChar.css'
import { FC, memo } from "react"

import svg_plus from '../assets/img/plus.svg'

interface IBtnChar {
  selected: boolean,
  status: 'active' | 'free' | 'donat' | 'ban',
  numberChar: number,
  lvl: number,
  exp: number,
  maxExp: number,
  nickname: string,
  onClick: (numberSlot: number) => void
}

const BtnChar: FC<IBtnChar> = memo(({ selected, status, numberChar, lvl, exp, maxExp, nickname, onClick }) => {

  const mathExp = () => {
    if (maxExp === 0) return 0

    const progress = Math.min(exp / maxExp, 1)
    const pathLength = 280
    return pathLength * (1 - progress)
  }

  const getStatusText = () => {
    switch (status) {
      case "active":
        return (
            <>
              <span className="title">{nickname}</span>
              <span className="subtitle">Гражданин</span>
            </>
        )
      case "free":
        return (
            <>
              <span className="title">Бесплатный слот №{numberChar}</span>
            </>
        )
      case "donat":
        return (
            <>
              <span className="title">Платный слот №{numberChar}</span>
              <span className="subtitle">450 RC</span>
            </>
        )
      case "ban":
        return (
            <>
              <span className="title">Заблокированный слот №{numberChar}</span>
              <span className="subtitle">{nickname}</span>
            </>
        )
      default:
        return ``
    }
  }

  return (
    <>
      <button id={`slot-${status}`} className={`btn-char ${selected ? 'selected' : ''}`} onClick={() => onClick(numberChar)}>
        <div className="header-slot">{getStatusText()}</div>
        { status === 'active' && (
            <div className="lvl-content">
              <span className="lvl-text">{lvl}</span>
              <svg className='progress-lvl-bg' width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M73 3V73H3V3H73Z"
                    stroke="white"
                    strokeOpacity="0.26"
                    strokeWidth="6"
                />
                <path
                    className='progress-lvl'
                    style={{ strokeDashoffset: mathExp() }}
                    d="M38 3 L73 3 L73 73 L3 73 L3 3 L38 3"
                    stroke="#eea50a"
                    strokeWidth="6"
                    fill="none"
                    transform="rotate(0 38 38)"
                />
              </svg>
            </div>
        ) }

        { status === 'free' && (
            <div className="icon-create">
              <img src={svg_plus} />
            </div>
        ) }

        { status === 'donat' && (
            <svg className='svg_flash' width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M30.418 0C47.2173 0 60.8359 13.6186 60.8359 30.418C60.8359 47.2173 47.2173 60.8359 30.418 60.8359C13.6186 60.8359 0 47.2173 0 30.418C0 13.6186 13.6186 0 30.418 0ZM12.4395 34.4141H30.4209L28.4238 50.3984L48.4033 26.4229H30.4209L32.4189 10.4385L12.4395 34.4141Z" fill="#322D36" />
            </svg>
        ) }

      </button>
    </>
  )
})

export default BtnChar