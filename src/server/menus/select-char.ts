import { rce } from "../utils/rce"
import chalk from "chalk";
import { data } from "../database/mysql";
import { listLoginAccs } from "./auth/login";
import { getDataAccount } from "../data/getDataAccount";
import { setNumberChar } from "../data/char/numberChar";
import { connectedUsers } from "../data/dataConnectedUser";
import { getMaxExpForLevel } from "../player/experience";
import { setCustomizationChar } from "../index";
import { sendInventoryToCef } from "../modules/inventory/inventoryHandlers";

interface IDataChar {
  firstname: string,
  lastname: string,
  numberslot: number,
  cash: number,
  bankmoney: number,
}

export const selectChar = (player: PlayerMp) => {
  rce.triggerClient(player, 'player:freeze', true)

  player.position = new mp.Vector3(-142.221, -599.458, 211.775)
  player.heading = 30.854
  rce.triggerClient(player, 'server:showSelectChar')
}

rce.registerClient('client:setSelectedChar', async (player: PlayerMp, numberSlot: number, statusSlot: string, plPos) => {
  player.position = new mp.Vector3(plPos.x, plPos.y, plPos.z)
  player.heading = plPos.heading

  const sid = await getDataAccount(player, 'sid', player.id)
  const selectCharQuery = 'SELECT * FROM chars WHERE sid = ? AND numberslot = ?'

  if (statusSlot === 'active' || statusSlot === 'ban') {
    data.query(selectCharQuery, [sid, numberSlot], (err, results: any) => {
      if (err) {
        return console.log(chalk.bgRed('• SELECT CHAR •') + chalk.red(` ${err}`))
      }

      if (!results || results.length === 0) {
        return console.log(chalk.bgRed('• SELECT CHAR •') + chalk.red(` Персонаж не найден: SID #${sid}, NSLOT: ${numberSlot}`))
      }

      const charData = results[0]
      player.setClothes(8, 15, 0, 2);
      setCustomizationChar(player, JSON.parse(charData.chardata))
    })
  } else {
    player.setCustomization(
        true,
        0,
        0,
        0,
        0,
        0,
        0,
        0.0,
        0.0,
        0,
        0,
        0,
        0,
        []
    )

    for (let i = 0; i < 13; i++) {
      player.setHeadOverlay(i, [0, 0.0, 0, 0])
    }

    player.setClothes(2, 0, 0, 2)
    player.setClothes(11, 0, 0, 2)
    player.setClothes(4, 0, 0, 2)
    player.setClothes(6, 0, 0, 2)
  }
})

rce.registerCef('handleSpawnPlayer', async (player: PlayerMp, nickname: string, numberSlot: number, pointSpawn: string) => {
  if (pointSpawn !== 'exit' && pointSpawn !== 'rent') {
    return rce.triggerClient(player, 'sendNotify', 'info', 'В разработке!', 3500, 'top')
  }

  const nameParts = nickname.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ')
  rce.triggerClient(player, 'closeSelectChar')
  rce.triggerClient(player, 'execute', 'window.App.selectCharReducer.hideSelectChar()')
  player.setVariable('player_spawned', true)

  rce.triggerClient(player, 'execute', `window.App.playerInfoReducer.setNickname('${nickname}')`)
  console.log(nickname)
  setNumberChar(player.id, numberSlot)
  player.dimension = 0

  try {
    const sql = `SELECT uid, coordquit, adminlvl, age, cash, bankmoney, lvl, exp, health, armour, chardata FROM chars WHERE firstname = ? AND lastname = ?`

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
        let coords: any

        switch (pointSpawn) {
          case 'exit':
            coords = JSON.parse(results[0].coordquit)
            break

          case 'rent':
            coords = {
              x: 1392.2622,
              y: 3594.6489,
              z: 34.8918,
              heading: -117.2898
            }
            break
          default:
            rce.triggerClient(player, 'sendNotify', 'err', 'Неизвестная точка спавна!', 3500, 'top')
        }


        rce.triggerClient(player, 'execute', `window.App.spawnReducer.hideSpawn()`)
        sendInventoryToCef(player, await getDataAccount(player, 'uid', player.id))

        player.spawn(new mp.Vector3(parseFloat(coords.x), parseFloat(coords.y), parseFloat(coords.z)))
        player.heading = parseFloat(coords.heading)
        player.health = results[0].health
        player.armour = results[0].armour

        const cash = await getDataAccount(player, 'cash', player.id)
        const bankmoney = await getDataAccount(player, 'bankmoney', player.id)

        const sql = 'UPDATE chars SET coordquit = ? WHERE uid = ?'
        const uid = await getDataAccount(player, 'uid', player.id)
        const dataChar = JSON.parse(results[0].chardata)

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
        connectedUsers.setUser(player.id, {
          uid: results[0].uid,
          nickName: `${firstName} ${lastName}`,
          gender: dataChar.gender,
          adminLvl: results[0].adminlvl,
          age: results[0].age,
          cash: results[0].cash,
          bankmoney: results[0].bankmoney,
          lvl: results[0].lvl,
          exp: results[0].exp,
          unique_quest: results[0].unique_quest
        })

        rce.trigger('charSpawned', player)
        player.setVariable('gender', dataChar.gender)
        rce.triggerClient(player, 'execute', `window.App.cashReducer.setCash(${cash})`)
        rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.setBankMoney(${bankmoney})`)

        setCustomizationChar(player, JSON.parse(results[0].chardata))
        rce.triggerClient(player, 'closeSelectChar')
      } catch (e) {
        console.log(chalk.bgRed('• SPAWN •') + chalk.red(` Ошибка парсинга координат: ${e}`))
      }
    })
  } catch (e) {
    console.log(chalk.bgRed('• SPAWN CHAR •' + chalk.red(` Ошибка: ${e}`)))
  }
})

rce.registerClient('client:playerSpawnedBeforeAuth', async (player: PlayerMp) => {
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

        const slots = []
        const firstSlotChar: any = Array.isArray(results) ? results.find((char: any) => char.numberslot === 1) : null

        if (firstSlotChar) {
          player.setClothes(8, 15, 0, 2)
          setCustomizationChar(player, JSON.parse(firstSlotChar.chardata))
        } else {
          player.setCustomization(
              true,
              0, 0, 0, 0, 0, 0,
              0.0, 0.0, 0, 0, 0, 0,
              []
          )

          for (let i = 0; i < 13; i++) {
            player.setHeadOverlay(i, [0, 0.0, 0, 0])
          }

          player.setClothes(2, 0, 0, 2)
          player.setClothes(11, 0, 0, 2)
          player.setClothes(4, 0, 0, 2)
          player.setClothes(6, 0, 0, 2)
        }

        for (let i = 1; i <= 5; i++) {
          const charData: any = Array.isArray(results) ?
              results.find((char: any) => char.numberslot === i) :
              null

          if (charData) {
            let status = 'active'

            slots.push({
              status: status,
              nickname: `${charData.firstname} ${charData.lastname}`,
              numberChar: i,
              lvl: charData.lvl,
              exp: charData.exp,
              cash: charData.cash,
              bankmoney: charData.bankmoney,
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
            return `{ status: '${slot.status}', nickname: '${slot.nickname}', numberChar: ${slot.numberChar}, lvl: ${slot.lvl}, exp: ${slot.exp}, expMax: ${getMaxExpForLevel(slot.lvl)}, cash: ${slot.cash}, bankmoney: ${slot.bankmoney}, fraction: 'LSPD', family: 'Бездари'}`
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