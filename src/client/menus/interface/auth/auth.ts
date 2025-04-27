import { rpc } from '../../../utils/rpc'
import { isInterfaceVisible } from '../../main/toogleInterface'
import { showLoading } from '../loading'
import Keys from '../../../utils/keys'
import { IAllCameras, startCamMoving, stopCamMoving } from 'client/game/movingCamera'
import { coordsCamera } from './coordsCamera'

let currentCameraIndex = -1
let cameraTimeout: NodeJS.Timeout | null = null
let isCameraSpan: boolean = false

const getRandomCameraIndex = (): number => {
    if (coordsCamera.length <= 1) return 0;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * coordsCamera.length);
    } while (newIndex === currentCameraIndex);
    
    return newIndex
};

const startNextCameraMovement = async () => {
  if (!isCameraSpan) return

  // 1. Затемнение перед сменной камеры (кроме первого запуска)
  if (currentCameraIndex !== -1) {
    mp.game.cam.doScreenFadeOut(1500);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // 2. Смена камеры (во время чёрного экрана)
  currentCameraIndex = getRandomCameraIndex();
  const path = coordsCamera[currentCameraIndex];
  startCamMoving(path); // <-- Камера меняется НЕВИДИМО для игрока

  // 3. Плавное появление
  mp.game.cam.doScreenFadeIn(1000);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 4. Ждём оставшееся время (duration - fadeTime)
  const visibleDuration = path.duration - 3000; // Вычитаем 2 секунды fade
  if (visibleDuration > 0) {
      await new Promise(resolve => setTimeout(resolve, visibleDuration));
  }

  // 5. Следующий цикл
  startNextCameraMovement();
};

const enableAuth = () => {
  isCameraSpan = true

  rpc.call('execute', [`window.App.authReducer.showAuth()`])
  rpc.callServer('client:authPlayerVisible', [false])
  mp.game.ui.displayRadar(false)
  mp.players.local.freezePosition(true)

  setTimeout(() => {
    mp.gui.cursor.show(true, true)
  }, 500)

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

  rpc.register('client:auth:saveLogin', (login) => {
    mp.storage.data.authLogin = login
  })
}


const disableAuth = () => {
  isCameraSpan = false

  setTimeout(() => {
    mp.gui.cursor.show(false, false)
  }, 500)

  if (cameraTimeout) {
    clearTimeout(cameraTimeout)
    cameraTimeout = null
  }
  stopCamMoving()

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