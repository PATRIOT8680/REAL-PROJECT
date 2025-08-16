import { rpc } from '../utils/rpc'

rpc.register('client:voice:new', (player: PlayerMp, target: PlayerMp) => {
  if (target) player.enableVoiceTo(target)
})

rpc.register('client:voice:deleted', (player: PlayerMp, target: PlayerMp) => {
  if (target) player.disableVoiceTo(target)
})