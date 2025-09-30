import chalk from "chalk";
import { rce } from '../utils/rce'

import { getSid } from "./account/sid";
import { getUid } from "./char/uid"
import { getCash } from "./char/cash";
import { getBankMoney } from "./char/bankMoney";
import { getDonatCoins } from "./account/donatcoins";
import { getNickname } from "./char/nickname";

export const getDataAccount = async (player: PlayerMp, dataKey: string, targetID: number): Promise<any> => {
  try {
    const targetPlayer = mp.players.at(targetID)
    if (!targetPlayer) {
      console.error(chalk.red(`[RPC] Игрок с ID ${targetID} не найден!`))
      return null
    }

    if (!targetPlayer.getVariable('login_player')) {
      return console.error(chalk.red(`Игрок #${targetPlayer.id} не авторизован!`))
    }

    const targetLogin = targetPlayer.getVariable('login_player')
    const sid = await getSid(targetLogin)

    if (!targetLogin) {
      console.error(chalk.red(`[RPC] У игрока ${targetID} нет логина!`));
      return null;
    }

    const dataMap = {
      sid: () => getSid(targetLogin),
      uid: () => getUid(sid),
      cash: async () => getCash(await getUid(sid)),
      bankmoney: async () => getBankMoney(await getUid(sid)),
      donatcoins: () => getDonatCoins(sid),
      nickname: async () => getNickname(await getUid(sid)),
    }

    if (!dataMap[dataKey]) return console.error(chalk.bgRed('GET DATA •') + chalk.red(` Unknown data key: ${dataKey}`))
    return dataMap[dataKey]()
  } catch (e) {
    console.log(chalk.bgRed('• GET DATA •' + chalk.red(` Ошибка: ${e}`)))
  }
}

rce.registerClientCef('getDataAccount', async (player: PlayerMp, dataKey: string, targetID: number) => {
  const result = await getDataAccount(player, dataKey, targetID)
  return result
})