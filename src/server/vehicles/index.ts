import { rce } from "../utils/rce";

export interface IActiveVehicle {
  id: number,
  model: string,
  fullName: string,
  plate: string,
  color: number | number[],
  fuel?: number,
  engine?: boolean,
  health?: number,
  ownerUid?: number,
  isRental?: boolean,
  rentalKeyId?: number,
  createAt: number,
  criticalWarningShown?: boolean,
}

const activeVehicles = new Map<number, IActiveVehicle>()

export const addVehicle = (vehicle: VehicleMp, data: {
  fullName: string,
  fuel?: number,
  ownerUid?: number,
  isRental?: boolean,
  rentalKeyId?: number
}): void => {

  if (!mp.vehicles.exists(vehicle)) return

  const activeVeh: IActiveVehicle = {
    id: vehicle.id,
    model: vehicle.model.toString(),
    fullName: data.fullName,
    plate: vehicle.numberPlate,
    color: vehicle.getColor(0),
    fuel: data.fuel ?? 100,
    engine: vehicle.engine,
    health: vehicle.bodyHealth,
    ownerUid: data.ownerUid,
    isRental: data.isRental || false,
    rentalKeyId: data.rentalKeyId,
    createAt: Date.now()
  }

  vehicle.setVariable('VEH_FUEL', data.fuel ?? 100)
  vehicle.setVariable('VEH_ENGINE', vehicle.engine)
  vehicle.setVariable('VEH_HEALTH', vehicle.bodyHealth)
  activeVehicles.set(vehicle.id, activeVeh)
}

export const removeVehicle = (vehicleId: number): boolean => {
  const existed = activeVehicles.has(vehicleId)

  if (existed) {
    activeVehicles.delete(vehicleId)
    return true
  }

  return false
}

export const updateVehicleProp = <K extends keyof IActiveVehicle>(
  vehicleId: number,
  field: K,
  value: IActiveVehicle[K]
): boolean => {
  const vehicleData = activeVehicles.get(vehicleId)
  if (!vehicleData) return false

  vehicleData[field] = value

  const veh = mp.vehicles.at(vehicleId)
  if (!veh || !mp.vehicles.exists(veh)) return true

  switch (field) {
    case 'fuel': {
      veh.setVariable('VEH_FUEL', Number(value))
      break
    }

    case 'engine': {
      const newState = Boolean(value)
      veh.setVariable('VEH_ENGINE', newState)
      veh.engine = newState
      break
    }

    case 'health': {
      const newHealth = Number(value)
      veh.setVariable('VEH_HEALTH', newHealth)

      if (newHealth <= 300) {
        veh.engine = false
        veh.setVariable('VEH_ENGINE', false)
        vehicleData.engine = false

        rce.triggerClient(veh.getOccupant(0), 'execute', 'window.App.speedVehReducer.setEngine(false)')
        rce.triggerClient(veh.getOccupant(0), 'sendNotify', 'err', 'Транспорт полностью сломан! Невозможно завести двигатель', 5000, 'bottom')
      } else if (newHealth <= 400) {
        if (!vehicleData.criticalWarningShown) {
          vehicleData.criticalWarningShown = true
          rce.triggerClient(veh.getOccupant(0), 'sendNotify', 'warning', 'Транспорт в критическом состоянии! Требуется срочный ремонт!', 5000, 'bottom')
        }
      } else {
        if (vehicleData.criticalWarningShown) {
          vehicleData.criticalWarningShown = false
        }
      }
      break
    }
  }
}

export const getVehicle = (vehicleId: number): IActiveVehicle | undefined => {
  return activeVehicles.get(vehicleId)
}

export const getVehicleProp = <K extends keyof IActiveVehicle>(
  vehicleId: number,
  prop: K
): IActiveVehicle[K] | undefined => {
  const vehicle = activeVehicles.get(vehicleId)
  return vehicle ? vehicle[prop] : undefined
}

export const getVehicleProps = <K extends keyof IActiveVehicle>(
  vehicleId: number,
  props: K[]
): Pick<IActiveVehicle, K> | undefined => {
  const vehicle = activeVehicles.get(vehicleId)
  if (!vehicle) return undefined

  const result = {} as Pick<IActiveVehicle, K>
  for (const prop of props) {
    result[prop] = vehicle[prop]
  }

  return result
}

export const getAllVehicles = (): IActiveVehicle[] => {
  return Array.from(activeVehicles.values())
}

export const getPlayerVehicles = (uid: number): IActiveVehicle[] => {
  return Array.from(activeVehicles.values().filter(v => v.ownerUid === uid))
}

export const clearAllVehicles = (): void => activeVehicles.clear()

rce.registerClient('getVehicleProp', (player: PlayerMp, vehicleId: number, prop: keyof IActiveVehicle) => {
  if (!mp.vehicles.exists(vehicleId)) return undefined
  return getVehicleProp(vehicleId, prop)
})

rce.registerClient('getVehicleProps', (player: PlayerMp, vehicleId: number, props: (keyof IActiveVehicle)[]) => {
  if (!mp.vehicles.exists(vehicleId)) return undefined
  return getVehicleProps(vehicleId, props)
})

rce.registerClient('updateVehicleProp', (player: PlayerMp, vehicleId: number, field: keyof IActiveVehicle, value: any) => {
  if (!mp.vehicles.exists(vehicleId)) return
  updateVehicleProp(vehicleId, field, value)
})

export const vehicleManager = {
  addVehicle,
  removeVehicle,
  updateVehicleProp,
  getVehicle,
  getVehicleProp,
  getVehicleProps,
  getAllVehicles,
  getPlayerVehicles,
  clearAllVehicles
}