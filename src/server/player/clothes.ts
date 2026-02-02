import { rce } from "../utils/rce"
import { connectedUsers } from "../data/dataConnectedUser";
import { getItemById } from "../modules/inventory/items";
import empty from '../configs/clothes/empty.json'
import undershirts from '../configs/clothes/undershirts.json'
import torsos from '../configs/clothes/torsos.json'
import tops from '../configs/clothes/tops.json'

const SLOT_TO_RAGE_ID = {
  0: { type: 'prop', id: 0 },    // Головной убор
  1: { type: 'prop', id: 2 },    // Украшения
  2: { type: 'component', id: 1 }, // Маска
  3: { type: 'prop', id: 1 },    // Очки
  4: { type: 'prop', id: 7 },    // Браслет
  5: { type: 'component', id: 11 }, // Футболка
  6: { type: 'component', id: 3 },  // Перчатки
  7: { type: 'component', id: 9 },  // Бронежилет
  8: { type: 'component', id: 11 }, // Верх
  9: { type: 'prop', id: 6 },    // Часы
  10: { type: 'component', id: 5 }, // Сумка
  11: { type: 'component', id: 4 }, // Штаны
  12: { type: 'component', id: 6 }  // Обувь
} as const;

type ClothesData = { drawable: number, texture: number }

const applyUpperBody = (player: PlayerMp) => {
  console.log(`[CLOTHES applyUpperBody] START for player ${player.id}`);

  const gender = connectedUsers.getField(player.id, 'gender') ||
    (player.model === mp.joaat('mp_m_freemode_01') ? 'male' : 'female');

  const shirt  = player.getVariable('shirt')  as ClothesData | null | undefined;
  const jacket = player.getVariable('jacket') as ClothesData | null | undefined;

  console.log(`[CLOTHES] shirt: ${JSON.stringify(shirt)}, jacket: ${JSON.stringify(jacket)}`);

  let topDrawable = empty[gender]?.[11] ?? 15;
  let topTexture  = 0;
  let usedFrom = 'default';

  // Приоритет: jacket > shirt > default
  // Убираем проверку !== empty[11] для shirt — 0 это футболка!
  if (jacket?.drawable !== undefined && jacket.drawable >= 0) {
    topDrawable = jacket.drawable;
    topTexture  = jacket.texture ?? 0;
    usedFrom = 'jacket';
  } else if (shirt?.drawable !== undefined && shirt.drawable >= 0) {
    topDrawable = shirt.drawable;
    topTexture  = shirt.texture ?? 0;
    usedFrom = 'shirt';
  }

  console.log(`[CLOTHES] Using ${usedFrom} as top: ${topDrawable}/${topTexture}`);

  player.setClothes(11, topDrawable, topTexture, 2);
  console.log(`[CLOTHES] setClothes(11) → ${topDrawable}/${topTexture}`);

  // Undershirt — здесь тоже важно: если shirt.drawable === 0 — всё равно считать, что shirt надет
  let undershirtDrawable = empty[gender]?.[8] ?? 15;
  let undershirtTexture  = shirt?.texture ?? 0;

  if (shirt?.drawable !== undefined && shirt.drawable >= 0) {  // ← Изменено: >= 0
    const topType = tops?.[gender]?.[topDrawable] ?? 0;
    console.log(`[CLOTHES] topType: ${topType}`);

    const undershirtOptions = undershirts?.[gender]?.[shirt.drawable];
    console.log(`undershirts[${gender}][${shirt.drawable}] exists? ${!!undershirtOptions}`);

    if (undershirtOptions && undershirtOptions[topType] !== undefined) {
      undershirtDrawable = undershirtOptions[topType];
      console.log(`Found undershirt: ${undershirtDrawable}`);
    } else {
      console.warn(`НЕТ undershirt для shirt ${shirt.drawable}, type ${topType} → default ${undershirtDrawable}`);
    }
  } else {
    console.log(`No shirt → default undershirt ${undershirtDrawable}`);
  }

  player.setClothes(8, undershirtDrawable, undershirtTexture, 2);
  console.log(`[CLOTHES] setClothes(8) → ${undershirtDrawable}/${undershirtTexture}`);

  // Torso — здесь всё ок, 0 тоже валидный topDrawable
  const torsoDrawable = torsos?.[gender]?.[topDrawable] ?? empty[gender]?.[3] ?? 15;
  player.setClothes(3, torsoDrawable, 0, 2);
  console.log(`[CLOTHES] setClothes(3) → ${torsoDrawable}/0`);

  console.log(`[CLOTHES applyUpperBody] FINISH`);
};

