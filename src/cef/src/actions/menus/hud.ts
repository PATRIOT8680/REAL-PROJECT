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

export const setBindsVisible = (visible: boolean) => {
  return { type: 'SET_BINDS_VISIBLE', visible}
}

export const setStreet = (street: string) => {
  return { type: 'SET_STREET', street }
}

export const setArea = (area: string) => {
  return { type: 'SET_AREA', area }
}

export const setHintVisible = (visible: boolean) => {
  return { type: 'SET_HINT_VISIBLE', visible }
}