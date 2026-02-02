interface ITextParams {
  scale: [number, number],
  alpha: number,
  yOffset: number,
  relativeFactor: number
}

export const getDistanceFactor = (
  distance: number,
  maxDistance: number = 400,
  baseScale: number = 0.25
): ITextParams => {
  const clampedDist = Math.max(0.1, Math.min(distance, maxDistance))

  const factor = clampedDist / maxDistance
  const minRelative = 0.6
  const relativeScale = 1 - factor * 0.65
  const finalRelative = Math.max(minRelative, relativeScale)

  const alpha = Math.round(255 * (1 - factor * 0.4))

  const maxLift = 0.045
  const yOffset = maxLift * factor

  return {
    scale: [finalRelative * baseScale, finalRelative * baseScale],
    alpha,
    yOffset,
    relativeFactor: finalRelative
  }
}