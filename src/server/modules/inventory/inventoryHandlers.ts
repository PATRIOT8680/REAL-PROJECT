import { rce } from "../../utils/rce";
import { getItemById, getItemImageIdForCef } from "./items";
import { getDataAccount } from "../../data/getDataAccount";
import { findFreeSlotsInInventory, processInventoryMove, updateSlotsArray, normalizeSlots } from "./inventoryMove";
import { decrementDonatCoins } from "../../data/account/donatcoins";
import { connectedUsers } from "../../data/dataConnectedUser";
import { data } from "../../database/mysql";
import chalk from "chalk";
import { useClothes } from "./usageItems";
import { usageClothes } from "../../player/clothes";
import { dropItemOnGround } from "./itemsObject";
import { getMyOffers, getPartnerOffers, getTradeForPlayer } from "./tradeManager";
import {ServerItem} from "../../../shared/types/items";

interface IHaveBag {
  have: boolean,
  weight?: number
}

export interface IInventoryWeight {
  current: number,
  max: number
}

type InventorySection = 'main' | 'donat' | 'bag'

interface SectionConfig {
  table: string
  column: string
  defaultSlots: number
  isBag?: boolean
  getSlots: (inventory: any, uid: number) => Promise<any[] | null>
  saveSlots: (uid: number, slots: any[], extra?: any) => Promise<boolean>
}

const SECTION_CONFIG: Record<InventorySection, SectionConfig> = {
  main: {
    table: 'inventory',
    column: 'mainslots',
    defaultSlots: 20,
    getSlots: async (inv) => normalizeSlots(JSON.parse(inv.mainslots || '[]')),
    saveSlots: async (uid, slots) => {
      const json = JSON.stringify(normalizeSlots(slots, 20))
      return new Promise<boolean>((resolve, reject) => {
        data.query(
          'UPDATE inventory SET mainslots = ? WHERE uid = ?',
          [json, uid],
          (err) => {
            if (err) {
              console.error(chalk.red('[SAVE MAIN]'), err)
              reject(err)
              return
            }
            resolve(true)
          }
        )
      })
    }
  },

  donat: {
    table: 'inventory',
    column: 'donatslots',
    defaultSlots: 15,
    getSlots: async (inv) => {
      const d = JSON.parse(inv.donatslots || '{}')
      return normalizeSlots(d.slots || [], 15)
    },
    saveSlots: async (uid, slots) => {
      const json = JSON.stringify({ have: true, slots: normalizeSlots(slots, 15) })
      return new Promise<boolean>((resolve, reject) => {
        data.query(
          'UPDATE inventory SET donatslots = ? WHERE uid = ?',
          [json, uid],
          (err) => {
            if (err) {
              console.error(chalk.red('[SAVE DONAT]'), err)
              reject(err)
              return
            }
            resolve(true)
          }
        )
      })
    }
  },

  bag: {
    table: 'bags',
    column: 'items',
    defaultSlots: 20,
    isBag: true,
    getSlots: async (_, uid) => {
      const bag = await getEquippedBag(uid)
      return bag ? normalizeSlots(JSON.parse(bag.items || '[]')) : null
    },
    saveSlots: async (uid, slots, bagUid) => {
      if (!bagUid) return false
      const json = JSON.stringify(normalizeSlots(slots, 20))
      const weight = calcWeightSlots(slots)
      return new Promise<boolean>((resolve, reject) => {
        data.query(
          'UPDATE bags SET items = ?, weight = ? WHERE bag_uid = ? AND owner_uid = ?',
          [json, weight, bagUid, uid],
          (err) => {
            if (err) {
              console.error(chalk.red('[SAVE BAG]'), err)
              reject(err)
              return
            }
            resolve(true)
          }
        )
      })
    }
  }
}

rce.registerCef('moveItemInInventory', async (
  player: PlayerMp,
  sourceSection: string,
  sourceSlot: number,
  targetSection: string,
  targetSlot: number
) => {
  try {
    console.log('Перемещаем')
    const uid = await getDataAccount(player, 'uid', player.id)
    const success = await processInventoryMove(uid, sourceSection, sourceSlot, targetSection, targetSlot)

    if (success) {
      await sendInventoryToCef(player, uid)
    } else {
      console.error(chalk.bgRed('• MOVE ITEM •') + chalk.red(` Ошибка при сохранении перемещения`))
      rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка при перемещении предмета!', 3500, 'top')
    }
  } catch (e) {
    console.error(chalk.bgRed('• MOVE ITEM [try] •') + chalk.red(` ${e}`))
  }
})

