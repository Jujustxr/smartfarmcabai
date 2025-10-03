"use client"

import { useEffect, useState, useCallback } from "react"
import Card from "../components/Card"
import Chart from "../components/Chart"
import { FaThermometerHalf, FaTint, FaFlask } from "react-icons/fa"
import { FaGear } from "react-icons/fa6"
import { supabase } from "../../lib/supabaseClient"

const Dashboard = ({ isDarkMode }) => {
  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0,
    ph: 0,
    pompa: "Mati",
  })
  const [chartData, setChartData] = useState([])
  const [sensorStatus, setSensorStatus] = useState("offline")
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [connectionStability, setConnectionStability] = useState({
    lastHeartbeats: [],
    isStable: true,
  })

  // =========================BAGIAN TIMESTAMP=========================
  const formatChartTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const handleNewSensorData = useCallback((newData) => {
    const timestamp = new Date(newData.created_at)
    setLastUpdateTime(timestamp)

    setSensorData({
      suhu: newData.temperature,
      kelembaban: newData.humidity,
      ph: newData.soil_percent,
      pompa: newData.pump_status || "Auto",
    })

    setChartData((prev) =>
      [
        ...prev,
        {
          time: formatChartTime(timestamp),
          temperature: newData.temperature,
          humidity: newData.humidity,
        },
      ].slice(-100),
    )

    // Update connection stability tracking
    setConnectionStability((prev) => {
      const newHeartbeats = [...prev.lastHeartbeats, Date.now()].slice(-5)
      const intervals = newHeartbeats.slice(1).map((time, i) => time - newHeartbeats[i])
      const isStable = intervals.every((interval) => interval < 30000) // 30 seconds threshold

      return {
        lastHeartbeats: newHeartbeats,
        isStable,
      }
    })

    setSensorStatus("online")
  }, [])

  useEffect(() => {
    let subscription
    let statusCheck

    const initialize = async () => {
      try {
        // Check if we have any data from the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

        const { data: recentData, error: recentError } = await supabase
          .from("sensor_data")
          .select("*")
          .gt("created_at", fiveMinutesAgo.toISOString())
          .order("created_at", { ascending: false })
          .limit(1)

        if (recentError) throw recentError

        // Set initial status based on recent data
        if (recentData && recentData.length > 0) {
          handleNewSensorData(recentData[0])
        } else {
          setSensorStatus("offline")
        }

        // Fetch historical data
        const { data: historyData } = await supabase
          .from("sensor_data")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(100)

        if (historyData) {
          setChartData(
            historyData.map((item) => ({
              time: formatChartTime(new Date(item.created_at)),
              temperature: item.temperature,
              humidity: item.humidity,
            })),
          )
        }

        // Set up real-time subscription
        subscription = supabase
          .channel("sensor_changes")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "sensor_data",
              filter: `created_at=gt.${new Date().toISOString()}`, // fixed filter to use current date
            },
            (payload) => handleNewSensorData(payload.new),
          )
          .subscribe()
      } catch (error) {
        console.error("Error initializing dashboard:", error)
        setSensorStatus("offline")
      }
    }

    initialize()

    // More robust status checking
    statusCheck = setInterval(() => {
      if (lastUpdateTime) {
        const timeSinceLastUpdate = (new Date() - lastUpdateTime) / 1000

        // Only set to offline if:
        // 1. No updates for more than 30 seconds AND
        // 2. Connection has been unstable
        if (timeSinceLastUpdate > 30 && !connectionStability.isStable) {
          setSensorStatus("offline")
        }
      }
    }, 15000) // Check every 15 seconds

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      clearInterval(statusCheck)
    }
  }, [handleNewSensorData, lastUpdateTime, connectionStability.isStable])

  const renderSensorValue = (value, unit) => {
    if (sensorStatus === "offline") {
      return "Offline"
    }
    return `${value}${unit}`
  }

  const getStatusColor = (value, type) => {
    if (sensorStatus === "offline") return "text-red-500"

    switch (type) {
      case "temperature":
        return value >= 25 && value <= 32 ? "text-green-500" : "text-yellow-500"
      case "humidity":
        return value >= 60 && value <= 80 ? "text-green-500" : "text-yellow-500"
      case "ph":
        return value >= 6.0 && value <= 7.0 ? "text-green-500" : "text-yellow-500"
      default:
        return isDarkMode ? "text-slate-100" : "text-gray-800"
    }
  }

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>Dashboard</h1>
          <p className={`${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Ringkasan kondisi lahan dan sistem SmartFarm Cabai
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${sensorStatus === "online" ? (isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700") : isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"}`}
            >
              • {sensorStatus.toUpperCase()}
            </span>
            {lastUpdateTime && sensorStatus === "online" && (
              <span className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} text-sm`}>
                Update terakhir: {new Date(lastUpdateTime).toLocaleString()}
              </span>
            )}
          </div>

          {sensorStatus === "offline" && (
            <div
              className={`mt-4 p-4 rounded-md border flex items-start gap-3 ${isDarkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full ${isDarkMode ? "bg-red-400" : "bg-red-500"}`}></div>
              <div>
                <p className={`${isDarkMode ? "text-red-400" : "text-red-700"} font-semibold`}>Sensor sedang offline</p>
                <ul className={`list-disc ml-5 mt-2 ${isDarkMode ? "text-red-300" : "text-red-600"} text-sm`}>
                  <li>Periksa koneksi WiFi perangkat</li>
                  <li>Pastikan power supply aktif</li>
                  <li>Cek koneksi internet</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            title="Sensor Suhu"
            icon={<FaThermometerHalf />}
            value={renderSensorValue(sensorData.suhu, "°C")}
            unit=""
            normalRange="25-32°C"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.suhu, "temperature")}
          />
          <Card
            title="Sensor Kelembaban"
            icon={<FaTint />}
            value={renderSensorValue(sensorData.kelembaban, "%")}
            unit=""
            normalRange="60-80%"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.kelembaban, "humidity")}
          />
          <Card
            title="Sensor pH Tanah"
            icon={<FaFlask />}
            value={renderSensorValue(sensorData.ph, "")}
            unit=""
            normalRange="6.0-7.0"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.ph, "ph")}
          />
          <Card
            title="Status Pompa Air"
            icon={<FaGear />}
            value={sensorStatus === "offline" ? "Offline" : sensorData.pompa}
            unit=""
            normalRange="Auto Mode"
            darkMode={isDarkMode}
            statusColor={sensorStatus === "offline" ? "text-red-500" : "text-green-500"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sensorStatus === "offline" ? (
            <div
              className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-slate-800 text-slate-200" : "bg-white text-gray-800"}`}
            >
              <div className="text-center py-8">
                <FaThermometerHalf className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <p className="text-red-500 font-semibold mb-2">Chart tidak tersedia - Sensor offline</p>
                <p className="text-sm text-gray-500">Data akan ditampilkan kembali setelah sensor online</p>
              </div>
            </div>
          ) : (
            <Chart
              title="Overview Suhu & Kelembaban"
              data={chartData}
              timeRanges={["1H", "3H", "6H"]}
              darkMode={isDarkMode}
            />
          )}

          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
              Aktivitas Terbaru
            </h3>
            <p className={`text-sm ${sensorStatus === "offline" ? "text-red-500" : "text-gray-500"}`}>
              {
                sensorStatus === "offline"
                  ? "Sensor offline - tidak ada data terbaru"
                  : `Update terakhir: ${lastUpdateTime ? new Date(lastUpdateTime).toLocaleString() : "Belum ada data"}` // fixed typo in message
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
