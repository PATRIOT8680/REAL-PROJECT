import { rpc } from '../utils/rpc'

rpc.register('client:playerDeath', (player: PlayerMp, [posX, posY, posZ] : [number, number, number]) => {
  if(player.vehicle) { 
    player.spawn(new mp.Vector3(posX, posY, posZ + 1))
  } else {
    player.spawn(new mp.Vector3(posX, posY, posZ))
  }

  player.playAnimation('amb@lo_res_idles@', 'world_human_bum_slumped_left_lo_res_base', 1, 15)
})


export const playerKill = async (player: PlayerMp) => {
  player.spawn(new mp.Vector3(-1221.006591796875, -100.9054946899414, 42.5238037109375))

  rpc.callClient(player, 'gui:cursorVisible', [false])
  rpc.callClient(player, 'ui:setPauseMenuActive', [true])
  rpc.callClient(player, 'ui:displayRadar', [true])
  rpc.callClient(player, 'player:freeze', [false])
  rpc.callClient(player, 'player:isCollision', [true])
  rpc.callClient(player, 'player:godmode', [false])

  await setTimeout(() => {
    rpc.callClient(player, 'graphics:stopAllScreenEffects')
  }, 4000)

  rpc.callClient(player, 'execute', ['window.App.deathReducer.showDeath(``, `finish`)'])
}

export const playerKnockout = (player: PlayerMp) => {
  player.health = 0

  if (player.vehicle) {
    rpc.callClient(player, 'player:isCollision', [true])
  } else {
    rpc.callClient(player, 'player:isCollision', [false])
  }

  rpc.callClient(player, 'gui:cursorVisible', [true])
  rpc.callClient(player, 'player:freeze', [true])
  rpc.callClient(player, 'ui:setPauseMenuActive', [false])
  rpc.callClient(player, 'ui:displayRadar', [false])
  rpc.callClient(player, 'graphics:startScreenEffect', ['DeathFailMPIn', 0, true])

  setTimeout(() => {
    rpc.callClient(player, 'player:godmode', [true])
  }, 200)
}


export const playerReborn = (player: PlayerMp) => {
  const playerPos = player.position

  player.health = 100
  player.stopAnimation()
  player.spawn(playerPos)

  rpc.callClient(player, 'ui:displayRadar', [true])
  rpc.callClient(player, 'player:freeze', [false])
  rpc.callClient(player, 'player:isCollision', [true])
  rpc.callClient(player, 'player:godmode', [false])
  rpc.callClient(player, 'ui:setPauseMenuActive', [true])
  rpc.callClient(player, 'graphics:stopAllScreenEffects')
  rpc.callClient(player, 'gui:cursorVisible', [false])
  rpc.callClient(player, 'execute', ['window.App.deathReducer.showDeath(``, `reborn`)'])

  setTimeout(() => {
    rpc.callClient(player, 'execute', [`window.App.chatReducer.showChat()`])
  }, 5000)
}

rpc.register('playerKill', (player: PlayerMp) => {
  playerKill(player)
})

rpc.register('playerKnockout', (player: PlayerMp) => {
  playerKnockout(player)
})

rpc.register('playerReborn', (player: PlayerMp) => {
  playerReborn(player)
})