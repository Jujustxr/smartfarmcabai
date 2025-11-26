import React, { useEffect, useState } from 'react'
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
import { supabase } from '../../lib/supabaseClient'

const Monitor = ({ isDarkMode }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    let subscription
    const init = async () => {
      const { data } = await supabase.from('sensor_data').select('*').order('created_at', { ascending: true }).limit(200)
      if (data) {
        setChartData(data.map((item) => ({
          id: item.id,
          time: new Date(item.created_at).toLocaleTimeString(),
          timestamp: new Date(item.created_at).getTime(),
          temperature: Number(item.temperature) || 0,
          humidity: Number(item.humidity) || 0,
        })))
      }

      subscription = supabase.channel('monitor_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_data' }, (payload) => {
          const it = payload.new
          setChartData((prev) => {
            const next = [...prev, {
              id: it.id,
              time: new Date(it.created_at).toLocaleTimeString(),
              timestamp: new Date(it.created_at).getTime(),
              temperature: Number(it.temperature) || 0,
              humidity: Number(it.humidity) || 0,
            }].slice(-200)
            return next
          })
        }).subscribe()
    }
    init()
    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [])

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
            disableAnimations={true}
            maxPoints={120}
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