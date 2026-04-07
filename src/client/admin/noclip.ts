import Keys from '../utils/keys'
import { rce } from '../utils/rce'

mp.keys.bind(Keys.VK_TAB, false, () => {
  rce.triggerServer('changeAnim')
})

global.noclip = {
  active: false,
  shiftBoost: false,
  ctrlSlowing: false,
  f: 2.0,
  w: 2.0,
  h: 2.0,
  point_distance: 1000,
  speed: 0.15
}

const ids = {
  F7: 0x76,
  W: 32,
  S: 33,
  A: 34,
  D: 35,
  Space: 321,
  Shift: 340,
  LCtrl: 326,
  LMB: 24,
  RMB: 25
}

let ev = null
const localplayer = mp.players.local
const noclip = global.noclip
const camera = mp.cameras.new('gameplay')
const controls = mp.game.controls
let direction = null
let coords = null

const startNoclip = () => {
  rce.triggerServer('toggleNoclip', true)

  if (ev) {
    ev.destroy()
    ev = null
  }

  ev = new mp.Event("render", () => {
    if (noclip.active) {
      let updated = false
      const pos = mp.players.local.position
      direction = camera.getDirection()
      coords = camera.getCoord()

      const heading = Math.atan2(direction.x, direction.y) * (180 / Math.PI);
      mp.players.local.setRotation(0, 0, heading, 2, true);

      if(controls.isControlPressed(0, ids.Shift)) noclip.speed = 1.0
      else if(controls.isControlPressed(0, ids.RMB)) noclip.speed = 0.02
      else noclip.speed = 0.15

      if (controls.isControlPressed(0, ids.W)) {
        if (noclip.f < 8.0) noclip.f *= 1.025
        pos.x += direction.x * noclip.f * noclip.speed
        pos.y += direction.y * noclip.f * noclip.speed
        pos.z += direction.z * noclip.f * noclip.speed
        updated = true
      } else if (controls.isControlPressed(0, ids.S)) {
        if (noclip.f < 8.0) noclip.f *= 1.025
        pos.x -= direction.x * noclip.f * noclip.speed
        pos.y -= direction.y * noclip.f * noclip.speed
        pos.z -= direction.z * noclip.f * noclip.speed
        updated = true
      } else noclip.f = 2.0

      if (controls.isControlPressed(0, ids.A)) {
        if (noclip.l < 8.0) noclip.l *= 1.025
        pos.x += (-direction.y) * noclip.l * noclip.speed
        pos.y += direction.x * noclip.l * noclip.speed
        updated = true
      } else if (controls.isControlPressed(0, ids.D)) {
        if (noclip.l < 8.0) noclip.l *= 1.05
        pos.x -= (-direction.y) * noclip.l * noclip.speed
        pos.y -= direction.x * noclip.l * noclip.speed
        updated = true
      } else noclip.l = 2.0

      if (controls.isControlPressed(0, ids.Space)) {
        if (noclip.h < 8.0) noclip.h *= 1.025
        pos.z += noclip.h * noclip.speed
        updated = true
      } else if (controls.isControlPressed(0, ids.LCtrl)) {
        if (noclip.h < 8.0) noclip.h *= 1.05
        pos.z -= noclip.h * noclip.speed
        updated = true
      } else noclip.h = 2.0

      if (updated) mp.players.local.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false)
    }
  })
}

const stopNoclip = () => {
  rce.triggerServer('toggleNoclip', false)

  if (ev) {
    ev.destroy()
    ev = null
  }

  noclip.f = 2.0
  noclip.w = 2.0
  noclip.h = 2.0
  noclip.speed = 0.15
}

mp.keys.bind(Keys.VK_F8, false, () => {
  if (!global.loginPlayer) return
  if (localplayer.getVariable('ADMIN_LVL') < 1) return

  noclip.active = !noclip.active
  direction = camera.getDirection()
  coords = camera.getCoord()

  localplayer.setInvincible(noclip.active)
  localplayer.freezePosition(noclip.active)
  localplayer.setCollision(!noclip.active, !noclip.active)

  rce.trigger('sendNotify', 'info', noclip.active ? 'Полёт включен' : 'Полёт отключен', 1200, 'top')

  if (!noclip.active && !controls.isControlPressed(0, ids.Space)) {
    const pos = mp.players.local.position
    pos.z = mp.game.gameplay.getGroundZFor3DCoord(pos.x, pos.y, pos.z, true, false)
    mp.players.local.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false)
  }

  if (noclip.active) {
    startNoclip()
  } else {
    stopNoclip()
  }
})