let visibleTag = true

mp.keys.bind(global.Keys.VK_F9, false, () => {
  visibleTag = !visibleTag
})

mp.events.add('render', (nametags) => {
  for (nametag of nametags) {
    const [player, x, y, distance] = nametag
    if (distance > 50) continue

    mp.game.graphics.drawText(player.remoteId, [x, y], {
      font: 0,
      color: [255, 255, 255, 255],
      scale: [0.4, 0.4],
      outline: true,
    })
  }
})