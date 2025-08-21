import Keys from '../../utils/keys'
import { rce } from "../../utils/rce";

const CHAT_MESSAGE_EVENT = 'chat:message'

interface IMessage {
  name: string | null,
  text: string,
  showTime: boolean,
  tile?: string
}

const buffer: IMessage[] = []

let loaded = false
let opened = false
global.chatOpened = false

const toggleChat = (state: boolean) => {
  rce.triggerCef('chatActive', state)
}

const addMsg = (name: string | null, text: string, showTime: boolean, tile?: string) => {
  mp.console.logError(`const addMsg: ${text}`)
  if (name) {
    mp.console.logInfo(`Есть имя. Addmsg на сторону CEF: ${text}`)
    rce.triggerCef('addMsg', name, text, showTime, tile)
  } else {
    mp.console.logInfo(`Нет имени. Addstring на сторону CEF: ${text}`)
    rce.triggerCef('addString', text, showTime, tile)
  }
}

rce.registerAll('chatloaded', () => {
  for (const msg of buffer) {
    addMsg(msg.name, msg.text, msg.showTime, msg.tile)
  }
  loaded = true
})

rce.registerAll('chatmessage', (text: string) => {
  mp.console.logError(`register:chatmessage: ${text}`)
  //rpc.call(CHAT_MESSAGE_EVENT, [text])
  rce.triggerServer(CHAT_MESSAGE_EVENT, text)
  toggleChat(true)
  opened = true
})

export const pushMsg = (name: string | null, text: string, showTime: boolean, tile?: string) => {
  rce.triggerServer('cef:serverCMD', `Проверенное сообщение дошло до клиента: ${text}`)
  mp.console.logInfo(`Проверенное сообщение дошло до клиента: ${text}`)
  if(!loaded) {
    mp.console.logInfo(`Отправляем в буффер: ${text}`)
    mp.console.logError(`pushMsg (no loaded): ${text}`)
    buffer.push({name, text, showTime, tile})
  } else {
    mp.console.logError(`pushMsg (loaded): ${text}`)
    mp.console.logInfo(`Добавляем в чат: ${text}`)
    addMsg(name, text, showTime, tile)
  }
}

export const pushLine = (text: string, showTime: boolean, tile?: string) => {
  pushMsg(null, text, showTime, tile)
}

rce.registerAll(CHAT_MESSAGE_EVENT, pushMsg)

mp.keys.bind(Keys.VK_T, false, () => {
  if (loaded && !opened) {
    opened = true
    toggleChat(true)
    global.chatOpened = true
    rce.triggerCef('openChat', false)
  }
})

mp.keys.bind(Keys.VK_OEM_2, false, () => {
  if (loaded && !opened) {
    opened = true
    toggleChat(true)
    rce.triggerCef('openChat', true)
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (loaded && opened) {
    opened = false
    global.chatOpened = false
    rce.triggerCef('closeChat')
    toggleChat(false)
  }
})

mp.keys.bind(Keys.VK_ENTER, false, () => {
  if (loaded && opened) {
    opened = false
    global.chatOpened = false
    rce.triggerCef('closeChat')
    toggleChat(false)
  }
})

rce.registerAll('chat:pushMsg', (name: string | null, text: string, showTime: boolean, tile?: string) => {
  pushMsg(name, text, showTime, tile)
})

rce.registerAll('chat:pushLine', (text: string, showTime: boolean, tile?: string) => {
  pushLine(text, showTime, tile)
})

pushLine(`Ваше приключение начинается на 🌟 {FCD53F}<b>REDSTAR ROLEPLAY!</b>`, false, 'hello')