import '../assets/styles/compiled-css/Timer.css'

import { FC, useRef, useEffect, useState, memo } from 'react'
import { Howler, Howl } from 'howler'
import { rpc } from '../../../main'
import { sys } from '../../../../shared/sys'


import tickTimer from '../assets/audio/tick-timer.mp3'
import endTimerSound from '../assets/audio/end-timer.mp3'

interface ITimer {
  timeLeft: number,
  setTimeLeft: (seconds: number | ((prev: number) => number)) => void
}

const Timer: FC<ITimer> = ({ timeLeft, setTimeLeft }) => {
  const timerRef = useRef<NodeJS.Timeout>()
  
  const soundTick = useRef<Howl>(new Howl({
    src: [tickTimer],
    volume: 0.1,
  }))

  const soundEnd = useRef<Howl>(new Howl({
    src: [endTimerSound],
    volume: 0.25,
  }))

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        const newTime = prev - 1

        if (newTime < 10) soundTick.current.play()
        if (newTime <= 0) {
          soundEnd.current.play()
          clearInterval(timerRef.current)
        }
        return newTime
      })
    }, 1000)

    return () => {
      soundTick.current.unload()
      soundEnd.current.unload()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <>
      <div className="timer">
        <span className="timeout-text">{sys.getStringTimeInMinutes(timeLeft)}</span>
        <span className="descr">Время до реанимации</span>
      </div>
    </>
  )
}

export default memo(Timer)