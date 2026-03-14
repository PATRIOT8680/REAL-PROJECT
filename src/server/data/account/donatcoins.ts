import { data } from "../../database/mysql";
import chalk from "chalk";
import { connectedUsers } from "../dataConnectedUser";
import { rce } from "../../utils/rce";

export const getDonatCoins = (sid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE sid = ?'
    data.query(sql, [sid], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].donatcoins)
    })
  })
}

export const addDonatCoins = async (player: PlayerMp, sid: number, amount: number): Promise<boolean> => {
  try {
    const sql = 'UPDATE accounts SET donatcoins = donatcoins + ? WHERE sid = ?'
    const currentDC = connectedUsers.getField(player.id, 'donatcoins')

    return new Promise((resolve, reject) => {
      data.query(sql, [amount, sid], (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• ADD DC •') + chalk.red(` Ошибка add: ${err}`))
          reject(err)
          return
        }

        if (result.affectedRows > 0) {
          rce.triggerClient(player, 'execute', `window.App.donatCoinsReducer.addDonatCoins(${amount})`)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• ADD DC •') + chalk.red(` Ошибка: ${e}`))
    return false
  }
}


export const decrementDonatCoins = async (player: PlayerMp, sid: number, amount: number): Promise<boolean | string> => {
  try {
    const checkSql = 'SELECT donatcoins FROM accounts WHERE sid = ?'

    return new Promise((resolve, reject) => {
      data.query(checkSql, [sid], async (err, result: any) => {
        if (err) {
          reject(err)
          return
        }

        if (result.length === 0) {
          resolve(false)
          return
        }

        const currentCash = result[0].donatcoins

        if (currentCash - amount < 0) {
          rce.triggerClient(player, 'sendNotify', 'err', 'У вас недостаточно донат - валюты!', 3700, 'top')
          resolve('noDonatCoins')
          return
        }

        const updateSql = 'UPDATE accounts SET donatcoins = donatcoins - ? WHERE sid = ?'
        data.query(updateSql, [amount, sid], (err, result: any) => {
          if (err) {
            console.log(chalk.bgRed('• DECREMENT DC •') + chalk.red(` Ошибка decrement: ${err}`))
            reject(err)
            return
          }

          if (result.affectedRows > 0) {
            rce.triggerClient(player, 'execute', `window.App.donatCoinsReducer.decrementDonatCoins(${amount})`)
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• DECREMENT DC •') + chalk.red(` Ошибка: ${e}`))
    return false
  }
}