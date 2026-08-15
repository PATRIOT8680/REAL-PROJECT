import './assets/styles/compiled-css/Whitelist.css'
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { rce } from "../../modules/rce.ts";

import Input from "../../components/Input/Input.tsx";
import MainBtn from "../../components/MainBtn/MainBtn.tsx";

const Whitelist = () => {
  const { submittedRequest } = useSelector((state: RootState) => state.whitelistReducer)
  const [discord, setDiscord] = useState<string>('')

  const handleSendRequest = () => {
    if (!discord) return window.App.sendNotifyReducer.sendNotify('err', 'Укажите свой дискорд!', 3200, 'top')

    rce.triggerServer('sendRequestWhitelist', discord)
    window.App.whitelistReducer.showWhitelist(true)
  }

  return (
    <div className="whitelist">
      <span className="title">Stop! whitelist</span>
      <p className="description">
        Сейчас проект находится в активной разработке.
        Мы тщательно готовим мир, экономику, бизнесы и правила, чтобы с первого дня всё работало качественно и атмосферно.
        Вайтлист открыт для тех, кто хочет принять участие в формировании сервера и готов играть в серьёзный ролевой проект.
        Если ты ответственный, любишь качественный RP и хочешь стать частью команды с самого начала — оставляй заявку.
        Мы внимательно рассмотрим каждую.
        Спасибо, что ждёшь вместе с нами.
      </p>

      { submittedRequest ? (
        <span className="warning-request">Вы подали заявку. Ожидайте</span>
      ) : (
        <>
          <Input
            type='text' value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder={'Ваш Discord'}
            maxLength={50}
          />
          <MainBtn text='Отправить заявку' onClick={handleSendRequest} nextIcon={false} textSize={0.9} />
        </>
      ) }
    </div>
  )
}

export default Whitelist