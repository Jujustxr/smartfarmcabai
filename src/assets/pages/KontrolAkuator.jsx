import { useState } from 'react'
import { 
  FaTint,
  FaFan, 
  FaLightbulb,
  FaShower
} from 'react-icons/fa'

const KontrolAkuator = () => {
  const [pumpStatus, setPumpStatus] = useState(false)
  const [fanStatus, setFanStatus] = useState(true)
  const [lightStatus, setLightStatus] = useState(false)
  const [sprinklerStatus, setSprinklerStatus] = useState(false)

  const aktuators = [
    {
      id: 'pump',
      name: 'Pompa Air',
      status: pumpStatus,
      setter: setPumpStatus,
      icon: <FaTint className="w-8 h-8" />,
      description: 'Mengatur sistem irigasi tanaman',
      color: 'blue'
    },
    {
      id: 'fan',
      name: 'Kipas Angin',
      status: fanStatus,
      setter: setFanStatus,
      icon: <FaFan className="w-8 h-8" />,
      description: 'Mengatur sirkulasi udara dan suhu',
      color: 'green'
    },
    {
      id: 'light',
      name: 'Lampu LED',
      status: lightStatus,
      setter: setLightStatus,
      icon: <FaLightbulb className="w-8 h-8" />,
      description: 'Memberikan pencahayaan tambahan',
      color: 'yellow'
    },
    {
      id: 'sprinkler',
      name: 'Sprinkler',
      status: sprinklerStatus,
      setter: setSprinklerStatus,
      icon: <FaShower className="w-8 h-8" />,
      description: 'Sistem penyemprotan otomatis',
      color: 'purple'
    }
  ]

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        bg: isActive ? 'bg-blue-500' : 'bg-gray-300',
        text: isActive ? 'text-blue-600' : 'text-gray-600',
        border: 'border-blue-200',
        bgLight: 'bg-blue-50'
      },
      green: {
        bg: isActive ? 'bg-green-500' : 'bg-gray-300',
        text: isActive ? 'text-green-600' : 'text-gray-600',
        border: 'border-green-200',
        bgLight: 'bg-green-50'
      },
      yellow: {
        bg: isActive ? 'bg-yellow-500' : 'bg-gray-300',
        text: isActive ? 'text-yellow-600' : 'text-gray-600',
        border: 'border-yellow-200',
        bgLight: 'bg-yellow-50'
      },
      purple: {
        bg: isActive ? 'bg-purple-500' : 'bg-gray-300',
        text: isActive ? 'text-purple-600' : 'text-gray-600',
        border: 'border-purple-200',
        bgLight: 'bg-purple-50'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kontrol Akuator</h1>
          <p className="text-gray-600">Kendali manual sistem otomatisasi Smart Farm</p>
        </div>

        {/* Aktuator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {aktuators.map((aktuator) => {
            const colorClasses = getColorClasses(aktuator.color, aktuator.status)
            return (
              <div key={aktuator.id} className={`bg-white p-6 rounded-lg shadow-md border ${colorClasses.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${colorClasses.bgLight} ${colorClasses.text}`}>
                      {aktuator.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{aktuator.name}</h3>
                      <p className="text-sm text-gray-500">{aktuator.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${aktuator.status ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {aktuator.status ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => aktuator.setter(!aktuator.status)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${aktuator.status ? colorClasses.bg : 'bg-gray-200'}
                      ${aktuator.status ? `focus:ring-${aktuator.color}-500` : 'focus:ring-gray-400'}
                    `}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                        transition duration-200 ease-in-out
                        ${aktuator.status ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Schedule Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Penjadwalan Otomatis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Penyiraman Pagi</p>
                  <p className="text-sm text-gray-500">Setiap hari jam 06:00</p>
                </div>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  Aktif
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Penyiraman Sore</p>
                  <p className="text-sm text-gray-500">Setiap hari jam 17:00</p>
                </div>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  Aktif
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Lampu LED</p>
                  <p className="text-sm text-gray-500">18:00 - 06:00</p>
                </div>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                  Nonaktif
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Kipas Ventilasi</p>
                  <p className="text-sm text-gray-500">Suhu &gt; 30°C</p>
                </div>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  Aktif
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Override */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode Manual</h3>
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
          <p className="text-sm text-gray-500 mt-2">
            Mode manual akan menonaktifkan semua penjadwalan otomatis
          </p>
        </div>
      </div>
    </div>
  )
}

export default KontrolAkuator