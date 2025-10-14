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
      return null
    }

    if (!targetPlayer.getVariable('login_player')) {
      return null
    }

    const targetLogin = targetPlayer.getVariable('login_player')

    const sid = await getSid(targetLogin)

    if (!targetLogin) {
      return null;
    }

    const dataMap = {
      sid: () => {
        return getSid(targetLogin);
      },
      uid: () => {
        return getUid(sid);
      },
      cash: async () => {
        const uid = await getUid(sid);
        return getCash(uid);
      },
      bankmoney: async () => {
        const uid = await getUid(sid);
        return getBankMoney(uid);
      },
      donatcoins: () => {
        return getDonatCoins(sid);
      },
      nickname: async () => {
        const uid = await getUid(sid);
        return getNickname(uid);
      },
    }

    if (!dataMap[dataKey]) {
      return null;
    }

    const result = await dataMap[dataKey]();
    return result;
  } catch (e) {
    console.log(chalk.bgRed('[GET DATA]') + chalk.red(` Ошибка: ${e}`));
    return null;
  }
}

export const getMultipleDataAccount = async (player: PlayerMp, keysArray: string[], targetId: number): Promise<object> => {
  try {
    const targetPlayer = mp.players.at(targetId)
    if (!targetPlayer) {
      return {}
    }

    if (!targetPlayer.getVariable('login_player')) {
      return {}
    }

    const targetLogin = targetPlayer.getVariable('login_player')

    const sid = await getSid(targetLogin)

    if (!targetLogin) {
      return {};
    }

    const dataMap = {
      sid: () => {
        return Promise.resolve(sid);
      },
      uid: async () => {
        const uid = await getUid(sid);
        return uid;
      },
      cash: async () => {
        const uid = await getUid(sid);
        return getCash(uid);
      },
      bankmoney: async () => {
        const uid = await getUid(sid);
        return getBankMoney(uid);
      },
      donatcoins: () => {
        return getDonatCoins(sid);
      },
      nickname: async () => {
        const uid = await getUid(sid);
        return getNickname(uid);
      },
    }

    const results = {}

    for (const key of keysArray) {

      if (dataMap[key]) {
        try {
          results[key] = await dataMap[key]();
        } catch (e) {
          results[key] = null;
        }
      } else {
        results[key] = null;
      }
    }

    return results
  } catch (e) {
    console.log(chalk.bgRed('[GET MULTIPLE DATA]') + chalk.red(` Общая ошибка: ${e}`));
    return {};
  }
}

rce.registerClientCef('getDataAccount', async (player: PlayerMp, dataKey: string, targetID: number) => {
  const result = await getDataAccount(player, dataKey, targetID);
  return result;
})

rce.registerClientCef('getMultipleDataAccount', async (player: PlayerMp, keysArray: string[], targetID: number) => {
  const result = await getMultipleDataAccount(player, keysArray, targetID);
  return result;
})