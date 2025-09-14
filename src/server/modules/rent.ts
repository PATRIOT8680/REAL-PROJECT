import {registerCMD, send} from "../menus/chat";
import { rce } from "../utils/rce"
import { data } from "../database/mysql"
import chalk from "chalk"
import { decrementCash } from "../player/money";

let rentsData = []
const MAX_RETRIES = 10
const RETRY_DELAY = 2000

const playerRentData = new Map<number, {
  isTakenRent: boolean,
  vehicleRent: VehicleMp | null,
  isWithdrawal: NodeJS.Timeout | null
}>()

mp.events.add('playerJoin', async (player: PlayerMp) => {
  playerRentData.set(player.id, {
    isTakenRent: false,
    vehicleRent: null,
    isWithdrawal: null,
  })

  rentsData.forEach(rent => {
    rce.triggerClient(player, 'createPed', rent.pedName, 'Местный арендатор', rent.modelName, [Number(rent.pedPos.x), Number(rent.pedPos.y), Number(rent.pedPos.z), Number(rent.pedPos.heading)], { isVisible: true, id: 811, color: 44 })
  })
})

mp.events.add('playerQuit', (player: PlayerMp) => {
  const rentData = playerRentData.get(player.id)

  if (rentData) {
    if (rentData.isWithdrawal) clearTimeout(rentData.isWithdrawal)
    if (rentData.vehicleRent && mp.vehicles.exists(rentData.vehicleRent)) {
      rentData.vehicleRent.destroy()
    }
  }

  playerRentData.delete(player.id)
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const loadRent = async (retryCount = 0) => {
  try {
    const connection = await data.promise().getConnection()

    try {
      const [rows]: any = await connection.execute('SELECT id, pedname, modelname, pedpos, vehiclesdata FROM rent')

      if (rows.length === 0) {
        return console.log(chalk.bgYellow("RENT") + chalk.yellow(" Таблица rents пустая!"))
      }

      rentsData = []

      rows.forEach((row: any) => {
        let parsedPedpos = null
        let vehiclesData = []

        if (row.pedpos) {
          try {
            parsedPedpos = JSON.parse(row.pedpos)
          } catch (e) {
            console.log(chalk.bgRed('RENT' + chalk.red(` Ошибка парсинга pedpos: ${e}`)));
          }
        }

        if (row.vehiclesdata) {
          try {
            vehiclesData = JSON.parse(row.vehiclesdata)
          } catch (e) {
            console.log(chalk.bgRed('RENT' + chalk.red(` Ошибка парсинга vehiclesdata: ${e}`)));
          }
        }

        const colshape = mp.colshapes.newSphere(
          Number(parsedPedpos.x),
          Number(parsedPedpos.y),
          Number(parsedPedpos.z),
          3,
          0
        )

        const rentData = {
          id: row.id,
          pedName: row.pedname,
          modelName: row.modelname,
          pedPos: parsedPedpos,
          vehiclesData: vehiclesData,
          colshape: colshape
        }

        rentsData.push(rentData)
      })

      console.log(chalk.bgGreenBright("RENT") + chalk.greenBright(` Загружено ${rows.length} точек аренды`))
    } finally {
      await connection.release()
    }

  } catch (e) {
    if (e.code === 'ETIMEDOUT' && retryCount < MAX_RETRIES) {
      console.log(chalk.bgYellow("RENT") + chalk.yellow(` Попытка подключения ${retryCount + 1}/${MAX_RETRIES}, повтор через ${RETRY_DELAY/1000} сек...`));
      await delay(RETRY_DELAY);
      return loadRent(retryCount + 1);
    }

    console.error(chalk.bgRed('RENT' + chalk.red(` Ошибка после ${retryCount} попыток: ${e.message}`)));
  }
}

mp.events.add('playerEnterColshape', (player: PlayerMp, shape: ColshapeMp) => {
  if (!player.vehicle) {
    const rentData = rentsData.find(rent => rent.colshape === shape);
    const playerData = playerRentData.get(player.id)

    if (rentData && playerData) {
      const filteredVehiclesData = rentData.vehiclesData.map(vehicle => ({
        nameCar: vehicle.vehName,
        price: vehicle.price
      }))

      rce.triggerClient(player, 'rentColshape', 'enabled', {
        id: rentData.id,
        isTakenRent: playerData.isTakenRent,
        data: filteredVehiclesData
      });
    }
  }
});

rce.registerCef('cef:handleRentCar', async (player: PlayerMp, id: number, nameCar: string, price: number, hours: number) => {
  const rentData = rentsData.find(rent => rent.id === id)
  const playerData = playerRentData.get(player.id)

  if (!rentData || !playerData) return

  const vehInfo = rentData.vehiclesData.find((veh) => veh.vehName === nameCar)

  if (!vehInfo) {
    return console.log(chalk.bgRed('• RENT •') + chalk.red('Транспорт не найден!'))
  }

  if (playerData.isTakenRent) {
    rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('err', 'У вас уже есть транспорт в аренде. Отмените предыдушую аренду.', 4000, 'bottom')`)
    return
  }

  const cashResult = await decrementCash(player, price)

  if (cashResult === 'noCash') return

  const vehPos = new mp.Vector3(Number(vehInfo.x), Number(vehInfo.y), Number(vehInfo.z))
  try {
    playerData.isTakenRent = true
    playerData.vehicleRent = mp.vehicles.new(
      mp.joaat(vehInfo.vehName),
      vehPos,
      {
        color: [[255, 255, 255], [255, 255, 255]],
        dimension: 0,
        engine: true,
        heading: vehInfo.heading,
        locked: false,
        numberPlate: 'RENT'
      }
    )

    player.putIntoVehicle(playerData.vehicleRent, 0)
    rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('success', 'Вы взяли в аренду ${nameCar} на ${hours} ч. (-$${price})'), 4500, 'bottom'`)

    const rentTime = hours * 60 * 60 * 1000

    setTimeout(async () => {
      rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('warning', 'Внимание! Через 3 минуты срок аренды закончится и транспорт будет изъят!', 6000, 'bottom')`)

      setTimeout(() => {
        if (playerData.vehicleRent && playerData.vehicleRent && mp.vehicles.exists(playerData.vehicleRent)) {
          if (playerData.isWithdrawal) {
            clearTimeout(playerData.isWithdrawal)
            playerData.isWithdrawal = null
          }
          playerData.isTakenRent = false
          playerData.vehicleRent.destroy()
          rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('info', 'Срок аренды закончился!', 4000, 'bottom')`)
        }
      }, 3 * 60 * 1000)
    }, rentTime - (3 * 60 * 1000))
  } catch (e) {
    console.log(chalk.bgRed('• RENT •') + chalk.red(JSON.stringify(e)))
  }
})

