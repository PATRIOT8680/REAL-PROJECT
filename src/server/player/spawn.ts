import { registerCMD } from '../menus/chat'
import { send } from '../menus/chat'
import { rpc } from '../utils/rpc'

mp.events.add('playerJoin', (player) => {
  player.dimension = player.id
  console.log(`${player.socialClub} подключился!!! dim: ${player.dimension}`)
  mp.events.call('emitCef', 'test', 'Test text', 'тест')
  player.call('bulb', 'text')
  player.model = 0x89768941
  player.spawn(new mp.Vector3(3335.050537109375, 5162.82177734375, 18.2938232421875))
  player.rotation = new mp.Vector3(0, 0, 144.56692336865447)
  player.health = 100
})