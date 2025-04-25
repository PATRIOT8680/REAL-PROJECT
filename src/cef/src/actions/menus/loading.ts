export const showLoading = (duration: number) => {
	return { type: 'SHOW_LOADING', payload: duration };
}

export const hideLoading = () => {
	return { type: 'HIDE_LOADING' }
}