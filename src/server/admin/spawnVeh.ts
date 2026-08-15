import { rce } from "../utils/rce";
import { vehicleManager } from "../vehicles";
import { vehicles } from "../configs/vehicles";

rce.registerCef('cef:amenu:spawnVeh', (player: PlayerMp, targetId: number, modelName: string, colorVeh: Array3d) => {
  const targetPlayer = mp.players.at(targetId)

  if (!targetPlayer) {
    return rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не в сети!', 3000, 'top')
  }

  const targetPos = targetPlayer.position

  const vehicle = mp.vehicles.new(mp.joaat(modelName), new mp.Vector3(
      targetPos.x, targetPos.y, targetPos.z
  ), {
    engine: true,
    numberPlate: 'REAL_RP',
    dimension: targetPlayer.dimension,
    heading: Number(targetPlayer.heading)
  })

  const vehicleFullName = vehicles.find(v => v.short === modelName || modelName)

  vehicleManager.addVehicle(vehicle, { fullName: vehicleFullName.full })
  vehicle.setColorRGB(colorVeh[0], colorVeh[1], colorVeh[2], colorVeh[0], colorVeh[1], colorVeh[2])
  targetPlayer.putIntoVehicle(vehicle, 0)
})

rce.registerCef('cef:amenu:spawnVehForMe', (player: PlayerMp, modelName: string, colorVeh: number[]) => {
  const plPos = player.position

  const vehicle = mp.vehicles.new(mp.joaat(modelName), new mp.Vector3(
    plPos.x, plPos.y, plPos.z
  ), {
    engine: true,
    numberPlate: 'REAL_RP',
    dimension: player.dimension,
    heading: Number(player.heading)
  })

  vehicle.setColorRGB(colorVeh[0], colorVeh[1], colorVeh[2], colorVeh[0], colorVeh[1], colorVeh[2])
  player.putIntoVehicle(vehicle, 0)
})