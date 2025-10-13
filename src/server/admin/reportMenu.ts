import { rce } from "../utils/rce";
import { data } from "../database/mysql";
import {getDateTime} from "../../cef/src/modules/dateTime";
import { connectedUsers } from "../data/dataConnectedUser";
import chalk from "chalk";
import './apanel_logs/reports'

interface IData {
  nickName: string,
  text: string,
  dateTime: string,
  role: 'player' | 'admin',
}

rce.registerCef('cef:report:createReport', (player: PlayerMp, reportData: IData) => {
  const sql = 'SELECT MAX(id) as maxId FROM logs_reports'

  data.query(sql, (err, results) => {
    if (err) {
      return console.log(chalk.bgRed('• logs_reports (create 1) •', err))
    }

    try {
      const maxIdRow = results[0];
      const nextId = (maxIdRow?.maxId || 0) + 1

      rce.triggerClients('execute',
        `window.App.reportsListReducer.setReport(${nextId}, [{
          nickName: "${reportData.nickName}",
          text: "${reportData.text}", 
          dateTime: "${reportData.dateTime}",
          role: "${reportData.role}"}],
        'waiting')`
      );
      const repData = JSON.stringify([reportData])
      const sql2 = 'INSERT INTO logs_reports (id, reportData) VALUES (?, ?)'

      data.query(sql2, [nextId, repData], (err) => {
        if (err) {
          return console.log(chalk.bgRed('• logs_reports (create 3) •', err))
        }
      })
    } catch (e) {
      console.log(chalk.bgRed('• logs_reports (create 2) •', err))
    }
  })
})

rce.registerCef('cef:report:addMsg', (player: PlayerMp, id: number, reportData: IData) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.addMessageToReport(${id}, {
    nickName: "${reportData.nickName}",
    text: "${reportData.text}",
    dateTime: "${reportData.dateTime}",
    role: "${reportData.role}"
  })`)

  const sql = 'SELECT reportData FROM logs_reports WHERE id = ?'

  try {
    data.query(sql, [id], (err, results: any) => {
      if (err) {
        return console.log(chalk.bgRed('• logs_reports (addMsg 1) •', err))
      }

      try {
        if (results.length === 0) {
          return console.log(chalk.bgYellow('• logs_reports •'), chalk.yellow(`Репорт с ID ${id} не найден в базе данных`))
        }

        const currentReportData = JSON.parse(results[0].reportData);
        currentReportData.push({
          nickName: reportData.nickName,
          text: reportData.text,
          dateTime: reportData.dateTime,
          role: reportData.role
        })

        const sql2 = 'UPDATE logs_reports SET reportData = ? WHERE id = ?'
        data.query(sql2, [JSON.stringify(currentReportData), id], (err, results: any) => {
          if (err) {
            return console.log(chalk.bgRed('• logs_reports (addMsg 2) •', err))
          }
        })
      } catch (e) {
        console.log(chalk.bgRed('• logs_reports (addMsg 3) •', e))
      }

    })
  } catch (e) {
    console.log(chalk.bgRed('• logs_reports (addMsg 4) •', e))
  }

})

rce.registerCef('cef:report:deleteReport', (player: PlayerMp, id: number, nickname: string) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.closeReport(${id})`)
})

rce.registerCef('cef:amenu:selectReport', (player: PlayerMp, id: number, nickname: string, adminNickname: string) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.updateReportStatus(${id}, "taken", "${adminNickname}")`)
})

rce.registerCef('cef:amenu:delayReport', (player: PlayerMp, id: number, nickname: string) => {
  rce.triggerClients('execute', `window.App.reportsListReducer.updateReportStatus(${id}, "waiting")`)
})

rce.registerCef('cef:amenu:closeReport', (player: PlayerMp, id: number, nickname: string) => {
  const targetId = connectedUsers.getPlayerIdByNickName(nickname)
  const target = mp.players.at(targetId)
  rce.triggerClient(target, 'sendNotify', 'info', `Администратор закрыл ваш репорт`, 3300, 'top')
  rce.triggerClients('execute', `window.App.reportsListReducer.updateReportStatus(${id}, "reviewed")`)
})

rce.registerCef('cef:amenu:sendAMsg', (player: PlayerMp, id: number, reportData: IData, playerNickname: string) => {
  const targetId = connectedUsers.getPlayerIdByNickName(playerNickname)
  const target = mp.players.at(targetId)
  rce.triggerClient(target, 'sendNotify', 'info', `На ваш репорт пришёл ответ!`, 3300, 'top')

  rce.triggerClients('execute', `window.App.reportsListReducer.addMessageToReport(${id}, {
    nickName: "${reportData.nickName}",
    text: "${reportData.text}",
    dateTime: "${reportData.dateTime}",
    role: "${reportData.role}"
  })`)

  const sql = 'SELECT reportData FROM logs_reports WHERE id = ?'

  try {
    data.query(sql, [id], (err, results: any) => {
      if (err) {
        return console.log(chalk.bgRed('• logs_reports (sendMsg 1) •', err))
      }

      try {
        if (results.length === 0) {
          return console.log(chalk.bgYellow('• logs_reports •'), chalk.yellow(`Репорт с ID ${id} не найден в базе данных`))
        }

        const currentReportData = JSON.parse(results[0].reportData);
        currentReportData.push({
          nickName: reportData.nickName,
          text: reportData.text,
          dateTime: reportData.dateTime,
          role: reportData.role
        })

        const sql2 = 'UPDATE logs_reports SET reportData = ? WHERE id = ?'
        data.query(sql2, [JSON.stringify(currentReportData), id], (err, results: any) => {
          if (err) {
            return console.log(chalk.bgRed('• logs_reports (sendMsg 2) •', err))
          }
        })
      } catch (e) {
        console.log(chalk.bgRed('• logs_reports (sendMsg 3) •', e))
      }

    })
  } catch (e) {
    console.log(chalk.bgRed('• logs_reports (sendMsg 4) •', e))
  }
})