rce.registerClientCef('useItem', async (player: PlayerMp, itemId: number, slotIdx: number, section: string) => {
  try {
    const itemData = getItemById(itemId)

    if (!itemData) {
      rce.triggerClient(player, 'sendNotify', 'err', 'Предмет не найден!', 3500, 'top')
      return
    }

    if (!itemData.usage && itemData.type !== 'clothes') {
      rce.triggerClient(player, 'sendNotify', 'warning', 'Этот предмет нельзя использовать!', 3500, 'top')
      return
    }

    const uid = await getDataAccount(player, 'uid', player.id)
    const inventory = await getPlayerInventory(uid)

    if (!inventory) {
      rce.triggerClient(player, 'sendNotify', 'err', 'Инвентарь не найден! Обратитесь к разработчикам', 3500, 'bottom')
      return
    }

    if (section === 'fast') {
      const fastSlots = JSON.parse(inventory.fastslots || '[]');
      const fastItem = fastSlots[slotIdx];

      if (!fastItem || fastItem.id !== itemId) {
        return rce.triggerClient(player, 'sendNotify', 'err', 'Предмет в быстром слоте не найден!', 3000, 'top');
      }

      // Ищем, где реально лежит этот предмет (main/donate/bag/clothes)
      let realSection: string | null = null;
      let realSlot: number | null = null;

      const tryFind = (slots: any[], sectionName: string) => {
        if (!slots) return;
        const idx = slots.findIndex(item => item?.id === itemId && item?.quantity > 0);
        if (idx !== -1) {
          realSection = sectionName;
          realSlot = idx;
        }
      };

      tryFind(JSON.parse(inventory.mainslots), 'main');
      if (!realSection) tryFind(JSON.parse(inventory.clothesslots), 'clothes');

      // Если есть donate — тоже можно проверить
      if (!realSection) {
        const donat = JSON.parse(inventory.donatslots);
        tryFind(donat.slots || [], 'donat');
      }

      // Если всё ещё не нашли — ошибка
      if (!realSection || realSlot === null) {
        console.log(`[USE FAST] Не найден реальный предмет ${itemId} в инвентаре`);
        return rce.triggerClient(player, 'sendNotify', 'err', 'Оригинальный предмет не найден в инвентаре!', 3500, 'top');
      }

      // Теперь вызываем ту же логику, но уже с реальной секцией
      section = realSection;
      slotIdx = realSlot;
      // дальше код продолжит работать как обычно ↓↓↓
    }

    // 🚨 ОБРАБОТКА ПРЕДМЕТОВ В СУМКЕ
    if (section === 'bag') {
      console.log(chalk.cyan(`[USE ITEM BAG] Пытаемся использовать предмет из сумки: itemId=${itemId}, slotIdx=${slotIdx}`));

      const clothesSlots = JSON.parse(inventory.clothesslots);
      const bagItem = clothesSlots[10];

      if (!bagItem || !bagItem.id) {
        rce.triggerClient(player, 'sendNotify', 'err', 'Сумка не надета!', 3000, 'top');
        return;
      }

      const bagItemData = getItemById(bagItem.id);
      if (!bagItemData ||
        !bagItemData.clothesData ||
        bagItemData.clothesData.slot !== 10 ||
        bagItemData.clothesData.maxWeight === undefined) {
        console.log(chalk.red(`[USE ITEM BAG] Предмет в слоте 10 не является сумкой: id=${bagItem.id}`));
        rce.triggerClient(player, 'sendNotify', 'err', 'Сумка не надета!', 3000, 'top');
        return;
      }

      const bagData = await getEquippedBag(uid);
      if (!bagData) {
        rce.triggerClient(player, 'sendNotify', 'err', 'Содержимое сумки не найдено!', 3000, 'top');
        return;
      }

      const slots = bagData.items ? JSON.parse(bagData.items) : Array(20).fill(null);
      const slot = slots[slotIdx];

      if (!slot || slot.id !== itemId) {
        console.log(chalk.red(`[USE ITEM BAG] Предмет не найден в сумке: slot=${JSON.stringify(slot)}, ожидаемый itemId=${itemId}`));
        rce.triggerClient(player, 'sendNotify', 'err', 'Предмет не найден в сумке!', 3000, 'top');
        return;
      }

      console.log(chalk.cyan(`[USE ITEM BAG] Найден предмет: ${JSON.stringify(slot)}`));

      // ─── Одежда из сумки ────────────────────────────────────────
      if (itemData.type === 'clothes') {
        console.log(chalk.cyan(`[USE ITEM BAG] Использование одежды из сумки: ${itemId}`));

        const isEquipped = clothesSlots.some((s: any) => s?.id === itemId);
        const clothesSlotIndex = itemData.clothesData?.slot ?? -1;

        if (clothesSlotIndex === -1) {
          rce.triggerClient(player, 'sendNotify', 'err', 'Неверные данные одежды!', 3000, 'top');
          return;
        }

        if (isEquipped) {
          // Снимаем
          const freeSlotInfo = await findFreeSlotsInInventory(uid);
          if (!freeSlotInfo.section) {
            rce.triggerClient(player, 'sendNotify', 'err', 'Нет свободного слота!', 3000, 'top');
            return;
          }
          const updatedClothes = clothesSlots.map((slot: any, idx: number) =>
            idx === clothesSlotIndex ? null : slot
          );
          await updateSlotsArray(uid, 'clothes', updatedClothes);
          const targetSection = freeSlotInfo.section;
          const targetSlot = freeSlotInfo.slot;
          let targetSlots: any[] = [];
          switch (targetSection) {
            case 'main':
              targetSlots = normalizeSlots(JSON.parse(inventory.mainslots || '[]'));
              break;
            case 'donat':
              const donat = JSON.parse(inventory.donatslots || '{}');
              targetSlots = normalizeSlots(donat.slots || []);
              break;
            case 'bag':
              const bag = await getEquippedBag(uid);
              if (bag) targetSlots = normalizeSlots(JSON.parse(bag.items || '[]'));
              break;
            default:
              rce.triggerClient(player, 'sendNotify', 'err', 'Неизвестная секция для возврата!', 3000, 'top');
              return;
          }
          targetSlots[targetSlot] = { id: itemId, quantity: 1 };

          // Сохраняем с проверкой на 'bag'
          console.log(chalk.blue(`[USE CLOTHES OFF] Сохраняем в targetSection: ${targetSection}`));
          if (targetSection === 'bag') {
            const clothesSlots = JSON.parse(inventory.clothesslots);
            const bagUid = clothesSlots[10]?.id;
            if (!bagUid) {
              console.log(chalk.red('[USE CLOTHES OFF] bagUid не найден'));
              return;
            }
            await handleBagOperations(uid, 'update', bagUid, targetSlots);
          } else {
            await updateSlotsArray(uid, targetSection, targetSlots);
          }

          // ←←← Если снимаем сумку — unequip
          if (clothesSlotIndex === 10 && itemData.clothesData?.maxWeight !== undefined) {
            await handleBagOperations(uid, 'unequip', itemId);
          }
          usageClothes(player, clothesSlotIndex, -1, 0, itemId);
          useClothes(player, itemId, false); // снял
          await updateTotalWeightInventory(uid);
          await sendInventoryToCef(player, uid);
          console.log(chalk.green(`[USE CLOTHES] Снята и возвращена в ${targetSection}-${targetSlot}`));
          return;
        }

        // Надеваем одежду
        const updatedClothes = clothesSlots.map((s: any, idx: number) =>
          idx === clothesSlotIndex ? { id: itemId, quantity: 1 } : s
        );

        // Удаляем из сумки
        const updateSuccess = await updateSlot(uid, 'bag', slotIdx, null, bagItem.id);
        if (!updateSuccess) {
          console.error(chalk.red('[USE CLOTHES BAG] Ошибка при удалении из сумки'));
          rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка при обновлении инвентаря!', 3500, 'top');
          return;
        }

        await updateSlotsArray(uid, 'clothes', updatedClothes);

        if (clothesSlotIndex === 10 && itemData.clothesData?.maxWeight !== undefined) {
          await handleBagOperations(uid, 'equip', itemId);
        }

        usageClothes(player, clothesSlotIndex, itemData.clothesData.drawable, itemData.clothesData.texture, itemId);
        useClothes(player, itemId, true); // одел

        await updateTotalWeightInventory(uid);
        await sendInventoryToCef(player, uid);

        rce.triggerClient(player, 'execute', `window.App.inventoryReducer.removeItem('bag', ${slotIdx})`);

        console.log(chalk.green(`[USE CLOTHES BAG] Надета одежда ${itemId} из bag-${slotIdx} в слот ${clothesSlotIndex}`));
        return;
      }

      // Используем предмет
      try {
        itemData.usage(player)
      } catch (usageError) {
        console.error(chalk.bgRed('• USE ITEM [bag usage] •') + chalk.red(` ${usageError}`))
        rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка при использовании предмета!', 3500, 'top')
        return
      }

      // Обработка расходуемого предмета
      if (itemData.consumable !== false) {
        if (slot.quantity > 1) {
          slot.quantity -= 1

          // Обновляем слот в сумке
          const updateSuccess = await updateSlot(uid, 'bag', slotIdx, slot, bagItem.id)
          if (!updateSuccess) {
            console.error(chalk.red('[USE ITEM BAG] Ошибка при обновлении слота сумки'))
            rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка при обновлении инвентаря!', 3500, 'top')
            return
          }

          rce.triggerClient(player, 'execute', `window.App.inventoryReducer.updateItemQuantity('bag', ${slotIdx}, ${slot.quantity})`)
        } else {
          // Удаляем предмет из сумки
          const clearSuccess = await updateSlot(uid, 'bag', slotIdx, null, bagItem.id)
          if (!clearSuccess) {
            console.error(chalk.red('[USE ITEM BAG] Ошибка при удалении предмета из сумки'))
            rce.triggerClient(player, 'sendNotify', 'err', 'Ошибка при обновлении инвентаря!', 3500, 'top')
            return
          }

          rce.triggerClient(player, 'execute', `window.App.inventoryReducer.removeItem('bag', ${slotIdx})`)
        }

        await updateTotalWeightInventory(uid)
        await sendInventoryToCef(player, uid)

        const inventoryAfterUse = await getPlayerInventory(uid); // свежие данные после изменения
        const fastSlots = JSON.parse(inventoryAfterUse.fastslots || '[]');

        let fastChanged = false;

        for (let i = 0; i < fastSlots.length; i++) {
          const fastItem = fastSlots[i];
          if (!fastItem) continue;

          if (fastItem.id === itemId) {
            // Ищем, остался ли предмет в оригинальной секции
            let stillExists = false;
            let newQuantity = 0;

            // Проверяем main
            const main = JSON.parse(inventoryAfterUse.mainslots);
            const mainItem = main.find(it => it?.id === itemId);
            if (mainItem) {
              stillExists = true;
              newQuantity = mainItem.quantity;
            }

            // Можно добавить donate, clothes, bag если нужно

            if (!stillExists) {
              // Предмет полностью закончился → убираем из fast
              fastSlots[i] = null;
              fastChanged = true;
            } else if (newQuantity !== fastItem.quantity) {
              // Количество уменьшилось → обновляем
              fastSlots[i] = { ...fastItem, quantity: newQuantity };
              fastChanged = true;
            }
          }
        }

        if (fastChanged) {
          const updateFastSql = 'UPDATE inventory SET fastslots = ? WHERE uid = ?';
          data.query(updateFastSql, [JSON.stringify(fastSlots), uid], (err) => {
            if (err) console.error('[FAST SYNC AFTER USE] Ошибка:', err);
          });

          // И сразу отправляем обновление клиенту (чтобы fast-слоты синхронизировались без переоткрытия)
          await sendInventoryToCef(player, uid);
        }
      }

      // ВАЖНО: Выходим из функции после обработки сумки
      console.log(chalk.green('[USE ITEM BAG] Предмет успешно использован из сумки'))
      return
    }

    // 🚨 ОБРАБОТКА ПРЕДМЕТОВ В ДРУГИХ СЕКЦИЯХ (main, donate, clothes)
    let slots
    if (section === 'main') {
      slots = JSON.parse(inventory.mainslots)
    } else if (section === 'donat') {
      const donatData = JSON.parse(inventory.donatslots)
      slots = donatData.slots
    } else if (section === 'clothes') {
      slots = JSON.parse(inventory.clothesslots)
    } else {
      rce.triggerClient(player, 'sendNotify', 'err', 'Неизвестная секция инвентаря!', 3500, 'bottom')
      return
    }

    const slot = slots[slotIdx]

    if (!slot || slot.id !== itemId) {
      rce.triggerClient(player, 'sendNotify', 'err', 'Предмет не найден в инвентаре!', 3500, 'bottom')
      return
    }

    try {
      if (itemData.type === 'clothes') {
        const uid = await getDataAccount(player, 'uid', player.id);
        const inventory = await getPlayerInventory(uid);
        if (!inventory) {
          rce.triggerClient(player, 'sendNotify', 'err', 'Инвентарь не найден!', 3500, 'bottom');
          return;
        }

        const clothesSlots = JSON.parse(inventory.clothesslots || '[]');
        const isEquipped = clothesSlots.some((slot: any) => slot?.id === itemId);

        const clothesSlotIndex = itemData.clothesData?.slot ?? -1;
        if (clothesSlotIndex === -1) {
          rce.triggerClient(player, 'sendNotify', 'err', 'Неверные данные одежды!', 3000, 'top');
          return;
        }

        if (isEquipped) {
          // Снимаем
          const freeSlotInfo = await findFreeSlotsInInventory(uid);
          if (!freeSlotInfo.section) {
            rce.triggerClient(player, 'sendNotify', 'err', 'Нет свободного слота!', 3000, 'top');
            return;
          }

          const updatedClothes = clothesSlots.map((slot: any, idx: number) =>
            idx === clothesSlotIndex ? null : slot
          );
          await updateSlotsArray(uid, 'clothes', updatedClothes);

          const targetSection = freeSlotInfo.section;
          const targetSlot = freeSlotInfo.slot;

          let targetSlots: any[] = [];
          switch (targetSection) {
            case 'main':
              targetSlots = normalizeSlots(JSON.parse(inventory.mainslots || '[]'));
              break;
            case 'donat':
              const donat = JSON.parse(inventory.donatslots || '{}');
              targetSlots = normalizeSlots(donat.slots || []);
              break;
            case 'bag':
              const bag = await getEquippedBag(uid);
              if (bag) targetSlots = normalizeSlots(JSON.parse(bag.items || '[]'));
              break;
            default:
              rce.triggerClient(player, 'sendNotify', 'err', 'Неизвестная секция для возврата!', 3000, 'top');
              return;
          }

          targetSlots[targetSlot] = { id: itemId, quantity: 1 };
          await updateSlotsArray(uid, targetSection, targetSlots);

          // ←←← ВАЖНО: если снимаем сумку — вызываем unequip
          if (clothesSlotIndex === 10 && itemData.clothesData?.maxWeight !== undefined) {
            await handleBagOperations(uid, 'unequip', itemId);
          }

          usageClothes(player, clothesSlotIndex, -1, 0, itemId);
          useClothes(player, itemId, false); // снял
          await sendInventoryToCef(player, uid);

          console.log(chalk.green(`[USE CLOTHES] Снята и возвращена в ${targetSection}-${targetSlot}`));
          return;
        }

        // Надеваем
        const updatedClothes = clothesSlots.map((slot: any, idx: number) =>
          idx === clothesSlotIndex ? { id: itemId, quantity: 1 } : slot
        );

        await updateSlot(uid, section, slotIdx, null);
        await updateSlotsArray(uid, 'clothes', updatedClothes);

        // ←←← ВАЖНО: если надеваем сумку — вызываем equip
        if (clothesSlotIndex === 10 && itemData.clothesData?.maxWeight !== undefined) {
          await handleBagOperations(uid, 'equip', itemId);
        }

        usageClothes(player, clothesSlotIndex, itemData.clothesData.drawable, itemData.clothesData.texture, itemId);
        useClothes(player, itemId, true); // одел
        await sendInventoryToCef(player, uid);

        console.log(chalk.green(`[USE CLOTHES] Перенесена одежда ${itemId} из ${section}-${slotIdx} в слот ${clothesSlotIndex}`));
        return;
      }

      itemData.usage(player)

      // Обработка расходуемого предмета
      if (itemData.consumable !== false) {
        if (slot.quantity > 1) {
          slot.quantity -= 1

          await updateSlot(uid, section, slotIdx, slot)

          rce.triggerClient(player, 'execute', `window.App.inventoryReducer.updateItemQuantity('${section}', ${slotIdx}, ${slot.quantity})`)
        } else {
          await clearInventorySlot(uid, section, slotIdx)
          rce.triggerClient(player, 'execute', `window.App.inventoryReducer.removeItem('${section}', ${slotIdx})`)
        }

        await updateTotalWeightInventory(uid)
        await sendInventoryToCef(player, uid)

        const inventoryAfter = await getPlayerInventory(uid);
        const fastSlots = JSON.parse(inventoryAfter.fastslots || '[]');

        let fastNeedsUpdate = false;
        const updatedFast = fastSlots.map((fItem: any) => {
          if (!fItem) return null;

          // Ищем, остался ли хоть один экземпляр этого предмета в инвентаре
          let remainingQuantity = 0;

          // main
          const main = JSON.parse(inventoryAfter.mainslots || '[]');
          remainingQuantity += main
            .filter((it: any) => it?.id === fItem.id)
            .reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);

          // donate
          const donat = JSON.parse(inventoryAfter.donatslots || '{}').slots || [];
          remainingQuantity += donat
            .filter((it: any) => it?.id === fItem.id)
            .reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);

          // clothes (редко, но на всякий случай)
          const clothes = JSON.parse(inventoryAfter.clothesslots || '[]');
          remainingQuantity += clothes
            .filter((it: any) => it?.id === fItem.id)
            .reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);

          // можно добавить bag, если используешь предметы из сумки через fast

          if (remainingQuantity === 0) {
            fastNeedsUpdate = true;
            return null; // полностью убираем
          }

          if (remainingQuantity !== fItem.quantity) {
            fastNeedsUpdate = true;
            return { ...fItem, quantity: remainingQuantity };
          }

          return fItem;
        });

        if (fastNeedsUpdate) {
          const updateFastSql = 'UPDATE inventory SET fastslots = ? WHERE uid = ?';
          data.query(updateFastSql, [JSON.stringify(updatedFast), uid], (err) => {
            if (err) console.error('[FAST CLEANUP] Ошибка обновления БД:', err);
          });

          // Самое важное — сразу синхронизируем клиенту
          await sendInventoryToCef(player, uid);
          console.log('[FAST CLEANUP] Быстрые слоты обновлены после использования');
        }
      }

    } catch (e) {
      console.error(chalk.bgRed('• USE ITEM [try 2] •') + chalk.red(` ${e}`));
      rce.triggerClient(player, 'sendNotify', 'err', 'Непредвиденная ошибка! Обратитесь к разработчикам', 3500, 'top');
    }

  } catch (e) {
    console.log(chalk.bgRed('• USE ITEM [try] •') + chalk.red(` ${e}`))
  }
})

