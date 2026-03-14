import { data } from '../../database/mysql'
import { rce } from "../../utils/rce";
import { connectedUsers } from "../dataConnectedUser";
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
    const currentCash = connectedUsers.getField(player.id, 'cash')

    return new Promise((resolve, reject) => {
      data.query(sql, [amount, uid], (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• ADD CASH •') + chalk.red(` Ошибка add: ${err}`))
          reject(err)
          return
        }

        if (result.affectedRows > 0) {
          connectedUsers.setUser(player.id, { cash: currentCash + amount })
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
    const checkSql = 'SELECT cash FROM chars WHERE uid = ?'
    const currentCash = connectedUsers.getField(player.id, 'cash')

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
            connectedUsers.setUser(player.id, { cash: currentCash - amount })
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