import Keys from '../utils/keys'
import { drawSprite } from "../utils/drawSprite"
import { rce } from '../utils/rce'

const maxDistance = 20*20
let width = 0.032
const height = 0.006
let visibleNametags: boolean = true
let playerTarget: PlayerMp = null
let playerAimAt = null
const playerSids = new Map<number, number>();

mp.nametags.enabled = false

const requestPlayerSid = async (player: PlayerMp) => {
  const statID = await rce.callServer('getDataAccount', 'sid', player.remoteId)
  playerSids.set(player.remoteId, statID)
}

mp.keys.bind(Keys.VK_F9, false, () => {
  visibleNametags = !visibleNametags
})

mp.events.add('render', (nametags) => {
  const graphics = mp.game.graphics
  const screenRes = graphics.getScreenResolution()
  playerAimAt = mp.game.player.getEntityIsFreeAimingAt()
  playerTarget = mp.players.local

  if (visibleNametags) {
    nametags.forEach(nametag => {
      let [player, x, y, distance] = nametag
      const sid = playerSids.get(player.remoteId)

      if (global.loginPlayer && (sid === null || sid === undefined)) {
        requestPlayerSid(player)
      }

      if(distance <= maxDistance) {
        const distanceFactor = Math.min(1, distance / maxDistance)
        const liftAmount = 0.04 * distanceFactor
        const textScale = Math.max(0.7, 1 - distanceFactor * 0.3)
        const textY = y - liftAmount

        mp.game.graphics.drawText(`Гражданин #${sid + 101522}`, [x, textY + 0.05],
          {
            font: 0,
            color: [255, 255, 255, distance > 15*15 ? 180 : 255],
            scale: [textScale * 0.25, textScale * 0.25],
            outline: true
          }
        )

        mp.game.graphics.drawText(`(ID: ${player.remoteId + 567})`, [x, textY + 0.03],
          {
            font: 0,
            color: [255, 255, 255, distance > 15*15 ? 180 : 255],
            scale: [textScale * 0.25, textScale * 0.25],
            outline: true
          }
        )

        if (player.getVariable('player_knockout')) {
          drawSprite('commonmenutu', 'team_deathmatch', [player.isVoiceActive ? x + 0.006 : x, textY + 0.018], [textScale * 0.8, textScale * 0.8], 0, [255, 13, 74, 255])

          mp.game.graphics.drawText('Без сознания...', [x, textY + 0.073],
            {
              font: 4,
              color: [255, 13, 74, 255],
              scale: [textScale * 0.35, textScale * 0.35],
              outline: true
            }
          )
        }

        if (player.getVariable('player_mute')) return drawSprite('mpleaderboard', 'leaderboard_audio_mute', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255])

        if (player.isVoiceActive) {
          if (distance > 15*15) {
            drawSprite('mpleaderboard', 'leaderboard_audio_1', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255])
          } else if (distance < 15*15 && distance > 10*10) {
            drawSprite('mpleaderboard', 'leaderboard_audio_2', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255])
          } else if (distance < 10*10) {
            drawSprite('mpleaderboard', 'leaderboard_audio_3', [player.getVariable('player_knockout') ? x - 0.006 : x, textY + 0.018], [textScale * 0.7, textScale * 0.7], 0, [255, 255, 255, 255])
          }
        }

        if (playerAimAt !== undefined && !player.getVariable('player_knockout')) {
          const healthBarY = textY + 0.08

          let health = player.getHealth()
          let armour = player.getArmour() / 100
          let x2 = x - width / 2

          health = health <= 100 ? health / 100 : (health - 100) / 100

          if (armour <= 0) {
            mp.game.graphics.drawRect(x, healthBarY, width, height, 81, 80, 80, 255, false)
            mp.game.graphics.drawRect(x - width / 2 * (1 - health), healthBarY, width * health, height, 0, 255, 128, 255, false)
          } else {
            width = 0.025
            mp.game.graphics.drawRect(x2, healthBarY, width, height, 81, 80, 80, 255, false)
            mp.game.graphics.drawRect(x2 - width / 2 * (1 - health), healthBarY, width * health, height, 0, 255, 128, 255, false)

            x2 = (x + width / 2) + 0.002

            mp.game.graphics.drawRect(x2, healthBarY, width, height, 81, 80, 80, 255, false)
            mp.game.graphics.drawRect(x2 - width / 2 * (1 - armour), healthBarY, width * armour, height, 0, 132, 255, 255, false)
          }
        }
      }
    })
  }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
  requestPlayerSid(player)
})

mp.events.add('playerQuit', (player: PlayerMp) => {
  playerSids.delete(player.remoteId)
})