export const showHud = (
  speedometerVisible?: boolean,
  rightX?: number,
  leftX?: number,
  topY?: number,
  bottomY?: number,
  width?: number,
  height?: number,
) => {
  return { type: 'SHOW_HUD', speedometerVisible, rightX, leftX, topY, bottomY, width, height }
}

export const hideHud = () => {
  return { type: 'HIDE_HUD' }
}