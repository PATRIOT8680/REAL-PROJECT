export const showCreateChar = (sid: number, numberSlot: number) => {
	return { type: 'SHOW_CREATE_CHAR', sid, numberSlot }
}

export const hideCreateChar = () => {
	return { type: 'HIDE_CREATE_CHAR' }
}