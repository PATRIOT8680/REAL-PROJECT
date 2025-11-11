import { rce } from '../utils/rce'

rce.registerClient('client:playerDeath', (player: PlayerMp, [posX, posY, posZ] : [number, number, number]) => {
  if(player.vehicle) { 
    player.spawn(new mp.Vector3(posX, posY, posZ + 1))
  } else {
    player.spawn(new mp.Vector3(posX, posY, posZ))
  }

  player.playAnimation('amb@lo_res_idles@', 'world_human_bum_slumped_left_lo_res_base', 1, 15)
})

export const playerKill = async (player: PlayerMp) => {
  player.spawn(new mp.Vector3(-1221.006591796875, -100.9054946899414, 42.5238037109375))
  player.setVariable('player_knockout', false)

  rce.triggerClient(player, 'gui:cursorVisible', false)
  rce.triggerClient(player, 'ui:setPauseMenuActive', true)
  rce.triggerClient(player, 'ui:displayRadar', true)
  rce.triggerClient(player, 'player:freeze', false)
  rce.triggerClient(player, 'player:isCollision', true)
  rce.triggerClient(player, 'player:godmode', false)

  await setTimeout(() => {
    rce.triggerClient(player, 'graphics:stopAllScreenEffects')
  }, 4000)


  rce.triggerClient(player, 'execute', ['window.App.deathReducer.showDeath(``, `finish`)'])
}

export const playerKnockout = (player: PlayerMp) => {
  player.health = 0
  player.setVariable('player_knockout', true)

  if (player.vehicle) {
    rce.triggerClient(player, 'player:isCollision', true)
  } else {
    rce.triggerClient(player, 'player:isCollision', false)
  }

  rce.triggerClient(player, 'gui:cursorVisible', true)
  rce.triggerClient(player, 'player:freeze', true)
  rce.triggerClient(player, 'ui:setPauseMenuActive', false)
  rce.triggerClient(player, 'ui:displayRadar', false)
  rce.triggerClient(player, 'graphics:startScreenEffect', 'DeathFailMPIn', 0, true)

  setTimeout(() => {
    rce.triggerClient(player, 'player:godmode', true)
  }, 200)
}


export const playerReborn = (player: PlayerMp) => {
  const playerPos = player.position

  player.health = 100
  player.stopAnimation()
  player.spawn(playerPos)
  player.setVariable('player_knockout', false)

  rce.triggerClient(player, 'ui:displayRadar', true)
  rce.triggerClient(player, 'player:freeze', false)
  rce.triggerClient(player, 'player:isCollision', true)
  rce.triggerClient(player, 'player:godmode', false)
  rce.triggerClient(player, 'ui:setPauseMenuActive', true)
  rce.triggerClient(player, 'graphics:stopAllScreenEffects')
  rce.triggerClient(player, 'gui:cursorVisible', false)
  rce.triggerClient(player, 'execute', 'window.App.deathReducer.showDeath(``, `reborn`)')

  /*setTimeout(() => {
    rce.triggerClient(player, 'execute', `window.App.chatReducer.showChat()`)
  }, 5000)*/
}

rce.registerClientCef('playerKill', (player: PlayerMp) => {
  playerKill(player)
})

rce.registerClientCef('playerKnockout', (player: PlayerMp) => {
  playerKnockout(player)
})

rce.registerClientCef('playerReborn', (player: PlayerMp) => {
  playerReborn(player)
})