import { rce } from "../utils/rce";
import { BusinessData, BusinessOwner, CreateBusinessDto, BusinessNames, BusinessType } from "./types";
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

export const initBusinessSystem = async (): Promise<void> => {
  await loadBusinesses()
  console.log(chalk.green('[UPLOADED BUSINESSES]') + ` Загружено ${businesses.size} бизнесов`)
}

const loadBusinesses = async (): Promise<void> => {
  try {
    const [rows]: any = await db.query(`SELECT * FROM businesses`)
    businesses.clear()

    rows.forEach((row: any) => {
      const nameBusiness = BusinessType[row.type]
      const pos = new mp.Vector3(JSON.parse(row.position))

      const business: BusinessData = {
        id: row.id,
        owner: typeof row.owner === 'number' ? row.owner.toString() : row.owner,
        type: row.type,
        name: nameBusiness,
        price: row.price,
        markup: row.markup ?? 0.00,
        balance: row.balance ?? 0,
        position: pos,
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
      (type, owner, price, position, balance, markup, taxAccumulated, lastHourlyExpense, taxDeadline, lastBalanceZero)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      dto.type,
      typeof owner === 'number' ? owner.toString() : owner,
      dto.price,
      JSON.stringify(dto.position),
      0,
      markup,
      0,
      now,
      new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      null
    ])

    const insertId = (result as mysql.ResultSetHeader).insertId

    const newBusiness: BusinessData = {
      id: insertId,
      owner: typeof owner === 'number' ? owner.toString() : owner,
      type: dto.type,
      name: nameBusiness,
      price: dto.price,
      markup: dto.markup ?? 0.00,
      balance: 0,
      position: dto.position,
      taxAccumulated: 0,
      lastHourlyExpense: now,
      taxDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      lastBalanceZero: null,
      createdAt: now,
      updatedAt: now,
    }

    mp.markers.new(20, dto.position, 0.75, {
      color: [229, 255, 173, 255],
      dimension: 0,
      rotation: new mp.Vector3(0, 180, 0)
    })

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