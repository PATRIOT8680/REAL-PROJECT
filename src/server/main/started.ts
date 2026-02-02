import { initTimeSystem } from "../world/time";
import { initItems } from "../modules/inventory/items";
import { loadItems } from "../modules/inventory/itemsObject";
import { data } from "../database/mysql";
import { rce } from "../utils/rce";
import chalk from "chalk";

mp.events.add('packagesLoaded', () => {
  initTimeSystem()
  initItems()

  setTimeout(async () => {
    await waitForDatabase()
    loadItems()
  }, 2000)
})

async function waitForDatabase() {
  const maxAttempts = 15
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((res, rej) => {
        data.query('SELECT 1', [], (err) => err ? rej(err) : res(true))
      })
      console.log(chalk.green('[DB OK]') + ' База готова')
      return
    } catch {
      console.log(chalk.yellow('[DB WAIT]') + ` Попытка ${i + 1}/${maxAttempts}...`)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  throw new Error('База данных недоступна')
}