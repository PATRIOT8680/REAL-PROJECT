import { rpc } from '../../utils/rpc'
import Keys from '../../utils/keys'

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

const toggleChat = (state: boolean) => {
  rpc.callBrowser('chatActive', [state])
}

const addMsg = (name: string | null, text: string, showTime: boolean, tile?: string) => {
  mp.console.logError(`const addMsg: ${text}`)
  if (name) {
    rpc.callBrowser('addMsg', [name, text, showTime, tile])
  } else {
    rpc.callBrowser('addString', [text, showTime, tile])
  }
}

rpc.register('chatloaded', () => {
  for (const msg of buffer) {
    addMsg(msg.name, msg.text, msg.showTime, msg.tile)
  }
  loaded = true
})

rpc.register('chatmessage', (text: string) => {
  mp.console.logError(`register:chatmessage: ${text}`)
  //rpc.call(CHAT_MESSAGE_EVENT, [text])
  rpc.callServer(CHAT_MESSAGE_EVENT, [text])
  toggleChat(true)
  opened = true
})

export const pushMsg = (name: string | null, text: string, showTime: boolean, tile?: string) => {
  if(!loaded) {
    mp.console.logError(`pushMsg (no loaded): ${text}`)
    buffer.push({name, text, showTime, tile})
  } else {
    mp.console.logError(`pushMsg (loaded): ${text}`)
    addMsg(name, text, showTime, tile)
  }
}

export const pushLine = (text: string, showTime: boolean, tile?: string) => {
  pushMsg(null, text, showTime, tile)
}

rpc.register(CHAT_MESSAGE_EVENT, pushMsg)

mp.keys.bind(Keys.VK_T, false, () => {
  if (loaded && !opened) {
    opened = true
    toggleChat(true)
    rpc.callBrowser('openChat', [false])
  }
})

mp.keys.bind(Keys.VK_OEM_2, false, () => {
  if (loaded && !opened) {
    opened = true
    toggleChat(true)
    rpc.callBrowser('openChat', [true])
  }
})

mp.keys.bind(Keys.VK_ESCAPE, false, () => {
  if (loaded && opened) {
    opened = false
      rpc.callBrowser('closeChat')
      toggleChat(false)
  }
})

mp.keys.bind(Keys.VK_ENTER, false, () => {
  if (loaded && opened) {
    opened = false
    rpc.callBrowser('closeChat')
    toggleChat(false)
  }
})

pushLine(`Ваше приключение начинается на 🌟 {FCD53F}<b>REDSTAR ROLEPLAY!</b>`, false, 'hello')