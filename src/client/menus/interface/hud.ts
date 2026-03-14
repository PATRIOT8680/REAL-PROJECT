import { rce } from "../../utils/rce";
import { gui } from "../global";

export const showHud = () => {
  const pl = mp.players.local
  const minimap = getMinimapAnchor()

  const isDriver = !! (pl.vehicle && pl.vehicle.getPedInSeat(-1) === pl.handle)

  gui.execute(`
    window.App.hudReducer.showHud(
      ${isDriver},
      ${minimap.rightX * 100}, ${minimap.leftX * 10},
      ${minimap.topY * 100}, ${minimap.bottomY * 10},
      ${minimap.width * 100}, ${minimap.height * 100}
    )
  `)
}

rce.registerAll('showHud', () => {
  showHud()
})

export const getMinimapAnchor = () => {
  let sfX = 1.0 / 20.0
  let sfY = 1.0 / 20.0
  let safeZone = mp.game.graphics.getSafeZoneSize()
  let aspectRatio = mp.game.graphics.getScreenAspectRatio(false)
  let resolution = mp.game.graphics.getScreenActiveResolution(0, 0)
  let scaleX = 1.0 / resolution.x
  let scaleY = 1.0 / resolution.y

  let minimap: any = {
    width: scaleX * (resolution.x / (4 * aspectRatio)),
    height: scaleY * (resolution.y / 5.674),
    scaleX: scaleX,
    scaleY: scaleY,
    leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
    bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
  }

  minimap.rightX = minimap.leftX + minimap.width
  minimap.topY = minimap.bottomY - minimap.height

  return minimap
}