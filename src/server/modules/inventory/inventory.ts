// inventory.ts
import { data } from "../../database/mysql";
import { calcWeightSlots, sendInventoryToCef } from "./inventoryHandlers";
import { generateClothesItemId } from "./items";
import chalk from "chalk";


export const createInventoryForChar = async (player: PlayerMp, uid: number, sid: number) => {
  try {
    const mainSlots = Array(20).fill(null)

    mainSlots[0] = { id: 1, quantity: 1 }
    mainSlots[1] = { id: 2, quantity: 2 }
    mainSlots[2] = { id: 500, quantity: 1 }
    mainSlots[3] = { id: 570, quantity: 2 }

    let slotIndex = 4

    mainSlots[slotIndex++] = { id: generateClothesItemId('props', 'male', 0, 0, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('props', 'male', 2, 10, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 1, 1, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('props', 'male', 1, 2, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('props', 'male', 6, 0, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 11, 0, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 3, 16, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 9, 1, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 11, 3, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 5, 40, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 4, 0, 0), quantity: 1 }
    mainSlots[slotIndex++] = { id: generateClothesItemId('clothes', 'male', 6, 1, 0), quantity: 1 }

    const donateSlotsObj = {
      have: false,
      slots: Array(15).fill(null)
    }

    const clothesSlots = Array(12).fill(null)
    const fastSlots = Array(4).fill(null)

    let totalWeight = 0

    totalWeight += calcWeightSlots(mainSlots)
    totalWeight += calcWeightSlots(donateSlotsObj.slots)
    totalWeight += calcWeightSlots(clothesSlots)

    const maxWeight = 20

    const sql = `
      INSERT INTO inventory (uid, sid, mainslots, donatslots, clothesslots, fastslots, weight, maxweight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    data.query(sql, [
      uid,
      sid,
      JSON.stringify(mainSlots),
      JSON.stringify(donateSlotsObj),
      JSON.stringify(clothesSlots),
      JSON.stringify(fastSlots),
      parseFloat(totalWeight.toFixed(2)),
      maxWeight
    ], (err, results) => {
      if (err) {
        console.log(chalk.bgRed('• CREATE INVENTORY •') + chalk.red(` ${err}`))
      } else {
        console.log(chalk.green(`Начальный вес: ${totalWeight.toFixed(2)} / ${maxWeight}`));

        if (player) {
          sendInventoryToCef(player, uid)
        }
      }
    })
  } catch (e) {
    console.log(chalk.bgRed('• CREATE INVENTORY [try] •') + chalk.red(` ${e}`))
  }
}