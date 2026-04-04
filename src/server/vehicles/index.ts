export interface IActiveVehicle {
  id: number,
  model: string,
  fullName: string,
  plate: string,
  color: number | number[],
  ownerUid?: number,
  isRental?: boolean,
  rentalKeyId?: number,
  createAt: number
}

const activeVehicles = new Map<number, IActiveVehicle>()

export const addVehicle = (vehicle: VehicleMp, data: {
  fullName: string,
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
    ownerUid: data.ownerUid,
    isRental: data.isRental || false,
    rentalKeyId: data.rentalKeyId,
    createAt: Date.now()
  }

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

export const getVehicle = (vehicleId: number): IActiveVehicle | undefined => {
  return activeVehicles.get(vehicleId)
}

export const getAllVehicles = (): IActiveVehicle[] => {
  return Array.from(activeVehicles.values())
}

export const getPlayerVehicles = (uid: number): IActiveVehicle[] => {
  return Array.from(activeVehicles.values().filter(v => v.ownerUid === uid))
}

export const clearAllVehicles = (): void => activeVehicles.clear()

export const vehicleManager = {
  addVehicle,
  removeVehicle,
  getVehicle,
  getAllVehicles,
  getPlayerVehicles,
  clearAllVehicles
}