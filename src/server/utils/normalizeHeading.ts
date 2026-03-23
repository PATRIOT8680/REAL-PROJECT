export const normalizeHeading = (deg: number): number => {
  let h = ((deg % 360) + 360) % 360
  if (h > 180) h -= 360
  return h
}