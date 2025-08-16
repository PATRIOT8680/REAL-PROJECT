import { rpc } from '../utils/rpc'

// rpc.register('playerVisible', (player: PlayerMp, toggle: boolean) => {
//   player.visible = toggle
//   player.setVariable('playerVisible', toggle)
// })

rpc.register('getIdPlayer', (player: PlayerMp) => {
  return player.id
})