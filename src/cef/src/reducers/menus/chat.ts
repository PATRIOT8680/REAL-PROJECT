export const chatReducer = (state = { isVisible: false }, action: any) => {
	switch (action.type) {
		case 'SHOW_CHAT':
			return { isVisible: true }
		case 'HIDE_CHAT':
			return { isVisible: false }
		default:
			return state
	}
}