rce.registerCef("dropItemOnGround", async (player: PlayerMp, itemId: number, slotId: number, section: string, value: number) => {
  try {
    const uid = connectedUsers.getField(player.id, 'uid')
    if (!uid) return

    const inventory = await getPlayerInventory(uid)
    if (!inventory) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Инвентарь не найден!', 3000, 'top')
    }

    let sourceSlots: any[] = []
    let sourceIsBag = false
    let sourceBagUid: number | null = null

    switch (section) {
      case 'main':
        sourceSlots = normalizeSlots(JSON.parse(inventory.mainslots || '[]'))
        break
      case 'donat':
        const donat = JSON.parse(inventory.donatslots || '{}')
        sourceSlots = normalizeSlots(donat.slots || [], 15)
        break
      case 'bag':
        const bagData = await getEquippedBag(uid)
        if (!bagData) {
          return rce.triggerClient(player, 'sendNotify', 'err', 'Сумка не надета!', 3000, 'top')
        }
        sourceSlots = normalizeSlots(bagData.items ? JSON.parse(bagData.items) : [])
        sourceIsBag = true
        const clothes = JSON.parse(inventory.clothesslots || '[]')
        sourceBagUid = clothes[10]?.id || null
        break
      default:
        return rce.triggerClient(player, 'sendNotify', 'err', 'Невозможно выкинуть!', 3000, 'top')
    }

    const sourceItem = sourceSlots[slotId]
    if (!sourceItem || sourceItem.id !== itemId) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Предмет не найден!', 3000, 'top')
    }

    const itemData = getItemById(itemId)
    if (!itemData) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Данные предмета не найдены!', 3000, 'top')
    }

    if (value <= 0 || value > sourceItem.quantity) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Неверное количество для выброса!', 3000, 'top')
    }

    const dropData = {
      id: sourceItem.id,
      quantity: value,
      name: sourceItem.name || itemData.name,
      description: sourceItem.description || itemData.description,
      keyData: sourceItem.keyData || null,
      hashObj: itemData.hashObj,
    }

    if (value === sourceItem.quantity) {
      sourceSlots[slotId] = null
    } else {
      sourceSlots[slotId] = { ...sourceItem, quantity: sourceItem.quantity - value }
    }

    sourceSlots = normalizeSlots(sourceSlots, section === 'donat' ? 15 : 20)

    if (sourceIsBag && sourceBagUid) {
      await handleBagOperations(uid, 'update', sourceBagUid, sourceSlots)
    } else {
      await updateSlotsArray(uid, section, sourceSlots)
    }

    await updateTotalWeightInventory(uid)
    await sendInventoryToCef(player, uid)

    dropItemOnGround(player, dropData)
  } catch (e) {
    console.log(chalk.red('[DROP ERROR]') + ` Err: ${e}`)
    rce.triggerClient(player, 'sendNotify', 'err', 'Не удалось выкинуть предмет', 3100, 'top')
  }
})

