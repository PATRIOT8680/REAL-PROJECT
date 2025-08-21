import * as mysql from 'mysql2'
import chalk from 'chalk'

export const data = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'redstar',
  password: 'Patriot86',
  port: 3306
})

export const mysql2 = {
  isConnected: false,
  sql: 'SELECT * FROM accounts'
}

const makeConnection = () => {
  data.getConnection((err, connection) => {
    if (err) {
      console.log(chalk.blueBright('• MYSQL • База данных не подключена! Повторная попытка через 2 секунды...'))
      setTimeout(makeConnection, 2000)
    } else {
      connection.query(mysql2.sql, (errQuery) => {
        if (errQuery) {
          mysql2.isConnected = false
          console.log(chalk.bgRed('• MYSQL •') + chalk.red(` Ошибка подключения к БД! (Err: ${errQuery})`))
        } else {
          mysql2.isConnected = true
          console.log(chalk.bgGreen('• MYSQL •') + chalk.green(' База данных подключена!'))
        }
      })
    }
  })
}

makeConnection()