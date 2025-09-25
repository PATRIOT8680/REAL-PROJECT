import './assets/styles/compiled-css/Reports.css'
import { useState } from "react";

export interface IMsg {
  nickName: string,
  text: string,
  dateTime: string,
  role: 'player' | 'admin'
}

export interface Reports {
  id: number,
  listMsg: IMsg[],
  status: 'waiting' | 'taken',
  responder: string | null
}

const ReportsPage = () => {
  const [selectReport, setSelectReport] = useState<number | null>(null)

  const handleSelectReport = (idx: number) => {

  }

  return (
    <>
      <div className="reports-page">
        <div className="list-reports">
          <header className="text-block">
            <div className="line-text">
              <span>Список обращений</span>
              <span className="number-reports">47</span>
            </div>
            <p>Выберете репорт, чтобы открыть чат с игроком</p>
          </header>
          <div className="list">
            <div className="item-report">
              <header className="info-report">
                <span className="main">Репорт от Patriot Adminov</span>
                <span className="status" id='taken'>В работе</span>
              </header>
              <span className="text-player">Помогите стрельба в зеленой зоне больницы, айди  566</span>
              <span className="date-time">17.10.2025 17:45</span>
            </div>
          </div>
        </div>
        <div className="chat-player">
          <header className="info-player-rep">
            <span>Чат с William Blade</span>

          </header>
        </div>
      </div>
    </>
  )
}

export default ReportsPage