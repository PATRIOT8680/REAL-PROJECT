export const showDeath = (killer: string, instant: 'finish' | 'reborn' | null) => {
	return { type: 'SHOW_DEATH', killer, instant }
}

export const hideDeath = () => {
	return { type: 'HIDE_DEATH' }
}

export const selectFateDeath = (fate: 'ems' | 'death' | null) => {
  return { type: 'SELECT_FATE', fate }
}

export const getFateDeath = () => {
  return { type: 'GET_FATE' }
}

export const setInstant = (instant: 'finish' | 'reborn' | null) => {
  return { type: 'SET_INSTANT', instant }
}