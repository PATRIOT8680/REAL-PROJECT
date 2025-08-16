import chalk from "chalk";
import { rpc } from '../utils/rpc'

import { getSid } from "./account/sid";

export const getDataAccount = async (player: PlayerMp, login: string, dataKey: string, targetID): Promise<any> => {
  const targetPlayer = mp.players.at(targetID)
  if (!targetPlayer) {
    console.error(chalk.red(`[RPC] Игрок с ID ${targetID} не найден!`))
    return null
  }

  const targetLogin = targetPlayer.getVariable('login_player')
  if (!targetLogin) {
    console.error(chalk.red(`[RPC] У игрока ${targetID} нет логина!`));
    return null;
  }
  
  const dataMap = {
    sid: () => getSid(targetLogin)
  }

  if (!dataMap[dataKey]) return console.error(chalk.bgRed('GET DATA •') + chalk.red(` Unknown data key: ${dataKey}`))

  return dataMap[dataKey]()
}

rpc.register('getDataAccount', async (player: PlayerMp, dataKey: string, targetID: number) => {
  const login = player.getVariable('login_player')

  if (!login) {
    console.error(chalk.red(`Игрок ${login} не авторизован!`))
    return
  }

  console.log(`СИД для ${login}: ${await getDataAccount(player, login, dataKey, targetID)}`)
  const result = await getDataAccount(player, login, dataKey, targetID)
  return result
})