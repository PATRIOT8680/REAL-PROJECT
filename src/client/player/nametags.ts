interface ICacheTag {
  text: string,
  color: Array4d
}

export let showPlayerNameTag = true
let cacheTags: ICacheTag[] = []
const maxDistance = 25*25;

mp.nametags.enabled = false
mp.keys.bind(global.Keys.VK_F9, false, () => {
  showPlayerNameTag = !showPlayerNameTag
})

const calcDistance = (v1, v2) =>  {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

mp.events.add('render', (nametags) => {
  try {
    if (global.loginPlayer) return
    mp.console.logWarning('1')

    const playerPos = mp.players.local.position
    const target = mp.players.local

    if (showPlayerNameTag) {
      mp.console.logWarning('2')
      nametags.forEach(nametag => {
        let [player, x, y, distance] = nametag
        mp.console.logWarning('2.1')

        if (calcDistance(playerPos, player.position) < 15) {
          mp.console.logWarning('3')
          if (player.vehicle) y += 0.5

          if (cacheTags[player.remoteId] === undefined) {
            mp.console.logWarning('4')
            let text: string = `Местный «${player.remoteId}»`
            let color: Array4d = [255, 255, 255, 255]

            cacheTags[player.remoteId] = { text, color }
          }

          const label: ICacheTag = cacheTags[player.remoteId]
          if (label) {
            mp.console.logWarning('5')
            mp.console.logWarning(`${player.remoteId} ${x} ${y} ${label.text} ${label.color}`)
            drawTag(player, x, y, label.text, label.color)
          }
        }
      })
    }
  } catch (e) {

  }
})


const drawTag = (player: PlayerMp, x: number, y: number, tag: string, color: Array4d) => {
  mp.console.logWarning('11')
  mp.game.graphics.drawText(tag, [x, y], { font: 2, color: color, scale: [0.3, 0.3], outline: true })
}