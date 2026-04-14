import { rce } from "../../utils/rce";
import { gui } from "../global";
import { showHud } from "./hud";
import Keys from '../../utils/keys'

let isKeyDownE = 'disabled'
let businessData = undefined

rce.registerServer('businessColshape', (status, data) => {
  if (status === 'enabled') {
    isKeyDownE = 'enabled'
    businessData = data
  } else {
    handleHideInfoBusiness()
    isKeyDownE = 'disabled'
    businessData = null
  }
})

rce.registerAll('closeInfoBusinessMenu', () => {
  handleHideInfoBusiness()
})

mp.keys.bind(Keys.VK_E, false, () => {
  if (isKeyDownE === 'enabled') handleShowInfoBusiness()
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (businessData) handleHideInfoBusiness()
})

const handleShowInfoBusiness = () => {
  mp.gui.cursor.visible = true
  mp.game.ui.displayRadar(false)
  mp.game.graphics.triggerScreenblurFadeIn(600)
  mp.game.graphics.isScreenblurFadeRunning()
  gui.execute('window.App.chatReducer.hideChat()')
  gui.execute('window.App.hudReducer.hideHud()')
  gui.execute(`window.App.buyingBusinessReducer.showBuyingBusiness(${JSON.stringify(businessData)})`)
}

const handleHideInfoBusiness = () => {
  mp.gui.cursor.visible = false
  mp.game.ui.displayRadar(true)
  mp.game.graphics.triggerScreenblurFadeOut(600)
  showHud()
  gui.execute('window.App.chatReducer.showChat()')
  gui.execute(`window.App.buyingBusinessReducer.hideBuyingBusiness()`)
}