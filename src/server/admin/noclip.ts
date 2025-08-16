import { rpc } from '../utils/rpc'

rpc.register('toggleNoclip', (player: PlayerMp, toggle: boolean) => {
  if (toggle) player.alpha = 50
  else player.alpha = 255
})