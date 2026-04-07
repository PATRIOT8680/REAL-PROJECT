import { rce } from "../../utils/rce";
import { gui } from "../global";
import { showHud } from "./hud";

rce.registerServer('openDevMenu', () => {
  mp.gui.cursor.visible = true
  mp.game.ui.displayRadar(false)
  mp.game.graphics.triggerScreenblurFadeIn(1000)
  mp.game.graphics.isScreenblurFadeRunning()
  gui.execute('window.App.hudReducer.hideHud()')
})

rce.registerAll('closeDevMenu', () => {
  mp.gui.cursor.visible = false
  mp.game.ui.displayRadar(true)
  mp.game.graphics.triggerScreenblurFadeOut(1000)
  showHud()
})