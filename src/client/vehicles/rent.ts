import { rce } from "../utils/rce"
import { gui } from '../menus/global'
import { showHud } from "../menus/interface/hud";
import Keys from '../utils/keys'

let keyDownE = 'disabled'
let rentData = null
let isWithdrawal: NodeJS.Timeout | null = null
let penaltyTimer: NodeJS.Timeout | null = null
let warningRentOver: NodeJS.Timeout | null = null
let syncInterval: NodeJS.Timeout | null = null
let rentFromPlayer: {
  uid: number | null,
  vehId: number | null,
  rentEndTime: number | null,
} = null

const clearAllRentTimers = () => {
  if (isWithdrawal !== null) {
    try { clearTimeout(isWithdrawal) } catch (e) {}
    isWithdrawal = null
  }
  if (warningRentOver !== null) {
    try { clearTimeout(warningRentOver) } catch (e) {}
    warningRentOver = null
  }
  if (penaltyTimer !== null) {
    try { clearTimeout(penaltyTimer) } catch (e) {}
    penaltyTimer = null
  }
  if (syncInterval !== null) {
    try { clearInterval(syncInterval); } catch (e) {}
    syncInterval = null
  }
}

rce.registerServer('rentColshape', (status, data) => {
  if (status === 'enabled') {
    keyDownE = 'enabled'
    rentData = data
  } else {
    handleHideRent()
    keyDownE = 'disabled'
    rentData = null
  }
})

rce.registerServer('closeRent', () => {
  handleHideRent()
})

rce.registerServer('startRentTimer', (uid: number, vehId: number, time: number) => {
  clearAllRentTimers()

  rentFromPlayer = {
    uid: uid,
    vehId: vehId,
    rentEndTime: Date.now() + (time * 60 * 1000)
  }

  warningRentOver = setTimeout(() => {
    gui.execute(`window.App.sendNotifyReducer.sendNotify('warning', 'Внимание! Аренда транспорта завершится через ${time} минут', 4000, 'bottom')`)
  }, (time * 60 * 1000) * 0.25)

  isWithdrawal = setTimeout(() => {
    rentFromPlayer = { uid: null, vehId: null, rentEndTime: null }

    rce.triggerServer('rentOver')
    clearAllRentTimers()

    gui.execute(`window.App.sendNotifyReducer.sendNotify('info', 'Аренда завершена. Транспорт был изъят', 4000, 'bottom')`)
  }, time * 60 * 1000)

  syncInterval = setInterval(() => {
    if (!rentFromPlayer?.rentEndTime) return

    const remainingMs = rentFromPlayer.rentEndTime - Date.now()
    const remainingMins = Math.max(0, Math.ceil(remainingMs / 60000))
    rce.triggerServer('syncRentTime', remainingMins)
  }, 5 * 60 * 1000) // 5 минуток
})

rce.registerAll('cef:cancelRentCar', () => {
  rentFromPlayer = { uid: null, vehId: null, rentEndTime: null }

  rce.triggerServer('rentOver')
  clearAllRentTimers()

  if (rentData) rentData.isTakenRent = false

  gui.execute(`window.App.rentReducer.setIsTakenRent(false)`)
  gui.execute(`window.App.sendNotifyReducer.sendNotify('success', 'Аренда была завершена!', 3200, 'bottom')`)
})

mp.events.add('playerQuit', () => {
  if (!rentFromPlayer || !rentFromPlayer.uid) {
    clearAllRentTimers()
    rentFromPlayer = { uid: null, vehId: null, rentEndTime: null }
    return
  }

  let remainingMins = 0

  if (rentFromPlayer.rentEndTime) {
    let remainingMs = rentFromPlayer.rentEndTime - Date.now()
    if (remainingMs < 0) remainingMs = 0
    remainingMins = Math.ceil(remainingMs / 60000)
  }

  rce.triggerServer('rentPlayerQuit', rentFromPlayer.uid, remainingMins, !!mp.players.local.vehicle)

  clearAllRentTimers()
  rentFromPlayer = { uid: null, vehId: null, rentEndTime: null }
})

mp.events.add('playerLeaveVehicle', (vehicle: VehicleMp, seat: number) => {
  if (!rentFromPlayer || !vehicle || vehicle.remoteId !== rentFromPlayer.vehId) return

  gui.execute(`window.App.sendNotifyReducer.sendNotify('warning', 'Аренда завершится через 10 минут!', 3500, 'bottom')`)

  penaltyTimer = setTimeout(() => {
    rce.triggerServer('rentOver')
    clearAllRentTimers()
    rentFromPlayer = { uid: null, vehId: null, rentEndTime: null }

    gui.execute(`window.App.sendNotifyReducer.sendNotify('info', 'Вы не вернулись в арендованное т/с. Транспорт был изъят', 4000, 'bottom')`)
  }, 600000)
})

mp.events.add('playerEnterVehicle', (vehicle: VehicleMp, seat: number) => {
  if (!rentFromPlayer || !vehicle || vehicle.remoteId !== rentFromPlayer.vehId) return

  const remainingMs = rentFromPlayer.rentEndTime! - Date.now()
  const remainingMins = Math.max(0, Math.ceil(remainingMs / 60000))

  if (penaltyTimer !== null) {
    try { clearTimeout(penaltyTimer) } catch (e) {}
    penaltyTimer = null
  }

  gui.execute(`window.App.sendNotifyReducer.sendNotify('info', 'Аренда возобновлена. Осталось ${remainingMins} мин до окончания', 4000, 'bottom')`)
})

const handleShowRent = () => {
  mp.gui.cursor.show(true, true)
  gui.execute('window.App.hudReducer.hideHud()')
  gui.execute('window.App.chatReducer.hideChat()')
  gui.execute(`window.App.rentReducer.showRent(${JSON.stringify(rentData)})`)
}

const handleHideRent = () => {
  mp.game.ui.setPauseMenuActive(false)
  mp.gui.cursor.show(false, false)
  gui.execute(`window.App.rentReducer.hideRent()`)
  showHud()
  gui.execute('window.App.chatReducer.showChat()')

  setTimeout(() => {
    mp.game.ui.setPauseMenuActive(true)
  }, 300)
}

mp.keys.bind(Keys.VK_E, false, () => {
  if (keyDownE !== 'disabled') {
    handleShowRent()
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  handleHideRent()
})

rce.registerAll('closeRentMenu', () => {
  handleHideRent()
})