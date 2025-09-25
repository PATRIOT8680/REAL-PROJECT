import { rce } from "../utils/rce";
import chalk from "chalk"

interface CommandArg {
  name: string
  type: string
  optional?: boolean
}

interface AdminCommandHandler {
  handler: (player: PlayerMp, args: string[]) => void
  description: string
  args: CommandArg[]
}

type AdminConsoleHandlers = Record<string, AdminCommandHandler>
const adminConsoleHandlers: AdminConsoleHandlers  = {}

export const registerACommand = (cmd: string, description: string, args: CommandArg[], handler: (player: PlayerMp, args: string[]) => void) => {
  if (adminConsoleHandlers[cmd]) {
    console.log(chalk.bgYellow('• AConsole •'), chalk.yellow(`Команда "${cmd}" уже зарегистрирована!`))
    return
  }

  adminConsoleHandlers[cmd] = {
    handler,
    description,
    args,
  }
}

rce.registerCef('console:executeCommand', (player: PlayerMp, cmdName: string, args: string[]) => {
  const cmd = adminConsoleHandlers[cmdName]

  console.log(`sethp 1`)

  if (!cmd) {
    rce.triggerCef(player, 'console:commandResponse', false, `Команда "${cmdName}" не найдена`)
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
      args: data.args
    })
  }

  rce.triggerCef(player, 'console:setCommands', cmds)
})