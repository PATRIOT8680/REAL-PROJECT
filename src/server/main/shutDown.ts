import { data } from "../database/mysql";
import { getDataAccount } from "../getData/getDataAccount";
import chalk from "chalk";

const savedCoordQuit = async () => {
  for (const player of mp.players.toArray()) {
    if(player.getVariable("player_spawned")) return

    try {
      console.log(`Начинаем запись: ${player.id}`)

      const uid = await getDataAccount(player, 'uid', player.id)
      console.log(`Получили UID: ${uid}`)

      if (!uid) {
        console.log(chalk.bgYellow('• SHUTDOWN •') + chalk.yellow(` UID не найден для игрока ${player.id}`))
        continue
      }

      const coords = {
        x: player.position.x.toFixed(3),
        y: player.position.y.toFixed(3),
        z: player.position.z.toFixed(3),
        heading: player.heading.toFixed(3)
      }

      const sql = 'UPDATE chars SET coordquit = ? WHERE uid = ?'
      const coordString = JSON.stringify(coords)

      console.log(`Записываем в БД: ${coordString}`)

      await new Promise((resolve, reject) => {
        data.query(sql, [coordString, uid], (err, results) => {
          if (err) {
            console.log(chalk.bgRed('• SHUTDOWN •') + chalk.red(` Ошибка записи coords: ${err}`))
            reject(err)
          } else {
            console.log(chalk.bgGreen('• SHUTDOWN •') + chalk.green(` Координаты игрока ${player.id} сохранены`))
            resolve(results)
          }
        })
      })
    } catch (e) {
      console.log(chalk.bgRed('• SHUTDOWN •') + chalk.red(` Ошибка: ${e}`))
    }
  }
}

mp.events.add("serverShutdown", async () => {
  mp.events.delayShutdown = true
  await savedCoordQuit()

  setTimeout(() => {
    mp.events.delayShutdown = false
  }, 3000)
})