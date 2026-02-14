import { rce } from "../utils/rce";
import { connectedUsers } from "../data/dataConnectedUser";
import { acceptTrade, getTradeForPlayer } from "../modules/inventory/tradeManager";
import chalk from "chalk";

rce.registerClient('handleInteractionPlayer', async (player: PlayerMp, action: string, targetId: number) => {
  if (mp.players.exists(targetId)) {
    const target = mp.players.at(targetId)
    const playerSid = connectedUsers.getField(player.id, 'sid')
    const targetSid = connectedUsers.getField(targetId, 'sid')

    switch (action) {
      case 'trade': {
        if (getTradeForPlayer(player)) {
          rce.triggerClient(player, 'sendNotify', 'warning', 'Вы уже находитесь в состоянии обмена!', 3200, 'top')
          return
        }

        if (getTradeForPlayer(target)) {
          rce.triggerClient(player, 'sendNotify', 'warning', 'Игрок уже обменивается с кем-то!', 3200, 'bottom')
          return
        }

        rce.triggerClient(player, 'sendNotify', 'info', `Вы предложили игроку #${targetSid} начать обмен`, 3000, 'bottom')
        const result = await rce.callClient(target, 'showOffer', player.id, 'Обмен', `Игрок #${playerSid} предлагает начать обмен`, 10000)

        try {
          if (result === 'timeout') {
            rce.triggerClient(player, 'sendNotify', 'info', `Время вышло. Игрок #${targetSid} не принял ваше предложение`, 4500, 'bottom')
            return
          }

          if (result === true) {
            acceptTrade(target, player.id)
          } else {
            rce.triggerClient(player, 'sendNotify', 'err', `Игрок #${targetSid} отказался обмениваться!`, 3500, 'bottom')
          }
        } catch (e) {
          console.log(chalk.red('[TRADE REQUEST]'), e)
        }
      }
    }
  } else {
    rce.triggerClient(player, 'sendNotify', 'err', 'Игрок не найден!', 3500, 'bottom')
  }
})