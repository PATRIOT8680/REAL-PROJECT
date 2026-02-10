const initialState = {
  isVisible: false,
  title: 'Обмен',
  description: 'Гражданин #1234 предлагает вам обмен',
  duration: 7000
}

export const offerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SHOW_OFFER':
      return {
        isVisible: true,
        title: action.title,
        description: action.description,
        duration: action.duration,
      }
    case 'HIDE_OFFER':
      return {
        isVisible: false,
        title: '',
        description: '',
        duration: 0
      }
    default:
      return state
  }
}