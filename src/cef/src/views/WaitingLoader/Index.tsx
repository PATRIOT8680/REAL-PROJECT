import './assets/styles/compiled-css/Index.css'

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { hideWaitingLoader } from "../../actions/menus/waitingLoader.ts";

const WaitingLoader = () => {
  const dispatch = useDispatch()
  const { isVisible, duration, subtitle } = useSelector((state: RootState) => state.waitingLoaderReducer)
  const [exit, setExit] = useState<boolean>(false)
  const [remainingMs, setRemainingMs] = useState<number>(duration)

  const formattedTime = (remainingMs / 1000).toFixed(2)
  const progress = duration > 0 ? 1 - remainingMs / duration : 0
  const dashOffset = 480 - (240 * progress)

  useEffect(() => {
    if (!isVisible || duration <= 0) return

    setRemainingMs(duration)

    const interval = setInterval(() => {
      setRemainingMs(prev => {
        const newValue = Math.max(0, prev - 10)
        if (newValue <= 0) clearInterval(interval)

        return newValue
      })
    }, 10)
  }, [isVisible, duration])

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setExit(true)

        const hideTimer = setTimeout(() => {
          setExit(false)
          dispatch(hideWaitingLoader())
        }, 1000)

        return () => clearTimeout(hideTimer)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, dispatch])

  if (!isVisible) return null

  return (
    <div className={`waiting-loader ${exit ? 'exit' : ''}`}>
      <svg className='loader-svg' width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 6C58.7777 6 74 21.2223 74 40C74 58.7777 58.7777 74 40 74C21.2223 74 6 58.7777 6 40C6 21.2223 21.2223 6 40 6Z"
          stroke="white"
          stroke-width="12"
          strokeDasharray={480}
          strokeDashoffset={dashOffset}
        />
        <path d="M40 6C58.7777 6 74 21.2223 74 40C74 58.7777 58.7777 74 40 74C21.2223 74 6 58.7777 6 40C6 21.2223 21.2223 6 40 6Z" stroke="white" strokeOpacity={0.4} stroke-width="12" />
      </svg>
      <div className="text-block">
        <span className="seconds">{formattedTime}s</span>
        { subtitle && <span className="subtitle">{subtitle}</span>}

      </div>
    </div>
  )
}

export default WaitingLoader