rce.registerClientCef('splitItem', async (player: PlayerMp, itemId: number, slotIdx: number, section: string, quantity: number) => {
  try {
    const uid = connectedUsers.getField(player.id, 'uid')
    if (!uid) return

    const inventory = await getPlayerInventory(uid)
    if (!inventory) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Инвентарь не найден!', 3000, 'top')
    }

    let sourceSlots: any[] = []
    let sourceIsBag = false
    let sourceBagUid: number | null = null

    switch (section) {
      case 'main':
        sourceSlots = normalizeSlots(JSON.parse(inventory.mainslots || '[]'))
        break
      case 'donat':
        const donat = JSON.parse(inventory.donatslots || '{}')
        sourceSlots = normalizeSlots(donat.slots || [], 15)
        break
      case 'bag':
        const bagData = await getEquippedBag(uid)
        if (!bagData) {
          return rce.triggerClient(player, 'sendNotify', 'err', 'Сумка не надета!', 3000, 'top')
        }
        sourceSlots = normalizeSlots(bagData.items ? JSON.parse(bagData.items) : [])
        sourceIsBag = true
        const clothes = JSON.parse(inventory.clothesslots || '[]')
        sourceBagUid = clothes[10]?.id || null
        break
      default:
        return rce.triggerClient(player, 'sendNotify', 'err', 'Разделение в этой секции невозможно', 3000, 'top')
    }

    const sourceItem = sourceSlots[slotIdx]
    if (!sourceItem || sourceItem.id !== itemId) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Предмет не найден в слоте', 3000, 'top')
    }

    const itemData = getItemById(itemId)
    if (!itemData?.stackable || sourceItem.quantity <= quantity || quantity < 1) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Нельзя разделить этот предмет', 3000, 'top')
    }

    const freeSlotInfo = await findFreeSlotsInInventory(uid)
    if (!freeSlotInfo.section) {
      return rce.triggerClient(player, 'sendNotify', 'err', 'Нет свободного слота в инвентаре!', 4000, 'top')
    }

    const remaining = sourceItem.quantity - quantity
    if (remaining > 0) {
      sourceSlots[slotIdx] = { ...sourceItem, quantity: remaining }
    } else {
      sourceSlots[slotIdx] = null
    }

    let targetSlots: any[] = []
    let targetIsBag = false
    let targetBagUid: number | null = null

    if (freeSlotInfo.section === section) {
      sourceSlots[freeSlotInfo.slot] = { id: itemId, quantity: quantity }
      sourceSlots = normalizeSlots(sourceSlots, section === 'donat' ? 15 : 20)

      if (sourceIsBag && sourceBagUid) {
        await handleBagOperations(uid, 'update', sourceBagUid, sourceSlots)
      } else {
        await updateSlotsArray(uid, section, sourceSlots)
      }
    } else {
      switch (freeSlotInfo.section) {
        case 'main':
          targetSlots = normalizeSlots(JSON.parse(inventory.mainslots || '[]'))
          break
        case 'donat':
          const donat = JSON.parse(inventory.donatslots || '{}')
          targetSlots = normalizeSlots(donat.slots || [], 15)
          break
        case 'bag':
          const bagData = await getEquippedBag(uid)
          if (!bagData) throw new Error('Сумка исчезла во время операции')
          targetSlots = normalizeSlots(bagData.items ? JSON.parse(bagData.items) : [])
          targetIsBag = true
          const clothesTarget = JSON.parse(inventory.clothesslots || '[]')
          targetBagUid = clothesTarget[10]?.id || null
          break
      }

      targetSlots[freeSlotInfo.slot] = { id: itemId, quantity: quantity }

      sourceSlots = normalizeSlots(sourceSlots, section === 'donat' ? 15 : 20)
      if (sourceIsBag && sourceBagUid) {
        await handleBagOperations(uid, 'update', sourceBagUid, sourceSlots)
      } else {
        await updateSlotsArray(uid, section, sourceSlots)
      }

      targetSlots = normalizeSlots(targetSlots, freeSlotInfo.section === 'donat' ? 15 : 20)
      if (targetIsBag && targetBagUid) {
        await handleBagOperations(uid, 'update', targetBagUid, targetSlots)
      } else {
        await updateSlotsArray(uid, freeSlotInfo.section, targetSlots)
      }
    }

    await updateTotalWeightInventory(uid)
    await sendInventoryToCef(player, uid)

  } catch (e) {
    console.log(chalk.red('[SPLIT ERROR]') + ` Err: ${e}`)
    rce.triggerClient(player, 'sendNotify', 'err', 'Не удалось разделить предмет', 4000, 'top')
  }
})

rce.registerClientCef('bagOperation', async (
  player: PlayerMp,
  operation: 'equip' | 'unequip' | 'update',
  bagItemId?: number,
  bagItems?: any
) => {
  const uid = await getDataAccount(player, 'uid', player.id)
  handleBagOperations(uid, operation, bagItemId, bagItems)
})

rce.registerCef('cef:buy-donat-slots', async (player: PlayerMp) => {
  try {
    const sid = connectedUsers.getField(player.id, 'sid')
    const uid = connectedUsers.getField(player.id, 'uid')
    const donatResult = await decrementDonatCoins(player, sid, 700)

    if (donatResult === 'noDonatCoins') return

    const inventory = await getPlayerInventory(uid)
    if (!inventory) {
      rce.triggerClient(player, 'sendNotify', 'err', 'Инвентарь не найден!', 3500, 'bottom')
      return
    }

    let donatSlotsObj: { have: boolean; slots: any[] } = JSON.parse(inventory.donatslots)

    if (donatSlotsObj.have === true) {
      rce.triggerClient(player, 'sendNotify', 'warning', 'Донат-слоты уже приобретены!', 3000, 'top')
      return
    }

    donatSlotsObj.have = true

    if (!donatSlotsObj.slots || !Array.isArray(donatSlotsObj.slots)) {
      donatSlotsObj.slots = Array(15).fill(null)
    }

    // ✅ Увеличиваем максимальный вес на 30 единиц
    const newMaxWeight = (inventory.maxweight || 20) + 30

    const updateSql = 'UPDATE inventory SET donatslots = ?, maxweight = ? WHERE uid = ?'
    await new Promise((resolve, reject) => {
      data.query(updateSql, [JSON.stringify(donatSlotsObj), newMaxWeight, uid], (err, results: any) => {
        if (err) {
          console.log(chalk.red('[BUY DONAT SLOTS]') + ` Ошибка обновления: ${err}`)
          reject(err)
        } else {
          resolve(results)
        }
      })
    })

    // Обновляем вес на клиенте
    await updateTotalWeightInventory(uid)
    await sendInventoryToCef(player, uid)

    rce.triggerClient(player, 'showInventory')
    rce.triggerClient(player, 'sendNotify', 'success', 'Донат - слоты успешно приобретены! Макс. вес увеличен!', 3500, 'top')
  } catch (e) {
    console.log(chalk.red('[BUY DONAT SLOTS]') + ` Критическая ошибка: ${e}`)
  }
})

rce.registerClient('existenceDonatSlots', async (player: PlayerMp) => {
  const uid = connectedUsers.getField(player.id, 'uid')

  const inventory = await getPlayerInventory(uid)
  if (!inventory) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Инвентарь не найден!', 3500, 'bottom')
    return
  }

  let donatSlotsObj: { have: boolean; slots: any[] } = JSON.parse(inventory.donatslots)

  if (donatSlotsObj.have === true) {
    return true
  } else {
    return false
  }
})

export const getPlayerInventory = async (uid: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM inventory WHERE uid = ? LIMIT 1'

    data.query(sql, [uid], (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• GET INVENTORY •') + chalk.red(` ${err}`))
        reject(err)
        return
      }

      resolve(results.length > 0 ? results[0] : null)
    })
  })
}

export const addItemToInventory = async (
  uid: number,
  itemId: number,
  quantity: number = 1
): Promise<{ success: boolean; reason?: string }> => {
  const inventory = await getPlayerInventory(uid)
  if (!inventory) return { success: false, reason: 'Инвентарь не найден' }

  const item = getItemById(itemId);
  if (!item) return { success: false, reason: 'Предмет не найден' }

  const addedWeight = item.weight * quantity
  if (inventory.weight + addedWeight > inventory.maxweight) {
    return { success: false, reason: 'Недостаточно места в инвентаре' }
  }

  const free = await findFreeSlotsInInventory(uid)
  if (!free.section) return { success: false, reason: 'Нет свободного слота' }

  const config = SECTION_CONFIG[free.section]
  if (!config) return { success: false, reason: 'Неизвестная секция' }

  let slots = await config.getSlots(inventory, uid)
  if (!slots) return { success: false, reason: 'Не удалось загрузить слоты' }

  let added = false
  for (let i = 0; i < slots.length; i++) {
    if (slots[i]?.id === itemId && item.stackable) {
      const max = item.maxStack || 999
      if (slots[i].quantity + quantity <= max) {
        slots[i].quantity += quantity
        added = true
        break
      }
    }
  }

  if (!added) {
    slots[free.slot] = { id: itemId, quantity }
  }

  const success = await config.saveSlots(uid, slots, free.section === 'bag' ? null : undefined)
  if (!success) return { success: false, reason: 'Ошибка сохранения' }

  await updateTotalWeightInventory(uid)
  return { success: true }
}

