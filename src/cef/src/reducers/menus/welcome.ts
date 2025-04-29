export const welcomeReducer = (state = { isVisible: false }, action: any) => {
	switch (action.type) {
		case 'SHOW_WELCOME':
			return { isVisible: true }
		case 'HIDE_WELCOME':
			return { isVisible: false }
		default:
			return state
	}
}