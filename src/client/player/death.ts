import { rce } from '../utils/rce'
import { gui } from '../menus/global'
import Keys from '../utils/keys'

mp.keys.bind(Keys.VK_F7, true, () => {
  mp.players.local.setArmour(100)
})

const getRandomChance = (): [number, boolean] => {
  const percent = Math.floor(Math.random() * 66)
  const luck = Math.random() * 100 < percent
  return [percent, luck]
}

mp.events.add('playerDeath', async (player: PlayerMp, reason: number, killer: PlayerMp) => {
  const [chance, luck] = getRandomChance()

  rce.triggerServer('playerKnockout')
  gui.execute(`window.App.deathReducer.showDeath('Здесь будет никнейм', null)`)
  gui.execute(`window.App.chatReducer.hideChat()`)
  rce.triggerCef('client:chanceReborn', chance, luck)

  const playerPos = mp.players.local.position
  const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false)

  rce.triggerServer('client:playerDeath', [player.position.x, player.position.y, getGroundZ])
})

rce.registerAll('cef:death:selectedFate', (timeLeft: number) => {
  mp.gui.cursor.visible = false
})