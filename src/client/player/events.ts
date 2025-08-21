import { rce } from '../utils/rce'

// PLAYER
rce.registerServer('player:freeze', (toggle: boolean) => {
  mp.players.local.freezePosition(toggle)
})

rce.registerServer('player:isCollision', (toggle: boolean) => {
  mp.players.local.setCollision(toggle, toggle)
})

rce.registerServer('player:godmode', (toggle: boolean) => {
  mp.players.local.setInvincible(toggle)
})


// GRAPHICS
rce.registerServer('graphics:startScreenEffect', (name: string, duration: number, looped: boolean) => {
  mp.game.graphics.startScreenEffect(name, duration, looped)
})

rce.registerServer('graphics:stopAllScreenEffects', () => {
  mp.game.graphics.stopAllScreenEffects()
})

// UI
rce.registerServer('ui:displayRadar', (toggle: boolean) => {
  mp.game.ui.displayRadar(toggle)
})

rce.registerServer('ui:setPauseMenuActive', (toggle: boolean) => {
  mp.game.ui.setPauseMenuActive(toggle)
})

// GUI
rce.registerServer('gui:cursorVisible', (toggle: boolean) => {
  mp.gui.cursor.visible = toggle
})

rce.registerServer('getId', () => {
  return mp.players.local.remoteId
})