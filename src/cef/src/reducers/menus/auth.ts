export const authReducer = (state = { isVisible: false }, action: any) => {
	switch (action.type) {
		case 'SHOW_AUTH':
			return { isVisible: true }
		case 'HIDE_AUTH':
			return { isVisible: false }
		default:
			return state
	}
}