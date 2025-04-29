import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "./reducers/rootReducer"
import { visibleMenu } from "./hooks/visibleMenu"
import { useNotify } from "./components/Notify/NotifyProvider"
import './assets/styles/compiled-css/Index.css'
import { rpc } from "./main"

// Fonts
import './assets/fonts/Another-Danger/stylesheet.css'
import './assets/fonts/MBF-Moonlander/stylesheet.css'
import './assets/fonts/Montserrat/stylesheet.css'
import './assets/fonts/Monument/stylesheet.css'
import './assets/fonts/PF-Dindisplay-Pro/stylesheet.css'
import './assets/fonts/Ponter/stylesheet.css'

import Auth from "./views/Auth/Index"
import Chat from "./views/Chat/Index"
import Loading from "./views/Loading/Index"
import Welcome from "./views/Welcome/Index"
import Rent from "./views/Rent/Index"

const App = () => {
  const dispatch = useDispatch()

  const [sid, setSid] = useState('')
  const [playerName, setPlayerName] = useState('Patriot Adminov')
  const [playerId, setPlayerId] = useState<number | undefined>(undefined)

  const sendNotify = useNotify()
  const authVisible = useSelector((state: RootState) => state.authReducer.isVisible)
  const chatVisible = useSelector((state: RootState) => state.chatReducer.isVisible)
  const welcomeVisible = useSelector((state: RootState) => state.welcomeReducer.isVisible)
  const sendNotifyReducer = useSelector((state: RootState) => state.sendNotifyReducer)

  rpc.register('server:player:local:info', (sid: string, id: number) => {
    setSid(sid)
    setPlayerId(id)
  })

  useEffect(() => {
    visibleMenu(dispatch)
  }, [dispatch])

  useEffect(() => {
    if (sendNotifyReducer) {
      sendNotify({ typeNotify: sendNotifyReducer.typeNotify, msg: sendNotifyReducer.msg, duration: sendNotifyReducer.duration, pos: sendNotifyReducer.pos })
    }
  }, [sendNotifyReducer])
  
  return(
    <>
      <div className="server-info">
        <span className="text">REDSTAR GAMEMODE (dev: v0.0.4)</span>
        <span className="text">{playerName && ` • ${playerName}`} {sid && `(#${sid})`} </span>
        <span className="text">{playerId !== undefined && ` • ID: ${playerId}`}</span>
      </div>
      { authVisible && <Auth /> }
      { chatVisible && <Chat /> }
      { welcomeVisible && <Welcome /> }
      <Loading />
      {/*<Rent />*/}
    </>
  )
}

export default App