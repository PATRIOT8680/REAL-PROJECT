interface ICacheTag {
  text: string,
  color: Array4d
}

export let showPlayerNameTag = true

mp.nametags.enabled = false
mp.keys.bind(global.Keys.VK_F9, false, () => {
  showPlayerNameTag = !showPlayerNameTag
})



mp.events.add('render', () => {
  mp.players.forEachInStreamRange((player: PlayerMp) => {
    if (player.handle === 0 || player === mp.players.local) return

    const targetPos = player.getBoneCoords(12844, 0, 0, 0)
    const localPos = mp.players.local.position

    const distance = mp.game.gameplay.getDistanceBetweenCoords(
      localPos.x, localPos.y, localPos.z,
      targetPos.x, targetPos.y, targetPos.z,
      true
    )

    if (distance < 15) return
    const { x, y } = mp.game.graphics.world3dToScreen2d(new mp.Vector3(targetPos.x, targetPos.y, targetPos.z + 0.5))

    if (x && y) {
      drawTag(x, y, `Местный «${player.remoteId}»`, [255, 255, 255, 255])
    }
  })
})


const drawTag = (x: number, y: number, tag: string, color: Array4d) => {
  mp.game.graphics.drawText(tag, [x, y], { font: 2, color: color, scale: [0.3, 0.3], outline: true })
}