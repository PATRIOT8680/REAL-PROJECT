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
    rce.triggerCef('addMsg', name, text, showTime, tile)
  } else {
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
  rce.triggerServer(CHAT_MESSAGE_EVENT, text)
  toggleChat(true)
  opened = true
})

export const pushMsg = (name: string | null, text: string, showTime: boolean, tile?: string) => {
  if(!loaded) {
    buffer.push({name, text, showTime, tile})
  } else {
    addMsg(name, text, showTime, tile)
  }
}

export const pushLine = (text: string, showTime: boolean, tile?: string) => {
  pushMsg(null, text, showTime, tile)
}

export const clearChat = () => {
  if (buffer) {
    buffer.length = 0
    rce.triggerCef('client:clearChat')
  }
}

rce.registerAll(CHAT_MESSAGE_EVENT, pushMsg)

rce.registerAll('clearChat', () => {
  clearChat()
})

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