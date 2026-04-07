export const stripNonDigits = (value: string): string => value.replace(/\D/g, '')

export const displayFormatedPrice = (raw: string): string => {
  const digits = stripNonDigits(raw)
  if (!digits) return ''

  const number = parseInt(digits, 10)

  return `$${number.toLocaleString('de-DE')}`
}