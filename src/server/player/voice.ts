import { rce } from "../utils/rce";

rce.registerClientCef('client:voice:new', (player: PlayerMp, target: PlayerMp) => {
  console.log(`Войс создан! (${target.id})`)
  if (target) player.enableVoiceTo(target)
})

rce.registerClientCef('client:voice:deleted', (player: PlayerMp, target: PlayerMp) => {
  console.log(`Войс удален! (${target.id})`)
  if (target) player.disableVoiceTo(target)
})