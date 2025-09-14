import '../assets/styles/compiled-css/BtnNext.css'
import { ISelectChar } from "../../../actions/menus/select-char.ts"
import { FC } from "react"
import { rce } from "../../../modules/rce.ts";

interface IBtnNext {
  status: "active" | "free" | "donat" | "ban"
  char?: ISelectChar
}

const BtnNext: FC<IBtnNext> = ({ status, char }) => {
  const getBtnInfo = () => {
    switch (status) {
      case "active":
        return 'Начать играть'
      case "free":
        return 'Создать персонажа'
      case "donat":
        return 'Приобрести слот'
    }
  }

  const handleClickBtn = (status: "active" | "free" | "donat" | "ban", char?: ISelectChar) => {
    if (status === 'active') {
      rce.triggerServer('handleSpawnPlayer', char?.nickname, char?.numberChar)
    } else if (status === 'free') {
      rce.triggerServer('handleCreateSlotChar', char?.numberChar)
    } else if (status === 'donat') {
      rce.triggerServer('handleDonatCreatePlayer', char?.nickname)
    }
  }

  return (
    <>
      { status !== 'ban' &&
        <button className="btn-next"
          onClick={() => handleClickBtn(status, char)}
        >{ getBtnInfo() }</button> }
    </>
  )
}

export default BtnNext