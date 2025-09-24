import { useState } from "react"
import Navbar from "./assets/components/Navbar"
import PageTransition from "./assets/components/PageTransition"
import Dashboard from "./assets/pages/Dashboard"
import Monitor from "./assets/pages/Monitor"
import KontrolAkuator from "./assets/pages/KontrolAkuator"
import Riwayat from "./assets/pages/Riwayat"
import useDarkMode from "./assets/hooks/useDarkMode"

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode}/>
      case 'monitor':
        return <Monitor isDarkMode={isDarkMode}/>
      case 'kontrol':
        return <KontrolAkuator isDarkMode={isDarkMode}/>
      case 'riwayat':
        return <Riwayat isDarkMode={isDarkMode}/>
      default:
        return <Dashboard isDarkMode={isDarkMode}/>
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <PageTransition key={currentPage}>
        {renderPage()}
      </PageTransition>
    </div>
  )
}

export default App
