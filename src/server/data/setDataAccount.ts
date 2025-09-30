import chalk from "chalk";
import { rce } from '../utils/rce'
import { getSid } from "./account/sid";
import { getUid } from "./char/uid"

// Импорты функций установки данных
import { addCash, decrementCash } from "./char/cash";
import {addBankMoney, decrementBankMoney, getBankMoney} from "./char/bankMoney";

export const setDataAccount = async (
    player: PlayerMp,
    dataKey: string,
    value: any,
    targetID: number
): Promise<boolean> => {
  try {
    const targetPlayer = mp.players.at(targetID)
    if (!targetPlayer) {
      console.error(chalk.red(`[RPC] Игрок с ID ${targetID} не найден!`))
      return false
    }

    if (!targetPlayer.getVariable('login_player')) {
      console.error(chalk.red(`Игрок #${targetPlayer.id} не авторизован!`))
      return false
    }

    const targetLogin = targetPlayer.getVariable('login_player')
    const sid = await getSid(targetLogin)

    if (!targetLogin) {
      console.error(chalk.red(`[RPC] У игрока ${targetID} нет логина!`));
      return false;
    }

    const dataMap = {
      addCash: async () => addCash(targetPlayer, await getUid(sid), value),
      decrementCash: async () => decrementCash(targetPlayer, await getUid(sid), value),
      addBankMoney: async () => addBankMoney(targetPlayer, await getUid(sid), value),
      decrementBankMoney: async () => decrementBankMoney(targetPlayer, await getUid(sid), value),
    }

    if (!dataMap[dataKey]) {
      console.error(chalk.bgRed('SET DATA •') + chalk.red(` Unknown data key: ${dataKey}`))
      return false
    }

    await dataMap[dataKey]()
    return true
  } catch (e) {
    console.log(chalk.bgRed('• SET DATA •' + chalk.red(` Ошибка: ${e}`)))
    return false
  }
}

rce.registerClientCef('setDataAccount', async (player: PlayerMp, dataKey: string, value: any, targetID: number) => {
  const result = await setDataAccount(player, dataKey, value, targetID)
  return result
})