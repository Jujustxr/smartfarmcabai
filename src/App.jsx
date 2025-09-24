import { useState } from "react"
import Navbar from "./assets/components/Navbar"
import PageTransition from "./assets/components/PageTransition"
import Dashboard from "./assets/pages/Dashboard"
import Monitor from "./assets/pages/Monitor"
import KontrolAkuator from "./assets/pages/KontrolAkuator"
import Riwayat from "./assets/pages/Riwayat"

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'monitor':
        return <Monitor />
      case 'kontrol':
        return <KontrolAkuator />
      case 'riwayat':
        return <Riwayat />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <PageTransition key={currentPage}>
        {renderPage()}
      </PageTransition>
    </div>
  )
}

export default App
