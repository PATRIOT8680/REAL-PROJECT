import { rpc } from '../../utils/rpc'
import { isInterfaceVisible } from '../main/toogleInterface'
import { showLoading } from './loading'
import Keys from '../../utils/keys'

const enableAuth = () => {
  rpc.call('execute', [`window.App.authReducer.showAuth()`])
  rpc.callServer('client:authPlayerVisible', [false])
  mp.game.ui.displayRadar(false)
  mp.players.local.freezePosition(true)
  setTimeout(() => {
    mp.gui.cursor.show(true, true)
  }, 500)
  

  if (mp.storage.data.auth !== undefined) {
    rpc.callBrowser('client:auth:saveLogin', [mp.storage.data.auth.login])
  }

  rpc.register('server:auth:saveLogin', (login: string) => {
    mp.storage.data.auth = {
      login: login
    }
    mp.storage.flush()
  })

  rpc.register('client:auth:saveLogin', (login) => {
    mp.storage.data.authLogin = login
  })
}


const disableAuth = () => {
  setTimeout(() => {
    mp.gui.cursor.show(false, false)
  }, 500)

  showLoading(5000)
  rpc.call('execute', [`window.App.authReducer.hideAuth()`])
  setTimeout(() => {
    rpc.callServer('client:authPlayerVisible', [true])
    mp.game.ui.displayRadar(true)
    mp.players.local.freezePosition(false)
  }, 5000)
}


rpc.register('cef:authEnabled', () => {
  mp.console.logWarning('вызов enabled')
  enableAuth()
})

rpc.register('cef:authDisabled', () => {
  disableAuth()
})