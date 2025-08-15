import chalk from "chalk";
import { rpc } from '../utils/rpc'

import { getSid } from "./account/sid";

export const getDataAccount = async (player: PlayerMp, login: string, dataKey: string): Promise<any> => {
  const dataMap = {
    sid: () => getSid(login)
  }

  if (!dataMap[dataKey]) return console.error(chalk.bgRed('GET DATA •') + chalk.red(` Unknown data key: ${dataKey}`))

  return dataMap[dataKey]()
}

rpc.register('getDataAccount', async (player: PlayerMp, dataKey: string) => {
  const login = player.getVariable('login_player')

  if (!login) {
    console.error(chalk.red(`Игрок ${login} не авторизован!`))
    return
  }

  const result = await getDataAccount(player, login, dataKey)
  return result
})