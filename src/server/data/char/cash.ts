import { data } from '../../database/mysql'
import { rce } from "../../utils/rce";
import chalk from "chalk";

export const getCash = (uid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM chars WHERE uid = ?'
    data.query(sql, [uid], (err, result) => {
      if (err) reject(err)
      else resolve(result[0].cash)
    })
  })
}

export const addCash = async (player: PlayerMp, uid: number, amount: number): Promise<boolean> => {
  try {
    const sql = 'UPDATE chars SET cash = cash + ? WHERE uid = ?'

    return new Promise((resolve, reject) => {
      data.query(sql, [amount, uid], (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• ADD CASH •') + chalk.red(` Ошибка add: ${err}`))
          reject(err)
          return
        }

        if (result.affectedRows > 0) {
          rce.triggerClient(player, 'execute', `window.App.cashReducer.addCash(${amount})`)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• ADD CASH •') + chalk.red(` Ошибка: ${e}`))
    return false
  }
}

export const decrementCash = async (player: PlayerMp, uid: number, amount: number): Promise<boolean | string> => {
  try {
    // Сначала проверяем достаточно ли денег
    const checkSql = 'SELECT cash FROM chars WHERE uid = ?'

    return new Promise((resolve, reject) => {
      data.query(checkSql, [uid], async (err, result: any) => {
        if (err) {
          reject(err)
          return
        }

        if (result.length === 0) {
          resolve(false)
          return
        }

        const currentCash = result[0].cash

        if (currentCash - amount < 0) {
          const player = mp.players.toArray().find(p => p.getVariable('uid') === uid)
          if (player) {
            rce.triggerClient(player, 'sendNotify', 'err', 'У вас недостаточно наличных!', 3700, 'bottom')
          }
          resolve('noCash')
          return
        }

        const updateSql = 'UPDATE chars SET cash = cash - ? WHERE uid = ?'
        data.query(updateSql, [amount, uid], (err, result: any) => {
          if (err) {
            console.log(chalk.bgRed('• DECREMENT CASH •') + chalk.red(` Ошибка decrement: ${err}`))
            reject(err)
            return
          }

          if (result.affectedRows > 0) {
            rce.triggerClient(player, 'execute', `window.App.cashReducer.decrementCash(${amount})`)
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• DECREMENT CASH •') + chalk.red(` Ошибка: ${e}`))
    return false
  }
}