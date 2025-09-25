import './assets/styles/compiled-css/Index.css'
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { rce } from "../../modules/rce.ts";

import BtnChar from './components/BtnChar'
import BtnNext from "./components/BtnNext.tsx";

const SelectChar = memo(() => {
  const [selectSlot, setSelectSlot] = useState<number | undefined>(1)
  const [clickedSlot, setClickedSlot] = useState<boolean>(false)
  const { char1, char2, char3, char4, char5 } = useSelector((state: RootState) => state.selectCharReducer)
  const donatCoinsState = useSelector((state: RootState) => state.donatCoinsReducer)

  const charsData = [
    { number: 1, data: char1 },
    { number: 2, data: char2 },
    { number: 3, data: char3 },
    { number: 4, data: char4 },
    { number: 5, data: char5 },
  ]

  const getTitleSlot = () => {
    if (selectSlot !== undefined)
      switch (charsData[selectSlot - 1].data.status) {
        case "active":
          return (
            <>
              <span className="title-slot">{charsData[selectSlot - 1].data.nickname}</span>
              <span className="descr-slot">Выберете точку спавна, чтобы продолжить игру. Приятной игры!</span>
            </>
          )
        case "free":
          return (
            <>
              <span className="title-slot">Свободный слот №{selectSlot}</span>
              <span className="descr-slot">Нажмите на кнопку создания, чтобы перейти к кастомизации.</span>
            </>
          )
        case "donat":
          return (
            <>
              <span className="title-slot">Платный слот №{selectSlot} (450 DC)</span>
              <span className="descr-slot">Вы можете за донат-коины приобрести доп. слот для персонажа.</span>
            </>
          )
        case "ban":
          return (
            <>
              <span className="title-slot">{charsData[selectSlot - 1].data.nickname} заблокирован!</span>
              <span className="descr-slot">Не нарушайте правила проекта, чтобы больше не получать блокировки</span>
            </>
          )
        default:
          return ``
      }
  }

  const handleSelectSlot = (slot: number, status: 'active' | 'free' | 'donat' | 'ban') => {
    if (clickedSlot || slot === selectSlot) return
    setSelectSlot(slot)
    setClickedSlot(true)
    rce.triggerClient('cef:selectSlotChar', slot, status)

    setTimeout(() => {
      setClickedSlot(false)
    }, 600)
  }

  

  return(
    <>
      <div className="select-char">
        <div className="right-block">
          <span className="donat">Donat coins: {donatCoinsState} DC</span>
          { selectSlot && (
            <div className="header-block">{getTitleSlot()}</div>
          ) }
          <ul className="list-slots">
            { charsData.map((char, idx) => (
                <BtnChar
                  status={char.data.status}
                  numberChar={char.number}
                  nickname={char.data.nickname}
                  onClick={() => handleSelectSlot(char.number, char.data.status)}
                  key={idx}
                />
            )) }
          </ul>
        </div>
        { selectSlot !== undefined &&
            <BtnNext status={charsData[selectSlot - 1].data.status} char={charsData[selectSlot - 1].data} />
        }
      </div>
    </>
  )
})

export default SelectChar