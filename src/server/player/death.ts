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
  player.spawn(new mp.Vector3(275.446, -1361.11, 24.5378))
  player.setVariable('player_knockout', false)
}

export const playerKnockout = (player: PlayerMp) => {
  player.health = 0
  player.setVariable('player_knockout', true)
}


export const playerReborn = (player: PlayerMp) => {
  const playerPos = player.position

  player.health = 100
  player.stopAnimation()
  player.spawn(playerPos)
  player.setVariable('player_knockout', false)
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