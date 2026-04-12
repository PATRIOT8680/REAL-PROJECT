import { rce } from "../utils/rce"
import { data } from "../database/mysql"
import chalk from "chalk"
import { decrementCash, getCash } from "../data/char/cash";
import { decrementBankMoney } from "../data/char/bankMoney";
import { getDataAccount } from "../data/getDataAccount";
import { connectedUsers } from "../data/dataConnectedUser";
import { ICarData } from "../../shared/types/rent";
import { vehicles } from "../configs/vehicles";
import { addCustomItemToInventory } from "./inventory/inventoryHandlers";
import { generateUSPlate } from "../vehicles/numberPlate";
import { removeKeyFromVeh } from "./inventory/inventoryHandlers";
import { vehicleManager } from "../vehicles";

interface IRentsData {
  id: number,
  pedName: string,
  modelName: string,
  pedPos: { x, y, z, heading },
  vehiclesData?: any,
  colshapeId?: number
}

const db = data.promise()

let rentsData: IRentsData[] = []
const MAX_RETRIES = 10
const RETRY_DELAY = 2000

const playerRentData = new Map<number, {
  isTakenRent: boolean,
  vehicleRent: VehicleMp | null,
  isWithdrawal: number | null,
  keyNameVeh?: string
}>()

rce.register('charSpawned', async (player: PlayerMp) => {
  const uid = await getDataAccount(player, 'uid', player.id)
  const oldData = playerRentData.get(uid)

  const playerData: {
    isTakenRent: boolean,
    vehicleRent: VehicleMp | null,
    isWithdrawal: number | null,
    keyNameVeh?: string
  } = {
    isTakenRent: false,
    vehicleRent: null,
    isWithdrawal: null
  }
  playerRentData.set(uid, playerData)

  rentsData.forEach(rent => {
    rce.triggerClients('createPed',
      rent.pedName, 'Местный арендодатель', rent.modelName,
      [rent.pedPos.x, rent.pedPos.y, rent.pedPos.z, rent.pedPos.heading],
      { isVisible: true, id: 811, color: 46 }
    )
  })

  try {
    const [rows]: any = await db.query(`SELECT rent_data FROM chars WHERE uid = ?`, [uid])
    if (rows.length === 0 || !rows[0].rent_data) return

    let rentInfo

    try {
      rentInfo = JSON.parse(rows[0].rent_data)
    } catch (e) {
      console.log(chalk.red('[SPAWN RENT VEH]') + ` Ошибка парсинга: ${e}`)
      await db.query(`UPDATE chars SET rent_data = NULL WHERE uid = ?`, [uid])
      return
    }

    const timeLeft = Number(rentInfo.timeLeft) || 0

    if (timeLeft < 1) {
      await db.query(`UPDATE chars SET rent_data = NULL WHERE uid = ?`, [uid])
      rce.triggerClient(player, 'sendNotify', 'warning', 'Аренда истекла', 3200, 'bottom')
      return
    }

    let vehicleToUse: VehicleMp | null = null
    if (player.vehicle && player.vehicle.model === mp.joaat(rentInfo.keyNameVeh)) {
      vehicleToUse = player.vehicle
    }

    if (!vehicleToUse) {
      const spawnPos = new mp.Vector3(
        rentInfo.position.x,
        rentInfo.position.y,
        rentInfo.position.z,
      )
      vehicleToUse = mp.vehicles.new(mp.joaat(rentInfo.keyNameVeh), spawnPos, {
        heading: rentInfo.heading,
        color: [rentInfo.color, rentInfo.color],
        dimension: player.dimension,
        engine: true,
        locked: false,
        numberPlate: rentInfo.plate
      })
    }

    if (oldData && oldData.vehicleRent && mp.vehicles.exists(oldData.vehicleRent) && oldData.vehicleRent !== vehicleToUse) {
      oldData.vehicleRent.destroy()
    }

    const vehicleFullName = vehicles.find(v => v.short === rentInfo.keyNameVeh)?.full || rentInfo.keyNameVeh
    playerData.vehicleRent = vehicleToUse
    playerData.isTakenRent = true
    playerData.isWithdrawal = timeLeft
    playerData.keyNameVeh = rentInfo.keyNameVeh

    vehicleManager.addVehicle(vehicleToUse, {
      fullName: vehicleFullName,
      ownerUid: uid,
      isRental: true,
      rentalKeyId: Date.now() + Math.floor(Math.random() * 1000000)
    })

    if (!player.vehicle && player.vehicle !== vehicleToUse && rentInfo.inVeh) {
      setTimeout(() => {
        if (mp.players.exists(player) && mp.vehicles.exists(vehicleToUse)) {
          player.putIntoVehicle(vehicleToUse, 0)
        }
      }, 500)
    }

    rce.triggerClient(player, 'startRentTimer', uid, vehicleToUse.id, timeLeft)
  } catch (e) {
    console.log(chalk.red('[SPAWN RENT VEH]') + ` Ошибка получения информации с БД: ${e}`)
  }
})

