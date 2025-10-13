import './assets/styles/compiled-css/MainBtn.css'
import { FC } from "react";

import svg_next from './assets/img/next.svg'

interface IMainBtn {
  text: string,
  onClick: () => void,
  nextIcon: boolean,
  textSize: number
}

const MainBtn: FC<IMainBtn> = ({ text, onClick, nextIcon, textSize }) => {
  return (
      <button name='btn-auth' type='button' className="main-btn" onClick={onClick} style={{ fontSize: `${textSize}rem` }} >
        <label htmlFor="btn-auth">{ text }</label>
        { nextIcon && (
            <div className="next-icons">
              <img id='one' src={svg_next} />
              <img id='two' src={svg_next} />
              <img id='three' src={svg_next} />
            </div>
        ) }
      </button>
  )
}

export default MainBtn