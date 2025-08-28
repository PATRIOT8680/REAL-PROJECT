import { rce } from '../utils/rce'

rce.registerClientCef('getIdPlayer', (player: PlayerMp) => {
  return player.id
})

rce.registerClientCef('player:mute', (player: PlayerMp, state: boolean) => {
  player.setVariable('player_mute', state)
})