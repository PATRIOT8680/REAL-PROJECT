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
        subject: '🔐 Код для восстановления пароля • REDSTAR RP',
        html: `
          <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Header with logo -->
            <div style="background: linear-gradient(135deg, #161523 0%, #2a1a4a 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #fff; font-weight: 600; letter-spacing: 1px;">REDSTAR ROLEPLAY</h1>
            </div>
            
            <!-- Main content -->
            <div style="background: #ffffff; padding: 30px 20px; color: #333;">
              <h2 style="margin-top: 0; color: #161523; font-weight: 600;">Восстановление доступа</h2>
              <p style="font-size: 16px; line-height: 1.5;">Вы запросили восстановление пароля для вашего аккаунта. Используйте следующий код подтверждения:</p>
              
              <!-- Verification code box -->
              <div style="margin: 25px 0; text-align: center;">
                <div style="display: inline-block; background: #f8f8f8; border: 1px dashed #d1d1d1; padding: 15px 30px; border-radius: 6px;">
                  <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 3px; color: #FF0C46;">${code}</p>
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 1.5;">Этот код действителен в течение 15 минут. Никому не сообщайте этот код.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="font-size: 14px; color: #777;">Если вы не запрашивали код для подтверждения электронной почты, проигнорируйте это сообщение или сообщите об этом нам в дискорд: https://discord.com/invite/JyNY89CUjE</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #777;">
              <p style="margin: 0;">© 2025 REDSTAR ROLEPLAY. Все права защищены.</p>
              <p style="margin: 5px 0 0;">Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(chalk.bgRed('• NODEMAILER • ' + chalk.red(`Ошибка отправки почты (${email}): ${error}`)))
          return
        }

        rpc.callBrowser(player, 'server:recovery:successSendNotify')
        rpc.callClient(player, 'sendNotify', ['info', `Код отправлен на почту "${email}". Если письма нет, то проверьте раздел "СПАМ"!`, 7000, 'right'])
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