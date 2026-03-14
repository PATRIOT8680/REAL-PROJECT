import './assets/styles/compiled-css/OverMinimap.css'
import { memo, useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";

import MoneyV1 from "../../../components/MoneyV1/MoneyV1.tsx";

const OverMinimap = memo(() => {
  const hudState = useSelector((state: RootState) => state.hudReducer)
  const [voiceActive, setVoiceActive] = useState<boolean>(false)
  const [hideVoice, setHideVoice] = useState<boolean>(false)

  useEffect(() => {
    (window as any).voiceComponent = {
      enable: () => setVoiceActive(true),
      disable: () => {
        setHideVoice(true)
        const timeout = setTimeout(() => {
          setVoiceActive(false)
          setHideVoice(false)
          clearTimeout(timeout)
        }, 180)
      }
    }

    return () => {
      delete (window as any).voiceComponent
    }
  }, [])

  return (
    <>
      <div
        className="near-minimap"
        style={{
          position: 'absolute',
          bottom: `calc(${hudState.bottomY}vh + 7rem)`,
          left: `calc(${hudState.leftX}vw + 3.3rem)`,
        }}
      >
        <MoneyV1 />
        { voiceActive && (
          <div className={`circle-voice ${hideVoice ? 'hide' : ''}`}>
            <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.48 16.5271C20.48 15.8871 19.9906 15.3976 19.3506 15.3976C18.7106 15.3976 18.2212 15.8871 18.2212 16.5271C18.2212 20.9318 14.6447 24.5082 10.24 24.5082C5.83529 24.5082 2.25882 20.9318 2.25882 16.5271C2.25882 15.8871 1.76941 15.3976 1.12941 15.3976C0.489412 15.3976 0 15.8871 0 16.5271C0 21.76 3.91529 26.1647 9.11059 26.7294V29.7412H5.00706C4.36706 29.7412 3.87765 30.2306 3.87765 30.8706C3.87765 31.5106 4.36706 32 5.00706 32H15.4729C16.1129 32 16.6024 31.5106 16.6024 30.8706C16.6024 30.2306 16.1129 29.7412 15.4729 29.7412H11.3694V26.7294C16.5647 26.1647 20.48 21.76 20.48 16.5271Z" fill="#FFCA58"/>
              <path d="M10.2402 0C6.77666 0 3.95312 2.82353 3.95312 6.28706V16.4894C3.95312 19.9906 6.77666 22.7765 10.2402 22.8141C13.7037 22.8141 16.5272 19.9906 16.5272 16.5271V6.28706C16.5272 2.82353 13.7037 0 10.2402 0Z" fill="#FFCA58"/>
            </svg>
          </div>
        )}
      </div>
    </>
  )
})

export default OverMinimap