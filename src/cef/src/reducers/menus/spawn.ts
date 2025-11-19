export const spawnReducer = (state = { isVisible: false, selectedSlot: 1, nickName: '' }, action: any) => {
  switch (action.type) {
    case 'SHOW_SPAWN':
      return {
        isVisible: true,
        selectedSlot: action.selectedSlot,
        nickName: action.nickName,
      };
    case 'HIDE_SPAWN':
      return { isVisible: false }
    default:
      return state
  }
}