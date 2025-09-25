import { rce } from "../../utils/rce"
import { gui } from "../global";
import { createCamera, destroyCamera } from "../../utils/switchCamera"
import { playAnim } from "../../utils/playAnim";
import { cameraRotator } from "../../utils/cameraRotate";

const Natives = {
  SWITCH_OUT_PLAYER: '0xAAB3200ED59016BC',
  SWITCH_IN_PLAYER: '0xD8295AF639FD9CB8',
  IS_PLAYER_SWITCH_IN_PROGRESS: '0xD9D2CFFF49FAB35F'
}

let currentCamera: CameraMp = null
let targetCamera: CameraMp = null

export const createChar = (sid: number, numberSlot: number) => {
  const lcplayerPos = mp.players.local.position
  rce.trigger('moveSkyCamera', 'up', 2)
  rce.triggerServer('setSpawnChar', -111.3426, 357.2092, 112.6961, 153.0604)
  //mp.players.local.position = new mp.Vector3(-111.3426, 357.2092, 112.6961)

  setTimeout(() => {
    currentCamera = createCamera(
      new mp.Vector3(-112.6367, 355.0139, 113.0961),
      new mp.Vector3(-2, 0, -28.83),
      30
    )
  
    if (currentCamera) {
      currentCamera.setActive(true)
      mp.game.cam.renderScriptCams(true, false, 0, true, false)
    }

    let hasExecuted = false

    const intervalFly = setInterval(() => {
      if (!mp.game.invoke(Natives.IS_PLAYER_SWITCH_IN_PROGRESS) && !hasExecuted) {
        hasExecuted = true
        mp.gui.cursor.show(true, true)

        gui.execute(`window.App.createCharReducer.showCreateChar(${sid}, ${numberSlot})`)
        rce.triggerServer('setSpawnChar', -111.3426, 357.2092, 112.6961, 153.0604)
        mp.console.logInfo(`Pos pl: ${mp.players.local.position}`)

        setTimeout(() => {
          cameraRotator.start(
            currentCamera,
            mp.players.local.position,
            new mp.Vector3(
                mp.players.local.position.x,
                mp.players.local.position.y,
                mp.players.local.position.z + 0.4
            ),
            new mp.Vector3(0, 2.5, 0.8),
            155,
            30
          );
          cameraRotator.pause(false)
          cameraRotator.setZBound(-1, 2)
          cameraRotator.setOffsetBound(2, 6)
          playAnim(mp.players.local, 'anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4')
        }, 500)
        clearInterval(intervalFly)

      }
    }, 100)
    //gui.execute(`window.App.createCharReducer.showCreateChar()`)
    //mp.game.streaming.requestAnimDict("anim@amb@business@meth@meth_smash_weight_check@")
    //mp.players.local.playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', false, false, false, false, 1.0)
    //mp.players.local.taskPlayAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 8.0, 1.0, -1, 1, 1.0, false, false, false)

    mp.players.local.freezePosition(true)
    rce.trigger('moveSkyCamera', 'down')
  }, 4000)
}

rce.registerServer('closeCreateChar', () => {
  cameraRotator.stop()
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