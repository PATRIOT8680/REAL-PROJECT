import { rce } from "../utils/rce";

rce.registerClient('client:voice:new', (player: PlayerMp, target: PlayerMp) => {
  if (target) player.enableVoiceTo(target)
})

rce.registerClient('client:voice:deleted', (player: PlayerMp, target: PlayerMp) => {
  if (target) player.disableVoiceTo(target)
})