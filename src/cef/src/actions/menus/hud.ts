export const showHud = (speedometerVisible?: boolean) => {
  return { type: 'SHOW_HUD', speedometerVisible }
}

export const hideHud = () => {
  return { type: 'HIDE_HUD' }
}