import { rce } from '../../utils/rce'
import { gui } from '../global'

export const showLoading = (duration) => {
  setTimeout(() => {
    mp.gui.cursor.show(false, false)
    mp.gui.cursor.visible = false
  }, 500)

  gui.execute(`window.App.loadingReducer.showLoading(${duration})`)
  mp.game.graphics.triggerScreenblurFadeIn(1000)
  mp.game.graphics.isScreenblurFadeRunning()
  mp.game.audio.playSoundFrontend(0, 'slow', 'SHORT_PLAYER_SWITCH_SOUND_SET', true);

  setTimeout(() => {
    mp.game.graphics.triggerScreenblurFadeOut(1000)
    mp.game.audio.stopSound(0)
  }, duration)
}

rce.register('client:showLoading', showLoading)
mp.console.logError('')