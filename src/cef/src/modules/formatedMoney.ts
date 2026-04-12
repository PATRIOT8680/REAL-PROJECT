export const formatedMoney = (num: number): string => {
  const isInteger = Number.isInteger(num)

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
    useGrouping: true,
  }).format(num)
}