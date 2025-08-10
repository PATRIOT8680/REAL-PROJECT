import '../assets/styles/compiled-css/Reborn.css'
import { useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'

import rebornSound from '../assets/audio/reborn.mp3'

const Reborn = () => {
  const [closedDeath, setClosedDeath] = useState<boolean>(false)

  const soundRef = useRef<Howl>(new Howl({
    src: [rebornSound],
    volume: 0.1
  }))

  useEffect(() => {
    soundRef.current.play()
    setTimeout(() => {
      setClosedDeath(true)
      window.App.deathReducer.setInstant('reborn')
      setTimeout(() => {
        window.App.deathReducer.hideDeath()
      }, 1000)
    }, 4000)

    return () => {
      soundRef.current.stop()
      soundRef.current.unload()
    }
  }, [])

  return (
    <>
      <div className="reborn" id={closedDeath ? 'closed-death' : ''}>
        <div className="line" id="top-line"></div>
        <div className="text-block">
          <span className="title">Возрожден</span>
          <span className="description">Поздравляем! Вам удалось выжить {`:)`}</span>
        </div>
        <div className="line" id="bottom-line"></div>
      </div>
    </>
  )
}

export default Reborn