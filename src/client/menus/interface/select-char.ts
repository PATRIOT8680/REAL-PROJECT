import { listCameras } from "../../configs/posSelectChar";
import { rce } from "../../utils/rce";
import { gui } from "../global";
import { createCamera, destroyCamera } from "../../utils/switchCamera";
import { createChar } from "./create-char";

const scenarios = [
  "WORLD_HUMAN_AA_COFFEE",
  "WORLD_HUMAN_CAR_PARK_ATTENDANT",
  "WORLD_HUMAN_CLIPBOARD_FACILITY",
  "WORLD_HUMAN_COP_IDLES",
  "WORLD_HUMAN_DRINKING_FACILITY",
  "WORLD_HUMAN_GUARD_STAND",
  "WORLD_HUMAN_STAND_MOBILE",
  "EAR_TO_TEXT_FAT",
  "WORLD_HUMAN_AA_SMOKE",
]

const Natives = {
  SWITCH_OUT_PLAYER: '0xAAB3200ED59016BC',
  SWITCH_IN_PLAYER: '0xD8295AF639FD9CB8',
  IS_PLAYER_SWITCH_IN_PROGRESS: '0xD9D2CFFF49FAB35F'
};

let currentCamera: CameraMp = null
let targetCamera: CameraMp = null


rce.registerServer('server:showSelectChar', () => {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
  mp.players.local.taskStartScenarioInPlace(scenario, 0, false)
  mp.game.ui.setPauseMenuActive(false)

  destroyCamera(currentCamera)
  destroyCamera(targetCamera)
  
  currentCamera = createCamera(
    new mp.Vector3(-143.5, -596.5199, 211.9750),
    new mp.Vector3(-2, 0, 204),
    45
  )

  if (currentCamera) {
    currentCamera.setActive(true)
    mp.game.cam.renderScriptCams(true, false, 0, true, false)
  }
  
  let hasExecuted = false;
  
  const intervalFly = setInterval(() => {
    if (!mp.game.invoke(Natives.IS_PLAYER_SWITCH_IN_PROGRESS) && !hasExecuted) {
      hasExecuted = true
      mp.gui.cursor.show(true, true)
      
      rce.triggerServer('client:flyEndSelectChar')
      
      clearInterval(intervalFly)
    }
  }, 100)
  
})

rce.registerAll('cef:selectSlotChar', (slot: number, status: 'active' | 'free' | 'donat' | 'ban') => {
  mp.console.logInfo('Oppps. Сработка!')
  const localplayer = mp.players.local
  
  const plPos = listCameras[slot - 1].playerPos
  const camPos = listCameras[slot - 1].cameraPos
  
  mp.console.logInfo(`Позиция камеры: ${JSON.stringify(listCameras[slot - 1].cameraPos)}`)
  
  if (currentCamera) {
    mp.console.logInfo(`Позиция камеры 2: ${JSON.stringify(currentCamera.getCoord())}`)
  }

  //destroyCamera(targetCamera)

  targetCamera = createCamera(
    new mp.Vector3(camPos.x, camPos.y, camPos.z),
    new mp.Vector3(-2, 0, camPos.heading),
    45
  )
  
  mp.console.logInfo(`Позиция камеры 3: ${JSON.stringify(targetCamera.getCoord())}`)
  

  //const targetPos = targetCamera.getCoord();
  //if (targetPos.x === 0 && targetPos.y === 0 && targetPos.z === 0) {
  //  mp.console.logInfo('Камера создана с нулевыми координатами, исправляем...');
    
  //  // Принудительно устанавливаем координаты
  //  targetCamera.setCoord(camPos.x, camPos.y, camPos.z);
  //  targetCamera.setRot(-2, 0, camPos.heading, 2);
    
  //  mp.console.logInfo(`Исправленные координаты: ${JSON.stringify(targetCamera.getCoord())}`);
  //}

  // Устанавливаем камеру активной
  if (currentCamera) {
    try {
      targetCamera.setActiveWithInterp(currentCamera.handle, 500, 150, 150);
      mp.game.cam.renderScriptCams(true, true, 1000, true, false)
      mp.game.audio.playSoundFrontend(-1, "Click", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true);

      setTimeout(() => {
        rce.triggerServer('setPosChar', plPos.x, plPos.y, plPos.z, plPos.heading)
        setTimeout(() => {
          const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]
          mp.players.local.taskStartScenarioInPlace(scenario, 0, false)
        }, 100)
      }, 200)
    } catch (e) {
      mp.console.logInfo(`Ошибка при установке плавного перехода: ${e}`);
      targetCamera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false);
    }
  } else {
    targetCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }

  setTimeout(() => {
    destroyCamera(currentCamera)
    currentCamera = targetCamera
  }, 500)

  mp.console.logInfo(`${JSON.stringify(listCameras[slot - 1].cameraPos)}`);
})

rce.registerServer('closedSelectCreateChar', (sid: number, numberSlot: number) => {
  if (mp.cameras.exists(currentCamera)) currentCamera.destroy()
  if (mp.cameras.exists(targetCamera)) targetCamera.destroy()

  currentCamera = null
  targetCamera = null

  mp.game.cam.renderScriptCams(false, false, 0, true, false)
  mp.gui.cursor.show(false, false)
  createChar(sid, numberSlot)
  //mp.players.local.freezePosition(false)
  //mp.players.local.clearTasks()

  //gui.execute(`window.App.chatReducer.showChat()`)
  gui.execute(`window.App.selectCharReducer.hideSelectChar()`)
})

rce.registerServer('closeSelectChar', () => {
  if (mp.cameras.exists(currentCamera)) currentCamera.destroy()
  if (mp.cameras.exists(targetCamera)) targetCamera.destroy()

  currentCamera = null
  targetCamera = null

  mp.game.cam.renderScriptCams(false, false, 0, true, false)
  mp.gui.cursor.show(false, false)

  setTimeout(() => {
    gui.execute('window.App.chatReducer.showChat()')
    gui.execute('window.App.hudReducer.showHud()')
    mp.players.local.freezePosition(false)
    mp.game.ui.displayRadar(true)
  }, 4000)
})