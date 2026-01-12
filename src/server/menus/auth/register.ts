import { rce } from '../../utils/rce'
import { data } from "../../database/mysql";
import chalk from 'chalk'
import bcrypt from 'bcryptjs'

import { User } from './main';
import { sendCodeVerify } from './verify-email';
import {selectChar} from "../select-char";
import {listLoginAccs} from "./login";
import {connectedUsers} from "../../data/dataConnectedUser";

export const checkUser = (player: PlayerMp, login: string, email: string, password: string) => {
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
        rce.triggerClient(player, 'sendNotify', 'err', `Пользователь с вашим Social Club уже зарегистрирован!`, 4000, 'bottom')
        return
      }

      rce.triggerClient(player, 'sendNotify', 'err', `Пользователь с данным Email / логином уже зарегистрирован!`, 4000, 'bottom')
      return
    }

    sendCodeVerify(player, email)
    rce.triggerCef(player, 'server:auth:showVerify')
  })
}


export const registerUser = (player: PlayerMp, login: string, email: string, password: string) => {
  const socialClubName = player.socialClub

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
        console.log(chalk.bgRed('• BCRYPT •' + chalk.red(` Ошибка хеширования пароля (reg): ${err}`)))
      }
      const sql = 'INSERT INTO accounts (login, email, password, sid, socialClubName, donatcoins) VALUES (?, ?, ?, ?, ?, ?)'
      data.query(sql, [login, email, hash, sid, socialClubName, 0], (err) => {
        if (err) {
          console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (regSql): ${err}`)))
          return
        } else {
          player.dimension = 0
          listLoginAccs.set(player.id, { sid, login })
          player.setVariable('login_player', login)
          selectChar(player)
          connectedUsers.setUser(player.id, { login: login, sid: sid })
          rce.triggerClient(player, 'server:auth:saveLogin', login)
          rce.triggerClient(player, 'sendNotify', 'success', `${login}, вы успешно зарегистрировались и подтвердили электронную почту!`, 4000, 'bottom')
          rce.triggerCef(player, 'server:authSuccess')
          console.log(chalk.bgGreen('• REGISTER •') + chalk.green(` Пользователь ${login} успешно зарегистрирован`))
        }
      })
    })
  }

  generatedSID((err, newSID) => {
    if (err) return;
    registerNewAccount(newSID);
  });
}