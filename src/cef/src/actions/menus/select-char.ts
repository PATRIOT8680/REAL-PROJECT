export interface ISelectChar {
  status: "active" | "free" | "donat" | "ban",
  numberChar?: number,
  nickname?: string
}

export const showSelectChar = (
    char1: ISelectChar, char2: ISelectChar, char3: ISelectChar, char4: ISelectChar, char5: ISelectChar,
) => {
	return { type: 'SHOW_SELECT_CHAR', char1, char2, char3, char4, char5 }
}

export const hideSelectChar = () => {
	return { type: 'HIDE_SELECT_CHAR' }
}