import './assets/styles/compiled-css/Index.css'
import {rce} from "../../modules/rce.ts"
import {useState, useEffect, useRef, KeyboardEvent, useMemo} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer.ts";
import { Reports, IMsg } from "../AdminMenu/pages/Reports.tsx";
import { getDateTime } from "../../modules/dateTime.ts";

import svg_msg from './assets/img/msg-icon.svg'
import svg_user from "../AdminMenu/pages/assets/img/svg_user.svg";
import svg_admin from "../AdminMenu/pages/assets/img/svg_admin.svg";

const PlayerReports = () => {
  const [msgValue, setMsgValue] = useState<string>('')
  const [currentReportId, setCurrentReportId] = useState<number | null>(null)

  const reports = useSelector((state: RootState) => state.reportReducer.reports)
  const playerInfoReducer = useSelector((state: RootState) => state.playerInfoReducer)
  const listChatRef = useRef<HTMLDivElement | null>(null)

  const currentReport = useMemo(() => {
    if (!currentReportId) return null
    return reports.find(report => report.id === currentReportId) || null
  }, [currentReportId, reports])

  const reportForStatusCheck = useMemo(() => {
    if (!currentReportId) return null
    return reports.find(report => report.id === currentReportId) || null
  }, [currentReportId, reports])

  useEffect(() => {
    if (listChatRef.current && currentReport) {
      listChatRef.current.scrollTop = listChatRef.current.scrollHeight
    }
  }, [currentReport?.listMsg?.length])

  useEffect(() => {
    rce.triggerClient(JSON.stringify(reports))
  }, [reports])

  useEffect(() => {
    if (playerInfoReducer.nickname && Array.isArray(reports)) {
      const foundReport = reports.find(report =>
          report.listMsg.length > 0 &&
          report.listMsg[0].nickName === playerInfoReducer.nickname
      )
      setCurrentReportId(foundReport?.id || null)
    }
  }, [playerInfoReducer.nickname, reports])

  const handleCloseReportMenu = () => {
    rce.triggerClient('cef:closeReportMenu')
  }

  const handleDeleteReport = () => {
    if (currentReport) {
      const nickName = currentReport.listMsg[0].nickName
      rce.triggerServer('cef:report:deleteReport', currentReport.id, nickName)
    }

    setCurrentReportId(null)
  }

  const handleSendMsg = () => {
    if (msgValue) {
      if (currentReport) {
        rce.triggerServer('cef:report:addMsg', currentReport.id, {
          nickName: playerInfoReducer.nickname,
          text: msgValue,
          dateTime: getDateTime(),
          role: 'player',
        } )
      } else {
        rce.triggerServer('cef:report:createReport', {
          nickName: playerInfoReducer.nickname,
          text: msgValue,
          dateTime: getDateTime(),
          role: 'player',
        })
      }

      setMsgValue('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMsg()
    }
  }

  return (
    <>
      <div className="player-reports">
        <header>
          <div className="titles">
            <span className="title">Обращение к администрации</span>
            <span className="descr">
              {currentReport
                  ? `Ваше обращение #${currentReport.id}`
                  : 'Вы можете обратиться к администрации за помощью или задать нужный вопрос.'
              }
            </span>
          </div>
          <div className="right-btns">
            { currentReport && <span className="delete-report" onClick={handleDeleteReport}>Удалить обращение</span> }
            <span className="close" onClick={handleCloseReportMenu}>ESC</span>
          </div>
        </header>
        <div className="chat-container" ref={listChatRef}>
          { currentReport ? (
              <ul className="msg-list">
                { currentReport.listMsg
                    .slice()
                    .sort((a: IMsg, b: IMsg) => {
                      const aTime = a.dateTime.replace(/[-: ]/g, '')
                      const bTime = b.dateTime.replace(/[-: ]/g, '')
                      return aTime.localeCompare(bTime)
                    })
                    .map((msg: any, key: any) => {
                      const timeOnly = msg.dateTime.split(' - ')[1]?.slice(0, 5) || msg.dateTime

                      return (
                          <li className={`${msg.role}-msg`} key={key}>
                            <img src={msg.role === 'player' ? svg_user : svg_admin} className="avatar" />
                            <div className="main-info">
                              <div className="header-msg">
                                <span className="nickname">{msg.nickName}</span>
                                <span className="date-time">{timeOnly}</span>
                              </div>
                              <span className="msg-report">{msg.text}</span>
                            </div>
                          </li>
                      )
                    }) }
              </ul>
          ) : (
              <div className="nofound-report">
                <img src={svg_msg} alt="" />
                <span>Новое обращение</span>
                <p>Чтобы создать новое обращение, отправьте первое сообщение</p>
              </div>
          ) }
        </div>
        { (currentReportId && reportForStatusCheck && reportForStatusCheck.status !== 'reviewed') || !currentReportId ? (
            <div className="enter-block">
              <input
                  type='text'
                  value={msgValue}
                  autoFocus={true}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => setMsgValue(e.target.value)}
                  className='enter-cmd'
                  placeholder='Введите сообщение...'
              />

              { msgValue !== '' && (
                  <span className="enter-keyup" onClick={handleSendMsg}>ENTER</span>
              ) }
            </div>
        ) : (
            <span className="reviewed-warning">Ваш репорт рассмотрен. Если вы не согласны с администрацией, обратитесь на форум</span>
        ) }

      </div>
    </>
  )
}

export default PlayerReports