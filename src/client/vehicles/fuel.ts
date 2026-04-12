import { rce } from "../utils/rce";
import { gui } from "../menus/global";

let fuelInterval: NodeJS.Timeout | null = null
let currentLocalFuel = 100
let lastSentFuel = 100

export const startFuelSystem = (initialFuel: number = 100) => {
  if (fuelInterval) clearInterval(fuelInterval)

  currentLocalFuel = Math.max(0, Math.min(initialFuel, 100))
  lastSentFuel = currentLocalFuel

  fuelInterval = setInterval(() => {
    const player = mp.players.local
    const vehicle = player.vehicle

    if (!vehicle) return

    const isEngineOn = vehicle.getVariable('VEH_ENGINE')
    if (!isEngineOn) return

    const speedVeh = vehicle.getSpeed() * 3.6
    if (speedVeh < 2) return

    let consumption = speedVeh > 5 ? speedVeh * 0.009 : 0.035

    if (currentLocalFuel <= consumption) {
      currentLocalFuel = 0
      gui.execute(`window.App.fuelVehReducer.setFuel(0)`)
      rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'fuel', 0)
      rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'engine', false)
      gui.execute(`window.App.speedVehReducer.setEngine(false)`)
      rce.trigger('sendNotify', 'err', 'Топливо закончилось! Двигатель заглох', 4000, 'bottom')
      return
    }

    currentLocalFuel = Math.max(0, currentLocalFuel - consumption)
    currentLocalFuel = Number(currentLocalFuel.toFixed(2))

    const fuelSpentSinceLastSend = lastSentFuel - currentLocalFuel
    if (fuelSpentSinceLastSend >= 1) {
      rce.triggerServer('updateVehicleProp', vehicle.remoteId, 'fuel', currentLocalFuel)
      lastSentFuel = currentLocalFuel
    }

    gui.execute(`window.App.fuelVehReducer.setFuel(${currentLocalFuel})`)
  }, 900)
}

export const stopFuelSystem = () => {
  if (fuelInterval) {
    clearInterval(fuelInterval)
    fuelInterval = null
  }
}