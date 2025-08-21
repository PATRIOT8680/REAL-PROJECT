import { rce } from '../utils/rce'

rce.registerClient('toggleNoclip', (player: PlayerMp, toggle: boolean) => {
  if (toggle) player.alpha = 50
  else player.alpha = 255
})