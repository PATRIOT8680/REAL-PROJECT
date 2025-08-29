import '../assets/styles/compiled-css/BtnChar.css'
import { FC, memo } from "react"

interface IBtnChar {
  status: 'active' | 'free' | 'donat' | 'ban',
  numberChar: number,
  nickname: string,
  onClick: (numberSlot: number) => void
}

const BtnChar: FC<IBtnChar> = memo(({ status, numberChar, nickname, onClick }) => {
  const getStatusText = () => {
    switch (status) {
      case "active":
        return `Персонаж №${numberChar}`
      case "free":
        return `Свободный слот №${numberChar}`
      case "donat":
        return `Премиум - слот №${numberChar}`
      case "ban":
        return `Слот №${numberChar} заблокирован`
      default:
        return `Персонаж №${numberChar}`
    }
  }

  return (
    <>
      <button className="btn-char" onClick={() => onClick(numberChar)}>
        <span className="title">{getStatusText()}</span>
        { nickname && <span className="nickname">{nickname}</span> }
      </button>
    </>
  )
})

export default BtnChar