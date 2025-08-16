import { rpc } from '../../../utils/rpc'
import { showLoading } from '../loading'
import { stopCamMoving } from '../../../game/movingCamera'
import { startNextCameraMovement } from './nextCameraMoving'

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

  rpc.call('execute', [`window.App.authReducer.showAuth()`])
  rpc.callServer('client:authPlayerVisible', [false])
  mp.game.ui.displayRadar(false)
  mp.game.graphics.disableScreenblurFade()
  mp.players.local.freezePosition(true)
  mp.gui.cursor.visible = true

  startNextCameraMovement()

  if (mp.storage.data.auth !== undefined) {
    rpc.callBrowser('client:auth:saveLogin', [mp.storage.data.auth.login])
  }

  rpc.register('server:auth:saveLogin', (login: string) => {
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
  rpc.call('execute', [`window.App.authReducer.hideAuth()`])
  setTimeout(() => {
    rpc.call('execute', [`window.App.chatReducer.showChat()`])
    rpc.call('execute', [`window.App.hudReducer.showHud()`])
    rpc.callServer('client:authPlayerVisible', [true])
    mp.game.ui.displayRadar(true)
    mp.players.local.freezePosition(false)
  }, 3000)
}


rpc.register('cef:authEnabled', () => {
  enableAuth()
})

rpc.register('cef:authDisabled', () => {
  disableAuth()
  rpc.callServer('getDataAccount', ['sid', mp.players.local.remoteId]).then((sid: number) => {
    rpc.call('execute', [`window.App.playerInfoReducer.setSid(${sid})`])
  })
  global.loginPlayer = true
})