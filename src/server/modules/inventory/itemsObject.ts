import { rce } from "../../utils/rce";
import { getItemById } from "./items";
import { ServerItem } from "../../../shared/types/items";
import { data } from "../../database/mysql";
import { addItemToInventory, sendInventoryToCef, addCustomItemToInventory } from "./inventoryHandlers";
import { connectedUsers } from "../../data/dataConnectedUser";
import { playAnim } from "../../utils/playAnim";
import chalk from "chalk";


const itemsWorld = new Map<number, {
  item: ServerItem,
  quantity: number,
  position: Vector3,
}>()

const createObjInWorld = (item: any, value: number, posObj: Vector3, dimension: number) => {
  const hash = item.hashObj || getItemById(item.id)?.hashObj || 0
  const obj = mp.objects.new(hash, posObj, {
    dimension,
    alpha: 255
  })
  itemsWorld.set(obj.id, {
    item,
    quantity: value,
    position: posObj
  })
  return obj
}

export const dropItemOnGround = async (player: PlayerMp, itemData: any) => {
  const randomAngle = Math.random() * 2 * Math.PI
  const distance = 0.5 + Math.random() * 1
  const offsetX = Math.cos(randomAngle) * distance
  const offsetY = Math.sin(randomAngle) * distance

  const getGroundZ = await rce.callClient(player, 'getGroundZ')

  const posObj = new mp.Vector3(
    player.position.x + offsetX,
    player.position.y + offsetY,
    getGroundZ + 0.02
  )

  const newObj: ObjectMp = createObjInWorld(itemData, itemData.quantity, posObj, player.dimension)

  try {
    const sql = 'INSERT INTO items(id, item, quantity, position, dimension) VALUES (?, ?, ?, ?, ?)'
    data.query(sql, [newObj.id, JSON.stringify(itemData), itemData.quantity, JSON.stringify(posObj), player.dimension], (err) => {
      if (err) console.log(chalk.red('[DROP ITEM]') + ` Insert in DB: ${err}`)
      else rce.triggerClients('droppedItemOnGround', itemData, newObj.id, posObj, itemData.quantity)
    })
  } catch (e) {
    console.log(chalk.red('[DROP ITEM]') + ` Insert in DB (gl): ${e}`)
  }
}

export const loadItems = () => {
  try {
    const sql = 'SELECT * FROM items'

    data.query(sql, [], (err, results: any) => {
      if (err) {
        console.log(chalk.red('[LOAD ITEMS]') + ` Load from DB: ${err}`)
        return
      }

      let loadedCount = 0

      for (const obj of results) {
        const id = obj.id
        const item = JSON.parse(obj.item)
        const quantity = obj.quantity
        const pos = JSON.parse(obj.position)
        const dimension = obj.dimension

        itemsWorld.set(id, {item, quantity, position: pos})
        createObjInWorld(item, quantity, pos, dimension)
        loadedCount++
      }

      console.log(chalk.green('[ITEMS]') + ` Загружено объектов в мире: ${loadedCount}`)
    })
  } catch (e) {
    console.log(chalk.red('[LOAD ITEMS]') + ` Load err: ${e}`)
  }
}

rce.registerClient('pickUpItem', async (player: PlayerMp, objId: number, item: ServerItem, value: number) => {
  const uid = connectedUsers.getField(player.id, 'uid')
  if (!uid) return { status: 'denied' }

  const obj = itemsWorld.get(objId)
  if (!obj) return { status: 'destroyItem', text: 'Предмет уже подобран!' }

  const customItem = {
    id: item.id,
    amount: value,
    name: item.name,
    description: item.description,
    keyData: item.keyData,
  }

  const resultAdd = await addCustomItemToInventory(uid, customItem)
  if (!resultAdd.success) return { status: 'denied', text: resultAdd.reason || 'Не удалось подобрать!' }

  const entityObj = mp.objects.at(objId)
  entityObj.destroy()
  itemsWorld.delete(objId)

  playAnim(player, 'pickup_object', 'pickup_low', 39, 2000)

  try {
    await new Promise<void>((resolve, reject) => {
      const sql = 'DELETE FROM items WHERE id = ?'
      data.query(sql, [objId], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
    await sendInventoryToCef(player, uid)
    return { status: 'approved' }
  } catch (e) {
    console.log(chalk.red('[PICK UP ITEM]') + ` ${e}`)
  }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
  if (itemsWorld.size > 0) {
    itemsWorld.forEach((objData, objId) => {
      rce.triggerClient(player, 'droppedItemOnGround', objData.item, objId, objData.position, objData.quantity)
    })
  }
})