export const usageClothes = (player: PlayerMp, internalSlot: number, drawable: number, texture: number = 0, itemId?: number) => {
  console.log(
    `[CLOTHES usageClothes] CALL → slot=${internalSlot}, drawable=${drawable}, texture=${texture}, player=${player.id}`
  );

  const rageInfo = SLOT_TO_RAGE_ID[internalSlot as keyof typeof SLOT_TO_RAGE_ID];

  if (!rageInfo) {
    console.error(`[CLOTHES] ERROR: unknown internalSlot ${internalSlot}`);
    return;
  }

  console.log(`[CLOTHES] rageInfo → type=${rageInfo.type}, id=${rageInfo.id}`);

  const freemodeModels = [mp.joaat('mp_m_freemode_01'), mp.joaat('mp_f_freemode_01')];

  if (!freemodeModels.includes(player.model)) {
    if (rageInfo.type === 'prop') player.setProp(rageInfo.id, drawable, texture);
    else player.setClothes(rageInfo.id, drawable, texture, 2);
    return;
  }

  const gender = connectedUsers.getField(player.id, 'gender') ||
    (player.model === mp.joaat('mp_m_freemode_01') ? 'male' : 'female');

  const isUpperBodySlot = internalSlot === 5 || internalSlot === 8;

  // Снимаем ТОЛЬКО если явно передали -1 (или меньше)
  const isRemove = drawable < 0;

  console.log(`[CLOTHES] Action: ${isRemove ? 'REMOVE' : 'SET'} (drawable=${drawable}, isUpper=${isUpperBodySlot})`);

  if (rageInfo.type === 'prop') {
    let finalPropId: any = rageInfo.id;

    // Переопределяем для проблемных слотов
    if ((internalSlot === 1 || internalSlot === 4) && itemId && !isRemove) {
      const itemData = getItemById(itemId);
      if (itemData?.clothesData?.propId) {
        finalPropId = itemData.clothesData.propId;
        console.log(`[CLOTHES] Slot ${internalSlot} item ${itemId} → propId=${finalPropId}`);

        // Если propId = 7 и слот 1 — это component 7, а не prop
        if (internalSlot === 1 && finalPropId === 7) {
          player.setClothes(7, drawable, texture, 2);
          console.log(`[CLOTHES] Special: setClothes(7, ${drawable}, ${texture}, 2)`);
          return;
        }
      }
    }

    const propValue = isRemove ? -1 : drawable;
    const propTex   = isRemove ? 0 : texture;

    player.setProp(finalPropId, propValue, propTex);
    console.log(`[CLOTHES] setProp(${finalPropId}, ${propValue}, ${propTex})`);
    return;
  }

  if (isUpperBodySlot) {
    const varName = internalSlot === 5 ? 'shirt' : 'jacket';

    if (isRemove) {
      player.setVariable(varName, null);
      console.log(`[CLOTHES] Cleared ${varName}`);
    } else {
      player.setVariable(varName, { drawable, texture });
      console.log(`[CLOTHES] Set ${varName} → ${drawable}/${texture}`);
    }

    applyUpperBody(player);
  } else {
    let finalDrawable = drawable;
    let finalTexture = texture;

    if (isRemove) {
      // Снятие → дефолт из empty.json
      finalDrawable = empty[gender]?.[rageInfo.id] ?? 0;
      finalTexture = 0;

      // Специальные дефолты для определённых слотов
      if (rageInfo.id === 4) {  // pants
        finalDrawable = 61;   // ← твоё значение для "голых ног"
        console.log(`[CLOTHES] Pants remove → forced to 61`);
      }
      // Можно добавить для других слотов, например:
      // if (rageInfo.id === 6) finalDrawable = 34; // shoes male default
      // if (rageInfo.id === 5) finalDrawable = 0;  // bag empty

      console.log(`[CLOTHES] REMOVE → setClothes(${rageInfo.id}, ${finalDrawable}, ${finalTexture}, 2)`);
    } else {
      // Надевание (0 — тоже валидно, например голые ноги/голова)
      console.log(`[CLOTHES] SET → setClothes(${rageInfo.id}, ${finalDrawable}, ${finalTexture}, 2)`);
    }

    player.setClothes(rageInfo.id, finalDrawable, finalTexture, 2);
  }

  if (rageInfo.id === 1) {
    player.setVariable('inMask', !isRemove && drawable !== (empty[gender]?.[1] ?? 0));
  }

  console.log(`[CLOTHES usageClothes] FINISH`);
};

// CEF событие — должно приходить componentId, drawable, texture
rce.registerClientCef('setClothes', (player: PlayerMp, componentId: number, drawable: number, texture: number) => {
  console.log(
    `[CEF → SERVER] setClothes event received: slot=${componentId}, drawable=${drawable}, texture=${texture}, player=${player.id}`
  );
  usageClothes(player, componentId, drawable, texture);
});