import { useState } from 'react'
import useToggleMenu from '../hooks/useTogglemenu'
import { 
  MdDashboard, 
  MdMonitor, 
  MdSettings, 
  MdHistory,
  MdMenu,
  MdClose,
  MdDarkMode,
  MdLightMode
} from 'react-icons/md'

const Navbar = ({ currentPage, setCurrentPage, isDarkMode, toggleDarkMode, onLogout }) => {
  const { isMenuOpen, toggleMenu, closeMenu } = useToggleMenu()

  return (
    <nav className={`shadow-lg border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-pink-100 border-pink-300'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* =========================BAGIAN LOGO========================= */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🌶️</div>
            <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-pink-800'}`}>
              Smart Farm Cabai
            </h1>

          {/* =========================BAGIAN LOGOUT BUTTON========================= */}
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          <div className="hidden md:flex space-x-1">
          {/* =========================BAGIAN MENU DASHBOARD========================= */}
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 ease-in-out
                flex items-center space-x-2
                ${currentPage === 'dashboard' 
                  ? 'text-green-600 bg-green-50' 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' : 'text-pink-600 hover:bg-pink-200 hover:text-green-600'}`
                }
              `}
            >
              <span><MdDashboard className="w-5 h-5" /></span>
              <span>Dashboard</span>
              
              {currentPage === 'dashboard' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full animate-pulse"></div>
              )}
            </button>

          {/* =========================BAGIAN MENU MONITOR========================= */}
            <button
              onClick={() => setCurrentPage('monitor')}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 ease-in-out
                flex items-center space-x-2
                ${currentPage === 'monitor' 
                  ? 'text-green-600 bg-green-50' 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' : 'text-pink-600 hover:bg-pink-200 hover:text-green-600'}`
                }
              `}
            >
              <span><MdMonitor className="w-5 h-5" /></span>
              <span>Monitor</span>
              
              {currentPage === 'monitor' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full animate-pulse"></div>
              )}
            </button>

          {/* =========================BAGIAN MENU KONTROL========================= */}
            <button
              onClick={() => setCurrentPage('kontrol')}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 ease-in-out
                flex items-center space-x-2
                ${currentPage === 'kontrol' 
                  ? 'text-green-600 bg-green-50' 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' : 'text-pink-600 hover:bg-pink-200 hover:text-green-600'}`
                }
              `}
            >
              <span><MdSettings className="w-5 h-5" /></span>
              <span>Kontrol Akuator</span>
              
              {currentPage === 'kontrol' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full animate-pulse"></div>
              )}
            </button>

          {/* =========================BAGIAN MENU RIWAYAT========================= */}
            <button
              onClick={() => setCurrentPage('riwayat')}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 ease-in-out
                flex items-center space-x-2
                ${currentPage === 'riwayat' 
                  ? 'text-green-600 bg-green-50' 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' : 'text-pink-600 hover:bg-pink-200 hover:text-green-600'}`
                }
              `}
            >
              <span><MdHistory className="w-5 h-5" /></span>
              <span>Riwayat</span>
          
              {currentPage === 'riwayat' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
          {/* =========================BAGIAN TOGGLENYA DARK MODE========================= */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-pink-600 hover:text-green-600 hover:bg-pink-200'}`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <MdLightMode className="w-5 h-5" />
              ) : (
                <MdDarkMode className="w-5 h-5" />
              )}
            </button>

          {/* =========================BAGIAN MENU MOBILE========================= */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu}
                className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-pink-600 hover:text-green-600'}`}
              >
                {isMenuOpen ? (
                  <MdClose className="w-6 h-6" />
                ) : (
                  <MdMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden border-t ${isDarkMode ? 'border-gray-600' : 'border-pink-300'}`}>
            <div className="py-2 space-y-1">
          {/* =========================BAGIAN MENU DASHBOARD MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage('dashboard')
                  closeMenu()
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  flex items-center space-x-3
                  ${currentPage === 'dashboard' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : `${isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-pink-600 hover:text-green-600 hover:bg-pink-200'}`
                  }
                `}
              >
                <span><MdDashboard className="w-5 h-5" /></span>
                <span>Dashboard</span>
              </button>

          {/* =========================BAGIAN MENU MONITOR MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage('monitor')
                  closeMenu()
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  flex items-center space-x-3
                  ${currentPage === 'monitor' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : `${isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-pink-600 hover:text-green-600 hover:bg-pink-200'}`
                  }
                `}
              >
                <span><MdMonitor className="w-5 h-5" /></span>
                <span>Monitor</span>
              </button>

          {/* =========================BAGIAN MENU KONTROL MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage('kontrol')
                  closeMenu()
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  flex items-center space-x-3
                  ${currentPage === 'kontrol' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : `${isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-pink-600 hover:text-green-600 hover:bg-pink-200'}`
                  }
                `}
              >
                <span><MdSettings className="w-5 h-5" /></span>
                <span>Kontrol Akuator</span>
              </button>

          {/* =========================BAGIAN MENU RIWAYAT MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage('riwayat')
                  closeMenu()
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  flex items-center space-x-3
                  ${currentPage === 'riwayat' 
                    ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                    : `${isDarkMode ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-pink-600 hover:text-green-600 hover:bg-pink-200'}`
                  }
                `}
              >
                <span><MdHistory className="w-5 h-5" /></span>
                <span>Riwayat</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar