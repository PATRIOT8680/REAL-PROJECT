import { rce } from "../../utils/rce";
import { gui } from "../global";

let area: string
let street: any
const lcplayer: PlayerMp = mp.players.local

mp.game.ui.setRadarZoom(1.0)
mp.game.ui.setRadarBigmapEnabled(false, false)

export const showHud = () => {
  const pl = mp.players.local
  const minimap = getMinimapAnchor()

  const isDriver = !! (pl.vehicle && pl.vehicle.getPedInSeat(-1) === pl.handle)

  gui.execute(`
    window.App.hudReducer.showHud(
      ${isDriver},
      ${minimap.rightX * 100}, ${minimap.leftX * 100},
      ${minimap.topY * 100}, ${minimap.bottomY * 100},
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

mp.events.add('render', () => {
  const currentArea: string = mp.game.zone.getNameOfZone(lcplayer.position.x, lcplayer.position.y, lcplayer.position.z)
  const currentStreet: any = mp.game.pathfind.getStreetNameAtCoord(lcplayer.position.x, lcplayer.position.y, lcplayer.position.z)

  if (currentArea !== area || currentStreet !== street) {
    area = currentArea
    street = currentStreet

    gui.execute(`window.App.hudReducer.setArea('${mp.game.ui.getLabelText(currentArea)}')`)
    gui.execute(`window.App.hudReducer.setStreet('${mp.game.ui.getStreetNameFromHashKey(currentStreet.streetName)}')`)
  }
})