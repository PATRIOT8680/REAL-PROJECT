import { data } from "../../database/mysql";
import chalk from 'chalk'
import bcrypt from 'bcryptjs'
import { rce } from '../../utils/rce'
import { selectChar } from "../select-char";
import { getNumberChar } from "../../getData/char/numberChar";

import { User } from './main';
import { getDataAccount } from "../../getData/getDataAccount";

export const listLoginAccs = new Map<number, { sid: number, login: string }>()

export const loginUser = (player: PlayerMp, login: string, password: string) => {
  const checkSql = 'SELECT * FROM accounts WHERE login = ? OR email = ?'
  data.query(checkSql, [login, login, password], (err, results) => {
    if (err) {
      console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (checkSql > login): ${err}`)))
      return
    }

    if (Array.isArray(results) && results.length === 0) {
      rce.triggerClient(player, 'sendNotify', 'err', `Аккаунт "${login}" не найден!`, 4500, 'right')
      return
    }

    if (Array.isArray(results) && results.length > 0) {
      const user = results[0] as User

      bcrypt.compare(password, user.password, async (err, match) => {
        if (err) {
          console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка сравнения пароля (login): ${err}`)))
          return
        }

        if (match) {
          //selectChar(player)
          player.setVariable('login_player', login)
          //player.spawn(new mp.Vector3(1948.4307861328125, 3916.800048828125, 38.833740234375))
          //rce.triggerClient(player, 'sendNotify', 'success', `${login}, вы успешно авторизовались!`, 4000, 'bottom')
          rce.triggerClient(player, 'server:auth:saveLogin', login)
          rce.triggerCef(player, 'server:authSuccess')
          console.log(chalk.bgGreen('• LOGIN •') + chalk.green(` Пользователь ${login} успешно авторизован!`))

          console.log('ага ага')
          const checkChar = 'SELECT numberslot, firstname, lastname, age FROM chars WHERE sid = ?'
          const sid = await getDataAccount(player, 'sid', player.id)
          console.log('ага ага 2')
          listLoginAccs.set(player.id, { sid, login })
          console.log(`Передали id: ${player.id}`)

          data.query(checkChar, [sid], async (err, charResults) => {
            if (err) {
              console.log(chalk.bgRed('• CHAR •' + chalk.red(`Ошибка получения данных о char: ${err}`)))
              return
            }
            console.log('Хе хе бой 0')

            if (Array.isArray(charResults) && charResults.length > 0) {
              const emptyChar: any = charResults.find((char: any) =>
                !char.firstname && !char.lastname && !char.age
              )

              if (emptyChar) {
                console.log('Хе хе бой - пустые поля')
                console.log('Пустой слот:', Number(emptyChar.numberslot))
                const sid = await getDataAccount(player, 'sid', player.id)
                rce.triggerClient(player, 'closedSelectCreateChar', sid, emptyChar.numberslot)
              } else {
                console.log('переходим к выборке')
                // Все строки заполнены, переходим к выбору персонажа
                selectChar(player)
              }
            } else {
              selectChar(player)
              console.log('Нет данных о персонаже для SID:', sid);
              // Обработка случая, когда у аккаунта нет персонажей
              // Возможно, нужно вызвать создание нового персонажа
              //rce.call('handleCreateNewChar');
            }
          })
        } else {
          rce.triggerClient(player, 'sendNotify', 'err', 'Неверный логин или пароль!', 5000, 'right')
        }
      })
    }
  })
}

mp.events.add('playerQuit', async (player: PlayerMp) => {
  listLoginAccs.delete(player.id)
  console.log(`вышел с игры: ${player.id}`)

  if (player.getVariable('player_spawned')) {
    const numberSlot = getNumberChar(player.id)
    const coords = {
      x: player.position.x.toFixed(3),
      y: player.position.y.toFixed(3),
      z: player.position.z.toFixed(3),
      heading: player.heading.toFixed(3)
    }

    try {
      const sid = await getDataAccount(player, 'sid', player.id)
      console.log(getNumberChar(player.id))
      const sql = 'UPDATE chars SET coordquit = ? WHERE sid = ? AND numberslot = ?'
      const coordString = JSON.stringify(coords)

      data.query(sql, [coordString, sid, numberSlot], (err, results) => {
        if (err) {
          console.log(chalk.bgRed('• QUIT •') + chalk.red(` Координаты записаны с ошибкой: ${err}`))
          return
        }

      })
    } catch (e) {
      console.log(chalk.bgRed('• QUIT •') + chalk.red(` Ошибка: ${e}`))
    }
  }
})