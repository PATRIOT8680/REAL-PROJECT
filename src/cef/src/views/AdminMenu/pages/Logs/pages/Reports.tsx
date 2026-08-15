import './assets/styles/compiled-css/Reports.css'
import { rce } from "../../../../../modules/rce.ts";
import { useEffect, useState, useRef, useCallback } from "react";
import {IMsg, Reports} from "../../Reports.tsx";

import search_svg from './assets/img/search.svg'
import svg_user from "../../assets/img/svg_user.svg";
import svg_admin from "../../assets/img/svg_admin.svg";

const ReportsContainer = () => {
  const [selectReport, setSelectReport] = useState<number | null>(null)
  const [lastReportId, setLastReportId] = useState<number>(0)
  const [reportsData, setReportsData] = useState<Reports[] | null>(null)
  const [endList, setEndList] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const selectedReportData = reportsData?.find(report => report.id === selectReport)
  const listChatRef = useRef<HTMLUListElement | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const endMarkerRef = useRef<HTMLDivElement>(null)

<<<<<<< HEAD
  useEffect(() => {
    const fetchGetReports = async () => {
      try {
        let data = await rce.callServer('logs:getAllReports', lastReportId)
        setReportsData(data)
      } catch (error) {
        console.log(error)
        setReportsData([])
=======


  useEffect(() => {
    const fetchGetReports = async () => {
      console.log("1 fetch")
      try {
        console.log("2 fetch")
        let data = await rce.callServer('logs:getAllReports', lastReportId)
        console.log("3 fetch")
        setReportsData(data)
      } catch (error) {
        console.log("4 fetch")
        console.log(error)
        setReportsData([]) // Устанавливаем пустой массив при ошибке
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
      }
    }

    fetchGetReports()
<<<<<<< HEAD
=======
    console.log("5 fetch")
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
  }, [])

  useEffect(() => {
    if (listChatRef.current) {
      listChatRef.current.scrollTop = listChatRef.current.scrollHeight
    }
  }, [reportsData])

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !endList) {
            loadMoreReports()
            setEndList(true)
          } else if (!entry.isIntersecting && endList) {
            setEndList(false)
          }
        },
        { threshold: 0.1 }
    )

    if (endMarkerRef.current) {
      observer.observe(endMarkerRef.current)
    }

    return () => observer.disconnect()
  }, [endList, reportsData])

  const loadMoreReports = async () => {
    if (endList && reportsData === null) return

    const nextLastId = Math.min(...filteredReports.map(r => r.id))
    let newData = await rce.callServer('logs:getAllReports', nextLastId)
    setLastReportId(nextLastId)

    if (newData.length === 0) {
      setEndList(true)
    } else {
      setReportsData(prev => prev ? [...prev, ...newData] : newData)
    }
  }

  const getFilteredAndSortedReports = (): Reports[] => {
    if (!reportsData) return []

    let filtered = reportsData

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = reportsData.filter(report => {
        if (report.id.toString().includes(searchValue)) {
          return true
        }

        if (report.listMsg[0]?.nickName?.toLowerCase().includes(searchLower)) {
          return true
        }

        if (report.listMsg[0]?.dateTime?.includes(searchValue)) {
          return true
        }

        return false
      })
    }

    return filtered.sort((a, b) => b.id - a.id)
  }

  const filteredReports = getFilteredAndSortedReports()

  const clearSearch = () => {
    setSearchValue('')
  }

  const handleOpenReport = (idx: number) => {
    setSelectReport(idx)
  }

  const handleBackReport = () => {
    setSelectReport(null)
  }

  return (
      <div className="reports-container">
        { !selectReport ? (
            <>
              <div className="input-search">
                <img src={search_svg} />
                <input
                    type="text" className="search-report"
                    value={searchValue}
                    onChange={ (e) => setSearchValue(e.target.value) }
                    placeholder='Введите ID репорта / никнейм игрока / дату и время...'
                />
                {searchValue && (
                    <button className="clear-search" onClick={clearSearch}>×</button>
                )}
              </div>

              <ul className="list-reports" ref={listRef}>
                { filteredReports.map((report: Reports, key: number) => (
                  <li className="el-report" key={key}>
                    <div className="info">
                      <span id='id'>#{report.id}</span>
                      <span id='nickname'>{report.listMsg[0].nickName}</span>
                      <span id='datetime'>{report.listMsg[0].dateTime}</span>
                    </div>
                    <button
                      type="button"
                      className='open-report'
                      onClick={() => handleOpenReport(report.id)}
                    >
                      Открыть
                    </button>
                  </li>
                )) }
                { reportsData !== null && <div ref={endMarkerRef} style={{ height: '1px', flexShrink: 0 }} /> }
              </ul>
            </>
        ) : (
            <>
            <div className='chat-player'>
                   <div className="selected-report">
                     <header>
                       <div className="info-report">
                         <span className="name-report">Обращение от { selectedReportData?.listMsg[0].nickName }</span>
                         <span className="time-sended">{ selectedReportData?.listMsg[0].dateTime }</span>
                       </div>
                       <button className="back-report" onClick={handleBackReport}>Назад</button>

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
                           .map((msg: any, key) => {
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
                   </div>
              </div>
            </>
        ) }
      </div>
  )
}

export default ReportsContainer