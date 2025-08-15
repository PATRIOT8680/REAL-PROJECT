import Keys from '../utils/keys'
import { deathInSeconds } from "./death"
import { drawSprite } from "../utils/drawSprite"

const maxDistance = 20*20
let width = 0.032
const height = 0.006
let visibleNametags: boolean = true
let playerTarget: PlayerMp = null
let playerAimAt = null

mp.nametags.enabled = false

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

      if(distance <= maxDistance) {
        if (player.getVariable('player_knockout')) {
          mp.console.logWarning('В нокауте')
        }

        drawNametags(player, x, y + 0.05, `Гражданин [ID: ${player.remoteId}]`, [255, 255, 255, 255], 0.27, distance)
      }
    })
  }
})


const drawNametags = (player: PlayerMp, x: number, y: number, displayName: string, color: Array4d, scale: number, distance: number) => {
  const distanceFactor = Math.min(1, distance / maxDistance)
  const liftAmount = 0.04 * distanceFactor
  const textScale = Math.max(0.7, 1 - distanceFactor * 0.3) * scale
  const textY = y - liftAmount

  mp.game.graphics.drawText(displayName, [x, textY],
    {
      font: 0,
      color: color,
      scale: [textScale, textScale],
      outline: true
    }
  )

  if (player.getVariable('player_knockout')) {
    drawSprite('commonmenutu', 'team_deathmatch', [x - 0.05, textY - 0.05], [0.7, 0.7], 0, [255, 13, 74, 255])

    mp.game.graphics.drawText(`Без сознания... (${deathInSeconds} sec)`, [x, textY + 0.1],
      {
        font: 0,
        color: [255, 13, 74, 255],
        scale: [textScale, textScale],
        outline: true
      }
    )
  }

  if (playerAimAt !== undefined) {
    const healthBarY = (textY - 0.03) + 0.057

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