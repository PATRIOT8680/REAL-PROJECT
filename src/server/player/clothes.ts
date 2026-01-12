import { rce } from "../utils/rce";
import torsoDataFemale from "../configs/besttorso_female.json";
import torsoDataMale from "../configs/besttorso_male.json";

const SLOT_TO_RAGE_ID = {
  0: { type: 'prop', id: 0 },   // Головной убор → prop 0 (hat)
  1: { type: 'prop', id: 2 },   // Украшения → prop 2 (ears? или что-то другое)
  2: { type: 'component', id: 1 }, // Маска → component 1
  3: { type: 'prop', id: 1 },   // Очки → prop 1 (glasses)
  4: { type: 'prop', id: 7 },   // Браслет → prop 7
  5: { type: 'component', id: 11 }, // Футболка → component 11
  6: { type: 'component', id: 3 },  // Перчатки → component 3? (проверь!)
  7: { type: 'component', id: 9 },  // Бронежилет → component 9
  8: { type: 'component', id: 11 }, // Верх → component 11
  9: { type: 'component', id: 5 },  // Сумка → component 5
  10: { type: 'component', id: 4 }, // Штаны → component 4
  11: { type: 'component', id: 6 }  // Обувь → component 6
} as const;

// Функция одевания/снятия
export const usageClothes = (player: PlayerMp, internalSlot: number, drawable: number, texture: number) => {
  const rageInfo = SLOT_TO_RAGE_ID[internalSlot as keyof typeof SLOT_TO_RAGE_ID];

  if (!rageInfo) {
    console.log(`[CLOTHES] Unknown internal slot: ${internalSlot}`);
    return;
  }

  console.log(`[CLOTHES] Internal slot ${internalSlot} → ${rageInfo.type} ${rageInfo.id}, drawable=${drawable}, texture=${texture}`);

  const freemodeModels = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];

  if (!freemodeModels.includes(player.model)) {
    player.setClothes(rageInfo.id, drawable, texture, 2);
    return;
  }

  const isMale = player.model === freemodeModels[0];
  const torsoData = isMale ? torsoDataMale : torsoDataFemale;

  if (rageInfo.type === 'prop') {
    player.setProp(rageInfo.id, drawable, texture);
    console.log(`[CLOTHES] Set prop ${rageInfo.id}`);
    return;
  }

  // Компоненты
  if (rageInfo.id === 11) {
    player.setClothes(8, 15, 0, 2); // undershirt

    if (torsoData[drawable]?.[texture]) {
      const torsoInfo = torsoData[drawable][texture];
      if (torsoInfo.BestTorsoDrawable !== -1 && torsoInfo.BestTorsoDrawable !== 0) {
        player.setClothes(3, torsoInfo.BestTorsoDrawable, torsoInfo.BestTorsoTexture, 2);
      } else {
        player.setClothes(3, isMale ? 15 : 15, 0, 2);
      }
    } else {
      player.setClothes(3, isMale ? 15 : 15, 0, 2);
    }

    player.setClothes(11, drawable, texture, 2);
  } else {
    player.setClothes(rageInfo.id, drawable, texture, 2);
  }

  console.log(`[CLOTHES] Set component ${rageInfo.id}`);
};

// Регистрация события от CEF
rce.registerClientCef('setClothes', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
  usageClothes(player, componentId, drawable, texture);
});