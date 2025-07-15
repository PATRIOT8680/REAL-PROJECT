import { rpc } from "../utils/rpc"

import './interface/auth/auth'
import './interface/notify'
import './interface/welcome'
import './interface/loading'
import './interface/auth/coordsCamera'

rpc.browser = mp.browsers.new('package://cef/index.html')

mp.events.add('guiReady', () => {
  mp.gui.chat.show(false)

  mp.console.logInfo('guiReady')

  rpc.register('execute', (commands) => {
  // Преобразуем одиночную команду в массив
    const commandsArray = Array.isArray(commands) ? commands : [commands];
    
    // Логируем
    mp.console.logWarning(`Принято команд: ${commandsArray.length}`);
    
    // Передаем в CEF как массив
    rpc.callBrowser('client:executeCode', commandsArray);
  });
});

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