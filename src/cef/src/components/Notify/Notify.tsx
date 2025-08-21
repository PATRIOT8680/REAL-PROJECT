import { FC, Dispatch, useRef, useState, useEffect } from 'react'
import { TypeNotify, TypePos } from '../../actions/elements/notify'
import './assets/styles/compiled-css/Notify.css'

interface INotification {
  id: string,
  typeNotify: TypeNotify,
  msg: string,
  dispatch: React.Dispatch<{ type: "REMOVE_NOTIFY"; id: string }>,
  duration: number,
  pos: TypePos
}

const Notify: FC<INotification> = ({ id, typeNotify, msg, dispatch, duration }) => {
  const [exit, setExit] = useState<boolean>(false)
  const [timerWork, setTimerWork] = useState<boolean>(true)
  const exitTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
  const timer = useRef<NodeJS.Timeout | undefined>(undefined)
  const remainingTime = useRef<number>(duration)
  const startTime = useRef<number>(Date.now())

  if (!msg) return null

  useEffect(() => {
    handleStartTimer()
    return () => {
      clearTimeout(timer.current)
      clearTimeout(exitTimeout.current)
    }
  }, [])

  const handleStartTimer = () => {
    startTime.current = Date.now()
    setTimerWork(true)
    
    clearTimeout(timer.current)
    clearTimeout(exitTimeout.current)
    
    timer.current = setTimeout(() => {
      handleCloseNotify()
    }, remainingTime.current)
  }

  const handleStopTimer = () => {
    setTimerWork(false)
    clearTimeout(timer.current)
    clearTimeout(exitTimeout.current)
    
    // Сохраняем оставшееся время
    const elapsed = Date.now() - startTime.current
    remainingTime.current = remainingTime.current - elapsed
  }

  const handleCloseNotify = () => {
    setExit(true)
    exitTimeout.current = setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFY', id })
    }, 500)
  }

  return(
    <>
      <div
        className={`notify-item ${exit ? 'exit' : ''}`}
        id={typeNotify}
        onClick={handleCloseNotify}
        onMouseEnter={handleStopTimer}
        onMouseLeave={handleStartTimer}
      >
        <div className="block-icon"><img className='icon' src={`assets/img/notify/${typeNotify}.svg`} /></div>
        <div className="block-notify">
          <span className="text">{msg}</span>
          <div className="progress-line">
            <div 
              className={`active-line ${timerWork ? '' : 'paused'}`}
              style={{ animationDuration: `${duration}ms` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notify