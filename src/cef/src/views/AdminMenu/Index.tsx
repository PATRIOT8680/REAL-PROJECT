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

<<<<<<< HEAD
  const handleCloseAMenu = () => {
    rce.triggerClient('closeAMenu')
  }

=======
  const handleKeyDown = (key: 'left' | 'right') => {
    if (key === 'left') {
      const currentIndex = pages.indexOf(activePage)
      const newIndex = (currentIndex - 1 + pages.length) % pages.length
      setActivePage(pages[newIndex])
    }
    else if (key === 'right') {
      const currentIndex = pages.indexOf(activePage)
      const newIndex = (currentIndex + 1) % pages.length
      setActivePage(pages[newIndex])
    }
  }

  rce.register('amenu:ctrlPress', (key: 'left' | 'right') => {
    rce.triggerClient('clientCmd', `Нажат ${key}`)
    handleKeyDown(key)
  })

>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
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
<<<<<<< HEAD
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
=======
    <>
      <div className="admin-menu">
        <Header activeMenu={activePage} onMenuChange={handleSelectPage} />
        { renderActivePage() }
      </div>
    </>
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
  )
}

export default AdminMenu