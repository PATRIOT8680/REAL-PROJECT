import './assets/styles/compiled-css/Index.css'
import { useState, useCallback, useEffect } from "react";
import { rce } from "../../modules/rce.ts";

import Header from './components/Header'
import ConsolePage from "./pages/Console.tsx";
import ReportsPage from "./pages/Reports.tsx";
import VehiclesPage from "./pages/Vehicles.tsx";
import PlayersPage from "./pages/Players.tsx";
import FractionsPage from "./pages/Fractions.tsx";
import HomesPage from "./pages/Homes.tsx";
import LogsPage from "./pages/Logs.tsx";

const AdminMenu = () => {
  const pages = ['console', 'reports', 'vehicles', 'players', 'fractions', 'homes']
  const [activePage, setActivePage] = useState<string>('console')

  const handleSelectPage = useCallback((menu: string) => {
    setActivePage(menu)
  }, [])

  const handleCloseAMenu = () => {
    rce.triggerClient('closeAMenu')
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'console':
        return <ConsolePage />
      case 'reports':
        return <ReportsPage />
      case 'vehicles':
        return <VehiclesPage />
      case 'players':
        return <PlayersPage />
      case 'fractions':
        return <FractionsPage />
      case 'homes':
        return <HomesPage />
      case 'logs':
        return <LogsPage />
    }
  }

  return (
    <div className='admin-menu'>
      <Header activeMenu={activePage} onMenuChange={handleSelectPage} />
      <div className="main-container">
        <header className="header-amenu">
          <span className="title">Admin panel</span>
          <span className="close" onClick={handleCloseAMenu}>ESC</span>
        </header>
        <div className="line"></div>
        { renderActivePage() }
      </div>
    </div>
  )
}

export default AdminMenu