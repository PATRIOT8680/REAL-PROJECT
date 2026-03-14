import { gui } from "../menus/global"
import { rce } from "../utils/rce";

let localplayer = mp.players.local

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp, seat: number)=> {
  if (vehicle && seat === -1) {
    gui.execute(`window.App.hudReducer.showHud(true)`)
  }
})

mp.events.add('playerLeaveVehicle', (vehicle: VehicleMp, seat: number)=> {
  if (vehicle && seat === -1) {
    gui.execute(`window.App.hudReducer.showHud(false)`)
  }
})

mp.events.add('render', () => {
  if (localplayer.vehicle !== null) {
    let speed = localplayer.vehicle.getSpeed() * 3.6
    gui.execute(`window.App.speedVehReducer.setSpeed(${speed})`)
  }
})