rce.registerCef('cef:cancelRentCar', (player: PlayerMp) => {
  const playerData = playerRentData.get(player.id)
  if (!playerData || !playerData.vehicleRent) return

  if (playerData.isWithdrawal) {
    clearTimeout(playerData.isWithdrawal)
    playerData.isWithdrawal = null
  }
  playerData.vehicleRent.destroy()
  playerData.isTakenRent = false
  rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('info', 'Вы отменили аренду транспорта!', 3000, 'bottom')`)
})

mp.events.add('playerExitVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
  const playerData = playerRentData.get(player.id)
  if (!playerData || !playerData.vehicleRent || vehicle !== playerData.vehicleRent || !playerData.isTakenRent) return

  rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('warning', 'Аренда будет отменена через 3 минуты!', 4500, 'bottom')`)

  if (playerData.isWithdrawal) clearTimeout(playerData.isWithdrawal)

  playerData.isWithdrawal = setTimeout(() => {
    if (mp.players.exists(player) && playerData.vehicleRent && mp.vehicles.exists(playerData.vehicleRent)) {
      rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('info', 'Аренда закончилась, транспорт был изъят!', 4500, 'bottom')`)
      playerData.vehicleRent.destroy()
      playerData.vehicleRent = null
      playerData.isTakenRent = false
      playerData.isWithdrawal = null
    }
  }, 180000)

})

mp.events.add('playerEnterVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
  const playerData = playerRentData.get(player.id)

  if (!playerData || !playerData.vehicleRent || vehicle !== playerData.vehicleRent || !playerData.isWithdrawal) return

  clearTimeout(playerData.isWithdrawal)
  playerData.isWithdrawal = null
  rce.triggerClient(player, 'execute', `window.App.sendNotifyReducer.sendNotify('info', 'Аренда возобновлена!', 2500, 'bottom')`)
})

mp.events.add('playerExitColshape', (player: PlayerMp, shape: ColshapeMp) => {
  const rentData = rentsData.find(rent => rent.colshape === shape)

  if (rentData) {
    rce.triggerClient(player, 'rentColshape', 'disabled', {})
  }
})

mp.events.add("packagesLoaded", () => {
  loadRent()
})