rce.registerCef('createNpcForRent', async (player: PlayerMp, npcModel: string, npcName: string) => {
  const playerAdmLvl = connectedUsers.getField(player.id, 'adminLvl')

  if (playerAdmLvl === 0) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Доступ запрещен!', 3200, 'top')
    return
  }

  if (!npcModel.trim() || !npcName.trim()) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Данные с моделью или именем NPC не должны быть пустыми!', 3200, 'top')
    return
  }

  try {
    const [rows]: any = await db.query(`
        SELECT COALESCE(MAX(id), 0) AS maxId
        FROM rent
    `)

    const maxId = Number(rows[0].maxId)
    const newId = maxId + 1

    const pedpos = {
      x: player.position.x,
      y: player.position.y,
      z: player.position.z,
      heading: player.heading,
    }

    await db.query(
      `INSERT INTO rent (id, pedname, modelname, pedpos) VALUES (?, ?, ?, ?)`,
      [newId, npcName, npcModel, JSON.stringify(pedpos)]
    )

    const coordZ: number = await rce.callClient(player, 'getGroundZ')

    const colshape = mp.colshapes.newSphere(
      pedpos.x, pedpos.y, coordZ, 4.0, player.dimension
    )

    rentsData.push({
      id: newId,
      pedName: npcName.trim(),
      modelName: npcModel.trim(),
      pedPos: pedpos,
      vehiclesData: [],
      colshapeId: colshape.id
    })

    rce.triggerClients('createPed',
      npcName.trim(), 'Местный арендодатель', npcModel.trim(),
      [pedpos.x, pedpos.y, pedpos.z, pedpos.heading],
      { isVisible: true, id: 811, color: 46 }
    )

    rce.triggerClient(player, 'sendNotify', 'success', `Вы успешно добавили арендодателя ${npcName.trim()} (#${newId})`, 4500, 'top')
  } catch (e) {
    console.log(chalk.red('[CREATE PED FOR RENT]') + ` Ошибка создания: ${e}`)
  }
})

rce.registerCef('addVehInRent', async (
  player: PlayerMp, rentId: number, typeVeh: 'car' | 'moto', vehModel: string, priceVeh: number
) => {
  const playerAdmLvl = connectedUsers.getField(player.id, 'adminLvl')

  if (playerAdmLvl === 0) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Доступ запрещен!', 3200, 'top')
    return
  }

  if (!player.vehicle) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Вы не в транспорте!', 3200, 'top')
    return
  }

  if (!rentId || !typeVeh.trim() || !vehModel.trim() || !priceVeh) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Данные о т/с не должны быть пустыми!', 3200, 'top')
    return
  }

  const veh = player.vehicle
  const vehPos = veh.position
  const vehRot = veh.heading

  try {
    const [checkRows]: any = await db.query(`SELECT COUNT(*) AS cnt FROM rent WHERE id = ?`, [rentId])

    const exist = checkRows[0].cnt > 0

    if (!exist) {
      rce.triggerClient(player, 'sendNotify', 'err', `Аренда #${rentId} не найдена!`, 3200, 'top')
      return
    }

    let vehiclesData = []
    const [rows]: any = await db.query(`SELECT vehiclesdata FROM rent WHERE id = ?`, [rentId])

    if (rows[0].vehiclesdata) {
      try {
        vehiclesData = JSON.parse(rows[0].vehiclesdata)
      } catch (e) {
        console.log(chalk.red('[ADD VEH IN RENT]') + ` Err JSON parsing: ${e}`)
      }
    }

    const vehiclesInfo = {
      vehName: vehModel,
      type: typeVeh,
      price: Number(priceVeh),
      x: Number(vehPos.x.toFixed(3)),
      y: Number(vehPos.y.toFixed(3)),
      z: Number(vehPos.z.toFixed(3)),
      heading: Number(vehRot.toFixed(3))
    }

    const existingIndex = vehiclesData.findIndex((item: any) => item.vehName === vehModel)

    if (existingIndex !== -1) {
      vehiclesData[existingIndex] = vehiclesInfo
    } else {
      vehiclesData.push(vehiclesInfo)
    }

    await db.query(
      `UPDATE rent SET vehiclesdata = ? WHERE id = ?`,
      [JSON.stringify(vehiclesData), rentId]
    )

    const rentIndex = rentsData.findIndex(r => r.id === rentId)
    if (rentIndex !== -1) {
      rentsData[rentIndex].vehiclesData = vehiclesData
    }

    rce.triggerClient(player, 'sendNotify', 'success', `Транспорт был добавлен в аренду #${rentId}`, 3500, 'top')
  } catch (e) {
    console.log(chalk.red('[ADD VEH IN RENT]') + ` Ошибка добавления: ${e}`)
  }
})

