import { rce } from "../utils/rce";

import './interaction'
import './rent'
import './speed'

const player = mp.players.local

rce.registerAll('getModelVeh', () => {
  mp.console.logWarning('Получаем модельку')
  if (player.vehicle) {
    let modelName = mp.game.vehicle.getDisplayNameFromVehicleModel(player.vehicle.model).toLowerCase()
    mp.console.logWarning(`model: ${modelName}`)
    return modelName
  } else {
    return null
  }
})