import { rce } from '../utils/rce'
import { connectedUsers } from "../data/dataConnectedUser";
import {prefix} from "concurrently/dist/src/defaults";

type CommandHandler = (player: PlayerMp, args: string[]) => void

const cmdHandlers: Record<string, CommandHandler> = {}
const mutedPlayers: Map<PlayerMp, boolean> = new Map()
const CHAT_MESSAGE_EVENT = 'chat:message'

export const send = (player: PlayerMp | null, msg: string, showTime: boolean, tile?: string, radius?: number) => {
  if (!player) {
    console.error('[CHAT SEND] player не должен быть равен null. Используй chat.broadcast')
    return
  } else {
    if (radius) {
      mp.players.forEachInRange(player.position, radius, (target: PlayerMp) => {
        rce.triggerClient(player, CHAT_MESSAGE_EVENT, null, msg, showTime, tile)
      })
    } else {
      rce.triggerClient(player, CHAT_MESSAGE_EVENT, null, msg, showTime, tile)
    }
  }
}

export const broadcast = (msg: string, showTime: boolean, tile?: string) => {
  rce.triggerClients(CHAT_MESSAGE_EVENT, null, msg, showTime, tile)
}


// РП-заготовки

export const meAction = (player: PlayerMp, text: string) => {
  if (!text.trim()) return

  const gender = connectedUsers.getField(player.id, 'gender')
  const prefix = gender === 'male' ? 'Гражданин' : 'Гражданка'
  const formatted = `{00E3FD}${prefix} [ ${player.id} ] ${text.toLowerCase()}`

  send(player, formatted, true, 'me', 15)
}

export const doAction = (player: PlayerMp, text: string) => {
  if (!text.trim()) return

  let cleanedText = text.trim()
  const hasPunctuation = /[.!?…]$/.test(cleanedText)

  if (!hasPunctuation) {
    cleanedText += '.'
  }

  const gender = connectedUsers.getField(player.id, 'gender')
  const prefix = gender === 'male' ? 'Гражданин' : 'Гражданка'
  const formattedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1)
  const formatted = `{95FF00}${formattedText} (${prefix} [ ${player.id} ])`

  send(player, formatted, true, 'do', 15)
}

export const tryAction = (player: PlayerMp, text: string) => {
  if (!text.trim()) return

  const gender = connectedUsers.getField(player.id, 'gender')
  const prefix = gender === 'male' ? 'Гражданин' : 'Гражданка'
  const success = Math.random() < 0.5

  const result = success ? `{00FF55}Удачно` : `{FF0000}Неудачно`
  const formatted = `{00E3FD}${prefix} [ ${player.id} ] ${text.toLowerCase()} | ${result}`

  send(player, formatted, true, 'try', 15)
}

export const todoAction = (player: PlayerMp, text: string) => {
  if (!text.includes('*')) {
    send(player, '{F6FF7D}[Подсказка]: /todo цитата*действие', false)
    return
  }

  const [part1, part2] = text.split('*').map(s => s.trim())
  if (!part1 || !part2) {
    send(player, '{F6FF7D}[Неверный формат]: /todo цитата*действие', false)
    return
  }

  const formattedPart1 = part1.charAt(0).toUpperCase() + part1.slice(1)
  const gender = connectedUsers.getField(player.id, 'gender')
  const prefix = gender === 'male' ? 'Гражданин' : 'Гражданка'
  const formatted = `{9112FF}"${formattedPart1}" сказал ${prefix} [ ${player.id} ], ${part2}.`

  send(player, formatted, true, 'todo', 15)
}

/////////

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

rce.registerClientCef(CHAT_MESSAGE_EVENT, (player: PlayerMp, msg: string, showTime: boolean, tile?: string) => {
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

      mp.players.forEachInRange(player.position, 8, (player) => {
        rce.triggerClient(player, CHAT_MESSAGE_EVENT, player.name, formattedMsg, showTime, tile)
      })
    }
  }
})


rce.registerClientCef('sendMsg', (player: PlayerMp, msg: string, showTime: boolean, tile?: string) => {
  send(player, msg, showTime, tile);
})

rce.registerClientCef('broadcastMsg', (player: PlayerMp, msg: string, showTime: boolean, tile?: string) => {
  broadcast(msg, showTime, tile);
})