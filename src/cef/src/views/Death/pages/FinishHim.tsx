import '../assets/styles/compiled-css/FinishHim.css'
import { useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'
import { rpc } from '../../../main'

import finishSound from '../assets/audio/finish_him.mp3'

const FinishHim = () => {
  const [closedDeath, setClosedDeath] = useState<boolean>(false)

  const soundRef = useRef<Howl>(new Howl({
    src: [finishSound],
    volume: 0.1
  }))

  useEffect(() => {
    soundRef.current.play()
    setTimeout(() => {
      setClosedDeath(true)
      rpc.callServer('playerKill')
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
      <div className="finish-him" id={closedDeath ? 'closed-death' : ''}>
        <div className="line" id="top-line"></div>
        <div className="text-block">
          <span className="title">Утрачен</span>
          <span className="description">К сожалению вас никто не успел спасти</span>
        </div>
        <div className="line" id="bottom-line"></div>
      </div>
    </>
  )
}

export default FinishHim