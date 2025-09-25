import { useEffect, useState } from "react"
import Card from '../components/Card'
import Chart from '../components/Chart'
import { 
  FaThermometerHalf, 
  FaTint, 
  FaFlask
} from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import { supabase } from "../../lib/supabaseClient"   // pastikan path ini benar

const Dashboard = ({ isDarkMode }) => {
  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0,
    ph: 0,
    pompa: "Mati"
  })
  const [chartData, setChartData] = useState([])

  // Ambil data terakhir dari Supabase
  const fetchData = async () => {
    let { data, error } = await supabase
      .from("sensor_data")   // ganti dengan nama tabelmu
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error(error)
      return
    }

    if (data && data.length > 0) {
      const d = data[0]
      setSensorData({
        suhu: d.suhu,
        kelembaban: d.kelembaban,
        ph: d.ph,
        pompa: d.pompa_status ? "Aktif" : "Mati"
      })
    }
  }

  // Ambil data chart (misalnya 6 jam terakhir)
  const fetchChart = async () => {
    let { data, error } = await supabase
      .from("sensor_data")
      .select("suhu, kelembaban, created_at")
      .order("created_at", { ascending: true })
      .limit(24) // misalnya 6 jam dengan interval 15 menit

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      const mapped = data.map(item => ({
        time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: item.suhu,
        humidity: item.kelembaban
      }))
      setChartData(mapped)
    }
  }

  useEffect(() => {
    fetchData()
    fetchChart()

    // refresh tiap 30 detik
    const interval = setInterval(() => {
      fetchData()
      fetchChart()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Dashboard</h1>
          <p className={`${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>Overview sistem monitoring Smart Farm Cabai</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Sensor Suhu"
            icon={<FaThermometerHalf className="w-6 h-6" />}
            value={sensorData.suhu}
            unit="°C"
            normalRange="25-32°C"
            darkMode={isDarkMode}
          />

          <Card
            title="Sensor Kelembaban"
            icon={<FaTint className="w-6 h-6" />}
            value={sensorData.kelembaban}
            unit="%"
            normalRange="60-80%"
            darkMode={isDarkMode}
          />

          <Card
            title="Sensor pH Tanah"
            icon={<FaFlask className="w-6 h-6" />}
            value={sensorData.ph}
            unit=""
            normalRange="6.0-7.0"
            darkMode={isDarkMode}
          />

          <Card
            title="Status Pompa Air"
            icon={<FaGear className="w-6 h-6" />}
            value={sensorData.pompa}
            unit=""
            normalRange="Auto Mode"
            darkMode={isDarkMode}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Chart 
              title="Overview Suhu & Kelembaban"
              data={chartData}
              timeRanges={['1H', '3H', '6H']}
              darkMode={isDarkMode}
            />
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-slate-100' : 'text-gray-800'
            }`}>Aktivitas Terbaru</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                (Aktivitas terbaru bisa ditarik juga dari tabel log Supabase, misalnya `pump_log`)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
