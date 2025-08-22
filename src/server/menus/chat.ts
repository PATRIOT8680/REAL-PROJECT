import { rce } from '../utils/rce'

type CommandHandler = (player: PlayerMp, args: string[]) => void

const cmdHandlers: Record<string, CommandHandler> = {}
const mutedPlayers: Map<PlayerMp, boolean> = new Map()
const CHAT_MESSAGE_EVENT = 'chat:message'

export const send = (player: PlayerMp | null, msg: string, showTime: boolean, tile?: string) => {
  if (!player) {
    console.error('[CHAT SEND] player не должен быть равен null. Используй chat.broadcast')
    return
  } else {
    mp.players.forEach(p => {
      rce.triggerClient(p, CHAT_MESSAGE_EVENT, null, msg, showTime, tile)
    })
  }
}

export const broadcast = (msg: string, showTime: boolean, tile?: string) => {
  mp.players.forEach(p => {
    rce.triggerClient(p, CHAT_MESSAGE_EVENT, null, msg, showTime, tile)
  })
}

export const registerCMD = (cmd: string, callback) => {
  if (cmdHandlers[cmd] !== undefined) {
    console.log(`Не удалось зарегистрировать команду (/${cmd}), которая уже зарегистрирована!`)
  } else {
    cmdHandlers[cmd] = callback
  }
}

export const mutePlayer = (player: PlayerMp, state: boolean) => {
  mutedPlayers.set(player, state)
}

export const setupPlayer = (player) => {
  player.sendMessage = (msg: string, showTime: boolean) => {
    send(player, msg, showTime)
  }

  player.mutePlayer = (state: boolean) => {
    mutePlayer(player, state)
  }
}

const invokeCMD = (player: PlayerMp, cmd: string, args: string[]) => {
  cmd = cmd.toLowerCase()
  const callback = cmdHandlers[cmd]

  if (callback) {
    callback(player, args)
  } else {
    send(player, `{ffcbbb} <b>Команда не найдена! (/${cmd})</b>`, false)
  }
}

rce.registerClientAndCef(CHAT_MESSAGE_EVENT, (player: PlayerMp, msg: string, showTime: boolean, tile?: string) => {
  if (msg.startsWith('/')) {
    msg = msg.trim().slice(1)

    if (msg.length > 0) {
      const args = msg.split(" ")
      const cmd = args.shift() as string

      invokeCMD(player, cmd, args)
    }
  } else {
    if (mutedPlayers.has(player) && mutedPlayers.get(player)) {
      send(player, '{E52B50} У вас бан-чат!', false)
      return
    }

    msg = msg.trim()

    if (msg.length > 0) {
      const formattedMsg = msg.replace(/</g, "&lt;").replace(/'/g, "&#39;").replace(/"/g, "&#34;");

      //mp.players.forEach(p => {
        rce.triggerClients(CHAT_MESSAGE_EVENT, player.name, formattedMsg, showTime, tile)
      //})
    }
  }
})


rce.registerClientAndCef('sendMsg', (player: PlayerMp, msg: string, showTime: boolean, tile?: string) => {
  send(player, msg, showTime, tile);
})

rce.registerClientAndCef('broadcastMsg', (player: PlayerMp, msg: string, showTime: boolean, tile?: string) => {
  broadcast(msg, showTime, tile);
})