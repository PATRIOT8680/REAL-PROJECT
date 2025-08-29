import { rce } from "../utils/rce"

export const selectChar = (player: PlayerMp) => {
  rce.triggerClient(player, 'moveSkyCamera', 'up', 2)
  rce.triggerClient(player, 'player:freeze', true)
  rce.triggerClient(player, 'server:showSelectChar')

  //setTimeout(() => {
    player.position = new mp.Vector3(-142.221, -599.458, 211.775)
    player.heading = 30.854
  //}, 2000)
  

  setTimeout(() => {
    rce.triggerClient(player, 'moveSkyCamera', 'down')
  }, 5000)
}