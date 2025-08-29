import { ISelectChar } from "../../actions/menus/select-char";

export interface SelectCharState {
  isVisible: boolean
  char1: ISelectChar
  char2: ISelectChar
  char3: ISelectChar
  char4: ISelectChar
  char5: ISelectChar
}

const initialState: SelectCharState = { 
  isVisible: false,
  char1: { status: "active", nickname: 'William Blade' },
  char2: { status: "free" },
  char3: { status: "ban", nickname: 'Max Wilson' },
  char4: { status: "donat" },
  char5: { status: "donat" },
};

export const selectCharReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case 'SHOW_SELECT_CHAR':
			return { 
        isVisible: true, 
        char1: action.char1 || { status: action.status },
        char2: action.char2 || { status: action.status },
        char3: action.char3 || { status: action.status },
        char4: action.char4 || { status: action.status },
        char5: action.char5 || { status: action.status }
      }
		case 'HIDE_SELECT_CHAR':
			return { 
        isVisible: false,
        char1: { status: action.status },
        char2: { status: action.status },
        char3: { status: action.status },
        char4: { status: action.status },
        char5: { status: action.status }
      }
		default:
			return state
	}
}