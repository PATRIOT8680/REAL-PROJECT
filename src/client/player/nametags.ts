const maxDistance = 25*25
const width = 0.025
const height = 0.004
let visibleNametags: boolean = true
let playerTarget: PlayerMp = null
let playerAimAt = null

mp.nametags.enabled = false

mp.keys.bind(global.Keys.VK_F9, false, () => {
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
        let scale = (distance / maxDistance)
        if(scale < 0.4) scale = 0.4

        y -= scale * (0.005 * (screenRes.y / 1080))

        if (player.getVariable('player_knockout')) {
          mp.console.logWarning('В нокауте')
        }

        drawNametags(player, x, y, `Гражданин [ID: ${player.remoteId}]`, [255, 255, 255, 255])
      }
    })
  }
})


const drawNametags = (player: PlayerMp, x: number, y: number, displayName: string, color: Array4d) => {
  mp.game.graphics.drawText(displayName, [x, y],
    {
      font: 0,
      color: color,
      scale: [0.35, 0.35],
      outline: true
    }
  )

  if (playerTarget && player.handle === playerTarget.handle && playerAimAt) {
    y += 0.05

    let health = player.getHealth()
    let armour = player.getArmour() / 100

    health = health <= 100 ? health / 100 : (health - 100) / 100

    if (armour <= 0) {
      mp.game.graphics.drawRect(x, y, width, height, 81, 80, 80, 255, false)
      mp.game.graphics.drawRect(x - width / 2 * (1 - health), y, width * health, height, 0, 255, 128, 255, false)
    } else {
      mp.game.graphics.drawRect(x, y, width, height, 81, 80, 80, 255, false)
      mp.game.graphics.drawRect(x - width / 2 * (1 - health), y, width * health, height, 0, 200, 255, 255, false)

      y -= 0.007
      mp.game.graphics.drawRect(x, y, width, height, 81, 80, 80, 255, false)
      mp.game.graphics.drawRect(x - width / 2 * (1 - armour), y, width * armour, height, 0, 132, 255, 255, false)
    }
  }
}