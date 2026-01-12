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

interface IHaveBag {
  have: boolean,
  weight?: number
}

export interface IInventoryWeight {
  current: number,
  max: number
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
        tryFind(donat.slots || [], 'donate');
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
      console.log(chalk.cyan(`[USE ITEM BAG] Пытаемся использовать предмет из сумки: itemId=${itemId}, slotIdx=${slotIdx}`))

      const clothesSlots = JSON.parse(inventory.clothesslots)
      const bagItem = clothesSlots[9]

      if (!bagItem || !bagItem.id) {
        rce.triggerClient(player, 'sendNotify', 'err', 'Сумка не надета!', 3000, 'top')
        return
      }

      const bagItemData = getItemById(bagItem.id)
      if (!bagItemData ||
        !bagItemData.clothesData ||
        bagItemData.clothesData.slot !== 9 ||
        bagItemData.clothesData.maxWeight === undefined) {
        console.log(chalk.red(`[USE ITEM BAG] Предмет в слоте 9 не является сумкой: id=${bagItem.id}`))
        rce.triggerClient(player, 'sendNotify', 'err', 'Сумка не надета!', 3000, 'top')
        return
      }

      // Получаем содержимое сумки
      const bagData = await getEquippedBag(uid)
      console.log(chalk.cyan(`[USE ITEM BAG] bagData: ${JSON.stringify(bagData)}`))

      if (!bagData) {
        rce.triggerClient(player, 'sendNotify', 'err', 'Содержимое сумки не найдено!', 3000, 'top')
        return
      }

      const slots = bagData.items ? JSON.parse(bagData.items) : Array(20).fill(null)
      const slot = slots[slotIdx]

      if (!slot || slot.id !== itemId) {
        console.log(chalk.red(`[USE ITEM BAG] Предмет не найден в сумке: slot=${JSON.stringify(slot)}, ожидаемый itemId=${itemId}`))
        rce.triggerClient(player, 'sendNotify', 'err', 'Предмет не найден в сумке!', 3000, 'top')
        return
      }

