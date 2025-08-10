import { rpc } from "../utils/rpc"
import Keys from '../utils/keys'

import './interface/auth/auth'
import './interface/notify'
import './interface/welcome'
import './interface/loading'
import './interface/auth/coordsCamera'
import './interface/chat'

rpc.browser = mp.browsers.new('package://cef/index.html')

mp.events.add('guiReady', () => {
  mp.gui.chat.show(false)
  mp.console.logInfo('guiReady')

  rpc.register('execute', (commands) => {
    const commandsArray = Array.isArray(commands) ? commands : [commands]
    mp.console.logWarning(`Принято команд: ${commandsArray.length}`)
    rpc.callBrowser('client:executeCode', commandsArray)
  })
})

mp.keys.bind(Keys.VK_OEM_3, false, () => {
  mp.gui.cursor.visible = !mp.gui.cursor.visible
})

rpc.register('clientCmd', (text: string) => {
  mp.console.logInfo(`[CEF]: ${text}`)
})

rpc.register('cef:setActiveAmbient', (toggle: boolean) => {
  mp.storage.data.activeAmbient = toggle
  mp.storage.flush()
})

rpc.register('cef:changeLanguage', (lang: string) => {
  mp.storage.data.language = lang
  mp.storage.flush()
})

rpc.register('cursorVisible', (toggle: boolean) => {
  mp.gui.cursor.visible = toggle
})