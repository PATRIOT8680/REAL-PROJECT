import { rce } from "../utils/rce";

rce.registerClient('client:voice:new', (player: PlayerMp, targetId: number) => {
  const target = mp.players.at(targetId)

  if (target) {
    player.enableVoiceTo(target)
  }
})

rce.registerClient('client:voice:deleted', (player: PlayerMp, targetId: number) => {
  const target = mp.players.at(targetId)

  if (target) player.disableVoiceTo(target)
})