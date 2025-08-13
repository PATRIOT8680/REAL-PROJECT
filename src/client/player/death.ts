import { rpc } from '../utils/rpc' 
import Keys from '../utils/keys'

mp.keys.bind(Keys.VK_F2, true, () => {
  rpc.callServer('playerKnockout')
})

mp.keys.bind(Keys.VK_F6, true, () => {
  rpc.callServer('playerReborn')
})

mp.keys.bind(Keys.VK_F7, true, () => {
  mp.players.local.setArmour(100)
})

mp.keys.bind(Keys.VK_F5, true, () => {
  const playerPos = mp.players.local.position
  mp.vehicles.new(mp.game.joaat("22stinger"), new mp.Vector3(playerPos.x + 2, playerPos.y, playerPos.z), 
    {
      numberPlate: "PATRIOT",
      color: [[22, 21, 35],[22, 21, 35]]
    });
})


let timeDeath: string = ''

const getRandomChance = (): [number, boolean] => {
  const percent = Math.floor(Math.random() * 66)
  const luck = Math.random() * 100 < percent
  return [percent, luck]
}

mp.events.add('playerDeath', async (player: PlayerMp, reason: number, killer: PlayerMp) => {
  const [chance, luck] = getRandomChance()
  timeDeath = await rpc.callServer('client:getFormatedDateTime', [true, true, true]);

  rpc.callServer('playerKnockout')
  rpc.call('execute', [`window.App.deathReducer.showDeath('Здесь будет никнейм', null)`])
  rpc.call('execute', [`window.App.chatReducer.hideChat()`])
  rpc.callBrowser('client:chanceReborn', [chance, luck])

  const playerPos = mp.players.local.position
  const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false)

  rpc.callServer('client:playerDeath', [[player.position.x, player.position.y, getGroundZ]])
})


rpc.register('server:getFormatedDateTime', (time: string) => {
  timeDeath = time
})

rpc.register('cef:death:selectedFate', () => {
  mp.gui.cursor.visible = false
})