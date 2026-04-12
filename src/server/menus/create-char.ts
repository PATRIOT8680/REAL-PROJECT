import { rce } from '../utils/rce'
import { data } from '../database/mysql'
import { getDataAccount } from '../data/getDataAccount'
import chalk from 'chalk'
import { connectedUsers } from "../data/dataConnectedUser";
import { setCustomizationChar } from '../index'
import { decrementDonatCoins } from "../data/account/donatcoins";
import { createInventoryForChar } from "../modules/inventory/inventory";
import { addItemToInventory, sendInventoryToCef } from "../modules/inventory/inventoryHandlers";
import { updateSlotsArray } from "../modules/inventory/inventoryMove";
import { usageClothes } from "../player/clothes";
import { findClothesItem } from "../modules/inventory/items";

const createSlotChar = async (player: PlayerMp, numberSlot: number) => {
  try {
    const sqlUid = 'SELECT MAX(uid) as maxUid from chars'

    data.query(sqlUid, [], async (err, results) => {
      if (err) return console.log(chalk.bgRed('• CREATE SLOT CHAR •' + chalk.red(` Err generate uid: ${err}`)))

      const maxUid = results[0].maxUid || 0
      const newUid = maxUid + 1

      const sid = await getDataAccount(player, 'sid', player.id)
      const sql = 'INSERT INTO chars (uid, sid, numberslot, adminlvl, cash, bankmoney, lvl, exp, health, armour, friends) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

      data.query(sql, [newUid, sid, numberSlot, 0, 1500, 200, 1, 0, 100, 0, '[]'], (err, results) => {
        if (err) return console.log(chalk.bgRed('• CREATE SLOT CHAR •' + chalk.red(` Err insert data: ${err}`)))
      })
    })

  } catch (e) {
    console.error(chalk.bgRed('• CREATE CHAR •' + chalk.red(` Ошибка createSlotChar(): ${e}`)));
  }

}

const closeCreateChar = async (player: PlayerMp, dataChar) => {
  const { clothes, gender } = dataChar

  rce.triggerClient(player, 'execute', 'window.App.createCharReducer.hideCreateChar()')

  const cash = connectedUsers.getField(player.id, 'cash')
  const bankmoney = connectedUsers.getField(player.id, 'bankmoney')
  const nickname = connectedUsers.getField(player.id, 'nickName')

  player.spawn(new mp.Vector3(-1050.2455, -2739.7385, 14.5978))
  player.heading = -29.5
  player.dimension = 0

  rce.triggerClient(player, 'execute', `window.App.cashReducer.setCash(${cash})`)
  rce.triggerClient(player, 'execute', `window.App.playerInfoReducer.setNickname('${nickname}')`)
  rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.setBankMoney(${bankmoney})`)

  rce.triggerClient(player, 'closeCreateChar')

  const uid = await getDataAccount(player, 'uid', player.id)

  rce.triggerClient(player, 'execute', `window.App.playerInfoReducer.setUid(${uid})`)

  const coordExit = {
    x: player.position.x.toFixed(3),
    y: player.position.y.toFixed(3),
    z: player.position.z.toFixed(3),
    heading: player.heading.toFixed(3)
  }

  await new Promise<void>((resolve, reject) => {
    data.query(
      'UPDATE chars SET coordquit = ?, chardata = ? WHERE uid = ?',
      [JSON.stringify(coordExit), JSON.stringify(dataChar), uid],
      (err) => {
        if (err) {
          console.log(chalk.bgRed('• CREATE CHAR •') + chalk.red(` Ошибка записи coords: ${err}`))
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })

  await createInventoryForChar(player, uid, connectedUsers.getField(player.id, 'sid'))
  await new Promise(resolve => setTimeout(resolve, 150))

  const realTopsId  = clothes.tops  ? findClothesItem('clothes', gender, 11, clothes.tops, 0)?.id ?? clothes.tops  : 0
  const realLegsId  = clothes.legs  ? findClothesItem('clothes', gender, 4,  clothes.legs, 0)?.id ?? clothes.legs  : 0
  const realShoesId = clothes.shoes ? findClothesItem('clothes', gender, 6,  clothes.shoes, 0)?.id ?? clothes.shoes : 0

  const clothesSlots = Array(13).fill(null)

  if (realTopsId)  clothesSlots[5]  = { id: realTopsId,  quantity: 1 }
  if (realLegsId)  clothesSlots[11] = { id: realLegsId,  quantity: 1 }
  if (realShoesId) clothesSlots[12] = { id: realShoesId, quantity: 1 }

  await updateSlotsArray(uid, 'clothes', clothesSlots)

  usageClothes(player, 5,  clothes.tops || 0, 0)
  usageClothes(player, 11, clothes.legs || 0, 0)
  usageClothes(player, 12, clothes.shoes || 0, 0)

  await sendInventoryToCef(player, uid)

  rce.trigger('charSpawned', player)
}

rce.registerCef('cef:buyUniqueScenario', async (player: PlayerMp, scenario: string) => {
  const uid = await getDataAccount(player, 'uid', player.id)
  const sid = await getDataAccount(player, 'sid', player.id)

  if (scenario === 'walter_white' || scenario === 'crazy_que') {
    try {
      const sql = 'UPDATE chars SET unique_quest = ? WHERE uid = ?'
      const priceScenario = 850

      return new Promise((resolve: any, reject) => {
        data.query(sql, [scenario, uid], (err, results) => {
          if (err) {
            console.log(chalk.bgRed('• SET UQUEST •') + chalk.red(` ${err}`))
            reject(err)
            return
          }

          decrementDonatCoins(player, sid, priceScenario)
          resolve('ok')
        })
      })

    } catch (e) {
      console.log(chalk.bgRed('• SET UQUEST (GL) •') + chalk.red(` ${e}`))
    }
  }
})

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
    const { firstName, lastName, age, gender } = dataChar
    const uid = await getDataAccount(player, 'uid', player.id)
    const checkDuplicateQuery = 'SELECT id FROM chars WHERE firstname = ? AND lastname = ?';

    data.query(checkDuplicateQuery, [firstName, lastName], (error, duplicateResult: any) => {
      if (error) {
        console.error('Ошибка при проверке дубликата:', error);
        return;
      }

      if (duplicateResult && duplicateResult.length > 0) {
        rce.triggerClient(player, 'sendNotify', 'err', 'Персонаж с таким никнеймом уже существует!', 5000, 'bottom');
        return;
      }

      const updateCharQuery = `
          UPDATE chars 
          SET firstname = ?, lastname = ?, age = ?, chardata = ? 
          WHERE uid = ?
      `;

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

        if (updateResult.affectedRows === 0) {
          console.error(`Не удалось обновить персонажа UID: ${uid}, слот: ${numberSlot}`);
          rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка сохранения персонажа!', 5000, 'bottom');
          return;
        }

        player.dimension = 0
        player.setVariable('ADMIN_LVL', 0)
        player.setVariable('gender', dataChar.gender)
        player.setVariable('player_spawned', true)

        connectedUsers.setUser(player.id, {
          uid: uid,
          nickName: `${firstName} ${lastName}`,
          gender: gender,
          adminLvl: 0,
          age: dataChar.age,
          cash: 1500,
          bankmoney: 200,
          lvl: 1,
          exp: 0,
          unique_quest: ''
        })

        setCustomizationChar(player, dataChar)

        rce.trigger('charSpawned', player)
        closeCreateChar(player, dataChar)
      });
    });
  } catch (e) {
    console.error(chalk.bgRed('• CREATE CHAR •' + chalk.red(` Ошибка createChar(): ${e}`)));
  }
})