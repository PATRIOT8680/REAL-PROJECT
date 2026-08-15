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
<<<<<<< HEAD
import './assets/fonts/Karantina/stylesheet.css'
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

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
import DevMenus from "./views/DevMenus/Index.tsx";
import BuyingBusiness from "./views/BuyingBusiness/BuyingBusiness.tsx";
import Shop24 from "./views/Shop24/Shop24.tsx";
<<<<<<< HEAD
import Bank from "./views/Bank/Bank.tsx";
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

// Components
import { useVisibleMenus } from "./hooks/useVisibleMenus"
import BtnAmbient from "./components/BtnAmbient/Index"
import ChangeLanguage from "./components/ChangeLanguage/Index"
import ModalComponent from './components/Modal/Index'
<<<<<<< HEAD
import Whitelist from "./views/Whitelist/Whitelist.tsx";
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

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
  const devMenusVisible = useSelector((state: RootState) => state.devMenusReducer.isVisible)
  const buyingBusinessVisible = useSelector((state: RootState) => state.buyingBusinessReducer.isVisible)
  const shop24Visible = useSelector((state: RootState) => state.shop24Reducer.isVisible)
<<<<<<< HEAD
  const whitelistVisible = useSelector((state: RootState) => state.whitelistReducer.isVisible)
  const bankVisible = useSelector((state: RootState) => state.bankReducer.isVisible)
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

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
      Dev: devMenusVisible,
      BuyingBusiness: buyingBusinessVisible,
<<<<<<< HEAD
      Shop24: shop24Visible,
      Whitelist: whitelistVisible,
      Bank: bankVisible,
=======
      Shop24: shop24Visible
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
    }

    const open = Object.entries(menus)
      .filter(([, visible]) => visible)
      .map(([name]) => name)

    return open
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

      let scale = (width / 1920) * 1.15

      scale = Math.min(scale, 2.2)
      scale = Math.max(scale, 1.0)

      document.documentElement.style.setProperty('--app-scale', scale.toString())
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    window.addEventListener('orientationchange', updateScale)

    return () => {
      window.removeEventListener('resize', updateScale)
      window.removeEventListener('orientationchange', updateScale)
    }
  }, [])
  
  return(
    <>
      <div className="server-info">
        <span className="text">dev-real-rp.ru (pre-dev: v0.0.5.1)</span>
        <span className="text">{playerInfoReducer.nickname ? ` • ${playerInfoReducer.nickname}` : ''}</span>
        <span className="text">{playerInfoReducer.sid ? ` #${playerInfoReducer.uid}` : ''}</span>
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
      { devMenusVisible && <DevMenus /> }
      { buyingBusinessVisible && <BuyingBusiness /> }
      { shop24Visible && <Shop24 /> }
<<<<<<< HEAD
      { whitelistVisible && <Whitelist /> }
      { bankVisible && <Bank /> }
=======
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c

      {/*<div className="language_ambients">*/}
      {/*  /!*{ shouldChangeLanguage && <ChangeLanguage /> }*!/*/}
      {/*  { shouldPlayAudio && <BtnAmbient playRandomAmbient={playRandomAmbient} stopAmbient={stopAmbient} ambientActive={ambientActive} setActiveAmbient={setAmbientActive} /> }*/}
      {/*</div>*/}
    </>
  )
}

export default App