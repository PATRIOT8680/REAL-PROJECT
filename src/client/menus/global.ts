import { rce } from "../utils/rce"
import Keys from '../utils/keys'

import './interface/auth'
import './interface/notify'
import './interface/welcome'
import './interface/loading'
import './interface/chat'
import './interface/amenu'
import './interface/reportMenu'
import './interface/inventory'
import './interface/hud'
import './interface/dev-menus'
import './interface/business'

mp.events.add('guiReady', () => {
  mp.gui.chat.show(false)
  gui.browser.active = true

  rce.registerAll('execute', (commands) => {
    const commandsArray = Array.isArray(commands) ? commands : [commands]

    mp.browsers.forEach(browser => {
      if (browser && browser.execute) {
        try {
          commandsArray.forEach(code => {
            mp.console.logInfo(code)
            gui.execute(code);
          });
        } catch (e) {
          mp.console.logError(`Ошибка выполнения кода в браузере: ${e}`);
        }
      }
    });
  });
})

mp.keys.bind(Keys.VK_F2, false, () => {
  mp.gui.cursor.visible = !mp.gui.cursor.visible
})


rce.registerAll('clientCmd', (text: string) => {
  mp.console.logInfo(`[CEF]: ${text}`)
})

rce.registerAll('cef:setActiveAmbient', (toggle: boolean) => {
  mp.storage.data.activeAmbient = toggle
  mp.storage.flush()
})

rce.registerAll('cef:changeLanguage', (lang: string) => {
  mp.storage.data.language = lang
  mp.storage.flush()
})

rce.registerAll('cursorVisible', (toggle: boolean) => {
  mp.gui.cursor.visible = toggle
})



export const gui = {
  browser: mp.browsers.new('package://cef/index.html'),
  execute: (command) => {
    if (mp.browsers.exists(gui.browser) && gui.browser.active)
    {
      gui.browser.execute(command)
    }
  }
}