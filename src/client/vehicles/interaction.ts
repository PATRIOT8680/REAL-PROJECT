import { rce } from "../utils/rce";
import { checkCenterScreenHit, updateLastHit, lastHit } from "../utils/raycastCenterScreen";
import { getDistanceFactor } from "../utils/distanceFactorText";
import { gui } from "../menus/global";
import Keys from '../utils/keys'

const HIT_MAX_DIST = 2.5
const RAY_LENGTH = 15

let openedInteraction: boolean = false

mp.events.add('render', () => {
  const hit = checkCenterScreenHit(RAY_LENGTH, HIT_MAX_DIST, 2);
  const changedHit = hit.type !== lastHit.type || hit.remoteId !== lastHit.remoteId

  if (openedInteraction && (hit.type !== 'vehicle' || hit.remoteId === null || hit.distToHit > HIT_MAX_DIST)) {
    openedInteraction = false;
    gui.execute(`window.App.interactionReducer.hideInteraction()`)
    mp.gui.cursor.visible = false;
  }

  if (hit.type === 'vehicle' && hit.remoteId !== null && hit.distToHit <= HIT_MAX_DIST && !mp.players.local.vehicle) {
    const veh = mp.vehicles.atRemoteId(hit.remoteId)
    if (veh && !mp.players.local.vehicle) {
      const posVeh = veh.position
      const factor = getDistanceFactor(hit.distToHit, HIT_MAX_DIST, 0.48)
      mp.game.graphics.drawText('[E]', [posVeh.x, posVeh.y - factor.yOffset, posVeh.z], {
        font: 4,
        color: [255, 255, 255, factor.alpha - 30],
        scale: factor.scale,
        outline: true
      });
    }

    if (changedHit) {
      if (lastHit.type !== 'none') {
        gui.execute(`window.App.hoverInteractionReducer.removeHover()`)
      }
      updateLastHit(hit);
      gui.execute(`window.App.hoverInteractionReducer.setHover()`)
    }
  } else {
    if (changedHit && lastHit.type === 'vehicle') {
      gui.execute(`window.App.hoverInteractionReducer.removeHover()`)
    }
  }
})

mp.keys.bind(Keys.VK_E, false, async () => {
  if (lastHit.type === 'none') return

  if (openedInteraction) {
    openedInteraction = false
    mp.gui.cursor.visible = false
    gui.execute(`window.App.interactionReducer.hideInteraction()`)
    return
  }

  const openedMenus = await rce.callCef('getOpenMenus')
  const specialMenus = ['Welcome', 'Auth', 'SelectChar', 'Spawn', 'CreateChar', 'Loading', 'Rent']
  const hasSpecialOpen = openedMenus.some(menu => specialMenus.includes(menu))

  if (lastHit.type === 'vehicle' && lastHit.remoteId !== null && lastHit.distToHit <= HIT_MAX_DIST && !hasSpecialOpen) {
    openedInteraction = true
    gui.execute(`window.App.interactionReducer.showInteraction('vehicle', ${lastHit.remoteId})`)
    mp.gui.cursor.visible = true
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (openedInteraction) {
    openedInteraction = false
    gui.execute(`window.App.interactionReducer.hideInteraction()`)
    mp.gui.cursor.visible = false
  }
})

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp, seat: number) => {
  gui.execute(`window.App.hoverInteractionReducer.visibleHover(false)`)
})

mp.events.add('playerLeaveVehicle', (vehicle: VehicleMp, seat: number) => {
  gui.execute(`window.App.hoverInteractionReducer.visibleHover(true)`)
})