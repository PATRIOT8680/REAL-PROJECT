import { rce } from '../utils/rce'

rce.registerClientAndCef('getIdPlayer', (player: PlayerMp) => {
  return player.id
})

rce.registerClientAndCef('player:mute', (player: PlayerMp, state: boolean) => {
  player.setVariable('player_mute', state)
})