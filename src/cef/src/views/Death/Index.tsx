import { FC, useState, useEffect, useRef, memo } from 'react'
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

import FinishHim from './pages/FinishHim'
import Reborn from './pages/Reborn'

import deathSound from './assets/audio/death_sound.mp3'

const DeathPlayer = () => {
  let ev: CustomEventHandler
  const deathState = useSelector((state: RootState) => state.deathReducer)
  const [chanceReborn, setChanceReporn] = useState<number>(34)
  const [timeDead, setTimeDead] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(120)
  const [luck, setLuck] = useState<boolean>(true)

  const sound = useRef<Howl>(new Howl({
    src: [deathSound],
    loop: true,
    volume: 0.11,
  }))

  useEffect(() => {
    if (deathState.instant !== 'finish' && deathState.instant !== 'reborn') sound.current.play()
    rce.triggerServer('getFormatedDateTime', true, true, false)
    
    ev = rce.register('getFormatedDateTime', (dateTime: string) => {
      setTimeDead(dateTime)
    })

    ev = rce.register('client:chanceReborn', (chance: number, luck: boolean) => {
      setChanceReporn(chance)
      setLuck(luck)
    })

    return () => {
      rce.clearRegister('server:getFormatedDateTime')
      rce.clearRegister('client:chanceReborn')
      sound.current.stop()
      sound.current.unload()
    }
  }, [])

  useEffect(() => {
    if (timeLeft < 10 && timeLeft > 0) {
      const fadeDuration = timeLeft * 1000
      sound.current.fade(sound.current.volume(), 0, fadeDuration)
    }

    if (timeLeft <= 0 && luck) {
      setTimeout(() => {
        rce.triggerServer('playerReborn')
      }, 1000)
    } else if (timeLeft <= 0 && !luck) {
      setTimeout(() => {
        rce.triggerServer('playerKill')
      }, 1000)
    }

  }, [timeLeft])

  return(
    <>
      <div className={`death-player ${deathState.instant !== null ? deathState.instant : 'null'}`}>
        { deathState.instant === null && (
          <>
            <div className="titles_timer">
              <Header />
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
            </div>
            { deathState.fate === null && <Fate setTimeLeft={setTimeLeft} />}
            { deathState.fate !== null && <InfoDeath killer={deathState.killer} chanceReborn={chanceReborn} timeDead={timeDead} /> }
          </>
        )}

        { deathState.instant === 'finish' && <FinishHim /> }
        { deathState.instant === 'reborn' && <Reborn /> }
        
      </div>
    </>
  )
}

export default memo(DeathPlayer)