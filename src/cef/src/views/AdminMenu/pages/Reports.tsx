import './assets/styles/compiled-css/Reports.css'
import {useState, useEffect, useRef, KeyboardEvent} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer.ts";
import { rce } from "../../../modules/rce.ts";

import svg_selectedReport from './assets/img/selectedReport.svg'
import svg_user from './assets/img/svg_user.svg'
import svg_admin from './assets/img/svg_admin.svg'
import {getDateTime} from "../../../modules/dateTime.ts";

export interface IMsg {
  nickName: string,
  text: string,
  dateTime: string,
  role: 'player' | 'admin'
}

export interface Reports {
  id: number,
  listMsg: IMsg[],
  status: 'waiting' | 'taken' | 'reviewed',
  responder: string | undefined,
}

const ReportsPage = () => {
  const [selectReport, setSelectReport] = useState<number | null>(null)
  const [sendMsg, setSendMsg] = useState<string>('')
  const reports = useSelector((state: RootState) => state.reportReducer.reports)

  const listChatRef = useRef<HTMLUListElement | null>(null)
  const selectedReportData = selectReport !== null ? reports.find(report => report.id === selectReport) : null
  const playerInfoReducer = useSelector((state: RootState) => state.playerInfoReducer)

  const sortedReports = [...reports].sort((a, b) => {
    if (a.status === 'reviewed' && b.status !== 'reviewed') return 1
    if (a.status !== 'reviewed' && b.status === 'reviewed') return -1

    const parseDateTime = (dateTimeStr: string) => {
      const [datePart, timePart] = dateTimeStr.split(' - ')
      const [day, month, year] = datePart.split('.').map(Number)
      const [hours, minutes, seconds] = timePart.split(':').map(Number)

      return new Date(year, month - 1, day, hours, minutes, seconds)
    }

    const dateA = parseDateTime(a.listMsg[0].dateTime)
    const dateB = parseDateTime(b.listMsg[0].dateTime)

    return dateA.getTime() - dateB.getTime()
  })

  useEffect(() => {
    if (playerInfoReducer.nickname && reports.length > 0) {
      const foundReport = reports.find(report =>
          report.responder === playerInfoReducer.nickname
      )

      if (foundReport) {
        setSelectReport(foundReport.id)
      }
    }
  }, [])

  useEffect(() => {
    if (listChatRef.current) {
      listChatRef.current.scrollTop = listChatRef.current.scrollHeight
    }
  }, [selectedReportData])

  const getStatusText = (status: 'waiting' | 'taken' | 'reviewed') => {
    switch (status) {
      case 'waiting':
        return 'Ожидание'
      case 'taken':
        return 'В работе'
      case 'reviewed':
        return 'Рассмотрен'
    }
  }

  const handleSelectReport = (idx: number) => {
    if (reports[idx - 1]?.status === 'taken' && reports[idx - 1].responder !== playerInfoReducer.nickname) {
      return window.App.sendNotifyReducer.sendNotify('err', 'Этот репорт рассматривает другой администратор!', 3500, 'top')
    }

    if (reports[idx - 1]?.status === 'reviewed') {
      setSelectReport(idx)
      return
    }

    const nickName = reports[idx - 1]?.listMsg?.[0]?.nickName
    if (nickName) {
      rce.triggerServer('cef:amenu:selectReport', idx, nickName, playerInfoReducer.nickname)
      setSelectReport(idx)
    }
  }

  const handleDelayReport = () => {
    if (selectReport !== null) {
      const nickName = reports[selectReport - 1]?.listMsg?.[0]?.nickName
      if (nickName) {
        rce.triggerServer('cef:amenu:delayReport', selectReport, nickName)
      }

      setSelectReport(null)
    }
  }

  const handleCloseReport = () => {
    if (selectReport !== null) {
      const nickName = reports[selectReport - 1]?.listMsg?.[0]?.nickName
      if (nickName) {
        rce.triggerServer('cef:amenu:closeReport', selectReport, nickName)
      }
      setSelectReport(null)
    }
  }

  const handleSendMsg = async () => {
    if (selectReport !== null) {
      const nickName = reports[selectReport - 1]?.listMsg?.[0]?.nickName
      if (nickName) {
        rce.triggerServer('cef:amenu:sendAMsg', selectReport, {
          nickName: playerInfoReducer.nickname,
          text: sendMsg,
          dateTime: await getDateTime(),
          role: 'admin',
        } )
      }
      setSendMsg('')
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
      <div className="reports-page">
        <div className="list-reports">
          <header className="text-block">
            <div className="line-text">
              <span>Список обращений</span>
              <span className="number-reports">{ reports.length }</span>
            </div>
            <p>{reports.length > 0 ? 'Выберите репорт, чтобы открыть чат с игроком' : 'Ожидайте поступления новых репортов от игроков'}</p>
          </header>
          { reports.length > 0 ? (
              <ul className="list">
                { sortedReports.map((item: Reports, idx: number) => (
                    <li
                      className={`item-report ${item.id === selectReport ? `selected` : ''}`}
                      onClick={() => handleSelectReport(item.id)}
                      style={ item.status === 'reviewed' ? {
                        opacity: 0.7
                      } : {} }
                      key={idx}
                    >
                      <header className="info-report">
                        <span className="main">Репорт от {item.listMsg[0].nickName}</span>
                        <span className="status" id={item.status}>{ getStatusText(item.status) }</span>
                      </header>
                      <span className="text-player">
                  {item.listMsg[0].text.length > 100 ? `${item.listMsg[0].text.slice(0, 100)}...` : `${item.listMsg[0].text}`}
                </span>
                      <span className="date-time">{item.listMsg[0].dateTime}</span>
                    </li>
                )) }
              </ul>
          ) : (
              <span className="nofound-reports">Репорты отсутствуют! Ожидайте...</span>
          ) }

        </div>
        <hr style={{ height: '100%', opacity: '0.05' }} />
        <div className={`chat-player ${selectReport ? '' : 'noSelect'}`}>
          { selectReport ? (
              <div className="selected-report">
                <header>
                  <div className="info-report">
                    <span className="name-report">Обращение от {reports[selectReport - 1].listMsg[0].nickName}</span>
                    <span className="time-sended">{reports[selectReport - 1].listMsg[0].dateTime}</span>
                  </div>
                  { reports[selectReport - 1].status !== 'reviewed' && (
                      <div className="btns-action">
                        <button className="close-report" onClick={handleCloseReport}>Завершить</button>
                        <button className="put-report" onClick={handleDelayReport}>Отложить</button>
                      </div>
                  ) }

                </header>
                <hr style={{ width: '100%', opacity: '0.08' }} />
                <ul className="list-chat" ref={listChatRef}>
                  { selectedReportData?.listMsg
                      .slice()
                      .sort((a: IMsg, b: IMsg) => {
                        const aTime = a.dateTime.replace(/[-: ]/g, '')
                        const bTime = b.dateTime.replace(/[-: ]/g, '')
                        return aTime.localeCompare(bTime)
                      })
                      .map((msg: any) => {
                        const timeOnly = msg.dateTime.split(' - ')[1]?.slice(0, 5) || msg.dateTime

                        return (
                          <li className={`${msg.role}-msg`}>
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

                { reports[selectReport - 1].status !== 'reviewed' && (
                    <div className="enter-block">
                      <input
                          type='text'
                          className='enter-cmd'
                          value={sendMsg}
                          onKeyDown={handleKeyPress}
                          onChange={(e: any) => setSendMsg(e.target.value)}
                          placeholder='Введите текст...'
                      />

                      { sendMsg !== '' && (
                          <span className="enter-keyup" onClick={handleSendMsg}>ENTER</span>
                      ) }
                    </div>
                ) }

              </div>
          ) : (
            <div className="noselect-chat">
              <img src={svg_selectedReport} className="icon-cursor"/>
              <span className="title">Выберите репорт</span>
              <p className="descr">Чтобы открыть чат с игроком, выберите слева репорт</p>
            </div>
          ) }
        </div>
      </div>
    </>
  )
}

export default ReportsPage