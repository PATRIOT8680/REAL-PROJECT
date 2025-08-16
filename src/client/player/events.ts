import { rpc } from '../utils/rpc'

// PLAYER
rpc.register('player:freeze', (toggle: boolean) => {
  mp.players.local.freezePosition(toggle)
})

rpc.register('player:isCollision', (toggle: boolean) => {
  mp.players.local.setCollision(toggle, toggle)
})

rpc.register('player:godmode', (toggle: boolean) => {
  mp.players.local.setInvincible(toggle)
})


// GRAPHICS
rpc.register('graphics:startScreenEffect', (name: string, duration: number, looped: boolean) => {
  mp.game.graphics.startScreenEffect(name, duration, looped)
})

rpc.register('graphics:stopAllScreenEffects', () => {
  mp.game.graphics.stopAllScreenEffects()
})

// UI
rpc.register('ui:displayRadar', (toggle: boolean) => {
  mp.game.ui.displayRadar(toggle)
})

rpc.register('ui:setPauseMenuActive', (toggle: boolean) => {
  mp.game.ui.setPauseMenuActive(toggle)
})

// GUI
rpc.register('gui:cursorVisible', (toggle: boolean) => {
  mp.gui.cursor.visible = toggle
})

rpc.register('getId', () => {
  return mp.players.local.remoteId
})