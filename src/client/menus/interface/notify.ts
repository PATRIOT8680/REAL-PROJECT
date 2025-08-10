import { rpc } from '../../utils/rpc'

type TypeNotify = 'info' | 'warning' | 'err' | 'success'
type TypePos = 'bottom' | 'top' | 'left' | 'right'

rpc.register('sendNotify', (typeNotify: TypeNotify, msg: string, duration?: number, pos?: TypePos) => {
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
  rpc.call('clientCmd', [`[CLIENT][RPC] Формируемый JS код:', ${code}`]);
  rpc.call('execute', [code])
});