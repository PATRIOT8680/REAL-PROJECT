import { rce } from "../utils/rce";
import { getBusiness } from "./manager";
import { connectedUsers } from "../data/dataConnectedUser";
import { addCash, decrementCash } from "../data/char/cash";
import { addBankMoney, decrementBankMoney } from "../data/char/bankMoney";

export const processSale = (businessId: number, totalSaleAmount: number) => {
  const business = getBusiness(businessId)
  if (!business || totalSaleAmount <= 0) return

  const totalIncome = Number(totalSaleAmount.toFixed(2))
  const expenses = Number((totalIncome * 0.3).toFixed(2))

  business.balance += totalIncome
  business.balance = Number(business.balance.toFixed(2))
  business.updatedAt = new Date()
}

export const withdrawMoney = async (player: PlayerMp, typePayment: string, businessId: number, amount: number) => {
  const business = getBusiness(businessId)
  const uid = connectedUsers.getField(player.id, 'uid')

  if (!business) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Бизнес не найден!', 3200, 'top')
    return
  }

  if (business.owner !== uid.toString()) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Вы не владелец бизнеса!', 3200, 'top')
    return
  }

  const withdrawAmount = Math.min(amount, business.balance)
  if (withdrawAmount <= 0) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Недостаточно средств!', 3200, 'top')
    return
  }

  if (typePayment === 'cash') {
    await addCash(player, uid, amount)
  } else if (typePayment === 'bankmoney') await addBankMoney(player, uid, amount)

  business.balance -= withdrawAmount
  business.balance = Number(business.balance.toFixed(2))
  business.updatedAt = new Date()
}

export const depositMoney = async (player: PlayerMp, typePayment: string, businessId: number, amount: number) => {
  const business = getBusiness(businessId)
  const uid = connectedUsers.getField(player.id, 'uid')
  const currentCash = connectedUsers.getField(player.id, 'cash')
  const currentBankMoney = connectedUsers.getField(player.id, 'bankmoney')

  if (!business) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Бизнес не найден!', 3200, 'top')
    return
  }

  if (business.owner !== uid.toString()) {
    rce.triggerClient(player, 'sendNotify', 'err', 'Вы не владелец бизнеса!', 3200, 'top')
    return
  }

  const money = typePayment === 'cash' ? currentCash : currentBankMoney
  if (money < amount) {
    rce.triggerClient(player, 'sendNotify', 'err', `У вас недостаточно средств! ($${amount-money})`, 3800, 'top')
    return
  }

  if (typePayment === 'cash') {
    await decrementCash(player, uid, amount)
  } else if (typePayment === 'bankmoney') await decrementBankMoney(player, uid, amount)

  business.balance += amount
  business.balance = Number(business.balance.toFixed(2))
  business.updatedAt = new Date()
}