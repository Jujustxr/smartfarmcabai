import React from 'react'
import SensorCard from '../components/SensorCard'
import Chart from '../components/Chart'
import { 
  FaThermometerHalf, 
  FaTint, 
  FaFlask, 
  FaSeedling, 
  FaSun, 
  FaLeaf 
} from 'react-icons/fa'

const Monitor = ({ isDarkMode }) => {
  const generateChartData = () => {
    const data = []
    const now = new Date()
    
    // INI DI GENERATE TIAP 30 MENIT
    for (let i = 48; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 30 * 60 * 1000))
      const hours = timestamp.getHours()
      const minutes = timestamp.getMinutes()
      const baseTemp = 26 + Math.sin((hours - 6) * Math.PI / 12) * 4 + Math.random() * 2
      const baseHumidity = 65 + Math.cos((hours - 12) * Math.PI / 12) * 10 + Math.random() * 5
      
      data.push({
        timestamp: timestamp.toISOString(),
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        temperature: Math.round(baseTemp * 10) / 10,
        humidity: Math.round(baseHumidity * 10) / 10,
      })
    }
    
    return data
  }

  const chartData = generateChartData()
  const suhuSensor = (26 + Math.sin(Date.now() / 100000) * 3 + Math.random() * 1).toFixed(1)
  const kelembabanUdara = Math.floor(60 + Math.cos(Date.now() / 120000) * 15 + Math.random() * 5)
  const phTanah = (6.5 + Math.sin(Date.now() / 150000) * 0.3 + Math.random() * 0.2).toFixed(1)
  const kelembabanTanah = Math.floor(40 + Math.cos(Date.now() / 180000) * 20 + Math.random() * 10)
  const intensitasCahaya = Math.floor(700 + Math.sin(Date.now() / 90000) * 200 + Math.random() * 100)
  const nutrisiEC = (1.8 + Math.cos(Date.now() / 200000) * 0.4 + Math.random() * 0.3).toFixed(1)

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Monitor Sensor</h1>
          <p className={`${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>Real-time monitoring parameter lingkungan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* =========================BAGIAN SENSOR SUHU========================= */}
          <SensorCard
            title="Sensor Suhu"
            icon={<FaThermometerHalf className="w-6 h-6" />}
            value={suhuSensor}
            unit="°C"
            normalRange="25-32°C"
            progressValue={Math.min(Math.max((parseFloat(suhuSensor) - 20) / 15 * 100, 0), 100)}
            darkMode={isDarkMode}
          />

          {/* =========================BAGIAN SENSOR KELEMBAPAN UDARA========================= */}
          <SensorCard
            title="Kelembaban Udara"
            icon={<FaTint className="w-6 h-6" />}
            value={kelembabanUdara}
            unit="%"
            normalRange="50-80%"
            progressValue={kelembabanUdara}
            darkMode={isDarkMode}
          />

          {/* =========================BAGIAN SENSOR pH========================= */}
          <SensorCard
            title="pH Tanah"
            icon={<FaFlask className="w-6 h-6" />}
            value={phTanah}
            unit=""
            normalRange="6.0-7.0"
            progressValue={Math.min(Math.max((parseFloat(phTanah) - 5) / 3 * 100, 0), 100)}
            darkMode={isDarkMode}
          />
          {/* =========================BAGIAN SENSOR KELEMBAPAN TANAH========================= */}
          <SensorCard
            title="Kelembaban Tanah"
            icon={<FaSeedling className="w-6 h-6" />}
            value={kelembabanTanah}
            unit="%"
            normalRange="50-70%"
            progressValue={kelembabanTanah}
            darkMode={isDarkMode}
          />

          {/* =========================BAGIAN SENSOR CAHAYA========================= */}
          <SensorCard
            title="Intensitas Cahaya"
            icon={<FaSun className="w-6 h-6" />}
            value={intensitasCahaya}
            unit=" Lux"
            normalRange="500-1200 Lux"
            progressValue={Math.min(Math.max((intensitasCahaya - 300) / 900 * 100, 0), 100)}
            darkMode={isDarkMode}
          />

          {/* =========================BAGIAN SENSOR NUTRISI========================= */}
          <SensorCard
            title="Nutrisi (EC)"
            icon={<FaLeaf className="w-6 h-6" />}
            value={nutrisiEC}
            unit=" mS"
            normalRange="1.5-2.5 mS"
            progressValue={Math.min(Math.max((parseFloat(nutrisiEC) - 1.0) / 2.0 * 100, 0), 100)}
            darkMode={isDarkMode}
          />
        </div>

        <div className="mb-6">
          <Chart 
            title="Grafik Suhu & Kelembaban Real-time"
            data={chartData}
            darkMode={isDarkMode}
          />
        </div>

          {/* =========================BAGIAN ALLERT========================= */}
        <div className={`p-6 rounded-lg shadow-md ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Sistem Peringatan</h3>
          <div className="space-y-3">
            {/* INI BUAT KALO KELEMBAPAN TANAH RENDAH */}
            {kelembabanTanah < 50 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Kelembaban tanah rendah ({kelembabanTanah}%)</p>
                  <p className="text-xs text-yellow-600">Diperlukan penyiraman segera</p>
                </div>
              </div>
            )}

            {/* INI BUAT KALO SUHU TINGGI */}
            {parseFloat(suhuSensor) > 32 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-red-800">Suhu terlalu tinggi ({suhuSensor}°C)</p>
                  <p className="text-xs text-red-600">Aktifkan sistem pendingin</p>
                </div>
              </div>
            )}

            {/* INI BUAT KALO pH ABNORMAL */}  
            {(parseFloat(phTanah) < 6.0 || parseFloat(phTanah) > 7.0) && (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-orange-800">pH tanah tidak optimal ({phTanah})</p>
                  <p className="text-xs text-orange-600">Lakukan penyesuaian pH tanah</p>
                </div>
              </div>
            )}

            {/* INI BUAT KALO SEMUA NORMAL */}
            {kelembabanTanah >= 50 && parseFloat(suhuSensor) <= 32 && parseFloat(phTanah) >= 6.0 && parseFloat(phTanah) <= 7.0 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-800">Semua parameter dalam kondisi normal</p>
                  <p className="text-xs text-green-600">Sistem berjalan dengan baik</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Monitor