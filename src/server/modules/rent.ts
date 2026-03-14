import { rce } from "../utils/rce"
import { data } from "../database/mysql"
import chalk from "chalk"
import { decrementCash, getCash } from "../data/char/cash";
import { decrementBankMoney } from "../data/char/bankMoney";
import { getDataAccount } from "../data/getDataAccount";
import { connectedUsers } from "../data/dataConnectedUser";
import { ICarData } from "../../shared/types/rent";
import { vehicles } from "../configs/vehicles";

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
  isWithdrawal: number | null
}>()

rce.register('charSpawned', async (player: PlayerMp) => {
  const uid = await getDataAccount(player, 'uid', player.id)

  playerRentData.set(uid, {
    isTakenRent: false,
    vehicleRent: null,
    isWithdrawal: null,
  })

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

    const timeLeft = rentInfo.timeLeft

    if (timeLeft <= 0) {
      await db.query(`UPDATE chars SET rent_data = NULL WHERE uid = ?`, [uid])
      rce.triggerClient(player, 'sendNotify', 'warning', 'Срок вашей предыдущей аренды истёк!', 3200, 'bottom')
      return
    }

    const spawnPos = new mp.Vector3(
      rentInfo.position.x,
      rentInfo.position.y,
      rentInfo.position.z,
    )

    const vehicle = mp.vehicles.new(mp.joaat(rentInfo.keyNameVeh), spawnPos, {
      heading: rentInfo.heading,
      color: [rentInfo.color, rentInfo.color],
      dimension: player.dimension,
      engine: true,
      locked: false,
      numberPlate: 'RENT'
    })

    const playerData = playerRentData.get(uid)
    if (playerData) {
      playerData.isTakenRent = true
      playerData.vehicleRent = vehicle
      playerData.isWithdrawal = timeLeft

      rce.triggerClient(player, 'startRentTimer', timeLeft)
    }

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

  try {
    playerData.isTakenRent = true
    playerData.vehicleRent = mp.vehicles.new(
      mp.joaat(selectedVeh.keyNameCar),
      vehPos,
      {
        color: [color, color],
        dimension: player.dimension,
        engine: true,
        heading: vehInfo.heading,
        locked: false,
        numberPlate: 'RENT'
      }
    )

    player.putIntoVehicle(playerData.vehicleRent, 0)
    playerData.isWithdrawal = time

    const rentInfo = {
      keyNameVeh: selectedVeh.keyNameCar,
      color: color,
      position: {
        x: Number(vehPos.x),
        y: Number(vehPos.y),
        z: Number(vehPos.z),
      },
      heading: Number(vehInfo.heading),
      timeLeft: time
    }

    if (method === 'cash') {
      decrementCash(player, uid, selectedVeh.price * (time / 60))
    } else {
      decrementBankMoney(player, uid, selectedVeh.price * (time / 60))
    }

    await db.query(`UPDATE chars SET rent_data = ? WHERE uid = ?`, [JSON.stringify(rentInfo), uid])
    rce.triggerClient(player, 'startRentTimer', playerData.vehicleRent.id, time)
  } catch (e) {
    console.log(chalk.red('[RENT VEH]') + ` Ошибка при аренде т/с: ${e}`)
  }
})

rce.registerClient('rentOver', async (player: PlayerMp) => {
  const uid = connectedUsers.getField(player.id, 'uid')
  const playerData = playerRentData.get(uid)

  await db.query(`UPDATE chars SET rent_data = NULL WHERE uid = ?`, [uid])

  playerData.isTakenRent = false
  playerData.isWithdrawal = null
  playerData.vehicleRent.destroy()
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
    rce.triggerClient(player, 'rentColshape', 'disabled', {})
  }
})

rce.registerClient('rentPlayerQuit', async (player: PlayerMp, timeLeft: number) => {
  const uid = await getDataAccount(player, 'uid', player.id)
  const rentData = playerRentData.get(uid)
  const vehPos = rentData.vehicleRent.position
  const vehRot = rentData.vehicleRent.heading

  const rentInfo = {
    keyNameVeh: rentData.vehicleRent.model,
    color: rentData.vehicleRent.getColorRGB(0),
    position: {
      x: Number(vehPos.x),
      y: Number(vehPos.y),
      z: Number(vehPos.z),
    },
    heading: Number(vehRot),
    timeLeft: Number(timeLeft)
  }

  if (rentData.isTakenRent && rentData.vehicleRent && mp.vehicles.exists(rentData.vehicleRent)) {
    const vehPos = rentData.vehicleRent.position
    const vehRot = rentData.vehicleRent.heading

    const rentInfo = {
      keyNameVeh: rentData.vehicleRent.model,
      color: rentData.vehicleRent.getColorRGB(0),
      position: {
        x: Number(vehPos.x),
        y: Number(vehPos.y),
        z: Number(vehPos.z),
      },
      heading: Number(vehRot),
      timeLeft: Number(timeLeft)
    }

    await db.query(`UPDATE chars SET rent_data = ? WHERE uid = ?`, [JSON.stringify(rentInfo), uid])
    rentData.vehicleRent.destroy()
  }

  if (rentData.isWithdrawal) clearTimeout(rentData.isWithdrawal)
  playerRentData.delete(uid)
})

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