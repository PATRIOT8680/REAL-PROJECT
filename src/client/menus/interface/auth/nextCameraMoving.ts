import { coordsCamera } from './coordsCamera'
import { cameraState } from "./auth";
import { startCamMoving } from '../../../game/movingCamera'
let currentCameraIndex = -1

const getRandomCameraIndex = (): number => {
    if (coordsCamera.length <= 1) return 0;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * coordsCamera.length);
    } while (newIndex === currentCameraIndex);
    
    return newIndex
};

export const startNextCameraMovement = async () => {
  if (!cameraState.isSpanActive) return
  cameraState.isTransition = true

  try {
    if (currentCameraIndex !== -1) {
      mp.game.cam.doScreenFadeOut(1500)
      await waitWithCancel(1500)
    }

    if (!cameraState.isSpanActive) return

    currentCameraIndex = getRandomCameraIndex()
    const path = coordsCamera[currentCameraIndex]
    startCamMoving(path)

    mp.game.cam.doScreenFadeIn(1000)
    await waitWithCancel(1000)

    if (!cameraState.isSpanActive) return

    const visibleDuration = path.duration - 3000
    if (visibleDuration > 0) {
      await waitWithCancel(visibleDuration)
    }

    cameraState.isTransition = false
    startNextCameraMovement()
  } catch (e) {
  }
  
};

const waitWithCancel = (ms: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve();
    }, ms);

    cameraState.timeout = timer

    const checkInterval = setInterval(() => {
      if (!cameraState.isSpanActive) {
        clearSafeTimers(timer, checkInterval)
        reject("Cancelled")
      }
    }, 100)

    cameraState.interval = checkInterval
  })
}

const clearSafeTimers = (timer: NodeJS.Timeout, interval: NodeJS.Timeout) => {
  try {
    if (timer && typeof timer === 'object') {
      clearTimeout(timer)
    }
  } catch (e) {
    mp.console.logError(`Timer clear err: ${e}`)
  }

  try {
    if (interval && typeof interval === 'object') {
      clearInterval(interval);
    }
  } catch (e) {
    mp.console.logError(`Interval clear err: ${e}`)
  }

  if (cameraState.timeout === timer) cameraState.timeout = null
  if (cameraState.interval === interval) cameraState.interval = null
}