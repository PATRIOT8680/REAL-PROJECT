import { rce } from "../utils/rce";
import { BusinessData, BusinessOwner, CreateBusinessDto, BusinessNames, BusinessType } from "./types";
import { data } from "../database/mysql";
import * as mysql from "mysql2";
import chalk from "chalk";

const db = data.promise()
const businesses = new Map<number, BusinessData>()

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
        createdAt: row.createdAt,
      }

      mp.markers.new(20, pos, 1, {
        color: [229, 255, 173, 255],
        dimension: 0,
      })

      businesses.set(row.id, business)
    })
  } catch (e) {
    console.log(chalk.red('[LOAD BUSINESS]') + ` Ошибка загрузки бизнеса: ${e}`)
  }
}

export const createBusiness = async (
  dto: CreateBusinessDto,
  owner: BusinessOwner = 'gov'
): Promise<BusinessData | null> => {

  const nameBusiness = BusinessType[dto.type]

  try {
    const markup = dto.markup ?? 0.00

    const [result] = await db.execute(`
      INSERT INTO businesses
      (type, owner, price, position, balance, markup)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      dto.type,
      typeof owner === 'number' ? owner.toString() : owner,
      dto.price,
      JSON.stringify(dto.position),
      0,
      markup
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
      createdAt: new Date(),
    }

    mp.markers.new(20, dto.position, 1, {
      color: [229, 255, 173, 255],
      dimension: 0,
    })

    businesses.set(insertId, newBusiness)
    console.log(chalk.green('[BUSINESS]') + ` Создан новый бизнес "${nameBusiness}" (ID: ${insertId})`)
    return newBusiness
  } catch (e) {
    console.log(chalk.red('[BUSINESS]') + ` Ошибка при создании бизнеса: ${e}`)
    return null
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