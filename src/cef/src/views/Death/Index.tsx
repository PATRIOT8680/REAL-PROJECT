import { FC, useState, useEffect, useRef, useCallback, memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers/rootReducer'
import { Howler, Howl } from 'howler'
import { rce } from "../../modules/rce.ts";
import { CustomEventHandler } from "../../../../shared/CustomEventBase.ts";
import './assets/styles/compiled-css/Index.css'

import Header from './components/Header'
import Timer from './components/Timer'
import Fate from './components/Fate'
import InfoDeath from './components/Info'
import BtnOutcome from "./components/BtnOutcome.tsx";

import WarningScreen from "./pages/WarningScreen.tsx";
import FinishHim from './pages/FinishHim'
import Reborn from './pages/Reborn'

import deathSound from './assets/audio/death_sound.mp3'

const DeathPlayer = () => {
  const deathState = useSelector((state: RootState) => state.deathReducer)
  const [chanceReborn, setChanceReporn] = useState<number>(34)
  const [timeDead, setTimeDead] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(120)
  const [luck, setLuck] = useState<boolean>(false)
  const [visibleWarning, setVisibleWarning] = useState<boolean>(true)

  const sound = useRef<Howl>(new Howl({
    src: [deathSound],
    loop: true,
    volume: 0.1,
  }))

  const handleClickOutcome = useCallback((keyName: 'medic' | 'death' | 'chance') => {
    rce.triggerClient('cef:death:selectedFate')

    switch (keyName) {
      case 'medic': {
        setLuck(false)
        setTimeLeft(300)
        window.App.deathReducer.selectFateDeath('medic')
        break
      }

      case 'death': {
        setLuck(false)
        window.App.deathReducer.selectFateDeath('death')
        break
      }

      case 'chance': {
        window.App.deathReducer.selectFateDeath('chance')
        break
      }
    }
  }, [])

  const handleOnTick = (remaining: number) => {
    if (remaining < 10 && remaining > 0) {
      const fadeDuration = remaining * 1000
      sound.current.fade(sound.current.volume(), 0, fadeDuration)
    }

    if (remaining === 0) window.App.loadingReducer.showLoading(1500)

    if (remaining <= 0 && luck) {
      setTimeout(() => {
        rce.triggerClient('playerRevive', 'reborn')
      }, 1000)
    } else if (remaining <= 0 && !luck) {
      setTimeout(() => {
        rce.triggerClient('playerRevive', 'kill')
      }, 1000)
    }
  }

  rce.register('client:chanceReborn', (chance: number, luck: boolean) => {
    setChanceReporn(chance)
    setLuck(luck)
  })

  useEffect(() => {
    const fetchData = async () => {
      let timeDeadPlayer = await rce.callServer('getFormatedDateTime', true, true, true)
      setTimeDead(timeDeadPlayer)
      console.log(`Время смерти: ${timeDeadPlayer}`)
    }

    fetchData()

    return () => {
      sound.current.stop()
      sound.current.unload()
    }
  }, [])

  return(
    <>
      <div className={`death-player ${deathState.instant !== null ? deathState.instant : 'null'}`}>
        { (deathState.instant === null && !visibleWarning) && (
          <>
            <div className="titles_timer">
              <Header />
              <Timer
                initialSeconds={timeLeft}
                onTick={(remaining: number) => handleOnTick(remaining)}
                onTimeUp={() => {
                  if (luck) {
                    setTimeout(() => rce.triggerServer('playerReborn'), 1000)
                  } else {
                    setTimeout(() => rce.triggerServer('playerKill'), 1000)
                  }
                }}
              />
              <svg className='blur-bg' width="990" height="826" viewBox="0 0 990 826" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse opacity="0.87" cx="495" cy="413" rx="495" ry="413" fill="#FF1616" />
              </svg>
            </div>
            {deathState.fate === null && (
              <div className="btns-outcome">
                <BtnOutcome keyName="medic" handler={handleClickOutcome} />
                <BtnOutcome keyName="death" handler={handleClickOutcome} />
                <BtnOutcome keyName="chance" handler={handleClickOutcome} />
              </div>
            )}
            { deathState.fate !== null && (
              <InfoDeath killer={deathState.killer} chanceReborn={chanceReborn} timeDead={timeDead} />
            ) }
          </>
        )}
        { visibleWarning && <WarningScreen
          setVisible={(visible: boolean) => {
            setVisibleWarning(visible)
            if (!visible) {
              if (deathState.instant !== 'finish' && deathState.instant !== 'reborn') {
                sound.current.play()
              }
            }}
          }
        /> }
      </div>
    </>
  )
}

export default DeathPlayer