export const addCustomItemToInventory = async (
  uid: number,
  customItem: Partial<ServerItem> & { id: number; amount?: number }
): Promise<{ success: boolean; reason?: string }> => {

  try {
    const inventory = await getPlayerInventory(uid)
    const player = connectedUsers.getPlayerByUid(uid)
    if (!inventory) {
      return { success: false, reason: 'Инвентарь не найден' }
    }

    const baseItem = getItemById(customItem.id)
    if (!baseItem) {
      return { success: false, reason: 'Базовый предмет не найден' }
    }

    const finalItem: any = {
      ...baseItem,
      name: customItem.name || baseItem.name,
      description: customItem.description || baseItem.description,
      keyData: customItem.keyData || null,
      weight: baseItem.weight,
      maxStack: 1,
      stackable: false,
      consumable: false,
    };

    const quantity = customItem.amount || 1
    const addedWeight = finalItem.weight * quantity

    if ((inventory.weight || 0) + addedWeight > (inventory.maxweight || 20)) {
      return { success: false, reason: 'Недостаточно места в инвентаре' }
    }

    const freeSlotInfo = await findFreeSlotsInInventory(uid)
    if (!freeSlotInfo || !freeSlotInfo.section) {
      return { success: false, reason: 'Нет свободного слота в инвентаре' }
    }

    const config = SECTION_CONFIG[freeSlotInfo.section as InventorySection]
    if (!config) {
      return { success: false, reason: 'Неизвестная секция инвентаря' }
    }

    let slots = await config.getSlots(inventory, uid)
    if (!slots) {
      return { success: false, reason: 'Не удалось загрузить слоты' }
    }

    let added = false

    for (let i = 0; i < slots.length; i++) {
      if (slots[i]?.id === customItem.id && baseItem.stackable) {
        const max = baseItem.maxStack || 999
        if (slots[i].quantity + quantity <= max) {
          slots[i].quantity += quantity
          slots[i].name = finalItem.name
          slots[i].description = finalItem.description
          slots[i].keyData = finalItem.keyData
          added = true
          break
        }
      }
    }

    if (!added) {
      slots[freeSlotInfo.slot] = {
        id: customItem.id,
        quantity: quantity,
        name: finalItem.name,
        description: finalItem.description,
        keyData: finalItem.keyData,
      }
    }

    const success = await config.saveSlots(
      uid,
      slots,
      freeSlotInfo.section === 'bag' ? null : undefined
    )

    if (!success) {
      return { success: false, reason: 'Ошибка сохранения в базу данных' }
    }

    await updateTotalWeightInventory(uid)
    if (typeof player !== 'undefined' && mp.players.exists(player)) {
      await sendInventoryToCef(player, uid)
    } else {
      const player = connectedUsers.getPlayerByUid(uid)
      if (player && mp.players.exists(player)) {
        await sendInventoryToCef(player, uid)
      }
    }

    return { success: true }

  } catch (e) {
    console.error(chalk.red('[addCustomItemToInventory] Ошибка:'), e)
    return { success: false, reason: 'Произошла внутренняя ошибка' }
  }
}

export const updateSlot = async (
  uid: number,
  section: string,
  slotIdx: number,
  itemData: any,
  bagUid?: number
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (section === 'bag') {
      if (!bagUid) {
        const findBagSql = 'SELECT clothesslots FROM inventory WHERE uid = ?'
        data.query(findBagSql, [uid], (err, results: any) => {
          if (err) {
            console.log(chalk.bgRed('• UPDATE SLOT [find bag] •') + chalk.red(` ${err}`))
            reject(err)
            return
          }

          if (results.length === 0) {
            reject('Инвентарь не найден')
            return
          }

          const clothesSlots = JSON.parse(results[0].clothesslots)
          const equippedBag = clothesSlots[10]

          if (!equippedBag || equippedBag.imageId !== 109) {
            reject('Сумка не надета!')
            return
          }

          updateSlot(uid, section, slotIdx, itemData, equippedBag.id)
            .then(resolve)
            .catch(reject)
        })

        return
      }

      const bagSql = 'SELECT * FROM bags WHERE bag_uid = ? AND owner_uid = ? LIMIT 1'

      data.query(bagSql, [bagUid, uid], (err, results: any) => {
        if (err) {
          console.log(chalk.bgRed('• UPDATE SLOT [bag] •') + chalk.red(` ${err}`))
          reject(err)
          return
        }

        if (results.length === 0) {
          const insertSql = 'INSERT INTO bags (bag_uid, owner_uid, items, weight) VALUE (?, ?, ?, ?)'

          const initialItems = Array(20).fill(null)

          if (itemData) {
            initialItems[slotIdx] = { id: itemData.id, quantity: itemData.quantity }
          }

          data.query(insertSql, [bagUid, uid, JSON.stringify(initialItems), 0], (err) => {
            if (err) {
              console.log(chalk.bgRed('• UPDATE SLOT [bag insert] •') + chalk.red(` ${err}`))
              reject(err)
              return
            }

            resolve(true)
          })

          return
        }

        const bag = results[0]
        let items = bag.items ? JSON.parse(bag.items) : Array(20).fill(null)

        if (itemData) {
          items[slotIdx] = { id: itemData.id, quantity: itemData.quantity }
        } else {
          items[slotIdx] = null
        }

        // ✅ Обновляем вес сумки
        const weight = calcWeightSlots(items)
        const updateSql = 'UPDATE bags SET items = ?, weight = ? WHERE bag_uid = ? AND owner_uid = ?'

        data.query(updateSql, [JSON.stringify(items), weight, bagUid, uid], (err) => {
          if (err) {
            console.log(chalk.bgRed('• UPDATE SLOT [bag update] •') + chalk.red(` ${err}`))
            reject(err)
            return
          }

          resolve(true)
        })
      })
    } else {
      const sql = 'SELECT * FROM inventory WHERE uid = ? LIMIT 1'

      data.query(sql, [uid], (err, results: any) => {
        if (err) {
          console.log(chalk.bgRed('• UPDATE SLOT [inv select] •') + chalk.red(` ${err}`))
          reject(err)
          return
        }

        if (results.length === 0) {
          reject('Инвентарь не найден')
          return
        }

        const inventory = results[0]
        let slots
        let columnName
        let isDonate = false

        switch (section) {
          case 'main':
            slots = JSON.parse(inventory.mainslots)
            columnName = 'mainslots'
            break

          case 'donat':
            const donatData = JSON.parse(inventory.donatslots)
            slots = Array.isArray(donatData) ? donatData : (donatData.slots || [])
            columnName = 'donatslots'
            isDonate = true
            break

          case 'clothes':
            slots = JSON.parse(inventory.clothesslots)
            columnName = 'clothesslots'
            break

          default:
            reject('Неизвестная секция инвентаря')
            return
        }

        if (itemData) {
          slots[slotIdx] = { id: itemData.id, quantity: itemData.quantity }
        } else {
          slots[slotIdx] = null
        }

        let updatedValue

        if (isDonate) {
          const donatData = JSON.parse(inventory.donatslots)
          donatData.slots = slots
          updatedValue = JSON.stringify(donatData)
        } else {
          updatedValue = JSON.stringify(slots)
        }

        const updateSql = `UPDATE inventory SET ${columnName} = ? WHERE uid = ?`
        data.query(updateSql, [updatedValue, uid], (err) => {
          if (err) {
            console.log(chalk.bgRed('• UPDATE SLOT [inventory update] •') + chalk.red(` ${err}`))
            reject(err)
            return
          }
          resolve(true)
        })
      })
    }
  })
}

const calcSlotsWeight = (slots: any[]) => {  // Сделал синхронной, т.к. bagWeight вызывается только для bag item
  let weight = 0
  slots.forEach((slot: any) => {
    if (slot && slot.id && slot.quantity) {
      const itemData = getItemById(slot.id)
      if (itemData) {
        weight += itemData.weight * slot.quantity
      }
    }
  })
  return weight
}

