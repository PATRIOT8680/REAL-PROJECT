import { rpc } from '../../utils/rpc'
import { data } from "../../database/mysql";
import chalk from 'chalk'
import bcrypt from 'bcryptjs'

import { User } from './main';

export const registerUser = (player: PlayerMp, login: string, email: string, password: string) => {
  const socialClubName = player.socialClub
  const checkSql = 'SELECT * FROM accounts WHERE login = ? OR email = ? OR socialClubName = ?'
  data.query(checkSql, [login, email, socialClubName], (err, results) => {
    if (err) {
      console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (checkSql > register): ${err}`)))
      return
    }

    const users = results as User[]

    if (Array.isArray(users) && users.length > 0) {
      const existingSocialClub = users.find(user => user.socialClubName = socialClubName)
      if (existingSocialClub) {
        rpc.callClient(player, 'sendNotify', ['err', `Пользователь с вашим Social Club уже зарегистрирован!`, 5500, 'right'])
        return
      }

      rpc.callClient(player, 'sendNotify', ['err', `Пользователь с данным Email / логином уже зарегистрирован!`, 5000, 'right'])
      return
    }


    //генерация sid и проверка на существование
    const generatedSID = (callback) => {
      const sidSql = 'SELECT MAX(sid) AS maxSid FROM accounts';
      data.query(sidSql, [], (err, result) => {
          if (err) {
              console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (getNextSID): ${err}`)));
              return callback(err, null);
          }
          const maxSid = result[0]?.maxSid || 0
          const newSid = maxSid < 1 ? 1 : maxSid + 1
          callback(null, newSid);
      });
    }

    const registerNewAccount = (sid) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка хеширования пароля (reg): ${err}`)))
        }
        const sql = 'INSERT INTO accounts (login, email, password, sid, socialClubName) VALUES (?, ?, ?, ?, ?)'
        data.query(sql, [login, email, hash, sid, socialClubName], (err) => {
          if (err) {
            console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (regSql): ${err}`)))
            return
          } else {
            player.dimension = 0
            rpc.callBrowser(player, 'server:player:local:info', [sid, player.id])
            rpc.callClient(player, 'server:auth:saveLogin', [login])
            rpc.callClient(player, 'sendNotify', ['success', `${login}, вы успешно зарегистрировались!`, 5000, 'bottom'])
            rpc.callBrowser(player, 'server:regSuccess')
            console.log(`User ${login} created. sid: ${sid}`)
            console.log(chalk.bgGreen('• REGISTER •') + chalk.green(` Пользователь ${login} успешно зарегистрирован`))
          }
        })
      })
    }

    generatedSID((err, newSID) => {
      if (err) return;
      registerNewAccount(newSID);
    });
    
  })
}