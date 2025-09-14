import { data } from "../database/mysql";
import { getDataAccount } from "../getData/getDataAccount";
import chalk from "chalk";

const savedCoordQuit = async (player: PlayerMp) => {
  const uid = await getDataAccount(player, 'uid', player.id)

  const coords = {
    x: player.position.x.toFixed(3),
    y: player.position.y.toFixed(3),
    z: player.position.z.toFixed(3),
    heading: player.heading.toFixed(3)
  }

  try {
    const sql = 'UPDATE chars SET coordquit = ? WHERE uid = ?'
    const coordString = JSON.stringify(coords)

    data.query(sql, [coordString, uid], (err, results) => {
      if (err) return console.log(chalk.bgRed('• SHUTDOWN •') + chalk.red(` Ошибка записи coords: ${err}`))
    })
  } catch (e) {
    console.log(chalk.bgRed('• SHUTDOWN •') + chalk.red(` Ошибка: ${e}`))
  }
}

mp.events.add("serverShutdown", () => {
  mp.events.delayShutdown = true
  mp.players.forEach((player: PlayerMp) => {
    savedCoordQuit(player)
  })
  mp.events.delayShutdown = false
})