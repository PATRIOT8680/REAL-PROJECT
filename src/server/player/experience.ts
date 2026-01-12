import { data } from "../database/mysql";
import { connectedUsers } from "../data/dataConnectedUser";
import { getDataAccount } from "../data/getDataAccount";
import { rce } from "../utils/rce";
import chalk from "chalk";

interface ILvlConf {
  maxExp: number
}

interface IPlayerLvlData {
  lvl: number,
  exp: number
}

const playerLvls = new Map<PlayerMp, IPlayerLvlData>()


// Основная система
const createLvlsConfig = (maxLvl: number): ILvlConf[] => {
  const lvls: ILvlConf[] = []

  for (let lvl = 1; lvl <= maxLvl; lvl++) {
    let maxExp: number

    if (lvl === 1) {
      maxExp = 3
    } else {
      const prevMaxExp = lvls[lvl - 2].maxExp
      maxExp = prevMaxExp + lvl + 1
    }

    lvls.push({ maxExp })
  }

  return lvls
}

const lvlsConfig = createLvlsConfig(1000)


// Добавление / удаление игрока с системы
const addPlayer = async (player: PlayerMp) => {
  try {
    const dataChar = await connectedUsers.getUser(player.id)

    playerLvls.set(player, {
      lvl: dataChar.lvl,
      exp: dataChar.exp,
    })
  } catch (e) {
    console.log(chalk.bgRed('• exp - addPlayer •') + chalk.red(` Err: ${e}`))
  }
}

const savePlayerData = async (player: PlayerMp) => {
  const playerData = await connectedUsers.getUser(player.id)
  const uid = await getDataAccount(player, 'uid', player.id)
  if (!playerData) return

  try {
    const sql = 'UPDATE chars SET lvl = ?, exp = ? WHERE uid = ?'

    data.query(sql, [playerData.lvl, playerData.exp, uid], (err, result) => {
      if (err)
        return console.log(chalk.bgRed('• exp - savePlayerData •') + chalk.red(` Err update: ${err}`))
    })
  } catch (e) {
    console.log(chalk.bgRed('• exp - savePlayerData •') + chalk.red(` Err: ${e}`))
  }
}

const removePlayer = async (player: PlayerMp) => {
  await savePlayerData(player)
  playerLvls.delete(player)
}


// Проверка повышения уровня
const checkLvlUp = async (player: PlayerMp) => {
  const playerData = playerLvls.get(player)
  if (!playerData) return

  const currentLvl = playerData.lvl
  const currentExp = playerData.exp

  if (currentLvl >= lvlsConfig.length) {
    playerData.exp = lvlsConfig[lvlsConfig.length - 1].maxExp
    return
  }

  const maxExp = lvlsConfig[currentLvl - 1].maxExp

  if (currentExp >= maxExp) {
    playerData.lvl++
    playerData.exp = 0

    await connectedUsers.setUser(player.id, {
      lvl: playerData.lvl,
      exp: playerData.exp,
    })

    await savePlayerData(player)
    rce.triggerClient(player, 'sendNotify', 'info', `Ваш уровень повышен до ${playerData.lvl}!`, 4000, 'bottom')

    checkLvlUp(player)
  }
}

// Взаимодействие с EXP
const addExp = async (player: PlayerMp, exp: number, reason?: number) => {
  const playerData = playerLvls.get(player)
  if (!playerData) return

  playerData.exp += exp

  if (reason) {
    rce.triggerClient(player, 'sendNotify', 'info', `+${exp} опыта за ${reason}`, 3000, 'bottom')
  }

  connectedUsers.setUser(player.id, {
    exp: playerData.exp,
  })

  checkLvlUp(player)
  savePlayerData(player)
}

const setPlayerLvl = async (player: PlayerMp, lvl: number) => {
  const playerData = playerLvls.get(player)
  if (!playerData) return

  if (lvl < 1) lvl = 1;
  if (lvl > lvlsConfig.length) lvl = lvlsConfig.length;

  playerData.lvl = lvl
  playerData.exp = 0

  await connectedUsers.setUser(player.id, {
    lvl: playerData.lvl,
    exp: 0
  })

  savePlayerData(player)
  rce.triggerClient(player, 'sendNotify', 'info', `Вам установлен ${lvl} уровень!`)
}


const getLevelsConfig = (): ILvlConf[] => {
  return lvlsConfig
}

const getMaxExpForLevel = (lvl: number): number => {
  if (lvl < 1 || lvl > lvlsConfig.length) return 0
  return lvlsConfig[lvl - 1].maxExp
}


export {
  addPlayer,
  removePlayer,
  addExp,
  setPlayerLvl,
  getLevelsConfig,
  getMaxExpForLevel,
  savePlayerData
}

rce.register('charSpawned', (player: PlayerMp) => {
  if (!player) return
  addPlayer(player)
})

mp.events.add('playerQuit', (player: PlayerMp) => {
  removePlayer(player)
})