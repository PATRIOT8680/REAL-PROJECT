import { rce } from "../utils/rce"
import chalk from "chalk";
import { data } from "../database/mysql";
import { listLoginAccs } from "./auth/login";
import { getDataAccount } from "../getData/getDataAccount";
import { setNumberChar } from "../getData/char/numberChar";

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

  rce.triggerClient(player, 'moveSkyCamera', 'up', 2)
  setNumberChar(player.id, numberSlot)
  player.dimension = 0

  try {
    const sql = `SELECT coordquit FROM chars WHERE firstname = ? AND lastname = ?`

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

        if (cash === null || bankmoney === null) {
          console.log('Не удалось получить данные');
        }

        console.log('Сработка после запроса')
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
      })
    } catch (e) {
      console.log(chalk.bgRed('• SELECT CHAR •' + chalk.red(` Ошибка: ${e}`)))
    }
  }
})