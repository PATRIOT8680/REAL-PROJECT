import { data } from '../../database/mysql'
import { rce } from "../../utils/rce";
import { connectedUsers } from "../dataConnectedUser";
import chalk from "chalk";

export const getBankMoney = (uid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chars WHERE uid = ?'
    data.query(sql, [uid], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].bankmoney)
    })
  })
}

export const addBankMoney = (player: PlayerMp, uid: number, amount: number): Promise<boolean> => {
  try {
    const sql = 'UPDATE chars SET bankmoney = bankmoney + ? WHERE uid = ?'
    const currentBankMoney = connectedUsers.getField(player.id, 'bankmoney')

    return new Promise((resolve, reject) => {
      data.query(sql, [amount, uid], (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• ADD BANKMONEY •') + chalk.red(` Ошибка add: ${err}`))
          reject(err)
          return
        }

        if (result.affectedRows > 0) {
          connectedUsers.setUser(player.id, { bankmoney: currentBankMoney + amount })
          rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.addBankMoney(${amount})`)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• ADD BANKMONEY •') + chalk.red(` Ошибка: ${e}`))
  }
}

export const decrementBankMoney = async (player: PlayerMp, uid: number, amount: number): Promise<boolean | string> => {
  try {
    const checkSql = 'SELECT bankmoney FROM chars WHERE uid = ?'
    const cbankmoney = connectedUsers.getField(player.id, 'bankmoney')

    return new Promise((resolve, reject) => {
      data.query(checkSql, [uid], async (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Ошибка проверки: ${err}`))
          reject(err)
          return
        }

        if (result.length === 0) {
          resolve(false)
          return
        }

        const currentBankMoney = result[0].bankmoney

        if (currentBankMoney - amount < 0) {
          if (player && mp.players.exists(player)) {
            rce.triggerClient(player, 'sendNotify', 'err', 'У вас недостаточно средств на банковском счёте!', 3700, 'bottom')
          }
          resolve('noBankMoney')
          return
        }


        const updateSql = 'UPDATE chars SET bankmoney = bankmoney - ? WHERE uid = ?'
        data.query(updateSql, [amount, uid], (err, result: any) => {
          if (err) {
            console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Ошибка списания: ${err}`))
            reject(err)
            return
          }

          if (result.affectedRows > 0) {
            connectedUsers.setUser(player.id, { bankmoney: cbankmoney - amount })
            rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.decrementBankMoney(${amount})`)
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Критическая ошибка: ${e}`))
    return false
  }
}