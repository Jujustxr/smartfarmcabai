import { useState } from 'react'
import useToggleMenu from '../hooks/useTogglemenu'
import { 
  MdDashboard, 
  MdMonitor, 
  MdSettings, 
  MdHistory,
  MdMenu,
  MdClose
} from 'react-icons/md'

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { isMenuOpen, toggleMenu, closeMenu } = useToggleMenu()

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <MdDashboard className="w-5 h-5" />
    },
    { 
      id: 'monitor', 
      label: 'Monitor', 
      icon: <MdMonitor className="w-5 h-5" />
    },
    { 
      id: 'kontrol', 
      label: 'Kontrol Akuator', 
      icon: <MdSettings className="w-5 h-5" />
    },
    { 
      id: 'riwayat', 
      label: 'Riwayat', 
      icon: <MdHistory className="w-5 h-5" />
    }
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🌶️</div>
            <h1 className="text-xl font-semibold text-gray-800">
              Smart Farm Cabai
            </h1>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 ease-in-out
                  flex items-center space-x-2
                  ${currentPage === item.id 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                
                {/* Active indicator */}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    closeMenu()
                  }}
                  className={`
                    w-full text-left px-4 py-3 text-sm font-medium
                    transition-all duration-200
                    flex items-center space-x-3
                    ${currentPage === item.id 
                      ? 'text-green-600 bg-green-50 border-r-2 border-green-600' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar