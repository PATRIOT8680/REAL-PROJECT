import { rpc } from '../utils/rpc'

mp.events.add('playerReady', (player: PlayerMp) => {
  rpc.callBrowser('client:setActiveAmbient', [mp.storage.data.activeAmbient])
  mp.game.gameplay.setFadeOutAfterDeath(false)
  mp.game.ui.displayCash(false)
  mp.game.ui.displayAreaName(false)
  mp.game.ui.displayAmmoThisFrame(false)
  rpc.call('execute', [`window.App.playerInfoReducer.setID(${mp.players.local.remoteId})`])

  if (mp.storage.data.language !== undefined) {
    rpc.callBrowser('client:setLanguage', [mp.storage.data.language])
  } else {
    rpc.callBrowser('client:setLanguage', ['ru'])
  }
})