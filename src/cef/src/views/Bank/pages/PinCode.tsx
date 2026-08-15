import './assets/styles/compiled-css/PinCode.css'
import { useState, useEffect } from "react";

import MainBtn from "../../../components/MainBtn/MainBtn.tsx";

const PinCode = () => {
  const [pin, setPin] = useState<string>('')
  const [visibleBtn, setVisibleBtn] = useState<boolean>(false)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      setPin(prev => prev.slice(0, -1))
      return
    }

    if (/^\d$/.test(e.key) && pin.length < 4) {
      setPin(prev => prev + e.key)
    }
  }

  const handleConfirmPin = () => {

  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pin])

  useEffect(() => {
    setVisibleBtn(false)
    if (pin.length === 4) {
      setVisibleBtn(true)
    }
  }, [pin])

  return (
    <div className="pincode-page">
      <span className="title">Придумайте PIN-код</span>
      <div className="pin-container">
        { Array.from({ length: 4 }).map((_, idx) => (
          <span
            key={idx}
            className={`pin-star ${idx < pin.length ? 'filled' : ''}`}
          >
            ✱
          </span>
        )) }
      </div>
      <p className="pin-hint">Используйте клавиатуру (0-9)</p>
      { visibleBtn && (
        <MainBtn
          text='Оформить'
          onClick={handleConfirmPin}
          nextIcon={true}
          textSize={.95}
        />
      ) }
    </div>
  )
}

export default PinCode