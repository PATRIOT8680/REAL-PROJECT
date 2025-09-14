import { rce } from '../../utils/rce'
import { showLoading } from './loading'
import { gui } from '../global'

let camera = null

const enableAuth = () => {
  //mp.game.time.setClockTime(6, 0, 0)
  mp.game.gameplay.setWeatherTypePersist('CLEAR');
  rce.trigger('execute', `window.App.authReducer.showAuth()`)
  rce.triggerServer('client:authPlayerVisible', false)
  mp.game.ui.displayRadar(false)
  mp.game.graphics.disableScreenblurFade()
  rce.triggerServer('setPosChar', -1487.7098, 2274.3295, 32.5487, 153.0708)
  camera = mp.cameras.new('default', 
    new mp.Vector3(-1391.9077, 2417.4196, 58.210), 
    new mp.Vector3(0, 0, 150.2362), 45
  );
  mp.game.cam.renderScriptCams(true, false, 0, true, false)
  //mp.players.local.freezePosition(true)
  mp.gui.cursor.visible = true

  if (mp.storage.data.auth !== undefined) {
    rce.triggerCef('client:auth:saveLogin', mp.storage.data.auth.login)
  }

  rce.registerServer('server:auth:saveLogin', (login: string) => {
    mp.storage.data.auth = {
      login: login
    }
    mp.storage.flush()
  })
}


const disableAuth = () => {
  showLoading(1500)
  gui.execute('window.App.authReducer.hideAuth()')
  rce.triggerServer('client:authPlayerVisible', true)

  if (camera && mp.cameras.exists(camera)) {
    camera.destroy()
  }
}


rce.registerAll('cef:authEnabled', () => {
  enableAuth()
})

rce.registerAll('cef:authDisabled', async () => {
  disableAuth()
  const statID = await rce.callServer('getDataAccount', 'sid', mp.players.local.remoteId)
  rce.trigger('execute', `window.App.playerInfoReducer.setSid(${statID})`)
  global.loginPlayer = true
})