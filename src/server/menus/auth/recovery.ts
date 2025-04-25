import { rpc } from '../../utils/rpc'
import { data } from "../../database/mysql";
import chalk from 'chalk'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'yandex',
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'redstar.games2025@yandex.ru',
    pass: 'bskbfnbojgracain'
  }
})


const recoveryCodes: { [key: string]: string } = {}

export const sendRecoveryCode = (player: PlayerMp, email: string) => {
  const checkSql = 'SELECT * FROM accounts WHERE email = ?'

  data.query(checkSql, [email], (err, results) => {
    if (err) {
      console.log(chalk.bgRed('• MYSQL • ' + chalk.red(`Ошибка подключения (checkSql > login): ${err}`)))
      return
    }

    if (Array.isArray(results) && results.length > 0) {
      const generatedCode = (length = 8) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            result += characters[randomIndex]
        }
        return result
      }

      const code = generatedCode()
      recoveryCodes[player.id] = code
      const mailOptions = {
        from: 'redstar.games2025@yandex.ru',
        to: email,
        subject: 'Код для восстановления пароля',
        html: `
          <div style="font-family: Montserrat, sans-serif; background-color: #EBF7FF; padding: 20px;">
            <div style="display: flex; align-items: center; flex-direction: column; background-color: #161523; padding: 13px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <p style="text-transform: uppercase; font-size: 18px; color: #EBF7FF; background:rgba(235, 247, 255, 0.1); padding: 7px 5px; border-radius: 5px">Восстановление пароля</p>
                <p style="font-size: 16px; color: #EBF7FF;">Вы запросили код для восстановления пароля. Пожалуйста, используйте следующий код:</p>
                <p style="font-size: 40px; font-weight: bold; color: #FF0C46; backdrop-filter: blur(30px); background: rgba(255, 255, 255, 0.08); padding: 7px 10px; border-radius: 5px">${code}</p>
                <p style="font-size: 16px; color:rgba(235, 247, 255, 0.8);">Если вы не запрашивали восстановление пароля, просто проигнорируйте это сообщение.</p>
                <div style="margin-top: 20px; font-size: 12px; color: rgba(235, 247, 255, 0.8);">
                    <p>С уважением, команда 🌟 REDSTAR ROLEPLAY</p>
                </div>
            </div>
          </div>
        `
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(chalk.bgRed('• NODEMAILER • ' + chalk.red(`Ошибка отправки почты (${email}): ${error}`)))
          return
        }

        rpc.callBrowser(player, 'server:successSendNotify')
        rpc.callClient(player, 'sendNotify', ['info', `Код отправлен на почту "${email}". Если письма нет, не забудьте проверить раздел "СПАМ"!`, 7000, 'right'])
      })
    } else {
      rpc.callClient(player, 'sendNotify', ['err', `Пользователь с данным Email не найден!`, 5000, 'right'])
    }
  })
}


export const changePassRecovery = (player: PlayerMp, email: string, code: string, newPass: string) => {
  if (recoveryCodes[player.id] && recoveryCodes[player.id] === code) {
    bcrypt.hash(newPass, 10, (err, hash) => {
      if (err) {
        console.log(chalk.bgRed('• BCRYPT •' + chalk.red(`Ошибка хеширования пароля (changePassRecovery): ${err}`)))
        return
      }

      const updateSql = 'UPDATE accounts SET password = ? WHERE email = ?'
      data.query(updateSql, [hash, email], (err) => {
        if (err) {
          console.log(chalk.bgRed('• MYSQL •' + chalk.red(`Ошибка подключения (changePassRecovery): ${err}`)))
          return
        }

        delete recoveryCodes[player.id]
        rpc.callBrowser(player, 'server:auth:changePassSuccess')
        rpc.callClient(player, 'sendNotify', ['success', `Пароль для аккаунта "${email}" успешно изменён!`, 5000, 'right'])
      })
    })
  } else {
    rpc.callClient(player, 'sendNotify', ['err', `Неверный код восстановления!`, 4500, 'right'])
  }
}