export const updateTotalWeightInventory = async (uid: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM inventory WHERE uid = ? LIMIT 1'

    data.query(sql, [uid], async (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• UPDATE WEIGHT •') + chalk.red(` ${err}`))
        reject(err)
        return
      }

      if (results.length === 0) {
        reject('Инвентарь не найден')
        return
      }

      const inventory = results[0]
      let totalWeight = 0

      try {
        const calcSlotsWeight = async (slots: any[]) => {
          let weight = 0
          for (const slot of slots) {
            if (slot && slot.id && slot.quantity) {
              const itemData = getItemById(slot.id)
              if (itemData) {
                let itemWeight = itemData.weight * slot.quantity
                if (itemData.clothesData && itemData.clothesData.slot === 10) {
                  const bagContentWeight = await getBagWeight(uid, slot.id)
                  itemWeight += bagContentWeight
                }
                weight += itemWeight
              }
            }
          }
          return weight
        }

        const mainSlots = typeof inventory.mainslots === 'string' ? JSON.parse(inventory.mainslots) : inventory.mainslots
        totalWeight += await calcSlotsWeight(mainSlots)

        const donatSlotsObj = typeof inventory.donatslots === 'string' ? JSON.parse(inventory.donatslots) : inventory.donatslots
        totalWeight += await calcSlotsWeight(donatSlotsObj.slots)

        const clothesSlots = typeof inventory.clothesslots === 'string' ? JSON.parse(inventory.clothesslots) : inventory.clothesslots
        totalWeight += await calcSlotsWeight(clothesSlots)

        console.log(chalk.cyan(`[UPDATE WEIGHT] Общий вес: ${totalWeight.toFixed(2)}`))

        const updateSql = 'UPDATE inventory SET weight = ? WHERE uid = ?'
        data.query(updateSql, [parseFloat(totalWeight.toFixed(2)), uid], (updateErr) => {
          if (updateErr) {
            reject(updateErr)
          } else {
            resolve()
          }
        })

      } catch (e) {
        console.log(chalk.bgRed('• UPDATE WEIGHT [try] •') + chalk.red(` ${e}`))
        reject(e)
      }
    })
  })
}

// Вспомогательная функция для получения веса сумки
export const getBagWeight = async (uid: number, bagUid: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT weight FROM bags WHERE bag_uid = ? AND owner_uid = ? LIMIT 1'
    data.query(sql, [bagUid, uid], (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• GET BAG WEIGHT •') + chalk.red(` ${err}`))
        resolve(0)
        return
      }
      resolve(results.length > 0 ? (results[0].weight || 0) : 0)
    })
  })
}

export const canAddItemInventory = async (uid: number, itemId: number, quantity: number = 1): Promise<{ canAdd: boolean; reason?: string }> => {
  try {
    const inventory = await getPlayerInventory(uid)

    if (!inventory) {
      return { canAdd: false, reason: 'Инвентарь не найден' }
    }

    const itemData = getItemById(itemId)
    if (!itemData) {
      return { canAdd: false, reason: 'Предмет не найден' }
    }

    const additionalWeight = itemData.weight * quantity
    const currentWeight = inventory.weight || 0
    const maxWeight = inventory.maxweight || 20

    if ((currentWeight + additionalWeight) > maxWeight) {
      return {
        canAdd: false,
        reason: `Недостаточно места. Вес: ${currentWeight}/${maxWeight}, нужно: ${additionalWeight}`
      }
    }

    return { canAdd: true }
  } catch (e) {
    console.log(chalk.bgRed('• CHECK WEIGHT •') + chalk.red(` ${e}`))
  }
}

export const calcTotalWeight = (inventory: any): number => {
  let totalWeight = 0

  try {
    if (inventory.mainslots) {
      const mainSlots = typeof inventory.mainslots === 'string'
        ? JSON.parse(inventory.mainslots)
        : inventory.mainslots

      mainSlots.forEach((slot: any) => {
        if (slot && slot.id && slot.quantity) {
          const itemData = getItemById(slot.id)

          if (itemData) {
            totalWeight += itemData.weight * slot.quantity
          }
        }
      })
    }

    if (inventory.bagslots) {
      const bagSlots = typeof inventory.bagslots === 'string'
        ? JSON.parse(inventory.bagslots)
        : inventory.bagslots

      bagSlots.slots.forEach((slot: any) => {
        if (slot && slot.id && slot.quantity) {
          const itemData = getItemById(slot.id)

          if (itemData) {
            totalWeight += itemData.weight * slot.quantity
          }
        }
      })
    }

    if (inventory.donatslots) {
      const donatSlots = typeof inventory.donatslots === 'string'
        ? JSON.parse(inventory.donatslots)
        : inventory.donatslots

      donatSlots.slots.forEach((slot: any) => {
        if (slot && slot.id && slot.quantity) {
          const itemData = getItemById(slot.id)

          if (itemData) {
            totalWeight += itemData.weight * slot.quantity
          }
        }
      })
    }

    if (inventory.clothesslots) {
      const clothesSlots = typeof inventory.clothesslots === 'string'
        ? JSON.parse(inventory.clothesslots)
        : inventory.clothesslots

      clothesSlots.forEach((slot: any) => {
        if (slot && slot.id && slot.quantity) {
          const itemData = getItemById(slot.id)

          if (itemData) {
            totalWeight += itemData.weight * slot.quantity
          }
        }
      })
    }

    return Math.max(0, parseFloat(totalWeight.toFixed(2)))
  } catch (e) {
    console.log(chalk.bgRed('• CALC TOTAL WEIGHT INV •') + chalk.red(` ${e}`))
  }
}

export const calcWeightSlots = (slots: any[]): number => {
  let totalWeight = 0

  slots.forEach((slot: any) => {
    if (slot && slot.id && slot.quantity) {
      const itemData = getItemById(slot.id)

      if (itemData) {
        totalWeight += itemData.weight * slot.quantity
      }
    }
  })

  return Math.max(0, parseFloat(totalWeight.toFixed(2)))
}

export const convertSlots = (slots: any[]): any[] => {
  if (!slots || !Array.isArray(slots)) {
    return []
  }

  return slots.map((slot: any) => {
    if (!slot) return null

    const baseItem = getItemById(slot.id)
    if (!baseItem) return null

    const imageId = getItemImageIdForCef(baseItem)

    return {
      id: slot.id,
      name: slot.name || baseItem.name,
      description: slot.description || baseItem.description,
      imageId: imageId,
      quantity: slot.quantity || 1,
      maxStack: baseItem.maxStack,
      type: baseItem.type,
      weight: baseItem.weight,
      stackable: baseItem.stackable,
      consumable: baseItem.consumable,
      price: baseItem.price,

      clothesData: baseItem.clothesData,
      weaponData: baseItem.weaponData,
      foodData: baseItem.foodData,
      miscData: baseItem.miscData,

      keyData: slot.keyData || null,
      isFast: true,
    }
  })
}

export const checkMaxWeight = (inventory: any, additionalWeight: number = 0): boolean => {
  const currentWeight = inventory.weight || 0
  const maxWeight = inventory.maxweight || 0

  return (currentWeight + additionalWeight) <= maxWeight
}

const clearInventorySlot = async (uid: number, section: string, slotIdx: number): Promise<boolean> => {
  return await updateSlot(uid, section, slotIdx, null)
}

