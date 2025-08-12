// const drawTags = () => {
//   const { position } = mp.players.local
//
//   mp.players.forEachInStreamRange(player => {
//     const targetPos = player.position
//     const distance = mp.game.system.vdist(position.x, position.y, position.z, targetPos.x, targetPos.y, targetPos.z)
//
//     if (distance > 50) return
//
//     mp.game.graphics.drawText(`Местный <${player.remoteId}>`, [targetPos.x, targetPos.y, targetPos.z], {
//       font: 0,
//       color: [255, 255, 255, 255],
//       scale: [0.3, 0.3],
//       outline: true,
//     })
//   })
// }
//
// mp.events.add('render', drawTags)


const maxDistance = 25*25
const width = 0.03
const height = 0.0065
const border = 0.001
const color = [255,255,255,255]

mp.nametags.enabled = false

mp.events.add('render', (nametags) => {
  const graphics = mp.game.graphics
  const screenRes = graphics.getScreenResolution()

  nametags.forEach(nametag => {
    let [player, x, y, distance] = nametag

    if(distance <= maxDistance) {
      let scale = (distance / maxDistance)
      if(scale < 0.6) scale = 0.6

      y -= scale * (0.005 * (screenRes.y / 1080))

      mp.game.graphics.drawText(`Местный <${player.remoteId}>`, [x, y],
      {
        font: 0,
        color: [255, 255, 255, 255],
        scale: [0.35, 0.35],
        outline: true
      })
    }
  })
})