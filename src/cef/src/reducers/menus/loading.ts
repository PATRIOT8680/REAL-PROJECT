export const loadingReducer = (state = { isVisible: false, duration: 0 }, action: any) => {
	switch (action.type) {
		case 'SHOW_LOADING':
			return { isVisible: true, duration: action.payload }
		case 'HIDE_LOADING':
			return { isVisible: false, duration: 0 }
		default:
			return state
	}
}