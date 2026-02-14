import './whitelist/index'
import './player/spawn'
import './player/playerCmd'
import './admin/adminCmd'
import './database/mysql'
import './menus/index'
import './utils/rce'
import './player/death'
import './world/time'
import './main/started'
import './data/getDataAccount'
import './player/events'
import './player/voice'
import './admin/noclip'
import './modules/rent'
import './menus/create-char'
// import './player/money'
import './main/shutDown'
import './admin/console'
import './admin/spawnVeh'
import './admin/reportMenu'
import './data/dataConnectedUser'
import './player/experience'
import './modules/inventory/inventoryHandlers'
import './player/clothes'
import './modules/inventory/itemsObject'
import './player/interaction'
import './modules/inventory/tradeManager'

mp.world.weather = 'XMAS'

export const setCustomizationChar = (player: PlayerMp, dataChar: any) => {
  try {
    const gender = dataChar.gender === 'male';

    player.setCustomization(
        gender,
        dataChar.mother,
        dataChar.father,
        0,
        dataChar.mother,
        dataChar.father,
        0,
        dataChar.shapeMix,
        dataChar.skinMix,
        0,
        dataChar.eyeColor,
        dataChar.hairColor,
        0,
        dataChar.faceFeatures
    )

    if (dataChar.eyebrow !== undefined) {
      player.setHeadOverlay(2, [dataChar.eyebrow - 1, 1.0, dataChar.eyebrowColor, dataChar.eyebrowColor]);
    }

    if (gender && dataChar.beard !== undefined && dataChar.beard > 0) {
      player.setHeadOverlay(1, [dataChar.beard - 1, 1.0, dataChar.beardColor, dataChar.beardColor]);
    }

    player.setClothes(2, dataChar.hair, 0, 2);

    player.setClothes(11, dataChar.clothes.tops, 0, 2);
    player.setClothes(4, dataChar.clothes.legs, 0, 2);
    player.setClothes(6, dataChar.clothes.shoes, 0, 2);

    console.log('Кастомизация персонажа установлена на серверной стороне');
    return true;

  } catch (customizationError) {
    console.error('Ошибка при установке кастомизации:', customizationError);
    return false;
  }
};