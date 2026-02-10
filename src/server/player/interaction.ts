import { rce } from "../utils/rce";
import { connectedUsers } from "../data/dataConnectedUser";

rce.registerClient('handleInteractionPlayer', async (player: PlayerMp, action: string, targetId: number) => {
  if (mp.players.exists(targetId)) {
    const target = mp.players.at(targetId)
    const playerSid = connectedUsers.getField(player.id, 'sid')
    const targetSid = connectedUsers.getField(targetId, 'sid')

    switch (action) {
      case 'trade': {
        const result = await rce.callClient(target, 'showOffer', player.id, 'Обмен', `Игрок #${playerSid} предлагает начать обмен`, 10000)

        if (result === 'timeout') {
          rce.triggerClient(player, 'sendNotify', 'info', `Время вышло. Игрок #${targetSid} не принял ваше предложение`, 4500, 'bottom')
          return
        }

        if (result === true) {
          rce.triggerClient(player, 'sendNotify', 'success', `Игрок #${targetSid} согласился на обмен`, 3500, 'bottom')
        } else {
          rce.triggerClient(player, 'sendNotify', 'err', `Игрок #${targetSid} отказался обмениваться!`, 3500, 'bottom')
        }
      }
    }
  } else {
    rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не найден!', 3500, 'bottom')
  }
})