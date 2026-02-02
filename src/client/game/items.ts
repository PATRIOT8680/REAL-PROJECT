import { rce } from "../utils/rce";
import { ServerItem } from "../../shared/types/items";
import { getDistanceFactor } from "../utils/distanceFactorText";
import { gui } from "../menus/global";
import Keys from '../utils/keys'

const MAX_DIST = 7
const HIT_MAX_DIST = 2
const worldItems = new Map<number, { item: ServerItem, position: Vector3, value: number }>()
let lastHitId: number | null = null
let isHitState: boolean = false

mp.events.add('render', () => {
  mp.objects.forEachInStreamRange((obj: ObjectMp) => {
    const localplayer = mp.players.local

    const posPl = localplayer.position
    const posObj = obj.position
    const distToObj = mp.game.system.vdist(posObj.x, posObj.y, posObj.z, posPl.x, posPl.y, posPl.z)
    const p = getDistanceFactor(distToObj, MAX_DIST, 0.37)

    const itemInfo = worldItems.get(obj.id)
    const textQuantity = itemInfo.value > 1 ? `[x ${itemInfo.value}]` : ''

    if (distToObj <= MAX_DIST) {
      mp.game.graphics.drawText(`${itemInfo.item.name} ${textQuantity}`, [posObj.x, posObj.y - p.yOffset - 0.01, posObj.z],
        {
          font: 4,
          color: [255, 255, 255, p.alpha - 30],
          scale: p.scale,
          outline: true
        }
      )
    }

    if (localplayer.vehicle) {
      obj.setCollision(false, false)
    } else {
      obj.setCollision(true, false)
    }

    checkCenterScreenHit()
  })
})

rce.registerServer('droppedItemOnGround', (item: ServerItem, objId: number, objPos: Vector3, value: number) => {
  mp.console.logWarning(`${JSON.stringify(item)}, ${objPos}`)

  worldItems.set(objId, { item, position: objPos, value })

  mp.console.logInfo(`WorldItems: ${JSON.stringify(worldItems.get(item.id))}`)
})


const checkCenterScreenHit = () => {
  let currentHitId: number | null = null

  const camera = mp.cameras.new('gameplay')
  const coordCam = camera.getCoord()
  const directionCam = camera.getDirection()

  const raycastPos = {
    x: coordCam.x + directionCam.x * 15,
    y: coordCam.y + directionCam.y * 15,
    z: coordCam.z + directionCam.z * 15,
  }

  const raycastEndPos = new mp.Vector3(raycastPos.x, raycastPos.y, raycastPos.z)

  const raycastResult: RaycastResult = mp.raycasting.testPointToPoint(
    coordCam,
    raycastEndPos,
    mp.players.local,
    16
  )

  //mp.game.graphics.drawLine(coordCam.x, coordCam.y, coordCam.z, raycastPos.x, raycastPos.y, raycastPos.z, 255, 255, 255, 255)

  if (raycastResult && raycastResult.entity) {
    const entityHandle: any = raycastResult.entity

    const objId = entityHandle.remoteId
    const hasObjId = objId !== undefined || objId !== null

    if (hasObjId && worldItems.has(objId)) {
      const playerPos = mp.players.local.position
      const hitPos = raycastResult.position
      const distToHit = mp.game.system.vdist(playerPos.x, playerPos.y, playerPos.z, hitPos.x, hitPos.y, hitPos.z)

      if (distToHit <= HIT_MAX_DIST) {
        currentHitId = objId
      }
    }
  }

  if (currentHitId !== null && lastHitId !== currentHitId) {
    const itemData = worldItems.get(currentHitId)

    if (itemData) {
      gui.execute('window.App.hoverInteractionReducer.setHover()')
      isHitState = true
    }
  } else if (currentHitId === null && lastHitId !== null) {
    const itemData = worldItems.get(lastHitId)

    if (itemData) {
      gui.execute('window.App.hoverInteractionReducer.removeHover()')
      isHitState = false
    }
  }

  lastHitId = currentHitId
}

mp.keys.bind(Keys.VK_E, false, async () => {
  if (lastHitId !== null && isHitState) {
    const itemData = worldItems.get(lastHitId)

    if (itemData) {
      const { item, value } = itemData

      const pickUp = await rce.callServer('pickUpItem', lastHitId, item, value)

      if (pickUp.status === 'destroyItem') {
        worldItems.delete(lastHitId)
        return
      }

      if (pickUp.status === 'denied') {
        if (pickUp.text) {
          gui.execute(`window.App.sendNotifyReducer.sendNotify('err', '${pickUp.text}', 3000, 'bottom')`)
        }
        return
      }

      if (pickUp.status === 'approved') {
        worldItems.delete(lastHitId)
        gui.execute(`window.App.waitingLoaderReducer.showWaitingLoader(2000, 'Поднятие предмета')`)
        gui.execute('window.App.hoverInteractionReducer.removeHover()')
      }
    }
  }
})