rce.registerCef('cef:handleRentVeh', async (
  player: PlayerMp, rentId: number, method: 'cash' | 'bank', selectedVeh: ICarData, color: Array3d, time: number
) => {
  if (!mp.players.exists(player)) return

  const currentCash = connectedUsers.getField(player.id, 'cash')
  const currentBankMoney = connectedUsers.getField(player.id, 'bankmoney')
  const uid = connectedUsers.getField(player.id, 'uid')
  const rentData = rentsData.find(rent => rentId === rent.id)
  const playerData = playerRentData.get(uid)

  if (!rentData || !playerData) return

  const money = method === 'cash' ? currentCash : currentBankMoney
  if (money < selectedVeh.price * (time / 60)) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Недостаточно средств!', 3200, 'top')
    return
  }

  if (playerData.isTakenRent) {
    rce.triggerClient(player, 'sendNotify', 'err', 'У вас уже есть транспорт в аренде. Чтобы оформить новую, отмените предыдущую!', 4700, 'top')
    return
  }

  const vehInfo = rentData.vehiclesData.find(veh => veh.vehName === selectedVeh.keyNameCar)
  const vehPos = new mp.Vector3(vehInfo.x, vehInfo.y, vehInfo.z)

  const modelName = selectedVeh.keyNameCar
  const vehicleFullName = vehicles.find(v => v.short === modelName)?.full || modelName
  const plate = await generateUSPlate()
  const keyUniqueId = Date.now() + Math.floor(Math.random() * 1000000)

  const result = await addCustomItemToInventory(uid, {
    id: 800,
    name: `Ключ от ${vehicleFullName}`,
    description: `Номерной знак: ${plate}`,
    amount: 1,
    keyData: {
      model: modelName,
      uniqueId: keyUniqueId,
      plate: plate,
      isRental: true,
      vehicleName: vehicleFullName
    }
  })

  if (!result.success) {
    rce.triggerClient(player, 'sendNotify', 'err', result.reason, 3500, 'bottom')
    return
  }

  try {
    const vehicle = mp.vehicles.new(
      mp.joaat(selectedVeh.keyNameCar),
      vehPos,
      {
        color: [color, color],
        dimension: player.dimension,
        engine: true,
        heading: vehInfo.heading,
        locked: false,
        numberPlate: plate
      }
    )

    vehicle.setVariable('rentalKeyId', keyUniqueId)

    playerData.isTakenRent = true
    playerData.isWithdrawal = time
    playerData.keyNameVeh = selectedVeh.keyNameCar
    playerData.vehicleRent = vehicle

    vehicleManager.addVehicle(vehicle, {
      fullName: vehicleFullName,
      ownerUid: uid,
      isRental: true,
      rentalKeyId: keyUniqueId
    })

    setTimeout(() => {
      player.putIntoVehicle(playerData.vehicleRent, 0)
    }, 400)

    setTimeout(() => {
      console.log(`Heading rveh: ${playerData.vehicleRent.heading} | ${typeof playerData.vehicleRent.heading}`)
    }, 3000)

    const rentInfo = {
      keyNameVeh: selectedVeh.keyNameCar,
      plate: plate,
      color: color,
      position: {
        x: Number(vehPos.x),
        y: Number(vehPos.y),
        z: Number(vehPos.z),
      },
      heading: vehInfo.heading,
      timeLeft: time,
      inVeh: true
    }

    if (method === 'cash') {
      decrementCash(player, uid, selectedVeh.price * (time / 60))
    } else {
      decrementBankMoney(player, uid, selectedVeh.price * (time / 60))
    }


    await db.query(`UPDATE chars SET rent_data = ? WHERE uid = ?`, [JSON.stringify(rentInfo), uid])
    rce.triggerClient(player, 'startRentTimer', uid, playerData.vehicleRent.id, time)
  } catch (e) {
    console.log(chalk.red('[RENT VEH]') + ` Ошибка при аренде т/с: ${e}`)
  }
})

