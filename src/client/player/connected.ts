import { rce } from '../utils/rce'
import { gui } from '../menus/global'


mp.events.add('playerReady', (player: PlayerMp) => {
  rce.triggerCef('client:setActiveAmbient', mp.storage.data.activeAmbient)
  mp.game.gameplay.setFadeOutAfterDeath(false)
  mp.game.ui.displayCash(false)
  mp.game.ui.displayAreaName(false)
  mp.game.ui.displayAmmoThisFrame(false)
  gui.execute(`window.App.playerInfoReducer.setID(${mp.players.local.remoteId})`)

  if (mp.storage.data.language !== undefined) {
    rce.triggerCef('client:setLanguage', mp.storage.data.language)
  } else {
    rce.triggerCef('client:setLanguage', 'ru')
  }
})