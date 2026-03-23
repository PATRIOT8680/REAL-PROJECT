import '../assets/styles/compiled-css/Timer.css'

import { FC, useRef, useEffect, useState, memo } from 'react'
import { Howl } from 'howler'
import { sys } from '../../../../shared/sys'

import tickTimer from '../assets/audio/tick-timer.mp3'
import endTimerSound from '../assets/audio/end-timer.mp3'

interface ITimer {
  initialSeconds: number
  onTick?: (remaining: number) => void
  onTimeUp?: () => void
  autoStart?: boolean
}

const Timer= ({ initialSeconds, onTick, onTimeUp, autoStart = true }: ITimer) => {
  const timerRef = useRef<NodeJS.Timeout>()
  const soundTick = useRef<Howl>(new Howl({ src: [tickTimer], volume: 0.1 }))
  const soundEnd  = useRef<Howl>(new Howl({ src: [endTimerSound], volume: 0.25 }))
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!autoStart) return

    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = prev - 1
        onTick?.(next)

        if (next < 10 && next > 0) {
          soundTick.current.play()
        }

        if (next <= 0) {
          soundEnd.current.play()
          clearInterval(timerRef.current)
          onTimeUp?.()
          return 0
        }

        return next
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      soundTick.current.unload()
      soundEnd.current.unload()
    }
  }, [onTick, autoStart, onTimeUp])

  return (
    <>
      <div className="timer">
        <span className="timeout-text">{sys.getStringTimeInMinutes(seconds)}</span>
        <span className="descr">Осталось до смерти</span>
      </div>
    </>
  )
}

export default memo(Timer)