rce.registerClient('rentOver', async (player: PlayerMp) => {
  const uid = connectedUsers.getField(player.id, 'uid')
  const playerData = playerRentData.get(uid)

  if (playerData?.vehicleRent) {
    const keyUniqueId = playerData.vehicleRent.getVariable('rentalKeyId')
    const plate = playerData.vehicleRent.numberPlate

    await removeKeyFromVeh(uid, keyUniqueId, plate)
  }

  await db.query(`UPDATE chars SET rent_data = NULL WHERE uid = ?`, [uid])

  playerData.isTakenRent = false
  playerData.isWithdrawal = null
  vehicleManager.removeVehicle(playerData.vehicleRent.id)

  if (playerData.vehicleRent && mp.vehicles.exists(playerData.vehicleRent)) {
    player.removeFromVehicle()
    playerData.vehicleRent.destroy()
  }

  playerData.vehicleRent = null
})

rce.registerClient('rentPlayerQuit', async (player: PlayerMp, uid: number, timeLeft: number, inVeh: boolean) => {
  rentPlayerQuit(uid, inVeh, timeLeft)
})

rce.registerClient('syncRentTime', async (player: PlayerMp, timeLeft: number) => {
  const uid = connectedUsers.getField(player.id, 'uid')
  const playerData = playerRentData.get(uid)
  if (!playerData || !playerData.isTakenRent) return

  playerData.isWithdrawal = timeLeft

  if (playerData.vehicleRent && mp.vehicles.exists(playerData.vehicleRent)) {
    const vehicle = playerData.vehicleRent
    const rentInfo = {
      keyNameVeh: playerData.keyNameVeh,
      plate: playerData.vehicleRent.numberPlate,
      color: vehicle.getColorRGB(0),
      position: {
        x: Number(vehicle.position.x.toFixed(4)),
        y: Number(vehicle.position.y.toFixed(4)),
        z: Number(vehicle.position.z.toFixed(4)),
      },
      heading: Number(vehicle.heading.toFixed(4)),
      timeLeft: timeLeft,
      inVeh: (player.vehicle && player.vehicle.id === vehicle.id) ? true : false
    }
    await db.query(`UPDATE chars SET rent_data = ? WHERE uid = ?`, [JSON.stringify(rentInfo), uid])
  }
})

mp.events.add('playerEnterColshape', (player: PlayerMp, colshape: ColshapeMp) => {
  if (!player.vehicle) {
    const uid: number = connectedUsers.getField(player.id, 'uid')
    const rentData: IRentsData = rentsData.find(rent => rent.colshapeId === colshape.id)
    const playerData = playerRentData.get(uid)

    if (rentData && playerData) {
      const filteredVehiclesData = rentData.vehiclesData.map(veh => {
        const vehicleConfig = vehicles.find(v => v.short === veh.vehName)

        return {
          fullNameCar: vehicleConfig ? vehicleConfig.full : veh.vehName,
          keyNameCar: veh.vehName,
          type: veh.type,
          price: veh.price,
          typeFuel: vehicleConfig ? vehicleConfig.fuel : 'gas'
        }
      })

      rce.triggerClient(player, 'execute', 'window.App.hudReducer.setHintVisible(true)')

      rce.triggerClient(player, 'rentColshape', 'enabled', {
        id: rentData.id,
        isTakenRent: playerData.isTakenRent,
        data: filteredVehiclesData
      })
    }
  }
})

mp.events.add('playerExitColshape', (player: PlayerMp, colshape: ColshapeMp) => {
  const rentData = rentsData.find(rent => colshape.id === rent.colshapeId)

  if (rentData) {
    rce.triggerClient(player, 'execute', 'window.App.hudReducer.setHintVisible(false)')
    rce.triggerClient(player, 'rentColshape', 'disabled', {})
  }
})

