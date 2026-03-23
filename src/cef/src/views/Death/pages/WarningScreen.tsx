import '../assets/styles/compiled-css/WarningScreen.css'
import { useEffect, useRef, useState } from "react"
import { Howl } from "howler";

import death_svg from '../assets/img/death.svg'
import warning_sound from '../assets/audio/warning-screen.mp3'

interface IWarningScreen {
  setVisible: (visible: boolean) => void
}

const WarningScreen = ({ setVisible }: IWarningScreen) => {
  const [exit, setExit] = useState<boolean>(false)
  const flashSound = useRef<Howl>(new Howl({ src: [warning_sound], volume: 0.2 }))

  useEffect(() => {
    flashSound.current.play()

    const timer = setTimeout(() => {
      setExit(true)

      const hideTimer = setTimeout(() => {
        setVisible(false)
        setExit(false)
      }, 1000)

      return () => clearTimeout(hideTimer)
    }, 5000)

    return () => {
      clearTimeout(timer)
      flashSound.current.stop()
      flashSound.current.unload()
    }
  }, [])

  return (
    <div className={`warning-screen ${exit ? 'exit' : ''}`}>
      <svg className='bg-blur-svg' width="1800" height="826" viewBox="0 0 1800 826" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse opacity="0.87" cx="900" cy="413" rx="900" ry="413" fill="#FF1616"/>
      </svg>
      <img className='death-icon' src={death_svg} />
      <span className="title">Вы без сознания</span>
      <p className="subtitle">Вам требуется немедленная медицинская помощь, иначе вы умрете и попадете в рай (ну или ад)</p>
    </div>
  )
}

export default WarningScreen