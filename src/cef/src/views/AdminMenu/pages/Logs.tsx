import './assets/styles/compiled-css/Logs.css'
import { useState } from "react";

import HeaderLogs from "./logs/components/Header.tsx";
import EconomicsContainer from "./logs/pages/Economics.tsx";
import ReportsContainer from "./logs/pages/Reports.tsx";

const LogsPage = () => {
  const [activeContainer, setActiveContainer] = useState<string>('economics');

  const renderActiveContainer = () => {
    switch (activeContainer) {
      case 'economics':
        return <EconomicsContainer />
      case 'reports':
        return <ReportsContainer />
    }
  }

  return (
    <div className='logs-page'>
      <HeaderLogs activeContainer={activeContainer} onContainerChange={setActiveContainer} />
      <hr style={{ width: '100%', opacity: '0.08' }} />
      { renderActiveContainer() }
    </div>
  )
}

export default LogsPage