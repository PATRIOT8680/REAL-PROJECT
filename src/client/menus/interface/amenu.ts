import Keys from "../../utils/keys";
import {gui} from "../global";
import {rce} from "../../utils/rce";

let visibleAMenu = false

mp.keys.bind(Keys.VK_OEM_3, false, () => {
  if (!visibleAMenu) {
    rce.trigger('openAMenu')
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (visibleAMenu) {
    rce.trigger('closeAMenu')
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (visibleAMenu) {
    rce.trigger('closeAMenu')
  }
})

mp.keys.bind(Keys.VK_NUMPAD4, false, () => {
  if (visibleAMenu) {
    rce.triggerCef('amenu:ctrlPress', 'left')
  }
})

mp.keys.bind(Keys.VK_NUMPAD6, false, () => {
  if (visibleAMenu) {
    rce.triggerCef('amenu:ctrlPress', 'right')
  }
})

rce.registerAll('openAMenu', () => {
  visibleAMenu = true
  gui.execute(`window.App.adminMenuReducer.showAdminMenu()`)
  gui.execute(`window.App.chatReducer.hideChat()`)
  gui.execute(`window.App.hudReducer.hideHud()`)
  mp.game.ui.displayRadar(false)
  mp.game.ui.setPauseMenuActive(false)
  mp.gui.cursor.show(true, true)
})

rce.registerAll('closeAMenu', () => {
  visibleAMenu = false
  gui.execute(`window.App.adminMenuReducer.hideAdminMenu()`)
  gui.execute(`window.App.chatReducer.showChat()`)
  gui.execute(`window.App.hudReducer.showHud()`)
  mp.game.ui.displayRadar(true)
  mp.game.ui.setPauseMenuActive(true)
  mp.gui.cursor.show(false, false)
})