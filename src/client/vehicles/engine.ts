import { rce } from "../utils/rce";
import { gui } from "../menus/global";
import { startFuelSystem, stopFuelSystem } from "./fuel";
import Keys from '../utils/keys'

const lcplayer = mp.players.local
let isKeyPressed = false
let keyPressedTimeout: NodeJS.Timeout | null = null

mp.keys.bind(Keys.VK_2, false, async () => {
  if (!lcplayer.vehicle) return
  if (isKeyPressed) return
  if (keyPressedTimeout) clearTimeout(keyPressedTimeout)

  isKeyPressed = true
  keyPressedTimeout = setTimeout(() => {
    isKeyPressed = false
    keyPressedTimeout = null
    clearTimeout(keyPressedTimeout)
  }, 1500)

  const vehicle = lcplayer.vehicle
  const currentEngineStatus = vehicle.getVariable('VEH_ENGINE') ?? true
  const currentFuel = vehicle.getVariable('VEH_FUEL') ?? true
  const hasKey = await rce.callServer('playerHasKeyForVehicle', vehicle.remoteId)

  if (!hasKey) {
    rce.trigger('sendNotify', 'err', 'У вас нет ключа от этого транспорта!', 3200, 'bottom')
    return
  }

  if (currentEngineStatus === false) {
    const vehHealth = vehicle.getVariable('VEH_HEALTH')
    if (vehHealth <= 300) {
      rce.trigger('sendNotify', 'err', 'Транспорт сломан! Невозможно завести', 3200, 'bottom')
      return
    }
  }

  const newEngineState = !currentEngineStatus

  if (newEngineState === true) {
    if (currentFuel <= 0) {
      rce.trigger('sendNotify', 'err', 'В баке нет топлива! Невозможно завести двигатель!', 3200, 'bottom')
      return
    }

    rce.trigger('sendNotify', 'success', 'Транспорт заведен', 2000, 'bottom')
    startFuelSystem(currentFuel)
    gui.execute(`window.App.fuelVehReducer.setFuel(${currentFuel})`)
    gui.execute(`window.App.speedVehReducer.setEngine(true)`)
  } else {
    rce.trigger('sendNotify', 'err', 'Транспорт заглушен', 2000, 'bottom')
    stopFuelSystem()
    gui.execute(`window.App.fuelVehReducer.setFuel(0)`)
    gui.execute(`window.App.speedVehReducer.setEngine(false)`)
  }

  rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'engine', newEngineState)
})