import { rce } from "../utils/rce";
import chalk from "chalk"
import { connectedUsers } from "../data/dataConnectedUser";

interface CommandArg {
  name: string
  type: string
  optional?: boolean
}

interface AdminCommandHandler {
  handler: (player: PlayerMp, args: string[]) => void
  description: string
  args: CommandArg[],
  adminLvl?: number,
}

type AdminConsoleHandlers = Record<string, AdminCommandHandler>
const adminConsoleHandlers: AdminConsoleHandlers  = {}

export const registerACommand = (
    cmd: string,
    description: string,
    args: CommandArg[],
    adminLvl: number,
    handler: (player: PlayerMp, args: string[]) => void,
) => {
  if (adminConsoleHandlers[cmd]) {
    console.log(chalk.bgYellow('• AConsole •'), chalk.yellow(`Команда "${cmd}" уже зарегистрирована!`))
    return
  }

  adminConsoleHandlers[cmd] = {
    handler,
    description,
    args,
    adminLvl,
  }
}

rce.registerCef('console:executeCommand', (player: PlayerMp, cmdName: string, args: string[]) => {
  const cmd = adminConsoleHandlers[cmdName]


  if (!cmd) {
    rce.triggerCef(player, 'console:commandResponse', false, `Команда "${cmdName}" не найдена`)
    return
  }

  const playerAdminLevel = connectedUsers.getField(player.id, 'adminLvl') || 0
  console.log(`Уровень админки: ${playerAdminLevel}`)

  if (playerAdminLevel < cmd.adminLvl) {
    const message = `Для "${cmdName}" требуется ${cmd.adminLvl} уровень администрирования.`.replace(/"/g, '\\"')
    rce.triggerCef(player, 'console:commandResponse', false, message)
    return
  }

  try {
    cmd.handler(player, args)
  } catch (e) {
    console.log(chalk.bgRed('• AConsole •'), chalk.red(`Ошибка выполнения команды "${cmdName}": ${e}`))
  }
})


rce.registerCef('console:getCommands', (player: PlayerMp) => {
  const cmds = []

  for (const [name, data] of Object.entries(adminConsoleHandlers)) {
    cmds.push({
      name: name,
      description: data.description,
      args: data.args,
      adminLvl: data.adminLvl,
    })
  }

  rce.triggerCef(player, 'console:setCommands', cmds)
})