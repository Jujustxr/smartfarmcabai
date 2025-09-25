import { useState } from 'react'
import AktuatorCard from '../components/AktuatorCard'
import { 
  FaTint,
  FaFan, 
  FaLightbulb,
  FaShower
} from 'react-icons/fa'

const KontrolAkuator = ({ isDarkMode }) => {
  const [pumpStatus, setPumpStatus] = useState(false)
  const [fanStatus, setFanStatus] = useState(true)
  const [lightStatus, setLightStatus] = useState(false)
  const [sprinklerStatus, setSprinklerStatus] = useState(false)

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Kontrol Akuator</h1>
          <p className={`${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>Kendali manual sistem otomatisasi Smart Farm</p>
        </div>

        {/* Aktuator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {/* Pompa Air */}
          <AktuatorCard
            name="Pompa Air"
            description="Mengatur sistem irigasi tanaman"
            icon={<FaTint className="w-8 h-8" />}
            status={pumpStatus}
            onToggle={() => setPumpStatus(!pumpStatus)}
            color="blue"
            darkMode={isDarkMode}
          />

          {/* Sprinkler */}
          <AktuatorCard
            name="Sprinkler"
            description="Sistem penyemprotan otomatis"
            icon={<FaShower className="w-8 h-8" />}
            status={sprinklerStatus}
            onToggle={() => setSprinklerStatus(!sprinklerStatus)}
            color="purple"
            darkMode={isDarkMode}
          />
        </div>

        {/* Schedule Controls */}
        <div className={`p-6 rounded-lg shadow-md mb-6 ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Penjadwalan Otomatis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-800'
                  }`}>Penyiraman Pagi</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>Setiap hari jam 06:00</p>
                </div>
                <button className={`px-3 py-1 text-sm rounded-full ${
                  isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  Aktif
                </button>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-800'
                  }`}>Penyiraman Sore</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>Setiap hari jam 17:00</p>
                </div>
                <button className={`px-3 py-1 text-sm rounded-full ${
                  isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  Aktif
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-800'
                  }`}>Lampu LED</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>18:00 - 06:00</p>
                </div>
                <button className={`px-3 py-1 text-sm rounded-full ${
                  isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  Nonaktif
                </button>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-slate-100' : 'text-gray-800'
                  }`}>Kipas Ventilasi</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>Suhu &gt; 30°C</p>
                </div>
                <button className={`px-3 py-1 text-sm rounded-full ${
                  isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  Aktif
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Override */}
        <div className={`p-6 rounded-lg shadow-md ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Mode Manual</h3>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Emergency Stop
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              Override All
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Auto Mode
            </button>
          </div>
          <p className={`text-sm mt-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Mode manual akan menonaktifkan semua penjadwalan otomatis
          </p>
        </div>
      </div>
    </div>
  )
}

export default KontrolAkuator