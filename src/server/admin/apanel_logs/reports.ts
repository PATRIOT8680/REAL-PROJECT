import { data } from "../../database/mysql";
import { rce } from "../../utils/rce";
import { getDataAccount } from "../../data/getDataAccount";
import chalk from "chalk";

const getAllReports = async (lastReportId: number) => {
  try {
    let sql = '';
    let params = []

    if (lastReportId === 0) {
      sql = `
        SELECT id, reportData
        FROM logs_reports
        ORDER BY id DESC
        LIMIT 100
      `
    } else {
      sql = `
        SELECT id, reportData
        FROM logs_reports
        WHERE id < ?
        ORDER BY id DESC
        LIMIT 100
      `

      params.push(lastReportId)
    }

    const reportsData = await new Promise((resolve, reject) => {
      data.query(sql, params, (error, results: any) => {
        if (error) {
          reject(error)
        } else {
          const formattedData = results.map((item: any) => {
            try {
              return {
                id: item.id,
                listMsg: JSON.parse(item.reportData),
                status: undefined,
                responder: undefined
              }
            } catch (parseError) {
              console.log(chalk.bgRed('• Logs - reports •'), chalk.red('Ошибка парсинга reportData для id', item.id, parseError));
              return {
                id: item.id,
                listMsg: [],
                status: undefined,
                responder: undefined
              }
            }
          })

          resolve(formattedData)
        }
      })
    })

    console.log('Отправляем:', reportsData)
    return reportsData
  } catch (e) {
    console.log(chalk.bgRed('• Logs - reports •'), chalk.red(e))
    return []
  }
}

rce.registerClientCef('logs:getAllReports', async (player: PlayerMp, lastReportId: number) => {
  return getAllReports(lastReportId)
  console.log(getAllReports(lastReportId))
})