const rentPlayerQuit = async (uid: number, inVeh: boolean = false, clientTimeLeft?: number, ) => {
  const rentData = playerRentData.get(uid)
  if (!rentData?.vehicleRent || !mp.vehicles.exists(rentData.vehicleRent)) return

  const vehicle = rentData.vehicleRent;
  const keyUniqueId = vehicle.getVariable('rentalKeyId')
  const plate = vehicle.numberPlate
  const pos = vehicle.position
  const heading = vehicle.heading
  const modelHash = vehicle.model

  let modelName = rentData.keyNameVeh
  if (!modelName || modelName === "unknown") {
    const found = vehicles.find(v => mp.joaat(v.short) === modelHash)
    modelName = found ? found.short : "unknown"
  }

  const finalTimeLeft = (clientTimeLeft !== undefined && clientTimeLeft > 0)
    ? clientTimeLeft
    : (rentData.isWithdrawal || 0)

  const rentInfo = {
    keyNameVeh: modelName,
    plate: plate,
    color: vehicle.getColorRGB(0),
    position: {
      x: Number(pos.x.toFixed(4)),
      y: Number(pos.y.toFixed(4)),
      z: Number(pos.z.toFixed(4)),
    },
    heading: Number(heading.toFixed(4)),
    inVeh: inVeh,
    timeLeft: Math.max(1, finalTimeLeft)
  }

  vehicleManager.removeVehicle(vehicle.id)

  await db.query(`UPDATE chars SET rent_data = ? WHERE uid = ?`,
    [JSON.stringify(rentInfo), uid])

  vehicle.destroy()

  if (rentData.isWithdrawal) clearTimeout(rentData.isWithdrawal)
  playerRentData.delete(uid)
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export const loadRentPoints = async (retryCount: number = 0) => {
  try {
    const [rows]: any = await db.query(`SELECT * FROM rent`)

    if (rows.length === 0) return

    rentsData = []
    for (const row of rows) {
      let pedPos = null
      let vehiclesData: any[] = []

      if (row.pedpos) {
        try {
          pedPos = JSON.parse(row.pedpos)
          if (!pedPos?.x || !pedPos?.y || !pedPos?.z) pedPos = null
        } catch (e) {
          console.log(chalk.red('[LOADING RENT]') + ` Ошибка парсинга pedPos #${row.id}: ${e}`)
        }
      }

      if (row.vehiclesdata) {
        try {
          vehiclesData = JSON.parse(row.vehiclesdata)
          if (!Array.isArray(vehiclesData)) vehiclesData = []
        } catch (e) {
          console.log(chalk.red('[LOADING RENT]') + ` Ошибка парсинга vehiclesdata #${row.id}: ${e}`)
        }
      }

      let colshapeId: number | undefined
      if (pedPos) {
        const colshape = mp.colshapes.newSphere(
          pedPos.x, pedPos.y, pedPos.z, 4.0, 0
        )
        colshapeId = colshape.id
      }

      rentsData.push({
        id: row.id,
        pedName: row.pedname,
        modelName: row.modelname,
        pedPos,
        vehiclesData,
        colshapeId
      })

      rentsData.forEach((rent: IRentsData) => {
        if (rent.pedPos) {
          rce.triggerClients('createPed',
            rent.pedName, 'Местный арендодатель', rent.modelName,
            [rent.pedPos.x, rent.pedPos.y, rent.pedPos.z, rent.pedPos.heading ?? 0],
            { isVisible: true, id: 811, color: 46 }
          )
        }
      })

      console.log(chalk.green('[UPLOADED RENT]') + ` Загружено ${rentsData.length} точек аренды`)
    }
  } catch (e) {
    if (e.code === 'ETIMEDOUT' && retryCount < MAX_RETRIES) {
      console.log(chalk.yellow('[LOADING RENT]') + ` Попытка ${retryCount + 1}/${MAX_RETRIES}. Повтор через ${RETRY_DELAY/1000} сек...`)
      await delay(RETRY_DELAY)
      return loadRentPoints(retryCount + 1)
    }

    console.log(chalk.red('[LOADING RENT]') + ` Ошибка загрузки после ${retryCount} попыток: ${e}`)
  }
}

export const savingPlayerRents = async () => {
  mp.events.delayShutdown = true
  let savedCount = 0

  for (const [uid, data] of playerRentData.entries()) {
    if (!data.isTakenRent || !data.vehicleRent || !mp.vehicles.exists(data.vehicleRent)) {
      continue
    }

    const player = connectedUsers.getPlayerByUid(uid)

    try {
      await rentPlayerQuit(uid, (player.vehicle && player.vehicle.id === data.vehicleRent.id) ? true : false, data.isWithdrawal)
      savedCount++
    } catch (e) {
      console.error(`[SHUTDOWN] Ошибка uid ${uid}:`, e)
    }
  }

  console.log(chalk.green('[SHUTDOWN] Сохранено аренд:') + ` ${savedCount}`)
  await new Promise(r => setTimeout(r, 2000))
  mp.events.delayShutdown = false
}