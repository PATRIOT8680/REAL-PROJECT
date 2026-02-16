import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import useMenuAmbients from './hooks/useMenuAmbients'
import { RootState } from "./reducers/rootReducer"
import { useNotify } from "./components/Notify/NotifyProvider"
import './assets/styles/compiled-css/Index.css'
import { rce } from "./modules/rce.ts"
import { CustomEventHandler } from "../../shared/CustomEventBase.ts";
import { i18n } from "./locales"

// Fonts
import './assets/fonts/Another-Danger/stylesheet.css'
import './assets/fonts/MBF-Moonlander/stylesheet.css'
import './assets/fonts/Montserrat/stylesheet.css'
import './assets/fonts/Monument/stylesheet.css'
import './assets/fonts/PF-Dindisplay-Pro/stylesheet.css'
import './assets/fonts/Ponter/stylesheet.css'
import './assets/fonts/Rothek/stylesheet.css'
import './assets/fonts/Bellflower/stylesheet.css'
import './assets/fonts/GhotamPro/stylesheet.css'
import './assets/fonts/Frutiger/stylesheet.css'
import './assets/fonts/Ubuntu/stylesheet.css'
import './assets/fonts/BebasNeue/stylesheet.css'
import './assets/fonts/Manrope/stylesheet.css'
import './assets/fonts/DrukWideCyr/stylesheet.css'

// Menus
import Auth from "./views/Auth/Index"
import Chat from "./views/Chat/Index"
import Loading from "./views/Loading/Index"
import Welcome from "./views/Welcome/Index"
import Rent from "./views/Rent/Index"
import DeathPlayer from "./views/Death/Index"
import Hud from "./views/Hud/Index"
import SelectChar from "./views/SelectChar/Index.tsx"
import CreateChar from "./views/CreateChar/Index.tsx"
import AdminMenu from "./views/AdminMenu/Index.tsx";
import PlayerReports from "./views/PlayerReports/Index.tsx";
import SpawnMenu from "./views/Spawn/Index.tsx";
import Inventory from "./views/Inventory/Index.tsx";
import WaitingLoader from "./views/WaitingLoader/Index.tsx";
import Interaction from './views/Interaction/Index.tsx'
import Offer from './views/Offer/Index.tsx'

// Components
import { useVisibleMenus } from "./hooks/useVisibleMenus"
import BtnAmbient from "./components/BtnAmbient/Index"
import ChangeLanguage from "./components/ChangeLanguage/Index"
import ModalComponent from './components/Modal/Index'

