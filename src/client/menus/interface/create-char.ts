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
let localPlayer: PlayerMp = mp.players.local

let characterData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: 'male',
  father: 0,
  mother: 21,
  shapeMix: 0.5,
  skinMix: 0.5,
  eyeColor: 0,
  eyebrow: 1,
  eyebrowColor: 62,
  hair: 0,
  hairColor: 0,
  beard: 0,
  beardColor: 62,
  faceFeatures: [
    0, 0, 0, 0, 0, 0,
    0, 0,
    0, 0,
    0, 0, 0,
    0, 0,
    0, 0, 0, 0,
    0
  ],
  clothes: {
    tops: 14,
    legs: 1,
    shoes: 1
  }
}

rce.registerAll('pauseCameraRotator', (pause: boolean) => {
  if (cameraRotator) {
    cameraRotator.pause(pause)
  }
})

rce.registerAll('cef:createChar:handleChange', (fieldName: string, value: any) => {
  // Для faceFeatures мы используем отдельную логику через updateFaceFeature
  if (fieldName === 'faceFeatures') {
    mp.console.logInfo(`[CHAR] Received faceFeatures array update, but using updateFaceFeature instead`);
    return;
  }

  // ЗАЩИТА: Не позволяем clothes стать числом
  if (fieldName === 'clothes') {
    mp.console.logWarning(`[CHAR] Attempt to set clothes as non-object value: ${typeof value}, value: ${value}`);
    return; // Игнорируем прямую установку clothes
  }

  characterData[fieldName] = value;
  handleCharacterChange(fieldName, value);
});

rce.registerAll('cef:createChar:updateFaceFeature', (index: any, value: any) => {
  try {
    const featureIndex = parseInt(index);
    const featureValue = parseFloat(value);

    if (isNaN(featureIndex) || featureIndex < 0 || featureIndex > 19) {
      mp.console.logError(`[CHAR] Invalid face feature index: ${index}`);
      return;
    }

    if (isNaN(featureValue) || featureValue < -1 || featureValue > 1) {
      mp.console.logError(`[CHAR] Invalid face feature value: ${value}`);
      return;
    }

    if (!Array.isArray(characterData.faceFeatures)) {
      mp.console.logError(`[CHAR] faceFeatures is not an array, resetting. Current type: ${typeof characterData.faceFeatures}, value: ${characterData.faceFeatures}`);
      characterData.faceFeatures = [
        0, 0, 0, 0, 0, 0,
        0, 0,
        0, 0,
        0, 0, 0,
        0, 0,
        0, 0, 0, 0,
        0
      ];
    }

    // Обновляем данные
    characterData.faceFeatures[featureIndex] = featureValue;

    // Применяем изменения к персонажу
    mp.players.local.setFaceFeature(featureIndex, featureValue);

  } catch (error) {
    mp.console.logError(`[CHAR] Error in updateFaceFeature: ${error}`);
  }
});

function applyFullCharacter(data) {
  // Смешение родителей
  mp.players.local.setHeadBlendData(
      data.father, data.mother, 0,
      data.father, data.mother, 0,
      data.shapeMix, data.skinMix, 0,
      false
  );

  // Черты лица
  data.faceFeatures.forEach((featureValue, index) => {
    mp.players.local.setFaceFeature(index, parseFloat(featureValue));
  });

  // Цвет глаз
  mp.players.local.setEyeColor(parseInt(data.eyeColor));

  // Волосы
  mp.players.local.setComponentVariation(2, parseInt(data.hair), 0, 0);
  mp.players.local.setHairColor(parseInt(data.hairColor), 0);

  // Брови
  mp.players.local.setHeadOverlay(2, parseInt(data.eyebrow) - 1, 1, parseInt(data.eyebrowColor), 0);

  // Борода
  mp.players.local.setHeadOverlay(1, parseInt(data.beard) - 1, 1, parseInt(data.beardColor), 0);

  // Одежда
  mp.players.local.setComponentVariation(11, parseInt(data.clothes.tops), 0, 0);
  mp.players.local.setComponentVariation(4, parseInt(data.clothes.legs), 0, 0);
  mp.players.local.setComponentVariation(6, parseInt(data.clothes.shoes), 0, 0);
}

