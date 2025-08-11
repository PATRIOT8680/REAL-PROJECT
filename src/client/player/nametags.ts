interface ICacheTag {
  text: string,
  color: Array4d
}

export let showPlayerNameTag = false
let cacheTags: ICacheTag[] = []

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

    const playerPos = mp.players.local.position
    const target = mp.players.local

    if (showPlayerNameTag) {
      nametags.forEach((tag: [PlayerMp, number, number, number]) => {
        let [_player, x, y, distance] = tag

        if (calcDistance(playerPos, _player.position) < 15) {
          if (_player.vehicle) y += 0.5

          if (cacheTags[_player.remoteId] === undefined) {
            let text: string = `Местный «${_player.remoteId}»`
            let color: Array4d = [255, 255, 255, 255]

            cacheTags[_player.remoteId] = { text, color }
          }

          const label: ICacheTag = cacheTags[_player.remoteId]
          if (label) {
            drawTag(_player, x, y, label.text, label.color)
          }
        }
      })
    }
  } catch (e) {

  }
})


const drawTag = (player: PlayerMp, x: number, y: number, tag: string, color: Array4d) => {
  mp.game.graphics.drawText(tag, [x, y], { font: 2, color: color, scale: [0.3, 0.3], outline: true })
}