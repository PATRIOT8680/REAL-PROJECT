import { rce } from '../utils/rce'
import { gui } from '../menus/global'
import { showHud } from "../menus/interface/hud";
import Keys from '../utils/keys'

const lcplayer: PlayerMp = mp.players.local

mp.keys.bind(Keys.VK_F7, true, () => {
  mp.players.local.setArmour(100)
})

const getRandomChance = (): [number, boolean] => {
  const percent = Math.floor(Math.random() * 40)
  const luck = Math.random() * 100 < percent
  return [percent, luck]
}

mp.events.add('playerDeath', async (player: PlayerMp, reason: number, killer: PlayerMp) => {
  const [chance, luck] = getRandomChance()
  let killerName: string = null
  let killerSid: number = null
  const playerPos = lcplayer.position
  const getGroundZ = mp.game.gameplay.getGroundZFor3dCoord(playerPos.x, playerPos.y, playerPos.z, true, false)

  if (killer) {
    killerName = await rce.callServer('dataOnlineUser:getField', killer.id, 'nickName')
    killerSid = await rce.callServer('dataOnlineUser:getField', killer.id, 'sid')
  }

  rce.triggerServer('playerKnockout')
  rce.triggerServer('client:playerDeath', [player.position.x, player.position.y, getGroundZ])

  const killerInfo = (killerName && killerSid) !== null ? `${killerName} #${killerSid}` : ''

  gui.execute(`window.App.deathReducer.showDeath('${killerInfo}', null)`)
  gui.execute(`window.App.chatReducer.hideChat()`)
  gui.execute(`window.App.hudReducer.hideHud()`)
  rce.triggerCef('client:chanceReborn', chance, luck)

  if (!lcplayer.vehicle) lcplayer.setCollision(false, false)

  lcplayer.freezePosition(true)
  lcplayer.setInvincible(true)
  mp.gui.cursor.visible = true
  mp.game.ui.setPauseMenuActive(false)
  mp.game.ui.displayRadar(false)
  mp.game.graphics.startScreenEffect('DeathFailMPIn', 0, true)
})

const playerRevive = (type: 'kill' | 'reborn') => {
  if (type === 'reborn') rce.triggerServer('playerReborn')
  else rce.triggerServer('playerKill')

  gui.execute(`window.App.chatReducer.showChat()`)
  gui.execute(`window.App.deathReducer.hideDeath()`)

  lcplayer.freezePosition(false)
  lcplayer.setInvincible(false)

  mp.gui.cursor.visible = false
  mp.game.ui.setPauseMenuActive(true)
  mp.game.ui.displayRadar(true)
  mp.game.graphics.stopAllScreenEffects()
  showHud()

  if(lcplayer.isCollisonDisabled()) lcplayer.setCollision(true, true)
}

rce.registerAll('playerRevive', (type: 'kill' | 'reborn') => {
  playerRevive(type)
})

rce.registerAll('cef:death:selectedFate', () => {
  mp.gui.cursor.visible = false
})