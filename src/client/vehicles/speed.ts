import { gui } from "../menus/global"
import { rce } from "../utils/rce";

let localplayer = mp.players.local
let currentVehicle: VehicleMp | null = null

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp, seat: number)=> {
  if (vehicle && seat === -1) {
    currentVehicle = vehicle
    gui.execute(`window.App.hudReducer.showHud(true)`)
  }
})

mp.events.add('playerLeaveVehicle', (vehicle: VehicleMp, seat: number)=> {
  if (vehicle && seat === -1) {
    currentVehicle = null
    gui.execute(`window.App.hudReducer.showHud(false)`)
  }
})

mp.events.add('render', () => {
  if (localplayer.vehicle !== null) {
    let speed = localplayer.vehicle.getSpeed() * 3.6
    gui.execute(`window.App.speedVehReducer.setSpeed(${Number(speed.toFixed(0))})`)
  } else {
    if (currentVehicle !== null) {
      currentVehicle = null
      gui.execute(`window.App.hudReducer.showHud(false)`)
      gui.execute(`window.App.speedVehReducer.setSpeed(0)`)
    }
  }
})