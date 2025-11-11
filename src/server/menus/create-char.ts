import { rce } from '../utils/rce'
import { data } from '../database/mysql'
import { getDataAccount } from '../data/getDataAccount'
import { setNumberChar } from "../data/char/numberChar";
import chalk from 'chalk'
import {Player} from "rage-rpc";
import {gui} from "../../client/menus/global";
import {connectedUsers} from "../data/dataConnectedUser";
import { setCustomizationChar } from '../index'

// rce.registerCef('cef:createChar:handleChange', (player: PlayerMp, fieldName: string, value: any) => {
//   switch (fieldName) {
//     case 'gender':
//       if (value === 'male') player.model = mp.joaat('mp_m_freemode_01')
//       else player.model = mp.joaat('mp_f_freemode_01')
//       break
//
//     case 'father':
//       player.setCustomization()
//
//     default:
//       return ''
//   }
// })

const createSlotChar = (player: PlayerMp, numberSlot: number) => {
  try {
    const sqlUid = 'SELECT MAX(uid) as maxUid from chars'

    data.query(sqlUid, [], async (err, results) => {
      if (err) return console.log(chalk.bgRed('• CREATE SLOT CHAR •' + chalk.red(` Err generate uid: ${err}`)))

      const maxUid = results[0].maxUid || 0
      const newUid = maxUid + 1

      const sid = await getDataAccount(player, 'sid', player.id)
      const sql = 'INSERT INTO chars (uid, sid, numberslot, adminlvl, cash, bankmoney, lvl, exp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

      data.query(sql, [newUid, sid, numberSlot, 0, 1500, 200, 1, 0], (err, results) => {
        if (err) return console.log(chalk.bgRed('• CREATE SLOT CHAR •' + chalk.red(` Err insert data: ${err}`)))
      })
    })


  } catch (e) {
    console.error(chalk.bgRed('• CREATE CHAR •' + chalk.red(` Ошибка createSlotChar(): ${e}`)));
  }

}

const closeCreateChar = async (player: PlayerMp) => {
  console.log(`Закрываем создание`)
  rce.triggerClient(player, 'moveSkyCamera', 'up', 2)
  rce.triggerClient(player, 'execute', 'window.App.createCharReducer.hideCreateChar()')

  const cash = await getDataAccount(player, 'cash', player.id)
  const bankmoney = await getDataAccount(player, 'bankmoney', player.id)

  player.spawn(new mp.Vector3(1948.4307861328125, 3916.800048828125, 37.333740234375))
  player.dimension = 0


  rce.triggerClient(player, 'execute', `window.App.cashReducer.setCash(${cash})`)
  rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.setBankMoney(${bankmoney})`)

  console.log(`Закрываем создание 2`)

  setTimeout(async () => {
    rce.triggerClient(player, 'moveSkyCamera', 'down')
    rce.triggerClient(player, 'closeCreateChar')

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
  }, 4000)
}

rce.registerCef('handleCreateSlotChar', async (player: PlayerMp, numberSlot: number) => {
  const sid = await getDataAccount(player, 'sid', player.id)
  rce.triggerClient(player, 'closedSelectCreateChar', sid, numberSlot)
  await createSlotChar(player, numberSlot)
  //player.playAnimation('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, 15)
})

rce.register('handleCreateSlotChar', async (playerId: number, numberSlot: number) => {
  const pl = mp.players.at(playerId)
  const sid = await getDataAccount(pl, 'sid', playerId)
  rce.triggerClient(pl, 'closedSelectCreateChar', sid, numberSlot)
  await createSlotChar(pl, numberSlot)
  //player.playAnimation('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, 15)
})

rce.registerCef('handleDonatCreatePlayer', async (player: PlayerMp, numberSlot: number) => {
  const sid = await getDataAccount(player, 'sid', player.id)
  const donatcoins = await getDataAccount(player, 'donatcoins', player.id)

  if (donatcoins - 450 < 0)
    return rce.triggerClient(player, 'sendNotify', 'err', 'Недостаточно Donat coins!', 3700, 'top')

  try {
    const sql = 'UPDATE accounts SET donatcoins = donatcoins - ? WHERE sid = ?'
    const priceSlot = 450

    data.query(sql, [priceSlot, sid], (err, results) => {
      if (err) return console.log(chalk.bgRed('• DECREMENT DONAT •') + chalk.red(` Ошибка decrement: ${err}`))
      rce.triggerClient(player, 'execute', `window.App.donatCoinsReducer.decrementDonatCoins(${priceSlot})`)
    })
  } catch (e) {
    console.error(chalk.bgRed('• CREATE CHAR •' + chalk.red(` Ошибка createDonatChar(): ${e}`)));
  }

  rce.triggerClient(player, 'closedSelectCreateChar', sid, numberSlot)
  await createSlotChar(player, numberSlot)
})

  rce.registerCef('cef:handleCreateChar', async (player: PlayerMp, numberSlot, dataChar)=> {
    try {
      const { firstName, lastName, age } = dataChar
      console.log(JSON.stringify(dataChar))
      const uid = await getDataAccount(player, 'uid', player.id)
      const checkDuplicateQuery = 'SELECT id FROM chars WHERE firstname = ? AND lastname = ?';
      console.log('0.1')
      // Проверка дубликата
      data.query(checkDuplicateQuery, [firstName, lastName], (error, duplicateResult: any) => {
        if (error) {
          console.error('Ошибка при проверке дубликата:', error);
          return;
        }

        console.log('1')
        if (duplicateResult && duplicateResult.length > 0) {
          rce.triggerClient(player, 'sendNotify', 'err', 'Персонаж с таким никнеймом уже существует!', 5000, 'bottom');
          return;
        }

        console.log('2')
        const updateCharQuery = `
            UPDATE chars 
            SET firstname = ?, lastname = ?, age = ?, chardata = ? 
            WHERE uid = ?
        `;

        // Обновление данных персонажа
        data.query(updateCharQuery, [
          firstName,
          lastName,
          Number(age),
          JSON.stringify(dataChar),
          uid
        ], (error, updateResult: any) => {
          if (error) {
            console.error('Ошибка при обновлении персонажа:', error);
            return;
          }

          console.log('3')
          if (updateResult.affectedRows === 0) {
            console.error(`Не удалось обновить персонажа UID: ${uid}, слот: ${numberSlot}`);
            rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка сохранения персонажа!', 5000, 'bottom');
            return;
          }

          console.log('4')
          player.setVariable('ADMIN_LVL', 0)
          player.setVariable('player_spawned', true)

          connectedUsers.setUser(player.id, {
            nickName: `${firstName} ${lastName}`,
            adminLvl: 0,
            age: dataChar.age,
            cash: 1500,
            bankmoney: 200,
            lvl: 1,
            exp: 0
          })

          setCustomizationChar(player, dataChar)

          console.log('5')
          rce.trigger('charSpawned', player.id)
          closeCreateChar(player)
        });
      });
    } catch (e) {
      console.error(chalk.bgRed('• CREATE CHAR •' + chalk.red(` Ошибка createChar(): ${e}`)));
    }
  })