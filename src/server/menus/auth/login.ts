import { data } from "../../database/mysql";
import chalk from 'chalk'
import bcrypt from 'bcryptjs'
import { rpc } from '../../utils/rpc'

import { User } from './main';

export const loginUser = (player: PlayerMp, login: string, password: string) => {
  const checkSql = 'SELECT * FROM accounts WHERE login = ? OR email = ?'
  data.query(checkSql, [login, login, password], (err, results) => {
    if (err) {
      console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (checkSql > login): ${err}`)))
      return
    }

    if (Array.isArray(results) && results.length === 0) {
      rpc.callClient(player, 'sendNotify', ['err', `Аккаунт "${login}" не найден!`, 4500, 'right'])
      return
    }

    if (Array.isArray(results) && results.length > 0) {
      const user = results[0] as User

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка сравнения пароля (login): ${err}`)))
          return
        }

        if (match) {
          player.dimension = 0
          player.spawn(new mp.Vector3(1948.4307861328125, 3916.800048828125, 38.833740234375))
          rpc.callClient(player, 'sendNotify', ['success', `${login}, вы успешно авторизовались!`, 4000, 'bottom'])
          rpc.callClient(player, 'server:auth:saveLogin', [login]).catch(() => {});
          rpc.callBrowser(player, 'server:loginSuccess').catch(() => {});
          rpc.callBrowser(player, 'server:player:local:info', [user.sid, player.id]).catch(() => {});
          console.log(chalk.bgGreen('• LOGIN •') + chalk.green(` Пользователь ${login} успешно авторизован!`))
        } else {
          rpc.callClient(player, 'sendNotify', ['err', 'Неверный логин или пароль!', 5000, 'right'])
        }
      })
    }
  })
}