      console.log(chalk.cyan(`[USE ITEM BAG] Найден предмет: ${JSON.stringify(slot)}`))

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
    } else if (section === 'donate') {
      const donateData = JSON.parse(inventory.donatslots)
      slots = donateData.slots
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
          // Одежда уже надета → снимаем и возвращаем в исходный слот
          const freeSlotInfo = await findFreeSlotsInInventory(uid);

          if (!freeSlotInfo.section) {
            rce.triggerClient(player, 'sendNotify', 'err', 'Нет свободного слота!', 3000, 'top');
            return;
          }

          // 1. Удаляем из одежды
          const updatedClothes = clothesSlots.map((slot: any, idx: number) =>
            idx === clothesSlotIndex ? null : slot
          );
          await updateSlotsArray(uid, 'clothes', updatedClothes);

          // 2. Добавляем обратно в свободный слот (main/donate/bag)
          const targetSection = freeSlotInfo.section;
          const targetSlot = freeSlotInfo.slot;

          let targetSlots: any[] = [];
          switch (targetSection) {
            case 'main':
              targetSlots = normalizeSlots(JSON.parse(inventory.mainslots || '[]'));
              break;
            case 'donate':
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
          usageClothes(player, clothesSlotIndex, 0, 0)

          useClothes(player, itemId, false); // снял
          await sendInventoryToCef(player, uid);

          console.log(chalk.green(`[USE CLOTHES] Снята и возвращена в ${targetSection}-${targetSlot}`));
          return;
        }

        const updatedClothes = clothesSlots.map((slot: any, idx: number) =>
          idx === clothesSlotIndex ? { id: itemId, quantity: 1 } : slot
        );

        await updateSlot(uid, section, slotIdx, null);
        await updateSlotsArray(uid, 'clothes', updatedClothes)
        usageClothes(player, clothesSlotIndex, itemData.clothesData.drawable, itemData.clothesData.texture)

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
          const equippedBag = clothesSlots[9]

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

          case 'donate':
            const donatData = JSON.parse(inventory.donatslots)
            slots = donatData.slots
            columnName = 'donateslots'
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
                if (itemData.clothesData && itemData.clothesData.slot === 9) {
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
  let totalWeight =  0

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
  return slots.map((slot: any) => {
    if (!slot) return null

    const itemData = getItemById(slot.id)
    if (!itemData) return null

    const imageId = getItemImageIdForCef(itemData)

    return {
      id: slot.id,
      name: itemData.name,
      description: itemData.description,
      imageId: imageId,
      quantity: slot.quantity || 1,
      maxStack: itemData.maxStack,
      type: itemData.type,
      weight: itemData.weight,
      stackable: itemData.stackable,
      consumable: itemData.consumable,
      price: itemData.price,

      clothesData: itemData.clothesData,
      weaponData: itemData.weaponData,
      foodData: itemData.foodData,
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

    const mainSlotsData = JSON.parse(inventory.mainslots)
    const donatSlotsData = JSON.parse(inventory.donatslots)
    const clothesSlotsData = JSON.parse(inventory.clothesslots)
    const fastSlotsData = JSON.parse(inventory.fastslots)

    const mainSlotsForCef = convertSlots(mainSlotsData)
    const donateSlotsForCef = convertSlots(donatSlotsData.slots)
    const clothesSlotsForCef = convertSlots(clothesSlotsData)
    const fastSlotsForCef = convertSlots(fastSlotsData)

    let bagSlotsForCef: any[] = Array(20).fill(null)
    let haveBag: IHaveBag = { have: false }
    let currentBagWeight = 0

    const currentWeight = parseFloat(inventory.weight?.toFixed(2) || '0')
    const maxWeight = inventory.maxweight || 20

    const inventoryWeight: IInventoryWeight = {
      current: currentWeight,
      max: maxWeight
    }

    if (clothesSlotsData[9] && clothesSlotsData[9].id) {
      const bagItem = clothesSlotsData[9]

      try {
        // Получаем данные сумки через Promise
        const bagData = await new Promise<any>((resolve, reject) => {
          const getBagSql = 'SELECT items, weight FROM bags WHERE bag_uid = ? AND owner_uid = ?'
          data.query(getBagSql, [bagItem.id, uid], (err, results: any) => {
            if (err) {
              console.log(chalk.bgRed('• [INV] Bag operation equip •') + chalk.red(` ${err}`))
              reject(err)
              return
            }
            resolve(results.length > 0 ? results[0] : null)
          })
        })

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
          console.log(chalk.cyan(`[SEND INV] bagSlotsForCef: ${JSON.stringify(bagSlotsForCef)}`))

          const bagItemIndex = clothesSlotsForCef.findIndex((item: any) => item && item.id === bagItem.id)
          if (bagItemIndex !== -1 && clothesSlotsForCef[bagItemIndex]) {
            clothesSlotsForCef[bagItemIndex].bagId = bagItem.id
            clothesSlotsForCef[bagItemIndex].bagWeight = currentBagWeight
          }
        }
      } catch (error) {
        console.log(chalk.bgRed('• SEND INV BAG ERROR •') + chalk.red(` ${error}`))
      }

      rce.triggerClient(player, 'execute', `
        window.App.inventoryReducer.setInventory(
          ${JSON.stringify(mainSlotsForCef)},
          ${JSON.stringify(bagSlotsForCef)},
          ${JSON.stringify(donateSlotsForCef)},
          [],
          [],
          ${JSON.stringify(clothesSlotsForCef)},
          ${JSON.stringify(fastSlotsForCef)},
          ${JSON.stringify(haveBag)},
          ${JSON.stringify(inventoryWeight)}
        )
      `)
    } else {
      rce.triggerClient(player, 'execute', `
        window.App.inventoryReducer.setInventory(
          ${JSON.stringify(mainSlotsForCef)},
          ${JSON.stringify(bagSlotsForCef)},
          ${JSON.stringify(donateSlotsForCef)},
          [],
          [],
          ${JSON.stringify(clothesSlotsForCef)},
          ${JSON.stringify(fastSlotsForCef)},
          ${JSON.stringify({ have: false })},
          ${JSON.stringify(inventoryWeight)}
        )
      `)
    }
  } catch (e) {
    console.log(chalk.bgRed('• SEND INV CEF [try] •') + chalk.red(` ${e}`))
  }
}

export const handleBagOperations = async (
  uid: number,
  action: 'equip' | 'unequip' | 'update',
  bagItemId?: number,
  bagItems?: any[]
): Promise<{success: boolean, bagId?: number}> => {
  return new Promise((resolve, reject) => {
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
        if (!itemData.clothesData || itemData.clothesData.slot !== 9) {
          console.log(chalk.red(`[BAG] Предмет не является сумкой: ${bagItemId}`))
          resolve({ success: false })
          return
        }

        const bagMaxWeight = itemData.clothesData?.maxWeight || 0

        console.log(chalk.cyan(`[BAG] Надеваем сумку ${bagItemId} с maxWeight=${bagMaxWeight}`))

        // Обновляем максимальный вес в инвентаре
        const updateMaxWeightSql = 'UPDATE inventory SET maxweight = maxweight + ? WHERE uid = ?'
        data.query(updateMaxWeightSql, [bagMaxWeight, uid], (updateErr) => {
          if (updateErr) {
            console.log(chalk.bgRed('• [INV] Bag operation equip (update maxweight) •') + chalk.red(` ${updateErr}`))
            reject(updateErr)
            return
          }

          // Продолжаем с созданием записи в bags
          const checkSql = 'SELECT id FROM bags WHERE bag_uid = ? AND owner_uid = ?'
          data.query(checkSql, [bagItemId, uid], (err, results: any) => {
            if (err) {
              console.log(chalk.bgRed('• [INV] Bag operation equip •') + chalk.red(` ${err}`))
              reject(err)
              return
            }

            if (results.length > 0) {
              console.log(chalk.green(`[BAG] Запись уже существует для сумки ${bagItemId}`))
              resolve({ success: true, bagId: results[0].id })
            } else {
              const insertSql = `INSERT INTO bags (bag_uid, owner_uid, items, weight) VALUES (?, ?, ?, ?)`

              data.query(insertSql, [bagItemId, uid, JSON.stringify(Array(20).fill(null)), 0], (err, results: any) => {
                if (err) {
                  console.log(chalk.bgRed('• [INV] Bag operation equip (2) •') + chalk.red(` ${err}`))
                  reject(err)
                  return
                }

                console.log(chalk.green(`[BAG] Создана запись для сумки bag_uid=${bagItemId}`))
                resolve({ success: true, bagId: results.insertId })
              })
            }
          })
        })

        break
      }

      case 'unequip': {
        if (!bagItemId) {
          resolve({ success: false })
          return
        }

        const itemData = getItemById(bagItemId)
        if (!itemData) {
          console.log(chalk.red(`[BAG] Предмет не найден для снятия: ${bagItemId}`))
          resolve({ success: false })
          return
        }

        const bagMaxWeight = itemData.clothesData?.maxWeight || 0

        console.log(chalk.cyan(`[BAG] Снимаем сумку ${bagItemId} с maxWeight=${bagMaxWeight}`))

        // Уменьшаем максимальный вес в инвентаре
        const updateMaxWeightSql = 'UPDATE inventory SET maxweight = maxweight - ? WHERE uid = ?'
        data.query(updateMaxWeightSql, [bagMaxWeight, uid], (updateErr) => {
          if (updateErr) {
            console.log(chalk.bgRed('• [INV] Bag operation unequip (update maxweight) •') + chalk.red(` ${updateErr}`))
            reject(updateErr)
          } else {
            resolve({ success: true })
          }
        })

        break
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
      const bagItem = clothesSlots[9]

      console.log(chalk.cyan(`[GET EQUIPPED BAG] bagItem в слоте 9: ${JSON.stringify(bagItem)}`))

      if (!bagItem) {
        console.log(chalk.yellow(`[GET EQUIPPED BAG] В слоте 9 нет предмета`))
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

        case 'donate':
          const donateData = JSON.parse(inventory.donatslots)
          donateData.slots[slotIndex] = itemData
          updatedValue = JSON.stringify(donateData)
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