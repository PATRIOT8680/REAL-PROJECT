import { rce } from '../../utils/rce'
import { gui } from '../global'

type TypeNotify = 'info' | 'warning' | 'err' | 'success'
type TypePos = 'bottom' | 'top' | 'left' | 'right'

rce.registerAll('sendNotify', (typeNotify: TypeNotify, msg: string, duration?: number, pos?: TypePos) => {
  mp.console.logWarning(`Мы приняли на клиенте уведомление с сервера: ${msg}`)
  const safeMsg = JSON.stringify(msg);
  const safeTypeNotify = JSON.stringify(typeNotify);
  const safeDuration = duration !== undefined ? duration : 4000;
  const safePos = pos !== undefined ? JSON.stringify(pos) : 'bottom'

  const code = `window.App.sendNotifyReducer.sendNotify(
    ${safeTypeNotify}, 
    ${safeMsg}, 
    ${safeDuration}, 
    ${safePos}
  )`
  rce.trigger('clientCmd', [`[CLIENT][RPC] Формируемый JS код:', ${code}`])
  gui.execute(code)
});