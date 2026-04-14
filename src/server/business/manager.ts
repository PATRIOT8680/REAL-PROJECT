import { rce } from "../utils/rce";
import { BusinessData, BusinessOwner, CreateBusinessDto, BusinessNames, BusinessType } from "./types";
import { connectedUsers } from "../data/dataConnectedUser";
import { data } from "../database/mysql";
import * as mysql from "mysql2";
import chalk from "chalk";

const db = data.promise()
const businesses = new Map<number, BusinessData>()

rce.registerCef('createBusiness', (player: PlayerMp, data) => {
  const pos = player.position

  const dto = {
    type: data.type,
    position: new mp.Vector3(pos.x, pos.y, pos.z),
    price: data.price,
    balance: data.balance,
    markup: data.markup,
  }

  createBusiness(dto, data.owner)
})

mp.events.add('playerEnterColshape', (player: PlayerMp, colshape: ColshapeMp) => {
  if (!player.vehicle) {
    const businessData = Array.from(businesses.values()).find((b: BusinessData) => colshape.id === b.colshapeId)

    if (businessData) {
      rce.triggerClient(player, 'execute', 'window.App.hudReducer.setHintVisible(true)')

      rce.triggerClient(player, 'businessColshape', 'enabled', {
        id: businessData.id,
        name: businessData.name,
        owner: businessData.owner,
        price: businessData.price,
        markup: businessData.markup
      })
    }
  }
})

mp.events.add('playerExitColshape', (player: PlayerMp, colshape: ColshapeMp) => {
  const businessData = Array.from(businesses.values()).find((b: BusinessData) => colshape.id === b.colshapeId)

  if (businessData) {
    rce.triggerClient(player, 'execute', 'window.App.hudReducer.setHintVisible(false)')
    rce.triggerClient(player, 'businessColshape', 'disabled', {})
  }
})

mp.events.add('playerJoin', (player: PlayerMp) => {
  businesses.forEach((business: BusinessData) => {
    const pos = business.position

    rce.triggerClient(player, 'createLabel',
      `Бизнес #${business.id}`,
      { x: pos.x, y: pos.y, z: pos.z + 0.6 },
      7, 5.0, [229, 255, 173, 200], 0
    )
  })
})

export const initBusinessSystem = async (): Promise<void> => {
  await loadBusinesses()
  console.log(chalk.green('[UPLOADED BUSINESSES]') + ` Загружено ${businesses.size} бизнесов`)
}

const loadBusinesses = async (): Promise<void> => {
  try {
    const [rows]: any = await db.query(`SELECT * FROM businesses`)
    businesses.clear()

    rows.forEach((row: any) => {
      const nameBusiness = BusinessNames[row.type as BusinessType]
      const pos = new mp.Vector3(JSON.parse(row.position))

      const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.2, 0)

      const business: BusinessData = {
        id: row.id,
        owner: typeof row.owner === 'number' ? row.owner.toString() : row.owner,
        type: row.type,
        name: nameBusiness,
        price: row.price,
        markup: row.markup ?? 0.00,
        balance: row.balance ?? 0,
        position: pos,
        colshapeId: colshape.id,
        taxAccumulated: Number(row.taxAccumulated || 0),
        lastHourlyExpense: new Date(row.lastHourlyExpense || Date.now()),
        taxDeadline: new Date(row.taxDeadline || Date.now()),
        lastBalanceZero: row.lastBalanceZero ? new Date(row.lastBalanceZero) : null,
        createdAt: row.createdAt,
        updatedAt: row.updateAt
      }

      mp.markers.new(20, pos, 0.75, {
        color: [229, 255, 173, 255],
        dimension: 0,
        rotation: new mp.Vector3(0, 180, 0)
      })

      rce.triggerClients('createLabel',
        `Бизнес #${row.id}`,
        { x: pos.x, y: pos.y, z: pos.z + 0.6 },
        7, 5.0, [229, 255, 173, 200], 0
      )

      businesses.set(row.id, business)
    })
  } catch (e) {
    console.log(chalk.red('[UPLOADED BUSINESS]') + ` Ошибка загрузки бизнеса: ${e}`)
  }
}

export const createBusiness = async (
  dto: CreateBusinessDto,
  owner: BusinessOwner = 'gov'
): Promise<void> => {

  const nameBusiness = BusinessNames[dto.type as BusinessType]

  try {
    const markup = dto.markup ?? 0.00
    const now = new Date()

    const [result] = await db.execute(`
      INSERT INTO businesses
      (type, owner, price, position, balance, markup, taxAccumulated, lastHourlyExpense, taxDeadline, lastBalanceZero, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      dto.type,
      typeof owner === 'number' ? owner.toString() : owner,
      dto.price,
      JSON.stringify(dto.position),
      dto.balance,
      markup,
      0,
      now,
      new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      null,
      new Date()
    ])

    const pos = dto.position
    const insertId = (result as mysql.ResultSetHeader).insertId
    const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.2, 0)

    const newBusiness: BusinessData = {
      id: insertId,
      owner: typeof owner === 'number' ? owner.toString() : owner,
      type: dto.type,
      name: nameBusiness,
      price: dto.price,
      markup: dto.markup ?? 0.00,
      balance: 0,
      position: pos,
      colshapeId: colshape.id,
      taxAccumulated: 0,
      lastHourlyExpense: now,
      taxDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      lastBalanceZero: null,
      createdAt: now,
      updatedAt: now,
    }

    mp.markers.new(20, pos, 0.75, {
      color: [229, 255, 173, 255],
      dimension: 0,
      rotation: new mp.Vector3(0, 180, 0)
    })

    rce.triggerClients('createLabel',
      `Бизнес #${insertId}`,
      { x: pos.x, y: pos.y, z: pos.z + 0.6 },
      7, 5.0, [229, 255, 173, 200], 0
    )

    businesses.set(insertId, newBusiness)
    console.log(chalk.green('[BUSINESS]') + ` Создан новый бизнес "${nameBusiness}" (ID: ${insertId})`)
  } catch (e) {
    console.log(chalk.red('[BUSINESS]') + ` Ошибка при создании бизнеса: ${e}`)
  }
}

export const getBusiness = (id: number): BusinessData | undefined => {
  return businesses.get(id)
}

export const getBusinessByOwner = (owner: BusinessOwner): BusinessData[] => {
  const ownerStr = typeof owner === 'number' ? owner.toString() : owner
  return Array.from(businesses.values()).filter(b => b.owner === ownerStr)
}

export const getAllBusiness = (): BusinessData[] => {
  return Array.from(businesses.values())
}