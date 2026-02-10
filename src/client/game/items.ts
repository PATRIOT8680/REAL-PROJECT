import { rce } from "../utils/rce";
import { ServerItem } from "../../shared/types/items";
import { getDistanceFactor } from "../utils/distanceFactorText";
import { checkCenterScreenHit, updateLastHit, lastHit } from "../utils/raycastCenterScreen";
import { gui } from "../menus/global";
import Keys from '../utils/keys'

const MAX_DIST_TEXT = 7
const HIT_MAX_DIST = 2
const RAY_LENGTH = 15
const worldItems = new Map<number, { item: ServerItem, position: Vector3, value: number }>()

let lastObjectCheckTime = 0

mp.events.add('render', () => {
  mp.objects.forEachInStreamRange((obj: ObjectMp) => {
    const localplayer = mp.players.local

    const posPl = localplayer.position
    const posObj = obj.position
    const distToObj = mp.game.system.vdist(posObj.x, posObj.y, posObj.z, posPl.x, posPl.y, posPl.z)

    const itemInfo = worldItems.get(obj.id)
    if (!itemInfo) return

    // Отображаем текст предмета
    if (distToObj <= MAX_DIST_TEXT) {
      const p = getDistanceFactor(distToObj, MAX_DIST_TEXT, 0.37)
      const textQuantity = itemInfo.value > 1 ? `[x ${itemInfo.value}]` : ''

      mp.game.graphics.drawText(`${itemInfo.item.name} ${textQuantity}`, [posObj.x, posObj.y - p.yOffset - 0.01, posObj.z],
        {
          font: 4,
          color: [255, 255, 255, p.alpha - 30],
          scale: p.scale,
          outline: true
        }
      )
    }

    // Управление коллизией
    if (localplayer.vehicle) {
      obj.setCollision(false, false)
    } else {
      obj.setCollision(true, false)
    }
  })

  // Проверяем луч только для объектов (флаг 16)
  const hit = checkCenterScreenHit(RAY_LENGTH, HIT_MAX_DIST, 16)
  const currentTime = Date.now()
  const changed = hit.type !== lastHit.type || hit.remoteId !== lastHit.remoteId

  // Проверяем хит для объектов только если прошло достаточно времени
  if (changed && currentTime - lastObjectCheckTime > 50) {
    lastObjectCheckTime = currentTime

    // Сбрасываем наведение только если у нас было наведение на объект
    if (lastHit.type === 'object') {
      gui.execute(`window.App.hoverInteractionReducer.removeHover()`)
    }

    updateLastHit(hit)

    // Устанавливаем наведение только если луч попал в объект на допустимой дистанции
    if (hit.type === 'object' && hit.remoteId !== null && hit.distToHit <= HIT_MAX_DIST) {
      gui.execute(`window.App.hoverInteractionReducer.setHover()`)
    }
  }
})

rce.registerServer('droppedItemOnGround', (item: ServerItem, objId: number, objPos: Vector3, value: number) => {
  worldItems.set(objId, { item, position: objPos, value })
})


mp.keys.bind(Keys.VK_E, false, async () => {
  if (lastHit.type !== 'object' || lastHit.remoteId === null) return

  const itemData = worldItems.get(lastHit.remoteId)
  if (!itemData) return

  const { item, value } = itemData
  const pickUp = await rce.callServer('pickUpItem', lastHit.remoteId, item, value)

  if (pickUp.status === 'destroyItem') {
    worldItems.delete(lastHit.remoteId)
    return
  }

  if (pickUp.status === 'denied') {
    if (pickUp.text) {
      gui.execute(`window.App.sendNotifyReducer.sendNotify('err', '${pickUp.text}', 3000, 'bottom')`)
    }
    return
  }

  if (pickUp.status === 'approved') {
    worldItems.delete(lastHit.remoteId)
    gui.execute(`window.App.waitingLoaderReducer.showWaitingLoader(2000, 'Поднятие предмета')`)
  }
})