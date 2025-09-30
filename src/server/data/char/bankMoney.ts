import { data } from '../../database/mysql'
import { rce } from "../../utils/rce";
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

    return new Promise((resolve, reject) => {
      data.query(sql, [amount, uid], (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• ADD BANKMONEY •') + chalk.red(` Ошибка add: ${err}`))
          reject(err)
          return
        }

        if (result.affectedRows > 0) {
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

export const decrementBankMoney = (player: PlayerMp, uid: number, amount: number): Promise<boolean> => {
  try {
    const sql = 'UPDATE chars SET bankmoney = bankmoney - ? WHERE uid = ?'

    return new Promise((resolve, reject) => {
      data.query(sql, [amount, uid], (err, result: any) => {
        if (err) {
          console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Ошибка add: ${err}`))
          reject(err)
          return
        }

        if (result.affectedRows > 0) {
          rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.decrementBankMoney(${amount})`)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  } catch (e) {
    console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Ошибка: ${e}`))
  }
}