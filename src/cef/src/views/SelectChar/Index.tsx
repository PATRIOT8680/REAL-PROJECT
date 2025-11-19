import './assets/styles/compiled-css/Index.css'
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { rce } from "../../modules/rce.ts";
import useSmoothWheelScroll from "../../hooks/useSmoothScroll.ts";

import BtnChar from './components/BtnChar'
import MainBtn from "../../components/MainBtn/MainBtn.tsx";
import InfoChar from "./components/InfoChar.tsx";

import svg_real_coins from './assets/img/real-coins.svg'
import svg_real_logo from './assets/img/real_logo.svg'

const SelectChar = memo(() => {
  const [selectSlot, setSelectSlot] = useState<number | undefined>(1)
  const [clickedSlot, setClickedSlot] = useState<boolean>(false)
  const [selectSpawn, setSelectSpawn] = useState<string>('exit')
  const { char1, char2, char3, char4, char5 } = useSelector((state: RootState) => state.selectCharReducer)
  const donatCoinsState = useSelector((state: RootState) => state.donatCoinsReducer)
  const listSlotsRef = useSmoothWheelScroll()

  const charsData = [
    { number: 1, data: char1 },
    { number: 2, data: char2 },
    { number: 3, data: char3 },
    { number: 4, data: char4 },
    { number: 5, data: char5 },
  ]

  const formatNumber = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const getTextBtn = () => {
    if (selectSlot !== undefined) {
      switch (charsData[selectSlot - 1].data.status) {
        case 'active':
          return 'Играть'
        case 'free':
          return 'Создать'
        case 'donat':
          return 'Приобрести'
        default:
          return 'Выбрать'
      }
    }

    return 'Выбрать'
  }

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
              <span className="title-slot">Слот №{selectSlot}</span>
              <span className="descr-slot">Нажмите на кнопку создания, чтобы перейти к кастомизации.</span>
            </>
          )
        case "donat":
          return (
            <>
              <span className="title-slot">Донат слот №{selectSlot}</span>
              <span className="descr-slot">Вы можете за донат-коины приобрести доп. слот для персонажа.</span>
            </>
          )
        case "ban":
          return (
            <>
              <span className="title-slot" id='ban-slot'>{charsData[selectSlot - 1].data.nickname} заблокирован!</span>
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

  const handleClickBtn = () => {
    if (!selectSlot) return
    const status = charsData[selectSlot - 1].data.status
    const char = charsData[selectSlot - 1].data

    if (status === 'active') {
      window.App.selectCharReducer.hideSelectChar()
      window.App.spawnReducer.showSpawn(selectSlot, char.nickname)
    } else if (status === 'free') {
      rce.triggerServer('handleCreateSlotChar', char?.numberChar)
    } else if (status === 'donat') {
      rce.triggerServer('handleDonatCreatePlayer', char?.numberChar)
    }
  }

  return(
    <>
      <div className="select-char">

        <div className="left-content">
          <img className='svg_logo' src={svg_real_logo} />

          <div className="chars-block">
            {/*<span className="donat">Donat coins: {donatCoinsState} DC</span>*/}
            { selectSlot && (
                <div className="header-block">{getTitleSlot()}</div>
            ) }
            <div className="list-slots" ref={listSlotsRef}>
              { charsData.map((char, idx) => (
                  <BtnChar
                      selected={char.number === selectSlot}
                      status={char.data.status}
                      numberChar={char.number}
                      lvl={char.data.lvl}
                      exp={char.data.exp}
                      maxExp={char.data.expMax}
                      nickname={char.data.nickname}
                      onClick={() => handleSelectSlot(char.number, char.data.status)}
                      key={idx}
                  />
              )) }
            </div>
          </div>
        </div>

        <div className="center-content">
          { (selectSlot !== undefined && charsData[selectSlot - 1].data.status !== 'ban') &&
              <div className="btn-container">
                <MainBtn
                    text={getTextBtn()}
                    onClick={handleClickBtn}
                    nextIcon={true}
                    textSize={1}
                />
              </div>
          }

          {/*{ selectSlot && (charsData[selectSlot - 1].data.status === 'active') && (*/}
          {/*    <SelectSpawn selected={selectSpawn} setSelected={(location: string) => setSelectSpawn(location)} />*/}
          {/*) }*/}
        </div>

        <div className="right-content">
          <div className="real-coins">
            <img src={svg_real_coins} />
            <span className="text">{formatNumber(donatCoinsState)} RC</span>
          </div>

          { (selectSlot && (charsData[selectSlot - 1].data.status !== 'free' &&
              (charsData[selectSlot - 1].data.status !== 'donat')) &&
            (
              <InfoChar charData={charsData[selectSlot - 1].data} />
          )) }
        </div>


      </div>
    </>
  )
})

export default SelectChar