const App = () => {
  const dispatch = useDispatch()
  let ev: CustomEventHandler
  const { shouldPlayAudio } = useVisibleMenus()

  const { playRandomAmbient, stopAmbient } = useMenuAmbients()
  const [ambientActive, setAmbientActive] = useState(false);

  const sendNotify = useNotify()
  const authVisible = useSelector((state: RootState) => state.authReducer.isVisible)
  const chatVisible = useSelector((state: RootState) => state.chatReducer.isVisible)
  const welcomeVisible = useSelector((state: RootState) => state.welcomeReducer.isVisible)
  const hudVisible = useSelector((state: RootState) => state.hudReducer.isVisible)
  const rentVisible = useSelector((state: RootState) => state.rentReducer.isVisible)
  const selectCharVisible = useSelector((state: RootState) => state.selectCharReducer.isVisible)
  const createCharVisible = useSelector((state: RootState) => state.createCharReducer.isVisible)
  const adminMenuVisible = useSelector((state: RootState) => state.adminMenuReducer.isVisible)
  const playerReportsVisible = useSelector((state: RootState) => state.playerReportsReducer.isVisible)
  const spawnVisible = useSelector((state: RootState) => state.spawnReducer.isVisible)
  const inventoryState = useSelector((state: RootState) => state.inventoryReducer)
  const interactionVisible = useSelector((state: RootState) => state.interactionReducer.isVisible)

  const sendNotifyReducer = useSelector((state: RootState) => state.sendNotifyReducer)
  const deathReducer = useSelector((state: RootState) => state.deathReducer)
  const playerInfoReducer = useSelector((state: RootState) => state.playerInfoReducer)

  rce.registerCallable('getOpenMenus', () => {
    const menus = {
      Auth: authVisible,
      Chat: chatVisible,
      Welcome: welcomeVisible,
      Rent: rentVisible,
      Death: deathReducer.isVisible,
      HUD: hudVisible,
      SelectChar: selectCharVisible,
      CreateChar: createCharVisible,
      AdminMenu: adminMenuVisible,
      Reports: playerReportsVisible,
      Spawn: spawnVisible,
      Inventory: inventoryState.isVisible,
      Interaction: interactionVisible,
    }

    let open = Object.entries(menus)
      .filter(([, visible]) => visible)
      .map(([name]) => name)

    if (!Array.isArray(open)) open = open ? [open] : ['none']

    const jsonResult = JSON.stringify(open)

    console.log(`[CEF] Готовим отправку JSON: ${jsonResult}`)

    return jsonResult
  })

  useEffect(() => {
    ev = rce.register('client:setLanguage', (lang: string) => {
      i18n.changeLanguage(lang)
    })

    ev = rce.register('client:setActiveAmbient', (toggle: boolean) => {
      setAmbientActive(toggle)
    })

    return () => {
      ev.destroy()
    }
  }, [])

  useEffect(() => {
    if (sendNotifyReducer) {
      sendNotify({ typeNotify: sendNotifyReducer.typeNotify, msg: sendNotifyReducer.msg, duration: sendNotifyReducer.duration, pos: sendNotifyReducer.pos })
    }
  }, [sendNotifyReducer])

  useEffect(() => {
    if (shouldPlayAudio && ambientActive) {
      playRandomAmbient();
    } else {
      stopAmbient();
    }
  }, [shouldPlayAudio, ambientActive]);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      let scale = width / 1920

      scale = Math.min(scale, 2)
      scale = Math.max(scale, 0.8)

      document.documentElement.style.setProperty('--app-scale', scale.toString())
    }

    updateScale()
    window.addEventListener('resize', updateScale)

    return () => {
      window.removeEventListener('resize', updateScale)
    }
  }, [])
  
  return(
    <>
      <div className="server-info">
        <span className="text">dev-real-rp.ru (pre-dev: v0.0.5.1)</span>
        <span className="text">{playerInfoReducer.nickname ? ` • ${playerInfoReducer.nickname}` : ''}</span>
        <span className="text">{playerInfoReducer.sid ? ` #${playerInfoReducer.sid}` : ''}</span>
        <span className="text"> • ID: {playerInfoReducer.id}</span>
      </div>
      { authVisible && <Auth /> }
      { chatVisible && <Chat /> }
      { welcomeVisible && <Welcome /> }
      <Loading />
      { rentVisible && <Rent /> }
      { deathReducer.isVisible && <DeathPlayer />  }
      { hudVisible && <Hud /> }
      { selectCharVisible && <SelectChar /> }
      { createCharVisible && <CreateChar /> }
      { adminMenuVisible && <AdminMenu /> }
      { playerReportsVisible && <PlayerReports /> }
      { spawnVisible && <SpawnMenu /> }
      { inventoryState.isVisible && <Inventory haveDonateSlots={inventoryState.haveDonatSlots} /> }
      <WaitingLoader />
      { interactionVisible && <Interaction /> }
      <Offer />

      {/*<div className="language_ambients">*/}
      {/*  /!*{ shouldChangeLanguage && <ChangeLanguage /> }*!/*/}
      {/*  { shouldPlayAudio && <BtnAmbient playRandomAmbient={playRandomAmbient} stopAmbient={stopAmbient} ambientActive={ambientActive} setActiveAmbient={setAmbientActive} /> }*/}
      {/*</div>*/}
    </>
  )
}

export default App