function handleCharacterChange(fieldName: any, value: any) {
  switch (fieldName) {
    case 'father':
    case 'mother':
    case 'shapeMix':
    case 'skinMix':
      mp.players.local.setHeadBlendData(
          characterData.mother, characterData.father, 0,
          characterData.mother, characterData.father, 0,
          characterData.shapeMix, characterData.skinMix, 0,
          false
      );
      break;

    case 'eyeColor':
      mp.players.local.setEyeColor(parseInt(value));
      break;

    case 'hair':
      mp.players.local.setComponentVariation(2, parseInt(value), 0, 0);
      break;

    case 'hairColor':
      mp.players.local.setHairColor(parseInt(value), 0);
      break;

    case 'eyebrow':
      mp.players.local.setHeadOverlay(2, parseInt(value) - 1, 1, characterData.eyebrowColor, 0);
      break;

    case 'eyebrowColor':
      mp.players.local.setHeadOverlay(2, characterData.eyebrow - 1, 1, parseInt(value), 0);
      break;

    case 'beard':
      mp.players.local.setHeadOverlay(1, parseInt(value) - 1, 1, characterData.beardColor, 0);
      break;

    case 'beardColor':
      if (characterData.gender === 'male') {
        mp.players.local.setHeadOverlay(1, characterData.beard - 1, 1, parseInt(value), 0);
      }
      break;

    case 'gender':
      if (value === 'male') {
        localPlayer.model = mp.game.joaat('mp_m_freemode_01')
        setTimeout(() => {
          playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, -1)
        }, 500)
      } else {
        localPlayer.model = mp.game.joaat('mp_f_freemode_01')
        setTimeout(() => {
          playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, -1)
        }, 500)
      }
      break;
  }
}

export const createChar = (sid: number, numberSlot: number, uniqueScenario: string | undefined) => {
  rce.triggerServer('setSpawnChar', -111.3426, 357.2092, 112.6961, 153.0604)
  rce.triggerServer('setNumberChar', numberSlot)

    currentCamera = createCamera(
        new mp.Vector3(-112.6367, 355.0139, 113.0961),
        new mp.Vector3(-2, 0, -28.83),
        30
    )

    if (currentCamera) {
      currentCamera.setActive(true)
      mp.game.cam.renderScriptCams(true, false, 0, true, false)
    }



    gui.execute('window.App.loadingReducer.showLoading(2500)')
    gui.execute(`window.App.createCharReducer.showCreateChar(${sid}, ${numberSlot})`)
    rce.triggerServer('setSpawnChar', -111.3426, 357.2092, 112.6961, 153.0604)
    mp.console.logInfo(`Pos pl: ${mp.players.local.position}`)

    setTimeout(() => {
      mp.gui.cursor.visible = true
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

      setTimeout(() => {
        playAnim('anim@amb@business@meth@meth_smash_weight_check@', 'break_weigh_v2_methbag01^4', 1, -1)
      }, 500)
    }, 500)

    mp.players.local.freezePosition(true)
}

rce.registerServer('closeCreateChar', () => {
  cameraRotator.stop()
  gui.execute('window.App.loadingReducer.showLoading(2500)')
  if (mp.cameras.exists(currentCamera)) currentCamera.destroy()
  if (mp.cameras.exists(targetCamera)) targetCamera.destroy()

  currentCamera = null
  targetCamera = null

  mp.game.cam.renderScriptCams(false, false, 0, true, false)
  mp.gui.cursor.visible = false

  setTimeout(() => {
    gui.execute('window.App.chatReducer.showChat()')
    gui.execute('window.App.hudReducer.showHud()')
    mp.players.local.freezePosition(false)
    mp.game.ui.displayRadar(true)
  }, 4000)
})