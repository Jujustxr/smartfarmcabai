"use client"
import useToggleMenu from "../hooks/useTogglemenu"
import { MdDashboard, MdMonitor, MdSettings, MdHistory, MdMenu, MdClose, MdDarkMode, MdLightMode } from "react-icons/md"

const Navbar = ({ currentPage, setCurrentPage, isDarkMode, toggleDarkMode, onLogout }) => {
  const { isMenuOpen, toggleMenu, closeMenu } = useToggleMenu()

  return (
    <nav
      className={`shadow-lg border-b transition-colors duration-300 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white/90 backdrop-blur border-stone-200"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* =========================BAGIAN LOGO========================= */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🌶️</div>
            <h1 className={`text-xl font-semibold ${isDarkMode ? "text-slate-100" : "text-emerald-700"}`}>
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
              onClick={() => setCurrentPage("dashboard")}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center space-x-2 ${currentPage === "dashboard" ? "text-emerald-700 bg-emerald-50" : `${isDarkMode ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}`}
            >
              <span>
                <MdDashboard className="w-5 h-5" />
              </span>
              <span>Dashboard</span>
              {currentPage === "dashboard" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* =========================BAGIAN MENU MONITOR========================= */}
            <button
              onClick={() => setCurrentPage("monitor")}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center space-x-2 ${currentPage === "monitor" ? "text-emerald-700 bg-emerald-50" : `${isDarkMode ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}`}
            >
              <span>
                <MdMonitor className="w-5 h-5" />
              </span>
              <span>Monitor</span>
              {currentPage === "monitor" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* =========================BAGIAN MENU KONTROL========================= */}
            <button
              onClick={() => setCurrentPage("kontrol")}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center space-x-2 ${currentPage === "kontrol" ? "text-emerald-700 bg-emerald-50" : `${isDarkMode ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}`}
            >
              <span>
                <MdSettings className="w-5 h-5" />
              </span>
              <span>Kontrol Akuator</span>
              {currentPage === "kontrol" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* =========================BAGIAN MENU RIWAYAT========================= */}
            <button
              onClick={() => setCurrentPage("riwayat")}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center space-x-2 ${currentPage === "riwayat" ? "text-emerald-700 bg-emerald-50" : `${isDarkMode ? "text-slate-300 hover:bg-slate-800 hover:text-emerald-400" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`}`}
            >
              <span>
                <MdHistory className="w-5 h-5" />
              </span>
              <span>Riwayat</span>
              {currentPage === "riwayat" && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* =========================BAGIAN TOGGLENYA DARK MODE========================= */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? "text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"}`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <MdLightMode className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
            </button>

            {/* =========================BAGIAN MENU MOBILE========================= */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className={`transition-colors duration-200 ${isDarkMode ? "text-slate-300 hover:text-emerald-400" : "text-slate-600 hover:text-emerald-700"}`}
              >
                {isMenuOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden border-t ${isDarkMode ? "border-slate-700" : "border-stone-200"}`}>
            <div className="py-2 space-y-1">
              {/* =========================BAGIAN MENU DASHBOARD MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage("dashboard")
                  closeMenu()
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${currentPage === "dashboard" ? "text-emerald-700 bg-emerald-50 border-r-2 border-emerald-600" : `${isDarkMode ? "text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"}`}`}
              >
                <span>
                  <MdDashboard className="w-5 h-5" />
                </span>
                <span>Dashboard</span>
              </button>

              {/* =========================BAGIAN MENU MONITOR MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage("monitor")
                  closeMenu()
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${currentPage === "monitor" ? "text-emerald-700 bg-emerald-50 border-r-2 border-emerald-600" : `${isDarkMode ? "text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"}`}`}
              >
                <span>
                  <MdMonitor className="w-5 h-5" />
                </span>
                <span>Monitor</span>
              </button>

              {/* =========================BAGIAN MENU KONTROL MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage("kontrol")
                  closeMenu()
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${currentPage === "kontrol" ? "text-emerald-700 bg-emerald-50 border-r-2 border-emerald-600" : `${isDarkMode ? "text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"}`}`}
              >
                <span>
                  <MdSettings className="w-5 h-5" />
                </span>
                <span>Kontrol Akuator</span>
              </button>

              {/* =========================BAGIAN MENU RIWAYAT MOBILE========================= */}
              <button
                onClick={() => {
                  setCurrentPage("riwayat")
                  closeMenu()
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${currentPage === "riwayat" ? "text-emerald-700 bg-emerald-50 border-r-2 border-emerald-600" : `${isDarkMode ? "text-slate-300 hover:text-emerald-400 hover:bg-slate-800" : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"}`}`}
              >
                <span>
                  <MdHistory className="w-5 h-5" />
                </span>
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
