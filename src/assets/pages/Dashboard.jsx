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

  // Ambil data terakhir untuk stats cards
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")      // ambil semua kolom
      .order("created_at", { ascending: false }) // data terbaru
      .limit(1);        // hanya 1 record terakhir

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      const d = data[0];
      setSensorData({
        suhu: d.temperature,
        kelembaban: d.humidity,
        ph: d.soil_percent,      // contoh pakai soil_percent
        pompa: "Auto"            // default, bisa diganti jika ada kolom pompa_status
      });
    }
  }

  // Ambil seluruh data untuk chart
  const fetchChart = async () => {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")               // ambil semua kolom
      .order("created_at", { ascending: true }); // semua data kronologis

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const mapped = data.map(item => ({
        time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: item.temperature,
        humidity: item.humidity
      }));
      setChartData(mapped);
    }
  }

  useEffect(() => {
    fetchData()
    fetchChart()

    // refresh tiap 30 detik
    const interval = setInterval(() => {
      fetchData()
      fetchChart()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Dashboard</h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Overview sistem monitoring Smart Farm Cabai</p>
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

          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Aktivitas Terbaru</h3>
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
