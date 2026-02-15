import chalk from "chalk"
import { getItemById } from "./items"
import {
  getPlayerInventory, calcTotalWeight, getEquippedBag, handleBagOperations, updateSlotsInDB,
  updateTotalWeightInventory, getBagWeight, sendInventoryToCef
} from "./inventoryHandlers"
import {getMyOffers, getTradeForPlayer, updateStatuses} from "./tradeManager";
import { usageClothes } from "../../player/clothes";
import { useClothes } from "./usageItems";
import { connectedUsers } from "../../data/dataConnectedUser";
import { data } from "../../database/mysql";
import { rce } from "../../utils/rce";

export const canStack = (item1: any, item2: any): boolean => {
  const item1Data = getItemById(item1.id)
  const item2Data = getItemById(item2.id)

  if (!item1Data || !item2Data) return false

  return item1.id === item2.id && item1Data.stackable && item2Data.stackable
}

export const moveItemSlots = (
  sourceSlots: any[],
  sourceIndex: number,
  targetSlots: any[],
  targetIndex: number
): { newSourceSlots: any[], newTargetSlots: any[] } => {
  // ✅ Если это один и тот же массив (перемещение внутри одной секции)
  if (sourceSlots === targetSlots) {
    const newSlots = sourceSlots.length >= 20 ? [...sourceSlots] : [...sourceSlots, ...Array(20 - sourceSlots.length).fill(null)]

    const sourceItem = newSlots[sourceIndex]
    const targetItem = newSlots[targetIndex]

    if (!sourceItem) {
      return { newSourceSlots: newSlots, newTargetSlots: newSlots }
    }

    if (!targetItem) {
      // Перемещение в пустой слот
      newSlots[sourceIndex] = null
      newSlots[targetIndex] = sourceItem
    } else if (canStack(sourceItem, targetItem)) {
      const sourceItemData = getItemById(sourceItem.id)

      if (!sourceItemData) {
        return { newSourceSlots: newSlots, newTargetSlots: newSlots }
      }

      const totalQuantity = sourceItem.quantity + targetItem.quantity
      const maxStack = sourceItemData.maxStack

      if (totalQuantity <= maxStack) {
        newSlots[sourceIndex] = null
        newSlots[targetIndex] = { ...targetItem, quantity: totalQuantity }
      } else {
        const remainingQuantity = totalQuantity - maxStack
        newSlots[sourceIndex] = { ...sourceItem, quantity: remainingQuantity }
        newSlots[targetIndex] = { ...targetItem, quantity: maxStack }
      }
    } else {
      // Обмен предметами
      newSlots[sourceIndex] = targetItem
      newSlots[targetIndex] = sourceItem
    }

    return { newSourceSlots: newSlots, newTargetSlots: newSlots }
  }

  // ✅ Для разных массивов (перемещение между секциями)
  const newSourceSlots = sourceSlots.length >= 20 ? [...sourceSlots] : [...sourceSlots, ...Array(20 - sourceSlots.length).fill(null)]
  const newTargetSlots = targetSlots.length >= 20 ? [...targetSlots] : [...targetSlots, ...Array(20 - targetSlots.length).fill(null)]

  const sourceItem = newSourceSlots[sourceIndex]
  const targetItem = newTargetSlots[targetIndex]

  if (!sourceItem) {
    return { newSourceSlots, newTargetSlots }
  }

  if (!targetItem) {
    newSourceSlots[sourceIndex] = null
    newTargetSlots[targetIndex] = sourceItem
  } else if (canStack(sourceItem, targetItem)) {
    const sourceItemData = getItemById(sourceItem.id)

    if (!sourceItemData) {
      return { newSourceSlots, newTargetSlots }
    }

    const totalQuantity = sourceItem.quantity + targetItem.quantity
    const maxStack = sourceItemData.maxStack

    if (totalQuantity <= maxStack) {
      newSourceSlots[sourceIndex] = null
      newTargetSlots[targetIndex] = { ...targetItem, quantity: totalQuantity }
    } else {
      const remainingQuantity = totalQuantity - maxStack
      newSourceSlots[sourceIndex] = { ...sourceItem, quantity: remainingQuantity }
      newTargetSlots[targetIndex] = { ...targetItem, quantity: maxStack }
    }
  } else {
    newSourceSlots[sourceIndex] = targetItem
    newTargetSlots[targetIndex] = sourceItem
  }

  return { newSourceSlots, newTargetSlots }
}

export const processInventoryMove = async (
  uid: number,
  sourceSection: string,
  sourceSlot: number,
  targetSection: string,
  targetSlot: number
): Promise<boolean> => {
  try {
    console.log(chalk.blue(`• PROCESS INV MOVE • uid: ${uid}, from ${sourceSection}[${sourceSlot}] to ${targetSection}[${targetSlot}]`))

    const inventory = await getPlayerInventory(uid)
    if (!inventory) {
      console.log(chalk.red('• PROCESS INV MOVE • Инвентарь не найден'))
      return false
    }

    const player = mp.players.at(connectedUsers.getPlayerIdByUid(uid))
    if (!player) return false

    /*if (sourceSection === 'trade' || targetSection === 'trade' || sourceSection === 'returnTrade' || targetSection === 'returnTrade') {
      if (sourceSection === 'returnTrade' || targetSection === 'returnTrade') return false

      const tradeInfo = getTradeForPlayer(player)
      if (!tradeInfo) return false

      const { trade } = tradeInfo
      const myReady = player === trade.player1 ? trade.ready1 : trade.ready2
      if (myReady) return false

      let myOffers = getMyOffers(trade, player)
      let sourceSlots: any[] = myOffers
      let targetSlots: any[] = myOffers

      let sourceRealSection = sourceSection
      let targetRealSection = targetSection

      if (sourceSection !== 'trade') {
        switch (sourceSection) {
          case 'main':
            sourceSlots = normalizeSlots(JSON.parse(inventory.mainslots))
            break
          case 'donat':
            const donat = JSON.parse(inventory.donatslots)
            sourceSlots = normalizeSlots(donat.slots || [], 15)
            break
          case 'bag':
            const bag = await getEquippedBag(uid)
            if (!bag) return false
            sourceSlots = normalizeSlots(JSON.parse(bag.items || '[]'))
            break
          case 'clothes':
            sourceSlots = normalizeSlots(JSON.parse(inventory.clothesslots))
            break
          default:
            return false
        }
        sourceRealSection = sourceSection
      }

      if (targetSection !== 'trade') {
        switch (targetSection) {
          case 'main':
            targetSlots = normalizeSlots(JSON.parse(inventory.mainslots))
            break
          case 'donat':
            const donat = JSON.parse(inventory.donatslots)
            targetSlots = normalizeSlots(donat.slots || [], 15)
            break
          case 'bag':
            const bag = await getEquippedBag(uid)
            if (!bag) return false
            targetSlots = normalizeSlots(JSON.parse(bag.items || '[]'))
            break
          case 'clothes':
            targetSlots = normalizeSlots(JSON.parse(inventory.clothesslots))
            break
          default:
            return false
        }
        targetRealSection = targetSection
      }

      const { newSourceSlots, newTargetSlots } = moveItemSlots(sourceSlots, sourceSlot, targetSlots, targetSlot)

      if (sourceSection === 'trade' && targetSection === 'trade') {
        if (player === trade.player1) trade.offers1 = newSourceSlots
        else trade.offers2 = newSourceSlots
      } else if (sourceSection !== 'trade' && targetSection === 'trade') {
        if (player === trade.player1) trade.offers1 = newSourceSlots
        else trade.offers2 = newSourceSlots

        if (sourceRealSection === 'bag') {
          const bagItem = JSON.parse(inventory.clothesslots)[10]
          if (bagItem) {
            await handleBagOperations(uid, 'update', bagItem.id, newSourceSlots)
          }
        } else {
          await updateSlotsArray(uid, sourceRealSection, newSourceSlots)
        }
      } else if (sourceSection ===  'trade' && targetSection !== 'trade') {
        if (player === trade.player1) trade.offers1 = newSourceSlots
        else trade.offers2 = newSourceSlots

        if (targetRealSection === 'bag') {
          const bagItem = JSON.parse(inventory.clothesslots)[10]
          if (bagItem) {
            await handleBagOperations(uid, 'update', bagItem.id, newTargetSlots)
          }
        } else {
          await updateSlotsArray(uid, targetRealSection, newTargetSlots)
        }
      }

      await updateTotalWeightInventory(uid)

      const partner = player === trade.player1 ? trade.player2 : trade.player1
      const uidPartner = connectedUsers.getField(partner.id, 'uid')

      await sendInventoryToCef(player, uid)
      if (partner && uidPartner) sendInventoryToCef(partner, uidPartner)

      return true
    }*/

    if (sourceSection === 'trade' || targetSection === 'trade' || sourceSection === 'returnTrade' || targetSection === 'returnTrade') {
      if (sourceSection === 'returnTrade' || targetSection === 'returnTrade') {
        console.log(chalk.yellow('[TRADE] Попытка изменить returnTrade — запрещено'));
        return false;
      }

      const tradeInfo = getTradeForPlayer(player);
      if (!tradeInfo) {
        console.log(chalk.yellow('[TRADE] Перемещение в trade, но трейд не активен'));
        return false;
      }

      const { trade } = tradeInfo;
      const myReady = player === trade.player1 ? trade.ready1 : trade.ready2;
      if (myReady) {
        console.log(chalk.yellow('[TRADE] Нельзя менять слоты после нажатия "Обменяться"'));
        return false;
      }

      let myOffers = getMyOffers(trade, player);

      let sourceSlots: any[] = (sourceSection === 'trade') ? myOffers : [];
      let targetSlots: any[] = (targetSection === 'trade') ? myOffers : [];

      let sourceIsBag = false;
      let targetIsBag = false;
      let sourceBagUid: number | null = null;
      let targetBagUid: number | null = null;

      if (sourceSection !== 'trade') {
        switch (sourceSection) {
          case 'main':
            sourceSlots = normalizeSlots(JSON.parse(inventory.mainslots));
            break;
          case 'donat':
            const donat = JSON.parse(inventory.donatslots);
            sourceSlots = normalizeSlots(donat.slots || [], 15);
            break;
          case 'bag':
            const bag = await getEquippedBag(uid);
            if (!bag) return false;
            sourceSlots = normalizeSlots(JSON.parse(bag.items || '[]'));
            sourceIsBag = true;
            const clothes = JSON.parse(inventory.clothesslots);
            sourceBagUid = clothes[10]?.id || null;
            break;
          case 'clothes':
            sourceSlots = normalizeSlots(JSON.parse(inventory.clothesslots));
            break;
          case 'fast':
            sourceSlots = normalizeFastSlots(JSON.parse(inventory.fastslots || '[]'));
            break;
          default:
            return false;
        }
      }

      if (targetSection !== 'trade') {
        switch (targetSection) {
          case 'main':
            targetSlots = normalizeSlots(JSON.parse(inventory.mainslots));
            break;
          case 'donat':
            const donat = JSON.parse(inventory.donatslots);
            targetSlots = normalizeSlots(donat.slots || [], 15);
            break;
          case 'bag':
            const bag = await getEquippedBag(uid);
            if (!bag) return false;
            targetSlots = normalizeSlots(JSON.parse(bag.items || '[]'));
            targetIsBag = true;
            const clothes = JSON.parse(inventory.clothesslots);
            targetBagUid = clothes[10]?.id || null;
            break;
          case 'clothes':
            targetSlots = normalizeSlots(JSON.parse(inventory.clothesslots));
            break;
          case 'fast':
            targetSlots = normalizeFastSlots(JSON.parse(inventory.fastslots || '[]'));
            break;
          default:
            return false;
        }
      }

      const { newSourceSlots, newTargetSlots } = moveItemSlots(sourceSlots, sourceSlot, targetSlots, targetSlot);

      // Обновляем trade offers и инвентарь
      if (sourceSection === 'trade' && targetSection === 'trade') {
        // Внутри trade — просто обновляем offers
        if (player === trade.player1) trade.offers1 = newTargetSlots; // или newSourceSlots, т.к. один массив
        else trade.offers2 = newTargetSlots;
      } else if (sourceSection !== 'trade' && targetSection === 'trade') {
        // Из инвентаря в trade
        if (player === trade.player1) trade.offers1 = newTargetSlots;
        else trade.offers2 = newTargetSlots;

        // Обновляем оригинальный инвентарь (удаляем предмет)
        if (sourceIsBag && sourceBagUid) {
          await handleBagOperations(uid, 'update', sourceBagUid, newSourceSlots);
        } else {
          await updateSlotsArray(uid, sourceSection, newSourceSlots);
        }
      } else if (sourceSection === 'trade' && targetSection !== 'trade') {
        // Из trade обратно в инвентарь
        if (player === trade.player1) trade.offers1 = newSourceSlots;
        else trade.offers2 = newSourceSlots;

        // Обновляем инвентарь (добавляем предмет)
        if (targetIsBag && targetBagUid) {
          await handleBagOperations(uid, 'update', targetBagUid, newTargetSlots);
        } else {
          await updateSlotsArray(uid, targetSection, newTargetSlots);
        }
      }

      await updateTotalWeightInventory(uid);

      // Обновляем CEF для обоих
      const partner = player === trade.player1 ? trade.player2 : trade.player1;
      const uidPartner = connectedUsers.getField(partner?.id, 'uid');
      await sendInventoryToCef(player, uid);
      if (partner && mp.players.exists(partner) && uidPartner) {
        await sendInventoryToCef(partner, uidPartner);
      }

      // Если перемещение после ready — сбросить статусы
      if (trade.ready1 || trade.ready2) {
        trade.ready1 = false;
        trade.ready2 = false;
        updateStatuses(trade);
      }

      return true;
    }

    if (targetSection === 'bag') {
      console.log(chalk.blue(`• PROCESS INV MOVE • Проверяем, не сумка ли перемещается в bag...`))

      let sourceItemForCheck: any = null

      // Получаем sourceItem в зависимости от секции
      switch (sourceSection) {
        case 'main':
          const mainSlots = normalizeSlots(JSON.parse(inventory.mainslots))
          sourceItemForCheck = mainSlots[sourceSlot]
          break
        case 'donat':
          const donatData = JSON.parse(inventory.donatslots)
          sourceItemForCheck = donatData.slots[sourceSlot]
          break
        case 'clothes':
          const clothesSlots = normalizeSlots(JSON.parse(inventory.clothesslots))
          sourceItemForCheck = clothesSlots[sourceSlot]
          break
        case 'bag':
          // Если sourceSection тоже bag, это перемещение внутри сумки
          break
        default:
          break
      }

      if (sourceItemForCheck) {
        const itemData = getItemById(sourceItemForCheck.id)
        if (itemData && itemData.clothesData?.slot === 10) {
          console.log(chalk.red('• PROCESS INV MOVE • Нельзя перемещать сумку в секцию сумки!'))
          return false
        }
      }
    }

    // 🚨 ОБРАБОТКА: Перемещение внутри одной секции
    if (sourceSection === targetSection) {
      console.log(chalk.blue('• PROCESS INV MOVE • Перемещение внутри одной секции'))

      // Получаем массив слотов для этой секции
      let slots: any[]
      let isBagSection = false
      let bagUid: number | null = null
      let isFastSection = false

      switch (sourceSection) {
        case 'main':
          slots = normalizeSlots(JSON.parse(inventory.mainslots))
          break
        case 'donat':
          const donatData = JSON.parse(inventory.donatslots)
          slots = normalizeSlots(donatData.slots || [], 15)
          break
        case 'clothes':
          slots = normalizeSlots(JSON.parse(inventory.clothesslots))
          break
        case 'bag':
          const bagData = await getEquippedBag(uid)
          if (!bagData) {
            console.log(chalk.red('• PROCESS INV MOVE • Сумка не надета'))
            return false
          }
          slots = normalizeSlots(bagData.items ? JSON.parse(bagData.items) : Array(20).fill(null))
          isBagSection = true
          // Получаем bag_uid из одежды
          const clothesSlots = JSON.parse(inventory.clothesslots)
          bagUid = clothesSlots[10]?.id || null
          break
        case 'fast':
          slots = normalizeFastSlots(
            inventory.fastslots ? JSON.parse(inventory.fastslots) : Array(4).fill(null)
          )
          isFastSection = true
          break
        default:
          console.log(chalk.red(`• PROCESS INV MOVE • Неизвестная секция: ${sourceSection}`))
          return false
      }

      const sourceItem = slots[sourceSlot]
      const targetItem = slots[targetSlot]

      console.log(chalk.blue(`• PROCESS INV MOVE • sourceItem: ${JSON.stringify(sourceItem)}, targetItem: ${JSON.stringify(targetItem)}`))

      // Если нет предмета для перемещения
      if (!sourceItem) {
        console.log(chalk.red('• PROCESS INV MOVE • Нет предмета для перемещения'))
        return false
      }

      // Проверяем, что это один и тот же слот (защита от дублей)
      if (sourceSlot === targetSlot) {
        console.log(chalk.yellow('• PROCESS INV MOVE • Попытка переместить предмет в тот же слот'))
        return false
      }

      // Логика перемещения внутри одного массива
      if (!targetItem) {
        // Перемещение в пустой слот
        slots[sourceSlot] = null
        slots[targetSlot] = sourceItem
      } else if (canStack(sourceItem, targetItem)) {
        // Стакание предметов
        const sourceItemData = getItemById(sourceItem.id)
        if (!sourceItemData) {
          console.log(chalk.red('• PROCESS INV MOVE • Не удалось получить данные предмета для стакания'))
          return false
        }

        const totalQuantity = sourceItem.quantity + targetItem.quantity
        const maxStack = sourceItemData.maxStack

        if (totalQuantity <= maxStack) {
          // Полное стакание
          slots[sourceSlot] = null
          slots[targetSlot] = { ...targetItem, quantity: totalQuantity }
        } else {
          // Частичное стакание
          const remainingQuantity = totalQuantity - maxStack
          slots[sourceSlot] = { ...sourceItem, quantity: remainingQuantity }
          slots[targetSlot] = { ...targetItem, quantity: maxStack }
        }
      } else {
        // Обмен предметами
        slots[sourceSlot] = targetItem
        slots[targetSlot] = sourceItem
      }

      console.log(chalk.blue(`• PROCESS INV MOVE • После перемещения:`))
      console.log(chalk.blue(`  slots[${sourceSlot}]: ${JSON.stringify(slots[sourceSlot])}`))
      console.log(chalk.blue(`  slots[${targetSlot}]: ${JSON.stringify(slots[targetSlot])}`))

      // Обновляем данные в БД (один раз!)
      if (isBagSection && bagUid) {
        const updateResult = await handleBagOperations(uid, 'update', bagUid, slots)
        if (!updateResult.success) {
          console.log(chalk.red('• PROCESS INV MOVE • Ошибка при обновлении сумки'))
          return false
        }
      } else if (isFastSection) {  // ← Добавляем этот else if
        const updateSql = 'UPDATE inventory SET fastslots = ? WHERE uid = ?'
        data.query(updateSql, [JSON.stringify(slots), uid], (err) => {
          if (err) {
            console.log(chalk.bgRed('• UPDATE FAST SLOTS •') + chalk.red(` ${err}`))
            // Можно return false, но для простоты просто логируем
          }
        })
      } else {
        await updateSlotsArray(uid, sourceSection, slots)
      }

      // Обновляем общий вес
      await updateTotalWeightInventory(uid)
      console.log(chalk.green('• PROCESS INV MOVE • Перемещение внутри секции успешно завершено'))
      return true
    }

    console.log(chalk.blue('• PROCESS INV MOVE • Перемещение между разными секциями'))

    let sourceSlots: any[]
    let targetSlots: any[]
    let sourceIsBag = false
    let sourceBagUid: number | null = null
    let targetIsBag = false
    let targetBagUid: number | null = null

// Получаем sourceSlots
    switch (sourceSection) {
      case 'main':
        sourceSlots = normalizeSlots(JSON.parse(inventory.mainslots))
        break
      case 'donat':
        const donatData = JSON.parse(inventory.donatslots)
        sourceSlots = normalizeSlots(Array.isArray(donatData) ? donatData : (donatData.slots || []), 15)
        break
      case 'clothes':
        sourceSlots = normalizeSlots(JSON.parse(inventory.clothesslots))
        break
      case 'bag':
        const sourceBagData = await getEquippedBag(uid)
        if (!sourceBagData) return false
        sourceSlots = normalizeSlots(sourceBagData.items ? JSON.parse(sourceBagData.items) : Array(20).fill(null))
        sourceIsBag = true
        const clothesSlotsSource = JSON.parse(inventory.clothesslots)
        sourceBagUid = clothesSlotsSource[10]?.id || null
        break
      case 'fast':
        sourceSlots = normalizeFastSlots(
          inventory.fastslots ? JSON.parse(inventory.fastslots) : Array(4).fill(null)
        )
        break
      default:
        console.log(chalk.red(`Неизвестная sourceSection: ${sourceSection}`))
        return false
    }

// Получаем targetSlots
    switch (targetSection) {
      case 'main':
        targetSlots = normalizeSlots(JSON.parse(inventory.mainslots))
        break
      case 'donat':
        const donatData = JSON.parse(inventory.donatslots)
        targetSlots = normalizeSlots(donatData.slots || [], 15)
        break
      case 'clothes':
        targetSlots = normalizeSlots(JSON.parse(inventory.clothesslots))
        break
      case 'bag':
        const targetBagData = await getEquippedBag(uid)
        if (!targetBagData) return false
        targetSlots = normalizeSlots(targetBagData.items ? JSON.parse(targetBagData.items) : Array(20).fill(null))
        targetIsBag = true
        const clothesSlotsTarget = JSON.parse(inventory.clothesslots)
        targetBagUid = clothesSlotsTarget[10]?.id || null
        break
      case 'fast':
        targetSlots = normalizeFastSlots(
          inventory.fastslots ? JSON.parse(inventory.fastslots) : Array(4).fill(null)
        )
        break
      default:
        console.log(chalk.red(`Неизвестная targetSection: ${targetSection}`))
        return false
    }

    const sourceItem = sourceSlots[sourceSlot]
    const targetItem = targetSlots[targetSlot]

    if (!sourceItem) {
      console.log(chalk.red('Нет предмета для перемещения'))
      return false
    }

    if (targetSection === 'clothes') {
      console.log(chalk.blue('[CLOTHES MOVE] Пытаемся надеть предмет:'), JSON.stringify(sourceItem));

      // 1. Получаем ПОЛНЫЕ данные предмета из реестра (там есть clothesData!)
      const fullItemData = getItemById(sourceItem.id);
      if (!fullItemData || !fullItemData.clothesData) {
        console.log(chalk.red('[CLOTHES MOVE] Предмет не найден или не является одеждой'));
        return false;
      }

      // 2. Берём слот из полных данных
      let clothesSlotIndex = fullItemData.clothesData.slot ?? -1;

      // Защита для сумок без slot (если вдруг старые айтемы)
      if (clothesSlotIndex === -1 && fullItemData.clothesData.maxWeight !== undefined) {
        clothesSlotIndex = 10;
        console.log(chalk.yellow(`[FIX] Сумка ${sourceItem.id} без slot — принудительно в 10`));
      }

      if (clothesSlotIndex === -1) {
        console.log(chalk.red('[CLOTHES MOVE] Нет валидного слота для одежды'));
        return false;
      }

      // 3. Проверяем свободен ли слот
      if (targetSlots[clothesSlotIndex] !== null) {
        console.log(chalk.yellow(`[CLOTHES MOVE] Слот ${clothesSlotIndex} уже занят`));
        return false;
      }

      // 4. Надеваем (используем данные из БД + полные данные)
      targetSlots[clothesSlotIndex] = { id: sourceItem.id, quantity: 1 };
      sourceSlots[sourceSlot] = null;

      // 5. Применяем на модель
      const player = mp.players.at(connectedUsers.getPlayerIdByUid(uid));
      if (player) {
        console.log(chalk.green(`[CLOTHES MOVE] Применяем usageClothes на слот ${clothesSlotIndex}`));
        usageClothes(player, clothesSlotIndex, fullItemData.clothesData.drawable, fullItemData.clothesData.texture, sourceItem.id);
        useClothes(player, sourceItem.id, true);
      }

      // 7. Сохраняем
      await updateSlotsArray(uid, 'clothes', targetSlots);
      await updateSlotsArray(uid, sourceSection, sourceSlots);
      await updateTotalWeightInventory(uid);

      console.log(chalk.green(`[MOVE SUCCESS] Предмет ${sourceItem.id} надет в слот ${clothesSlotIndex}`));
      return true;
    }

// 2. Снимаем (source = clothes)
    if (sourceSection === 'clothes') {
      if (!sourceItem) return false;
      // Снимаем визуально
      const player = mp.players.at(connectedUsers.getPlayerIdByUid(uid));
      if (player) {
        usageClothes(player, sourceSlot, -1, 0, sourceItem.id);
        useClothes(player, sourceItem.id, false);
      }
      sourceSlots[sourceSlot] = null;

      // Если целевой слот занят — ищем свободный
      let finalTargetSection: any = targetSection;
      let finalTargetSlot = targetSlot;
      if (targetItem) {
        const free = await findFreeSlotsInInventory(uid);
        if (!free.section) {
          console.log(chalk.red('Нет свободного слота для снятия'));
          return false;
        }
        finalTargetSection = free.section;
        finalTargetSlot = free.slot;
        // Загружаем targetSlots для свободного слота
        switch (finalTargetSection) {
          case 'main': targetSlots = normalizeSlots(JSON.parse(inventory.mainslots)); break;
          case 'donat':
            const donat = JSON.parse(inventory.donatslots);
            targetSlots = normalizeSlots(donat.slots || []);
            break;
          case 'bag':
            const bag = await getEquippedBag(uid);
            if (bag) targetSlots = normalizeSlots(JSON.parse(bag.items || '[]'));
            break;
        }
      }

      targetSlots[finalTargetSlot] = { id: sourceItem.id, quantity: 1 };

      // Сохраняем изменения для clothes (source)
      await updateSlotsArray(uid, 'clothes', sourceSlots);

      // Сохраняем для target с проверкой на 'bag'
      console.log(chalk.blue(`[MOVE CLOTHES OFF] Сохраняем в finalTargetSection: ${finalTargetSection}`));
      if (finalTargetSection === 'bag') {
        const clothesSlots = JSON.parse(inventory.clothesslots);  // Заново загружаем, если нужно
        const bagUid = clothesSlots[10]?.id;
        if (!bagUid) {
          console.log(chalk.red('[MOVE CLOTHES OFF] bagUid не найден'));
          return false;
        }
        await handleBagOperations(uid, 'update', bagUid, targetSlots);
      } else {
        await updateSlotsArray(uid, finalTargetSection, targetSlots);
      }

      await updateTotalWeightInventory(uid);
      console.log(chalk.green(`[MOVE] Одежда ${sourceItem.id} снята в ${finalTargetSection}-${finalTargetSlot}`));
      return true;
    }

// Специальная логика ТОЛЬКО для fast-слотов
    if (targetSection === 'fast') {
      if (sourceItem.type === 'clothes') {
        console.log(chalk.red('Одежду нельзя добавлять в быстрые слоты'))
        return false
      }

      // Копируем предмет в fast (только id + quantity достаточно)
      const fastCopy = { id: sourceItem.id, quantity: sourceItem.quantity }

      // Если слот занят — заменяем (старый fast просто перезаписывается)
      targetSlots[targetSlot] = fastCopy

      // Оригинал НЕ удаляем!
      console.log(chalk.green(`Копия предмета ${sourceItem.id} добавлена в fast[${targetSlot}]`))
    }
    else if (sourceSection === 'fast') {
      // Убираем из fast — просто очищаем слот
      sourceSlots[sourceSlot] = null
      console.log(chalk.green(`Удалён предмет из fast[${sourceSlot}]`))
    }
    else {
      // Обычная логика переноса для всех остальных секций
      if (!targetItem) {
        sourceSlots[sourceSlot] = null
        targetSlots[targetSlot] = sourceItem
      } else if (canStack(sourceItem, targetItem)) {
        const sourceItemData = getItemById(sourceItem.id)
        if (!sourceItemData) return false

        const total = sourceItem.quantity + targetItem.quantity
        const max = sourceItemData.maxStack

        if (total <= max) {
          sourceSlots[sourceSlot] = null
          targetSlots[targetSlot] = { ...targetItem, quantity: total }
        } else {
          const rem = total - max
          sourceSlots[sourceSlot] = { ...sourceItem, quantity: rem }
          targetSlots[targetSlot] = { ...targetItem, quantity: max }
        }
      } else {
        sourceSlots[sourceSlot] = targetItem
        targetSlots[targetSlot] = sourceItem
      }
    }

// Сохраняем изменения
    if (sourceIsBag && sourceBagUid) {
      await handleBagOperations(uid, 'update', sourceBagUid, sourceSlots)
    } else {
      await updateSlotsArray(uid, sourceSection, sourceSlots)
    }

    if (targetIsBag && targetBagUid) {
      await handleBagOperations(uid, 'update', targetBagUid, targetSlots)
    } else {
      await updateSlotsArray(uid, targetSection, targetSlots)
    }

// Специально для fast — всегда сохраняем
    if (sourceSection === 'fast' || targetSection === 'fast') {
      const finalFast = sourceSection === 'fast' ? sourceSlots : targetSlots
      const sql = 'UPDATE inventory SET fastslots = ? WHERE uid = ?'
      data.query(sql, [JSON.stringify(finalFast), uid], (err) => {
        if (err) console.error('[FAST] Ошибка сохранения:', err)
      })
    }

// Сбрасываем isFast, если убираем из fast
    if (sourceSection === 'fast' && sourceItem) {
      const player = connectedUsers.getPlayerByUid(uid)
      if (player) {
        rce.triggerClient(player, 'execute', `
      window.App.inventoryReducer.updateItemIsFast(${sourceItem.id}, false)
    `)
      }
    }

    await updateTotalWeightInventory(uid)
    console.log(chalk.green('• PROCESS INV MOVE • Успешно'))
    return true

  } catch (e) {
    console.log(chalk.bgRed('• PROCESS INV MOVE •') + chalk.red(` ${e}`))
    console.log(chalk.red('Stack trace:'), e.stack)
    return false
  }
}

export const normalizeSlots = (slots: any[], targetLength: number = 20): any[] => {
  if (!Array.isArray(slots)) return Array(targetLength).fill(null)

  if (slots.length === targetLength) return slots
  if (slots.length > targetLength) return slots.slice(0, targetLength)

  return [...slots, ...Array(targetLength - slots.length).fill(null)]
}

const normalizeFastSlots = (slots: any[]): any[] => {
  if (!Array.isArray(slots)) return Array(4).fill(null);
  if (slots.length === 4) return slots;
  if (slots.length > 4) return slots.slice(0, 4);
  return [...slots, ...Array(4 - slots.length).fill(null)];
};

export const updateSlotsArray = async (
  uid: number,
  section: string,
  slots: any[]
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM inventory WHERE uid = ? LIMIT 1'

    data.query(sql, [uid], (err, results: any) => {
      if (err) {
        console.log(chalk.bgRed('• UPDATE SLOTS ARRAY •') + chalk.red(` ${err}`))
        reject(err)
        return
      }

      if (results.length === 0) {
        reject('Инвентарь не найден')
        return
      }

      const inventory = results[0]
      let columnName: string
      let updatedValue: string

      switch (section) {
        case 'main':
          columnName = 'mainslots'
          updatedValue = JSON.stringify(slots)
          break

        case 'donat':
          columnName = 'donatslots'

          let donatData = typeof inventory.donatslots === 'string'
            ? JSON.parse(inventory.donatslots)
            : inventory.donatslots

          if (!donatData || typeof donatData !== 'object' || Array.isArray(donatData)) {
            donatData = { have: false, slots: Array(15).fill(null) }
          }

          donatData.slots = normalizeSlots(slots, 15)
          updatedValue = JSON.stringify(donatData)
          break

        case 'clothes':
          columnName = 'clothesslots'
          updatedValue = JSON.stringify(slots)
          break

        case 'fast':
          columnName = 'fastslots'
          updatedValue = JSON.stringify(slots)
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

export const findFreeSlotsInInventory = async (uid: number) => {
  const inventory = await getPlayerInventory(uid)
  if (!inventory) return { section: null, slot: null }

  const mainSlots = normalizeSlots(JSON.parse(inventory.mainslots))
  let freeSlot = mainSlots.findIndex(slot => slot === null)
  if (freeSlot !== -1) return { section: 'main', slot: freeSlot }

  const donatData = JSON.parse(inventory.donatslots)
  const donatSlots = normalizeSlots(donatData.slots || [], 15)
  freeSlot = donatSlots.findIndex(slot => slot === null)
  if (freeSlot !== -1) return { section: 'donat', slot: freeSlot }

  const bagData = await getEquippedBag(uid)
  if (bagData) {
    const bagSlots = normalizeSlots(JSON.parse(bagData.items))
    freeSlot = bagSlots.findIndex(slot => slot === null)
    if (freeSlot !== -1) return { section: 'bag', slot: freeSlot }
  }

  return { section: null, slot: null }
}