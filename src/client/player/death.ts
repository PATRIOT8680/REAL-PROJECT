import { rce } from '../utils/rce'
import { gui } from '../menus/global'
import Keys from '../utils/keys'

mp.keys.bind(Keys.VK_F2, true, () => {
  rce.triggerServer('playerKnockout')
})

mp.keys.bind(Keys.VK_F6, true, () => {
  rce.triggerServer('playerReborn')
  setTimeout(() => {
    gui.execute('window.App.chatReducer.showChat()')
  }, 6000)
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
  mp.console.logInfo('Сдох *_*')
  const [chance, luck] = getRandomChance()
  timeDeath = await rce.callServer('getFormatedDateTime', true, true, true);
  mp.console.logInfo('Сдох *_* 2')

  rce.triggerServer('playerKnockout')
  gui.execute(`window.App.deathReducer.showDeath('Здесь будет никнейм', null)`)
  gui.execute(`window.App.chatReducer.hideChat()`)
  rce.triggerCef('client:chanceReborn', chance, luck)

  const playerPos = mp.players.local.position
  const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false)

  rce.triggerServer('client:playerDeath', [player.position.x, player.position.y, getGroundZ])
})


rce.registerServer('getFormatedDateTime', (time: string) => {
  timeDeath = time
})

rce.registerAll('cef:death:selectedFate', (timeLeft: number) => {
  mp.gui.cursor.visible = false
})