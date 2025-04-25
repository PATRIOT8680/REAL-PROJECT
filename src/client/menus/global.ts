import { rpc } from "../utils/rpc"
import './interface/auth'
import './interface/chat'
import './interface/loading'
import './main/toogleInterface'
import './interface/notify'

rpc.browser = mp.browsers.new('package://cef/index.html')

export let isBrowserReady = false;

mp.events.add('guiReady', () => {
  mp.gui.chat.show(false)
  isBrowserReady = true 

  mp.console.logInfo('guiReady')

  rpc.register('execute', (code) => {
    mp.console.logWarning(`На клиенте мы приняли с клиента код и отправляем в CEF: ${code}`)
    rpc.callBrowser('client:executeCode', [code]);
  });

  rpc.call('cef:authEnabled', [])
});

rpc.register('clientCmd', (text: string) => {
  mp.console.logInfo(`[CEF]: ${text}`)
})

