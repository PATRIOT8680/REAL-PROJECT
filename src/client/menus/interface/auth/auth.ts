import { rce } from '../../../utils/rce'
import { showLoading } from '../loading'
import { stopCamMoving } from '../../../game/movingCamera'
import { startNextCameraMovement } from './nextCameraMoving'
import { gui } from '../../global'

interface CameraState {
  currentIndex: number
  isSpanActive: boolean
  isTransition: boolean
  timeout: NodeJS.Timeout | null
  interval: NodeJS.Timeout | null
}

export const cameraState: CameraState = {
  currentIndex: -1,
  isSpanActive: false,
  isTransition: false,
  timeout: null,
  interval: null
};



const enableAuth = () => {
  cameraState.isSpanActive = true
  cameraState.isTransition = false

  rce.trigger('execute', `window.App.authReducer.showAuth()`)
  rce.triggerServer('client:authPlayerVisible', false)
  mp.game.ui.displayRadar(false)
  mp.game.graphics.disableScreenblurFade()
  mp.players.local.freezePosition(true)
  mp.gui.cursor.visible = true

  startNextCameraMovement()

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
  cameraState.isSpanActive = false

  try {
    if (cameraState.timeout) {
      clearTimeout(cameraState.timeout)
      cameraState.timeout = null
    }
    
    if (cameraState.interval) {
      clearInterval(cameraState.interval)
      cameraState.interval = null
    }
  } catch (e) {
    console.error("Disable auth timer error:", e)
  }

  mp.gui.cursor.visible = false

  if (cameraState.isTransition) {
    mp.game.cam.doScreenFadeIn(0)
    stopCamMoving()
  }

  if (cameraState.timeout) {
    clearTimeout(cameraState.timeout)
    cameraState.timeout = null
  }
  stopCamMoving()

  showLoading(3000)
  gui.execute('window.App.authReducer.hideAuth()')
  setTimeout(() => {
    gui.execute('window.App.chatReducer.showChat()')
    gui.execute('window.App.hudReducer.showHud()')
    rce.triggerServer('client:authPlayerVisible', true)
    mp.game.ui.displayRadar(true)
    mp.players.local.freezePosition(false)
  }, 3000)
}


rce.registerAll('cef:authEnabled', () => {
  enableAuth()
})

rce.registerAll('cef:authDisabled', () => {
  disableAuth()
  mp.console.logError('cef:authDisabled сработал!!!!!')
  const statID = rce.callServer('getDataAccount', 'sid', mp.players.local.remoteId)
  rce.trigger('execute', `window.App.playerInfoReducer.setSid(${statID})`)
  global.loginPlayer = true
})