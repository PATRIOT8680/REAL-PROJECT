export interface IHitInfo {
  type: 'object' | 'vehicle' | 'player' | 'ped' | 'none',
  remoteId: number | null,
  handle: number | null,
  position: Vector3 | null,
  entity?: EntityMp | null,
  distToHit: number
}

export let lastHit: IHitInfo = {
  type: 'none',
  remoteId: null,
  handle: null,
  position: null,
  entity: null,
  distToHit: 0
}

export const checkCenterScreenHit = (rayLength: number, hitMaxDist: number, flags: number | number[]): IHitInfo => {
  const camera = mp.cameras.new("gameplay")
  const start = camera.getCoord()
  const dir = camera.getDirection()

  const end = new mp.Vector3(
    start.x + dir.x * rayLength,
    start.y + dir.y * rayLength,
    start.z + dir.z * rayLength
  )

  const ignore = mp.players.local.handle
  const result = mp.raycasting.testPointToPoint(start, end, ignore, flags)

  const currentHit: IHitInfo = {
    type: 'none',
    remoteId: null,
    handle: null,
    position: null,
    entity: null,
    distToHit: 0,
  }

  if (!result || !result.entity) {
    return currentHit
  }

  const entity = result.entity as EntityMp
  const hitPos = result.position
  const playerPos = mp.players.local.position

  const distToHit = mp.game.system.vdist(
    playerPos.x, playerPos.y, playerPos.z,
    hitPos.x, hitPos.y, hitPos.z
  )

  if (distToHit > hitMaxDist) {
    return currentHit
  }

  currentHit.position = hitPos
  currentHit.distToHit = distToHit
  currentHit.entity = entity
  currentHit.handle = entity.handle

  if (entity.type) {
    currentHit.type = entity.type as any
    currentHit.remoteId = entity.remoteId ?? null
  }

  return currentHit
}

export const updateLastHit = (newHit: IHitInfo) => {
  lastHit = newHit
}