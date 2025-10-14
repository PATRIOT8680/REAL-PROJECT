import { rce } from "../utils/rce"
import chalk from "chalk";
import { data } from "../database/mysql";
import { listLoginAccs } from "./auth/login";
import { getDataAccount } from "../data/getDataAccount";
import { setNumberChar } from "../data/char/numberChar";
import { connectedUsers } from "../data/dataConnectedUser";

interface IDataChar {
  firstname: string,
  lastname: string,
  numberslot: number,
  cash: number,
  bankmoney: number,
}

export const selectChar = (player: PlayerMp) => {
  rce.triggerClient(player, 'moveSkyCamera', 'up', 2)
  rce.triggerClient(player, 'player:freeze', true)

  setTimeout(() => {
    player.position = new mp.Vector3(-142.221, -599.458, 211.775)
    player.heading = 30.854
    rce.triggerClient(player, 'moveSkyCamera', 'down')
    rce.triggerClient(player, 'server:showSelectChar')
  }, 4000)
}

rce.registerCef('handleSpawnPlayer', (player: PlayerMp, nickname: string, numberSlot: number) => {
  const nameParts = nickname.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ')
  rce.triggerClient(player, 'closeSelectChar')
  rce.triggerClient(player, 'execute', 'window.App.selectCharReducer.hideSelectChar()')
  player.setVariable('player_spawned', true)

  rce.triggerClient(player, 'moveSkyCamera', 'up', 2)
  rce.triggerClient(player, 'execute', `window.App.playerInfoReducer.setNickname('${nickname}')`)
  console.log(nickname)
  setNumberChar(player.id, numberSlot)
  player.dimension = 0

  try {
    const sql = `SELECT coordquit, adminlvl FROM chars WHERE firstname = ? AND lastname = ?`

    data.query(sql, [firstName, lastName], async (err, results) => {
      if (err) {
        console.log(chalk.bgRed('• SPAWN •') + chalk.red(` Ошибка запроса к БД: ${err}`))
        return
      }

      if (Array.isArray(results) && results.length === 0) {
        console.log(chalk.bgYellow('• SPAWN •') + chalk.yellow(` Игрок с никнеймом ${nickname} не найден в БД.`))
        return
      }

      try {
        const coords = JSON.parse(results[0].coordquit)
        player.spawn(new mp.Vector3(parseFloat(coords.x), parseFloat(coords.y), parseFloat(coords.z)))
        player.heading = parseFloat(coords.heading)

        console.log('Сработка до запроса')
        const cash = await getDataAccount(player, 'cash', player.id)
        const bankmoney = await getDataAccount(player, 'bankmoney', player.id)

        const sql = 'UPDATE chars SET coordquit = ? WHERE uid = ?'
        const uid = await getDataAccount(player, 'uid', player.id)

        const coordExit = {
          x: player.position.x.toFixed(3),
          y: player.position.y.toFixed(3),
          z: player.position.z.toFixed(3),
          heading: player.heading.toFixed(3)
        }
        const coordString = JSON.stringify(coordExit)

        data.query(sql, [coordString, uid], (err, results) => {
          if (err) return console.log(chalk.bgRed('• SHUTDOWN •') + chalk.red(` Ошибка записи coords: ${err}`))
        })

        player.setVariable('ADMIN_LVL', results[0].adminlvl)
        connectedUsers.setUser(player.id, { nickName: `${firstName} ${lastName}`, adminLvl: results[0].adminlvl })
        rce.triggerClient(player, 'execute', `window.App.cashReducer.setCash(${cash})`)
        rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.setBankMoney(${bankmoney})`)

        setTimeout(() => {
          rce.triggerClient(player, 'moveSkyCamera', 'down')
          rce.triggerClient(player, 'closeSelectChar')
        }, 4000)
      } catch (e) {
        console.log(chalk.bgRed('• SPAWN •') + chalk.red(` Ошибка парсинга координат: ${e}`))
      }
    })
  } catch (e) {
    console.log(chalk.bgRed('• SPAWN CHAR •' + chalk.red(` Ошибка: ${e}`)))
  }
})

rce.registerClient('client:flyEndSelectChar', async (player: PlayerMp) => {
  if (listLoginAccs.has(player.id)) {
    try {
      const sid = await getDataAccount(player, 'sid', player.id)
      const sql = 'SELECT * FROM chars WHERE sid = ? ORDER BY numberslot'
      const donatcoins = await getDataAccount(player, 'donatcoins', player.id)

      data.query(sql, [sid], (err, results) => {
        if (err) {
          console.log(chalk.bgRed('• SELECT CHAR •' + chalk.red(` Ошибка загрузки chars: ${err}`)))
          return
        }

        const slots = [];
        for (let i = 1; i <= 5; i++) {
          const charData: any = Array.isArray(results) ?
            results.find((char: any) => char.numberslot === i) :
            null

          if (charData) {
            let status = 'active'

            slots.push({
              status: status,
              nickname: `${charData.firstname} ${charData.lastname}`,
              numberChar: i
            })
          } else {
            if (i <= 3) {
              slots.push({ status: 'free', numberChar: i })
            } else {
              slots.push({ status: 'donat', numberChar: i })
            }
          }
        }

        const slotData = slots.map((slot: any) => {
          if (slot.nickname) {
            return `{ status: '${slot.status}', nickname: '${slot.nickname}', numberChar: ${slot.numberChar} }`
          } else {
            return `{ status: '${slot.status}', numberChar: ${slot.numberChar} }`
          }
        }).join(', ')

        rce.triggerClient(player, 'execute', `window.App.selectCharReducer.showSelectChar(${slotData})`)
        rce.triggerClient(player, 'execute', `window.App.donatCoinsReducer.setDonatCoins(${donatcoins})`)
      })
    } catch (e) {
      console.log(chalk.bgRed('• SELECT CHAR •' + chalk.red(` Ошибка: ${e}`)))
    }
  }
})

rce.registerClient('selectChar:getDataAllChars', async (player: PlayerMp) => {
  return new Promise((resolve: any, reject) => {
    getDataAccount(player, 'sid', player.id).then(sid => {
      if (!sid) {
        console.error(chalk.red(`[SELECT CHAR] No SID for player ${player.id}`))
        resolve([])
        return
      }

      const sql = 'SELECT firstname, lastname, numberslot, cash, bankmoney FROM chars WHERE sid = ?'

      data.query(sql, [sid], (err, results: any) => {
        if (err) {
          console.log(chalk.bgRed('• SELECT CHAR •') + chalk.red(` DB error: ${err}`))
          reject(err)
          return
        }

        const charsData = results.map((char: any) => ({
          nickname: `${char.firstname} ${char.lastname}`,
          numberslot: char.numberslot,
          cash: char.cash,
          bankmoney: char.bankmoney,
        }))

        resolve(charsData)
      })
    }).catch(error => {
      console.log(chalk.bgRed('• SELECT CHAR •') + chalk.red(` Error getting SID: ${error}`))
      reject(error)
    });
  })
})