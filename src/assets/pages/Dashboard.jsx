import Card from '../components/Card'
import Chart from '../components/Chart'
import useDarkMode from '../hooks/useDarkMode'
import { 
  FaThermometerHalf, 
  FaTint, 
  FaFlask
} from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'

const Dashboard = () => {
  const darkModeHook = useDarkMode()
  console.log('Dashboard - full hook object:', darkModeHook)
  const { isDarkMode } = darkModeHook
  console.log('Dashboard - extracted isDarkMode:', isDarkMode, typeof isDarkMode)
  // Data sementara untuk chart dashboard
  const generateDashboardChartData = () => {
    const data = []
    const now = new Date()
    
    // Generate data untuk 6 jam terakhir (setiap 15 menit untuk dashboard overview)
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000))
      const hours = timestamp.getHours()
      const minutes = timestamp.getMinutes()
      
      // Pola data yang sedikit lebih stabil untuk dashboard
      const baseTemp = 27 + Math.sin((hours - 8) * Math.PI / 10) * 3 + Math.random() * 1.5
      const baseHumidity = 63 + Math.cos((hours - 14) * Math.PI / 10) * 8 + Math.random() * 3
      
      data.push({
        timestamp: timestamp.toISOString(),
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        temperature: Math.round(baseTemp * 10) / 10,
        humidity: Math.round(baseHumidity * 10) / 10,
      })
    }
    
    return data
  }

  const dashboardChartData = generateDashboardChartData()

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview sistem monitoring Smart Farm Cabai</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Sensor Suhu */}
          <Card
            title="Sensor Suhu"
            icon={<FaThermometerHalf className="w-6 h-6" />}
            value="28"
            unit="°C"
            normalRange="25-32°C"
            darkMode={isDarkMode}
          />

          {/* Card Sensor Kelembaban */}
          <Card
            title="Sensor Kelembaban"
            icon={<FaTint className="w-6 h-6" />}
            value="65"
            unit="%"
            normalRange="60-80%"
            darkMode={isDarkMode}
          />

          {/* Card Sensor pH Tanah */}
          <Card
            title="Sensor pH Tanah"
            icon={<FaFlask className="w-6 h-6" />}
            value="6.8"
            unit=""
            normalRange="6.0-7.0"
            darkMode={isDarkMode}
          />

          {/* Card Status Pompa Air */}
          <Card
            title="Status Pompa Air"
            icon={<FaGear className="w-6 h-6" />}
            value="Aktif"
            unit=""
            normalRange="Auto Mode"
            darkMode={isDarkMode}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Area */}
          <div>
            <Chart 
              title="Overview Suhu & Kelembaban"
              data={dashboardChartData}
              timeRanges={['1H', '3H', '6H']}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pompa air dihidupkan</p>
                  <p className="text-xs text-gray-500">2 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Suhu mencapai 30°C</p>
                  <p className="text-xs text-gray-500">5 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Kelembaban turun ke 60%</p>
                  <p className="text-xs text-gray-500">10 menit yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard