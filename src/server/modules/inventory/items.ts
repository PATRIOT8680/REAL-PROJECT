import chalk from 'chalk'
import { rce } from "../../utils/rce";
import { ServerItem } from "../../../shared/types/items";

import { CLOTHES_MALE_CONFIG } from "../../configs/items/clothes.male";
import { CLOTHES_FEMALE_CONFIG } from "../../configs/items/clothes.female";
import { WEAPONS_CONFIG } from "../../configs/items/weapons";
import { FOODS_CONFIG } from "../../configs/items/foods";
import { SLOT_MAPPING, CLOTHES_IMAGE_IDS } from "../../configs/items/slotClothesMapping";

import { getUsageFunction, usageFunctions } from "./usageItems";

const itemsRegistry = new Map<number, ServerItem>()

rce.registerClient('getAllItems', (player: PlayerMp) => {
  return getAllItems()
})

export const registerItem = (item: ServerItem) => {
  itemsRegistry.set(item.id, item)
}

export const getItemById = (id: number): ServerItem | undefined => {
  return itemsRegistry.get(id)
}

export const generateClothesItemId = (
  type: 'clothes' | 'props',
  gender: 'male' | 'female',
  sectionId: number,
  drawable: number,
  texture: number = 0
): number => {
  const typeCode = type === 'clothes' ? 1 : 2
  const genderCode = gender === 'male' ? 1 : 2

  return parseInt(`${typeCode}${genderCode}${String(sectionId).padStart(2, '0')}${String(drawable).padStart(3, '0')}${String(texture).padStart(2, '0')}`)
}

const parseClothesItemId = (uniqueId: number): {
  type: 'clothes' | 'props';
  gender: 'male' | 'female';
  sectionId: number;
  drawable: number;
  texture: number;
} | null => {
  const idStr = String(uniqueId).padStart(9, '0')

  if (idStr.length !== 9) return null

  const typeCode = parseInt(idStr[0])
  const genderCode = parseInt(idStr[1])
  const type = typeCode === 1 ? 'clothes' : 'props'
  const gender = genderCode === 1 ? 'male' : 'female'
  const sectionId = parseInt(idStr.substring(2, 4))
  const drawable = parseInt(idStr.substring(4, 7))
  const texture = parseInt(idStr.substring(7, 9))

  return { type, gender, sectionId, drawable, texture }
}


const loadClothes = () => {
  Object.entries(CLOTHES_MALE_CONFIG).forEach(([slotStr, items]) => {
    const slot = parseInt(slotStr)
    const slotInfo = SLOT_MAPPING[slot as keyof typeof SLOT_MAPPING]

    if (!slotInfo) {
      console.warn(`[ITEMS] SLOT_MAPPING не найден для слота ${slot}`);
      return;
    }

    items.forEach((itemData: any) => {
      const drawable = itemData[0]
      const name = itemData[1]
      const weight = itemData[2] || 0.5
      const price = itemData[3] || 0
      const maxWeight = itemData[4]
      const variations = itemData[5] || 1
      const specialId = itemData[6] || 0  // ← фикс: если нет — 0

      for (let texture = 0; texture < variations; texture++) {
        const uniqueId = generateClothesItemId(
          slotInfo.type,
          'male',
          slotInfo.clothesSection,
          drawable,
          texture
        )

        const item: ServerItem = {
          id: uniqueId,
          name: name,
          description: "Чтобы одеть, перетащите в секцию с одеждой",
          imageId: 0,
          maxStack: 1,
          type: 'clothes',
          weight: weight,
          stackable: false,
          consumable: false,
          price: price,
          clothesData: {
            type: slotInfo.type,
            gender: 'male',
            sectionId: slotInfo.clothesSection,
            drawable: drawable,
            texture: texture,
            slot: slot,
            maxWeight: maxWeight,
            propId: specialId,
          }
        }

        registerItem(item)
      }
    })
  })

  Object.entries(CLOTHES_FEMALE_CONFIG).forEach(([slotStr, items]) => {
    const slot = parseInt(slotStr)
    const slotInfo = SLOT_MAPPING[slot as keyof typeof SLOT_MAPPING]

    if (!slotInfo) {
      console.warn(`[ITEMS] SLOT_MAPPING не найден для слота ${slot}`);
      return;
    }

    items.forEach((itemData: any) => {
      const drawable = itemData[0]
      const name = itemData[1]
      const weight = itemData[2] || 0.5
      const price = itemData[3] || 0
      const maxWeight = itemData[4]
      const variations = itemData[5] || 1
      const specialId = itemData[6] || 0

      for (let texture = 0; texture < variations; texture++) {
        const uniqueId = generateClothesItemId(
          slotInfo.type,
          'female',
          slotInfo.clothesSection,
          drawable,
          texture
        )

        const item: ServerItem = {
          id: uniqueId,
          name: name,
          description: "Чтобы одеть, перетащите в секцию с одеждой",
          imageId: 0,
          maxStack: 1,
          type: 'clothes',
          weight: weight,
          stackable: false,
          consumable: false,
          price: price,
          clothesData: {
            type: slotInfo.type,
            gender: 'female',
            sectionId: slotInfo.clothesSection,
            drawable: drawable,
            texture: texture,
            slot: slot,
            maxWeight: maxWeight,
            propId: specialId,
          }
        }

        registerItem(item)
      }
    })
  })
}


const loadWeapons = () => {
  WEAPONS_CONFIG.forEach((weapon: any[]) => {
    const [id, name, description, ammoType, weight, maxStack, stackable, price, usage] = weapon

    const item: ServerItem = {
      id,
      name,
      description,
      imageId: id,
      maxStack,
      type: 'weapon',
      weight,
      stackable,
      consumable: false,
      price,
      usage: usageFunctions[id],
      weaponData: {
        ammoType: ammoType
      }
    }

    registerItem(item)
  })
}

const loadFoods = () => {
  FOODS_CONFIG.forEach((food: any[]) => {
    const [id, name, description, weight, maxStack, stackable, health, eat, water, price, hashObj, waitingUsage, anim] = food

    const item: ServerItem = {
      id: id,
      name,
      description,
      imageId: id,
      maxStack,
      type: 'food',
      weight,
      stackable,
      consumable: true,
      price,
      hashObj: hashObj,
      usage: usageFunctions[id],
      foodData: {
        healthRestore: health,
        eatRestore: eat,
        waterRestore: water,
        waitingUsage: waitingUsage,
        anim: anim,
      }
    }

    registerItem(item)
  })
}

export const initItems = () => {
  console.log(chalk.bgBlue('• ITEMS •') + chalk.blue(' Инициализация системы предметов...'))

  loadClothes()

  let totalClothesItems = 0
  itemsRegistry.forEach((item: any) => {
    if (item.type === 'clothes') totalClothesItems++
  })
  console.log(chalk.bgGreen('• ITEMS •') + chalk.green(` Всего загружено одежды: ${totalClothesItems} моделей с вариациями`))

  loadWeapons()
  console.log(chalk.bgGreen('• ITEMS •') + chalk.green(` Загружено оружия: ${WEAPONS_CONFIG.length}`))

  loadFoods()
  console.log(chalk.bgGreen('• ITEMS •') + chalk.green(` Загружено предметов питания: ${FOODS_CONFIG.length}`))

  console.log(chalk.bgGreen('• ITEMS •') + chalk.green(` Общее количество предметов загружено: ${itemsRegistry.size}`))
}

export const findClothesItem = (
  type: 'clothes' | 'props',
  gender: 'male' | 'female',
  sectionId: number,
  drawable: number,
  texture: number = 0
): ServerItem | undefined => {
  const uniqueId = generateClothesItemId(type, gender, sectionId, drawable, texture)
  return getItemById(uniqueId)
}

export const getItemByType = (type: string): ServerItem[] => {
  const items: ServerItem[] = []

  itemsRegistry.forEach((item: ServerItem) => {
    if (item.type === type) {
      items.push(item)
    }
  })

  return items
}

export const getAllItems = (): ServerItem[] => {
  return Array.from(itemsRegistry.values())
}

export const isBagItem = (itemId: number): boolean => {
  const item = getItemById(itemId)
  if (!item) return false

  return item.clothesData?.slot === 10 && item.clothesData?.maxWeight !== undefined
}

export const getBagMaxWeight = (itemId: number): number => {
  const item = getItemById(itemId)
  if (!item || !isBagItem(itemId)) return 0

  return item.clothesData?.maxWeight || 0
}

export const getItemImageIdForCef = (item: ServerItem): number => {
  if (item.type === 'clothes' && item.clothesData) {
    // Используем обновленный CLOTHES_IMAGE_IDS
    return CLOTHES_IMAGE_IDS[item.clothesData.slot as keyof typeof CLOTHES_IMAGE_IDS] || 0
  }
  return item.imageId
}