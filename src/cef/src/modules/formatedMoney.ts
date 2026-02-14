export const formatedMoney = (num: number) => {
  return Intl.NumberFormat('ru-RU').format(num)
}