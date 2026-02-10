export const showInteraction = (typeEntity: 'player' | 'vehicle', targetId: number | null) => {
  return { type: 'SHOW_INTERACTION', typeEntity, targetId }
}

export const hideInteraction = () => {
  return { type: 'HIDE_INTERACTION' }
}