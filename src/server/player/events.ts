import { rce } from '../utils/rce'
import torsoDataFemale from "../configs/besttorso_female.json";
import torsoDataMale from "../configs/besttorso_male.json";

rce.registerClientCef('getIdPlayer', (player: PlayerMp) => {
  return player.id
})

rce.registerClientCef('player:mute', (player: PlayerMp, state: boolean) => {
  player.setVariable('player_mute', state)
})

rce.registerClientCef('player:mute', (player: PlayerMp, state: boolean) => {
  player.setVariable('player_mute', state)
})

rce.registerClientCef('setPosChar', (player: PlayerMp, x, y, z, heading) => {
  player.position = new mp.Vector3(x, y, z)
  player.heading = heading
})

rce.registerClientCef('setSpawnChar', (player: PlayerMp, x, y, z, heading) => {
  player.spawn(new mp.Vector3(x, y, z))
  player.heading = heading
})