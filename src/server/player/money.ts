// import { data } from "../database/mysql";
// import { rce } from "../utils/rce";
// import { getDataAccount } from "../getData/getDataAccount";
// import chalk from "chalk"
//
// export const addCash = async (player: PlayerMp, amount: number) => {
//   try {
//     const sql = 'UPDATE chars SET cash = cash + ? WHERE uid = ?'
//     const uid = await getDataAccount(player, 'uid', player.id)
//
//     data.query(sql, [amount, uid], (err, result) => {
//       if (err) return console.log(chalk.bgRed('• ADD CASH •') + chalk.red(` Ошибка add: ${err}`))
//       rce.triggerClient(player, 'execute', `window.App.cashReducer.addCash(${amount})`)
//     })
//   } catch (e) {
//     console.log(chalk.bgRed('• ADD CASH •') + chalk.red(` Ошибка: ${e}`))
//   }
// }
//
// export const decrementCash = async (player: PlayerMp, amount: number) => {
//   try {
//     const cashData = await getDataAccount(player, 'cash', player.id)
//
//     if (cashData - amount < 0) {
//       rce.triggerClient(player, 'sendNotify', 'err', 'У вас недостаточно наличных!', 3700, 'bottom')
//       return 'noCash'
//     }
//
//     const sql = 'UPDATE chars SET cash = cash - ? WHERE uid = ?'
//     const uid = await getDataAccount(player, 'uid', player.id)
//
//     data.query(sql, [amount, uid], (err, result) => {
//       if (err) return console.log(chalk.bgRed('• DECREMENT CASH •') + chalk.red(` Ошибка decrement: ${err}`))
//       rce.triggerClient(player, 'execute', `window.App.cashReducer.decrementCash(${amount})`)
//     })
//   } catch (e) {
//     console.log(chalk.bgRed('• DECREMENT CASH •') + chalk.red(` Ошибка: ${e}`))
//   }
// }
//
// export const addBankMoney = async (player: PlayerMp, amount: number) => {
//   try {
//     const sql = 'UPDATE chars SET bankmoney = bankmoney + ? WHERE uid = ?'
//     const uid = await getDataAccount(player, 'uid', player.id)
//
//     data.query(sql, [amount, uid], (err, result) => {
//       if (err) return console.log(chalk.bgRed('• ADD BANKMONEY •') + chalk.red(` Ошибка add: ${err}`))
//       rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.addBankMoney(${amount})`)
//     })
//   } catch (e) {
//     console.log(chalk.bgRed('• ADD BANKMONEY •') + chalk.red(` Ошибка: ${e}`))
//   }
// }
//
// export const decrementBankMoney = async (player: PlayerMp, amount: number) => {
//   try {
//     const bankMoneyData = await getDataAccount(player, 'cash', player.id)
//
//     if (bankMoneyData - amount < 0) {
//       rce.triggerClient(player, 'sendNotify', 'err', 'У вас недостаточно средств на карте!', 3800, 'bottom')
//       return 'noBankMoney'
//     }
//
//     const sql = 'UPDATE chars SET bankmoney = bankmoney - ? WHERE uid = ?'
//     const uid = await getDataAccount(player, 'uid', player.id)
//
//     data.query(sql, [amount, uid], (err, result) => {
//       if (err) return console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Ошибка decrement: ${err}`))
//       rce.triggerClient(player, 'execute', `window.App.bankMoneyReducer.decrementBankMoney(${amount})`)
//     })
//   } catch (e) {
//     console.log(chalk.bgRed('• DECREMENT BANKMONEY •') + chalk.red(` Ошибка: ${e}`))
//   }
// }
//
//
// rce.registerClientCef('addCash', async (player: PlayerMp, amount: number) => {
//   addCash(player, amount)
// })
//
// rce.registerClientCef('decrementCash', async (player: PlayerMp, amount: number) => {
//   decrementCash(player, amount)
// })
//
// rce.registerClientCef('addBankMoney', async (player: PlayerMp, amount: number) => {
//   addBankMoney(player, amount)
// })
//
// rce.registerClientCef('decrementBankMoney', async (player: PlayerMp, amount: number) => {
//   decrementBankMoney(player, amount)
// })