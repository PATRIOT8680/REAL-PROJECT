import './assets/styles/compiled-css/NearMinimap.css'
import { memo, useState, useEffect } from 'react'

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
        <button className="changeActive" onClick={() => setVoiceActive(!voiceActive)}>Сменить активность войса</button>
        { voiceActive ? (
            <span className={`text ${voiceActive && 'active'}`}>Войс ВКЛЮЧЕН</span>
        ) : (
            <span className="text">Войс ОТКЛЮЧЕН</span>
        ) }
      </div>
    </>
  )
})

export default NearMinimap