export const sendInventoryToCef = async (player: PlayerMp, uid: number) => {
  try {
    const inventory = await getPlayerInventory(uid)

    if (!inventory) {
      console.log(chalk.bgRed('• SEND INV •') + chalk.red(` Инвентарь не найден для UID: ${uid}`))
      return
    }

    // Безопасное получение и парсинг данных
    const mainSlotsData = inventory.mainslots
      ? JSON.parse(inventory.mainslots)
      : Array(20).fill(null)

    const donatSlotsData = inventory.donatslots
      ? JSON.parse(inventory.donatslots)
      : { have: false, slots: Array(15).fill(null) }

    const clothesSlotsData = inventory.clothesslots
      ? JSON.parse(inventory.clothesslots)
      : Array(13).fill(null)

    const fastSlotsData = inventory.fastslots
      ? JSON.parse(inventory.fastslots)
      : Array(4).fill(null)

    // Получаем слоты для доната (обрабатываем и старый формат массива)
    let donatSlotsArray: any[] = []
    if (Array.isArray(donatSlotsData)) {
      // Старый формат: просто массив
      donatSlotsArray = donatSlotsData
    } else if (donatSlotsData.slots && Array.isArray(donatSlotsData.slots)) {
      // Новый формат: объект с полем slots
      donatSlotsArray = donatSlotsData.slots
    } else {
      // На всякий случай
      donatSlotsArray = Array(15).fill(null)
    }

    const mainSlotsForCef = convertSlots(mainSlotsData)
    const donatSlotsForCef = convertSlots(donatSlotsArray)
    const clothesSlotsForCef = convertSlots(clothesSlotsData)
    const fastSlotsForCef = convertSlots(fastSlotsData)

    let tradeSlotsForCef = Array(5).fill(null)
    let returnTradeSlotsForCef = Array(5).fill(null)
    let bagSlotsForCef: any[] = Array(20).fill(null)

    let haveBag: IHaveBag = { have: false }
    let currentBagWeight = 0

    const currentWeight = parseFloat(inventory.weight?.toFixed(2) || '0')
    const maxWeight = inventory.maxweight || 20

    const inventoryWeight: IInventoryWeight = {
      current: currentWeight,
      max: maxWeight
    }

    const tradeInfo = getTradeForPlayer(player)
    if (tradeInfo) {
      const { trade } = tradeInfo
      const myOffers = getMyOffers(trade, player)
      const partnerOffers = getPartnerOffers(trade, player)

      tradeSlotsForCef = convertSlots(normalizeSlots(myOffers, 5))
      returnTradeSlotsForCef = convertSlots(normalizeSlots(partnerOffers, 5))
    }

    // Проверяем, надета ли сумка
    const bagItem = clothesSlotsData[10]
    if (bagItem && bagItem.id) {
      try {
        // Получаем данные сумки
        let bagData = await new Promise<any>((resolve, reject) => {
          const getBagSql = 'SELECT items, weight FROM bags WHERE bag_uid = ? AND owner_uid = ?';
          data.query(getBagSql, [bagItem.id, uid], (err, results: any) => {
            if (err) reject(err);
            else resolve(results.length > 0 ? results[0] : null);
          });
        });

        // Если записи нет - создаем
        if (!bagData) {
          console.log(chalk.yellow(`[SEND INV] Запись для сумки ${bagItem.id} не найдена, создаем...`));
          const createBagResult = await handleBagOperations(uid, 'equip', bagItem.id);

          if (createBagResult.success) {
            // Повторно запрашиваем
            bagData = await new Promise<any>((resolve, reject) => {
              const getBagSql = 'SELECT items, weight FROM bags WHERE bag_uid = ? AND owner_uid = ?';
              data.query(getBagSql, [bagItem.id, uid], (err, results: any) => {
                if (err) reject(err);
                else resolve(results.length > 0 ? results[0] : null);
              });
            });
          }
        }

        if (bagData) {
          haveBag = {
            have: true,
            weight: bagData.weight || 0
          }
          currentBagWeight = bagData.weight

          const bagItems = bagData.items ? JSON.parse(bagData.items) : Array(20).fill(null)
          bagSlotsForCef = convertSlots(bagItems)

          console.log(chalk.cyan(`[SEND INV] Bag data for bag_uid=${bagItem.id}:`))
          console.log(chalk.cyan(`[SEND INV] bagItems: ${JSON.stringify(bagItems)}`))

          // Обновляем данные сумки в clothesSlotsForCef
          const bagItemIndex = clothesSlotsForCef.findIndex((item: any) => item && item.id === bagItem.id)
          if (bagItemIndex !== -1 && clothesSlotsForCef[bagItemIndex]) {
            clothesSlotsForCef[bagItemIndex].bagId = bagItem.id
            clothesSlotsForCef[bagItemIndex].bagWeight = currentBagWeight
          }
        }
      } catch (error) {
        console.log(chalk.bgRed('• SEND INV BAG ERROR •') + chalk.red(` ${error}`))
      }
    }

    // Отправляем данные на клиент
    rce.triggerClient(player, 'execute', `
      window.App.inventoryReducer.setInventory(
        ${JSON.stringify(mainSlotsForCef)},
        ${JSON.stringify(bagSlotsForCef)},
        ${JSON.stringify(donatSlotsForCef)},
        ${JSON.stringify(tradeSlotsForCef)},
        ${JSON.stringify(returnTradeSlotsForCef)},
        ${JSON.stringify(clothesSlotsForCef)},
        ${JSON.stringify(fastSlotsForCef)},
        ${JSON.stringify(haveBag)},
        ${JSON.stringify(inventoryWeight)}
      )
    `)

  } catch (e) {
    console.log(chalk.bgRed('• SEND INV CEF [try] •') + chalk.red(` ${e}`))
    console.log(chalk.red('Stack trace:'), e.stack)
  }
}

const calculateBaseMaxWeight = (inventory: any): number => {
  let baseWeight = 20

  const donatSlotsObj = JSON.parse(inventory.donatslots)
  if (donatSlotsObj.have) {
    baseWeight += 30
  }

  return baseWeight
}

export const handleBagOperations = async (
  uid: number,
  action: 'equip' | 'unequip' | 'update',
  bagItemId?: number,
  bagItems?: any[]
): Promise<{success: boolean, bagId?: number}> => {
  return new Promise(async (resolve, reject) => {
    switch (action) {
      case 'equip': {
        if (!bagItemId) {
          resolve({ success: false })
          return
        }

        const itemData = getItemById(bagItemId)
        if (!itemData) {
          console.log(chalk.red(`[BAG] Предмет не найден: ${bagItemId}`))
          resolve({ success: false })
          return
        }

        // Проверяем, что это сумка
        if (!itemData.clothesData || itemData.clothesData.slot !== 10) {
          console.log(chalk.red(`[BAG] Предмет не является сумкой: ${bagItemId}`));
          resolve({ success: false });
          return;
        }

        const bagMaxWeight = itemData.clothesData?.maxWeight || 0;
        console.log(chalk.cyan(`[BAG] Надеваем сумку ${bagItemId} с maxWeight=${bagMaxWeight}`));

        // Получаем текущий инвентарь для расчета правильного веса
        const getCurrentInventory = () => {
          return new Promise<any>((resolve, reject) => {
            const sql = 'SELECT maxweight, donatslots FROM inventory WHERE uid = ?';
            data.query(sql, [uid], (err, results: any) => {
              if (err) reject(err);
              else resolve(results[0]);
            });
          });
        };

        try {
          const currentInventory = await getCurrentInventory();
          const baseWeight = calculateBaseMaxWeight(currentInventory);
          const newMaxWeight = baseWeight + bagMaxWeight;

          console.log(chalk.cyan(`[BAG] Расчет веса: base=${baseWeight}, bag=${bagMaxWeight}, total=${newMaxWeight}`));

          // Обновляем максимальный вес в инвентаре
          const updateMaxWeightSql = 'UPDATE inventory SET maxweight = ? WHERE uid = ?';
          data.query(updateMaxWeightSql, [newMaxWeight, uid], (updateErr) => {
            if (updateErr) {
              console.log(chalk.bgRed('• [INV] Bag operation equip •') + chalk.red(` ${updateErr}`));
              resolve({ success: false });
              return;
            }

            // Продолжаем с созданием записи в bags
            const checkSql = 'SELECT id FROM bags WHERE bag_uid = ? AND owner_uid = ?';
            data.query(checkSql, [bagItemId, uid], (err, results: any) => {
              if (err) {
                console.log(chalk.bgRed('• [INV] Bag operation equip •') + chalk.red(` ${err}`));
                reject(err);
                return;
              }

              if (results.length > 0) {
                console.log(chalk.green(`[BAG] Запись уже существует для сумки ${bagItemId}`));
                resolve({ success: true, bagId: results[0].id });
              } else {
                const insertSql = `INSERT INTO bags (bag_uid, owner_uid, items, weight) VALUES (?, ?, ?, ?)`;

                data.query(insertSql, [bagItemId, uid, JSON.stringify(Array(20).fill(null)), 0], (err, results: any) => {
                  if (err) {
                    console.log(chalk.bgRed('• [INV] Bag operation equip (2) •') + chalk.red(` ${err}`));
                    reject(err);
                    return;
                  }

                  console.log(chalk.green(`[BAG] Создана запись для сумки bag_uid=${bagItemId}`));
                  resolve({ success: true, bagId: results.insertId });
                });
              }
            });
          });
        } catch (error) {
          console.log(chalk.bgRed('• [INV] Bag operation equip error •') + chalk.red(` ${error}`));
          resolve({ success: false });
        }
        break;
      }

      case 'unequip': {
        if (!bagItemId) {
          resolve({ success: false });
          return;
        }

        const itemData = getItemById(bagItemId);
        if (!itemData) {
          console.log(chalk.red(`[BAG] Предмет не найден для снятия: ${bagItemId}`));
          resolve({ success: false });
          return;
        }

        console.log(chalk.cyan(`[BAG] Снимаем сумку ${bagItemId}`));

        // Получаем текущий инвентарь для расчета базового веса
        const getCurrentInventory = () => {
          return new Promise<any>((resolve, reject) => {
            const sql = 'SELECT maxweight, donatslots FROM inventory WHERE uid = ?';
            data.query(sql, [uid], (err, results: any) => {
              if (err) reject(err);
              else resolve(results[0]);
            });
          });
        };

        try {
          const currentInventory = await getCurrentInventory();
          const baseWeight = calculateBaseMaxWeight(currentInventory);

          console.log(chalk.cyan(`[BAG] Устанавливаем базовый вес: ${baseWeight}`));

          // Устанавливаем базовый вес в инвентаре
          const updateMaxWeightSql = 'UPDATE inventory SET maxweight = ? WHERE uid = ?';
          data.query(updateMaxWeightSql, [baseWeight, uid], (updateErr) => {
            if (updateErr) {
              console.log(chalk.bgRed('• [INV] Bag operation unequip •') + chalk.red(` ${updateErr}`));
              reject(updateErr);
            } else {
              resolve({ success: true });
            }
          });
        } catch (error) {
          console.log(chalk.bgRed('• [INV] Bag operation unequip error •') + chalk.red(` ${error}`));
          resolve({ success: false });
        }
        break;
      }

      case 'update': {
        if (!bagItemId || !bagItems) {
          console.log(chalk.red('[BAG] Отсутствуют bagItemId или bagItems для обновления'))
          resolve({ success: false })
          return
        }

        console.log(chalk.cyan(`[BAG] Обновляем сумку ${bagItemId}`))

        const updateSql = 'UPDATE bags SET items = ?, weight = ? WHERE bag_uid = ? AND owner_uid = ?'

        const normalizedBagItems = bagItems.length >= 20 ? bagItems : [...bagItems, ...Array(20 - bagItems.length).fill(null)]
        const weight = calcWeightSlots(normalizedBagItems)

        console.log(chalk.cyan(`[BAG] Вес обновляемой сумки: ${weight}`))

        data.query(updateSql, [JSON.stringify(normalizedBagItems), weight, bagItemId, uid], (err, results: any) => {
          if (err) {
            console.log(chalk.bgRed('• [INV] Bag operation update •') + chalk.red(` ${err}`))
            reject(err)
            return
          }

          // Если запись не найдена, создаем новую
          if (results.affectedRows === 0) {
            console.log(chalk.yellow('• [INV] Bag operation update • Запись не найдена, создаем новую'))

            const insertSql = 'INSERT INTO bags (bag_uid, owner_uid, items, weight) VALUES (?, ?, ?, ?)'
            data.query(insertSql, [bagItemId, uid, JSON.stringify(normalizedBagItems), weight], (err, insertResults) => {
              if (err) {
                console.log(chalk.bgRed('• [INV] Bag operation update (insert) •') + chalk.red(` ${err}`))
                reject(err)
                return
              }

              resolve({ success: true })
            })
          } else {
            resolve({ success: true })
          }
        })

        break
      }
    }
  })
}

