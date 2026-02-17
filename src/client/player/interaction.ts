import { rce } from "../utils/rce";
import { checkCenterScreenHit, updateLastHit, lastHit } from "../utils/raycastCenterScreen";
import { getDistanceFactor } from "../utils/distanceFactorText";
import { gui } from "../menus/global";
import Keys from '../utils/keys'

const HIT_MAX_DIST = 2.5
const RAY_LENGTH = 15

let openedInteraction: boolean = false

mp.events.add('render', () => {
  const hit = checkCenterScreenHit(RAY_LENGTH, HIT_MAX_DIST, 8);
  const changedHit = hit.type !== lastHit.type || hit.remoteId !== lastHit.remoteId

  if (openedInteraction && (hit.type !== 'player' || hit.remoteId === null || hit.distToHit > HIT_MAX_DIST)) {
    openedInteraction = false;
    gui.execute(`window.App.interactionReducer.hideInteraction()`)
    mp.gui.cursor.visible = false;
  }

  if (hit.type === 'player' && hit.remoteId !== null && hit.distToHit <= HIT_MAX_DIST && !mp.players.local.vehicle) {
    const target = mp.players.atRemoteId(hit.remoteId)
    if (target && !mp.players.local.vehicle) {
      const posTarget = target.position
      const factor = getDistanceFactor(hit.distToHit, HIT_MAX_DIST, 0.48)
      mp.game.graphics.drawText('[E]', [posTarget.x, posTarget.y - factor.yOffset, posTarget.z], {
        font: 4,
        color: [44, 255, 132, factor.alpha],
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
    if (changedHit && lastHit.type === 'player') {
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

  if (lastHit.type === 'player' && lastHit.remoteId !== null && lastHit.distToHit <= HIT_MAX_DIST && !hasSpecialOpen) {
    openedInteraction = true
    mp.console.logWarning(`Взаимодействуете с ID: ${lastHit.remoteId}`)
    gui.execute(`window.App.interactionReducer.showInteraction('player', ${lastHit.remoteId})`)
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