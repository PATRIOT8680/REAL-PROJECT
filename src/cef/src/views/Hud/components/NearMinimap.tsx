import './assets/styles/compiled-css/NearMinimap.css'
import { memo, useState, useEffect } from 'react'

import Money from "./Money.tsx";

const NearMinimap = memo(() => {
  const [voiceActive, setVoiceActive] = useState<boolean>(false)

  useEffect(() => {
    (window as any).voiceComponent = {
      enable: () => setVoiceActive(true),
      disable: () => setVoiceActive(false)
    }

    return () => {
      delete (window as any).voiceComponent
    }
  }, [])

  return (
    <>
      <div className="near-minimap">
        { voiceActive ? (
            <span className={`text ${voiceActive && 'active'}`}>Войс ВКЛЮЧЕН</span>
        ) : (
            <span className="text">Войс ОТКЛЮЧЕН</span>
        ) }

        <Money />

      </div>
    </>
  )
})

export default NearMinimap