export const getEquippedBag = async (uid: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT clothesslots FROM inventory WHERE uid = ?'
    data.query(sql, [uid], (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• [INV] GET EQUIPPED BAG •') + chalk.red(` ${err}`))
        reject(err)
        return
      }

      if (results.length === 0) {
        console.log(chalk.yellow(`[GET EQUIPPED BAG] Инвентарь не найден для uid: ${uid}`))
        resolve(null)
        return
      }

      const clothesSlots = JSON.parse(results[0].clothesslots)
      const bagItem = clothesSlots[10]

      console.log(chalk.cyan(`[GET EQUIPPED BAG] bagItem в слоте 10: ${JSON.stringify(bagItem)}`))

      if (!bagItem) {
        console.log(chalk.yellow(`[GET EQUIPPED BAG] В слоте 10 нет предмета`))
        resolve(null)
        return
      }

      const bagSql = 'SELECT * FROM bags WHERE bag_uid = ? AND owner_uid = ?'
      data.query(bagSql, [bagItem.id, uid], (err, bagResults: any) => {
        if (err) {
          console.log(chalk.bgRed('• [INV] GET EQUIPPED BAG (2) •') + chalk.red(` ${err}`))
          reject(err)
          return
        }

        console.log(chalk.cyan(`[GET EQUIPPED BAG] Найдено записей в bags: ${bagResults.length}`))
        resolve(bagResults.length > 0 ? bagResults[0] : null)
      })
    })
  })
}

export const updateSlotsInDB = async (
  uid: number,
  section: string,
  slotIndex: number,
  itemData: any
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM inventory WHERE uid = ?'

    data.query(sql, [uid], (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• [INV] UPDATE SLOTS DB •') + chalk.red(` ${err}`))
        reject(err)
        return
      }

      if (results.length === 0) {
        reject('Инвентарь не найден')
        return
      }

      const inventory = results[0]
      let updatedValue: string
      let columnName: string

      switch (section) {
        case 'main':
          const mainSlots = JSON.parse(inventory.mainslots)
          mainSlots[slotIndex] = itemData
          updatedValue = JSON.stringify(mainSlots)
          columnName = 'mainslots'
          break

        case 'donat':
          const donatData = JSON.parse(inventory.donatslots)
          donatData.slots[slotIndex] = itemData
          updatedValue = JSON.stringify(donatData)
          columnName = 'donatslots'
          break

        case 'clothes':
          const clothesSlots = JSON.parse(inventory.clothesslots)
          clothesSlots[slotIndex] = itemData
          updatedValue = JSON.stringify(clothesSlots)
          columnName = 'clothesslots'
          break

        default:
          reject('Неизвестная секция')
          return
      }

      const updateSql = `UPDATE inventory SET ${columnName} = ? WHERE uid = ?`
      data.query(updateSql, [updatedValue, uid], (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}

export const removeKeyFromVeh = async (uid: number, keyUniqueId?: number, plate?: string): Promise<boolean> => {
  try {
    const player = connectedUsers.getPlayerByUid(uid)
    const inventory = await getPlayerInventory(uid)
    if (!inventory) return false

    const sections: InventorySection[] = ['main', 'donat', 'bag']

    for (const section of sections) {
      let slots: any[] = []

      if (section === 'bag') {
        const bagData = await getEquippedBag(uid)
        if (bagData && bagData.items) {
          slots = normalizeSlots(JSON.parse(bagData.items))
        } else {
          continue
        }
      } else {
        const config = SECTION_CONFIG[section]
        slots = await config.getSlots(inventory, uid) || []
      }

      let changed = false

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]
        if (!slot?.keyData) continue

        const matchById = keyUniqueId && slot.keyData.uniqueId === keyUniqueId
        const matchByPlate = plate && slot.keyData.plate === plate

        if (matchById || matchByPlate) {
          slots[i] = null
          changed = true
          console.log(chalk.green(`[REMOVE KEY] Ключ удалён из ${section} (слот ${i}) | uniqueId=${slot.keyData.uniqueId} | plate=${slot.keyData.plate}`))
          break
        }
      }

      if (changed) {
        if (section === 'bag') {
          const clothesSlots = JSON.parse(inventory.clothesslots || '[]')
          const bagUid = clothesSlots[10]?.id
          if (bagUid) await handleBagOperations(uid, 'update', bagUid, slots)
        } else {
          await updateSlotsArray(uid, section, slots)
        }

        await updateTotalWeightInventory(uid)

        if (player && mp.players.exists(player)) {
          await sendInventoryToCef(player, uid)
        }

        return true
      }
    }

    console.log(chalk.yellow(`[REMOVE KEY] Ключ НЕ НАЙДЕН (uniqueId=${keyUniqueId}, plate=${plate})`))
    return false

  } catch (e) {
    console.error(chalk.red('[REMOVE KEY FROM VEH] Ошибка:'), e)
    return false
  }
}

export const playerHasKeyForVehicle = async (player: PlayerMp, vehicle: VehicleMp) => {
  if (!player || !vehicle || !mp.vehicles.exists(vehicle)) return false

  const uid = connectedUsers.getField(player.id, 'uid')
  if (!uid) return false

  const rentalKeyId = vehicle.getVariable('rentalKeyId') as number | undefined
  const plate = vehicle.numberPlate

  const inventory = await getPlayerInventory(uid)
  if (!inventory) return false

  const sections: InventorySection[] = ['main', 'donat', 'bag']

  for (const section of sections) {
    let slots: any[] = []

    if (section === 'bag') {
      const bagData = await getEquippedBag(uid)

      if (bagData && bagData.items) {
        slots = normalizeSlots(JSON.parse(bagData.items))
      } else {
        continue
      }
    } else {
      const config = SECTION_CONFIG[section]
      slots = await config.getSlots(inventory, uid) || []
    }

    for (const slot of slots) {
      if (!slot || !slot.keyData) continue

      const matchById = rentalKeyId !== undefined && slot.keyData.uniqueId === rentalKeyId
      const matchByPlate = plate && slot.keyData.plate === plate

      if (matchById || matchByPlate) return true
    }
  }

  return false
}

rce.registerClient('playerHasKeyForVehicle', async (player: PlayerMp, vehicleId: number) => {
  if (!mp.vehicles.exists(vehicleId)) return false

  const vehicle = mp.vehicles.at(vehicleId)
  const result = await playerHasKeyForVehicle(player, vehicle)
  return result
})