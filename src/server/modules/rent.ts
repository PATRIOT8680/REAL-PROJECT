import {registerCMD, send} from "../menus/chat";
import {rce} from "../utils/rce";
import { data } from "../database/mysql";
import chalk from "chalk";

let rentsData = []

mp.events.add('playerJoin', async (player: PlayerMp) => {
  rentsData.forEach(rent => {
    rce.triggerClient(player, 'createPed', rent.pedName, 'Местный арендатор', rent.modelName, [Number(rent.pedPos.x), Number(rent.pedPos.y), Number(rent.pedPos.z), Number(rent.pedPos.heading)], { isVisible: true, id: 811, color: 44 })
  })
})

const loadRent = async () => {
  try {
    const connection = await data.promise().getConnection()

    try {
      const [rows]: any = await connection.execute('SELECT * FROM rent')

      if (rows.length === 0) {
        return console.log(chalk.bgYellow("RENT") + chalk.yellow(" Таблица rents пустая!"))
      }

      rentsData = rows.map((row: any) => {
        let parsedPedpos = null

        if (row.pedpos) {
          try {
            parsedPedpos = JSON.parse(row.pedpos)
          } catch (e) {
            console.log(chalk.bgRed('RENT' + chalk.red(` Ошибка парсинга: ${e}`)));
          }
        }

        // const ped: any = mp.peds.new(mp.joaat(row.modelname),
        //   new mp.Vector3(Number(parsedPedpos.x), Number(parsedPedpos.y), Number(parsedPedpos.z)),
        //   {
        //     dynamic: true,
        //     frozen: true,
        //     invincible: true,
        //     lockController: false,
        //     heading: row.heading,
        //     dimension: 0
        //   }
        // )

        return {
          pedName: row.pedname,
          modelName: row.modelname,
          pedPos: parsedPedpos
        }
      })

      console.log(chalk.bgGreenBright("RENT") + chalk.greenBright(` Загружено ${rows.length} точек аренды`))
    } finally {
      await connection.release()
    }

  } catch (e) {
    console.error(chalk.bgRed('RENT' + chalk.red(` ${e}`)));
  }
}

loadRent()