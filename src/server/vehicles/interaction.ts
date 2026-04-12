import { rce } from "../utils/rce";
import { connectedUsers } from "../data/dataConnectedUser";
import { playerHasKeyForVehicle } from "../modules/inventory/inventoryHandlers";

rce.registerClient('handleInteractionVehicle', async (player: PlayerMp, action: string, targetId: number) => {
  if (mp.vehicles.exists(targetId)) {
    const vehicle = mp.vehicles.at(targetId)
    const playerSid = connectedUsers.getField(player.id, 'sid')

    switch (action) {
      case 'toggleDoors': {
        const availabilityOfKey = await playerHasKeyForVehicle(player, vehicle)
        if (!availabilityOfKey) {
          rce.triggerClient(player, 'sendNotify', 'err', 'У вас нет ключей от этого транспорта!', 3200, 'bottom')
          return
        }

        const lockedState = !vehicle.locked
        vehicle.locked = lockedState
        vehicle.setVariable('doorsLocked', lockedState)

        const stateText = lockedState ? 'закрыты' : 'открыты'
        rce.triggerClient(player, 'execute', `window.App.speedVehReducer.setDoors(${!lockedState})`)
        rce.triggerClient(player, 'sendNotify', lockedState ? 'err' : 'success', `Двери транпорта были ${stateText}`, 2500, 'bottom')
        break
      }

      default:
        rce.triggerClient(player, 'sendNotify', 'warning', 'Неизвестное действие с транспортом', 3200, 'bottom')
    }
  }
})