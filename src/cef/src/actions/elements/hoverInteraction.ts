export const visibleHover = (isVisible: boolean) => {
  return { type: 'VISIBLE_HOVER_INTERACTION', isVisible }
}

export const setHover = () => {
  return { type: 'SET_HOVER_INTERACTION' }
}

export const removeHover = () => {
  return { type: 'REMOVE_HOVER_INTERACTION' }
}