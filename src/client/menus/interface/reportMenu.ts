import Keys from "../../utils/keys";
import {gui} from "../global";
import {rce} from "../../utils/rce";

let visibleAMenu = false

mp.keys.bind(Keys.VK_F6, false, () => {
  if (!visibleAMenu) {
    rce.trigger('cef:openReportMenu')
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (visibleAMenu) {
    rce.trigger('cef:closeReportMenu')
  }
})

rce.registerAll('cef:openReportMenu', () => {
  visibleAMenu = true
  gui.execute(`window.App.playerReportsReducer.showPlayerReports()`)
  gui.execute(`window.App.chatReducer.hideChat()`)
  gui.execute(`window.App.hudReducer.hideHud()`)
  mp.game.ui.displayRadar(false)
  mp.game.ui.setPauseMenuActive(false)
  mp.gui.cursor.show(true, true)
})

rce.registerAll('cef:closeReportMenu', () => {
  visibleAMenu = false
  gui.execute(`window.App.playerReportsReducer.hidePlayerReports()`)
  gui.execute(`window.App.chatReducer.showChat()`)
  gui.execute(`window.App.hudReducer.showHud()`)
  mp.game.ui.displayRadar(true)
  mp.game.ui.setPauseMenuActive(true)
  mp.gui.cursor.show(false, false)
})