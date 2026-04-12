import { rce } from "../utils/rce";
import { gui } from "../menus/global";
import { startFuelSystem, stopFuelSystem } from "./fuel";

import './interaction'
import './rent'
import './speed'
import './fuel'
import './engine'

let lastBodyHealth = 1000
let currentVehicle = null

const player = mp.players.local

rce.registerAll('getModelVeh', () => {
  if (player.vehicle) {
    let modelName = mp.game.vehicle.getDisplayNameFromVehicleModel(player.vehicle.model).toLowerCase()
    mp.console.logWarning(`model: ${modelName}`)
    return modelName
  } else {
    return null
  }
})

mp.events.add("playerReady", () => {
  mp.game.weapon.setEnableLocalOutgoingDamage(true)
  mp.game.vehicle.defaultEngineBehaviour = false
})

mp.events.add("playerEnterVehicle", (vehicle, seat) => {
  if (seat === -1) {
    const savedFuel = vehicle.getVariable('VEH_FUEL')
    stopFuelSystem()
    startFuelSystem(savedFuel)
    vehicle.setInvincible(false)
    currentVehicle = vehicle
    lastBodyHealth = Math.floor(vehicle.getBodyHealth())
    gui.execute(`window.App.fuelVehReducer.setFuel(0)`)
  }
})

mp.events.add("playerLeaveVehicle", (vehicle, seat) => {
  if (seat === -1) {
    currentVehicle = null
  }
})

setInterval(() => {
  if (!currentVehicle || !mp.vehicles.exists(currentVehicle)) return;
  const currentBody = Math.floor(currentVehicle.getBodyHealth())

  if (currentBody < lastBodyHealth - 4) {
    rce.triggerServer('updateVehicleProp', currentVehicle.id, 'health', currentBody)
  }

  lastBodyHealth = currentBody
}, 2000)

mp.events.add('outgoingDamage', (sourceEntity, targetEntity, sourcePlayer, weapon, boneIndex, damage) => {
  if (!targetEntity || targetEntity.type !== "vehicle") return

  const vehicle: any = targetEntity

  const localPlayer = mp.players.local
  if (!localPlayer.vehicle || localPlayer.vehicle.handle !== vehicle.handle) return
  if (vehicle.getPedInSeat(-1) !== localPlayer.handle) return

  const currentBodyHealth = Math.floor(vehicle.getBodyHealth())
  rce.triggerServer('updateVehicleProp', vehicle.id, 'health', currentBodyHealth)
})