"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Card from "../components/Card"
import Chart from "../components/Chart"
import { FaThermometerHalf, FaTint } from "react-icons/fa"
import { FaGear } from "react-icons/fa6"
import { supabase } from "../../lib/supabaseClient"

const Dashboard = ({ isDarkMode }) => {
  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0,
    ph: 0,
    water_percent: 0,
    water_adc: 0,
    pompa: "Mati",
  })
  const [chartData, setChartData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [overviewData, setOverviewData] = useState([])
  const overviewMapRef = useRef({}) // stores per-quarter aggregation (sum/count)
  const lastOverviewUpdateRef = useRef(0)
  const [sensorStatus, setSensorStatus] = useState("offline")
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [connectionStability, setConnectionStability] = useState({
    lastHeartbeats: [],
    isStable: true,
  })

  // Tank capacity (liters) — adjust to your actual tank size
  const TANK_CAPACITY_LITERS = 200

  // Helper: round timestamp down to nearest 15-minute quarter and return ISO key
  const quarterKeyForTimestamp = (timestamp) => {
    const d = new Date(timestamp)
    d.setSeconds(0, 0)
    const minutes = d.getMinutes()
    const quarter = Math.floor(minutes / 15) * 15
    d.setMinutes(quarter)
    return d.toISOString()
  }

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
      water_percent: newData.water_percent ?? 0,
      water_adc: newData.water_adc ?? 0,
      pompa: newData.pump_status || "Auto",
    })

    setChartData((prev) =>
      [
        ...prev,
          {
            time: formatChartTime(timestamp),
            timestamp: timestamp.toISOString(),
            temperature: Number(newData.temperature) || 0,
            humidity: Number(newData.humidity) || 0,
          },
      ].slice(-100),
    )

    // Update recentActivity as FIFO (max 5). Avoid duplicates by id.
    setRecentActivity((prev) => {
      if (!newData?.id) return prev
      const exists = prev.some((it) => it.id === newData.id)
      if (exists) {
        // replace existing entry with newest payload
        return prev.map((it) => (it.id === newData.id ? { ...newData } : it))
      }
      const queue = [...prev, { ...newData }]
      while (queue.length > 5) queue.shift()
      return queue
    })

      // Update overviewMapRef (calculate average per quarter) and update overviewData.
      try {
        if (!newData?.id) return
        const qKey = quarterKeyForTimestamp(newData.created_at)
        const map = overviewMapRef.current || {}
        const valueTemp = Number(newData.temperature) || 0
        const valueHum = Number(newData.humidity) || 0
        const entry = map[qKey]
        const now = Date.now()
        if (!entry) {
          map[qKey] = {
            sumTemp: valueTemp,
            sumHum: valueHum,
            count: 1,
            lastTimestamp: newData.created_at,
            lastId: newData.id,
          }
        } else {
          entry.sumTemp += valueTemp
          entry.sumHum += valueHum
          entry.count += 1
          if (new Date(newData.created_at) > new Date(entry.lastTimestamp)) {
            entry.lastTimestamp = newData.created_at
            entry.lastId = newData.id
          }
        }
        overviewMapRef.current = map

        // Only update UI if last UI update was > DEBOUNCE_MS or avg changed enough
        const DEBOUNCE_MS = 800
        const lastUpdate = lastOverviewUpdateRef.current || 0
        let shouldUpdate = false
        if (now - lastUpdate > DEBOUNCE_MS) shouldUpdate = true
        // compute avg and compare
        if (!shouldUpdate) {
          const m = map[qKey]
          const avgTemp = Number(m.sumTemp / m.count)
          const avgHum = Number(m.sumHum / m.count)
          const prevEntry = (overviewData || []).find(it => it.quarterKey === qKey)
          if (!prevEntry) shouldUpdate = true
          else if (Math.abs(prevEntry.temperature - avgTemp) > 0.1 || Math.abs(prevEntry.humidity - avgHum) > 0.1) shouldUpdate = true
        }
        if (shouldUpdate) {
          lastOverviewUpdateRef.current = now
          const keys = Object.keys(map).sort()
          const lastKeys = keys.slice(-10)
          const points = lastKeys.map(k => {
            const m = map[k]
            return {
              id: m.lastId,
              quarterKey: k,
              time: formatChartTime(new Date(m.lastTimestamp)),
              timestamp: new Date(m.lastTimestamp).toISOString(),
              temperature: Number(m.sumTemp / m.count) || 0,
              humidity: Number(m.sumHum / m.count) || 0,
            }
          })
          setOverviewData(points)
        }
      } catch (err) {
        console.error('Failed updating overview map', err)
      }

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
              id: item.id,
              time: formatChartTime(new Date(item.created_at)),
              timestamp: new Date(item.created_at).toISOString(),
              temperature: Number(item.temperature) || 0,
              humidity: Number(item.humidity) || 0,
            })),
          )

              // Build overviewMapRef using average values per quarter (sum/count)
              const map = {}
              historyData.forEach((item) => {
                const key = quarterKeyForTimestamp(item.created_at)
                if (!map[key]) {
                  map[key] = {
                    sumTemp: Number(item.temperature) || 0,
                    sumHum: Number(item.humidity) || 0,
                    count: 1,
                    lastTimestamp: item.created_at,
                    lastId: item.id,
                  }
                } else {
                  map[key].sumTemp += Number(item.temperature) || 0
                  map[key].sumHum += Number(item.humidity) || 0
                  map[key].count += 1
                  // keep latest timestamp/id
                  if (new Date(item.created_at) > new Date(map[key].lastTimestamp)) {
                    map[key].lastTimestamp = item.created_at
                    map[key].lastId = item.id
                  }
                }
              })
              // store into ref for incremental updates
              overviewMapRef.current = map
              const quarterKeys = Object.keys(map).sort()
              const lastQuarters = quarterKeys.slice(-10)
              const overviewPoints = lastQuarters.map((k) => {
                const m = map[k]
                return {
                  id: m.lastId,
                  quarterKey: k,
                  time: formatChartTime(new Date(m.lastTimestamp)),
                  timestamp: new Date(m.lastTimestamp).toISOString(),
                  temperature: Number(m.sumTemp / m.count) || 0,
                  humidity: Number(m.sumHum / m.count) || 0,
                }
              })
              setOverviewData(overviewPoints)
        }

        // Fetch recent activity (latest 5 rows). We'll store as FIFO (oldest->newest)
        const { data: recentList } = await supabase
          .from('sensor_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (recentList) setRecentActivity(recentList.reverse())

        // Fetch overview data (latest 10 rows) for the overview chart (oldest->newest)
        const { data: overviewList } = await supabase
          .from('sensor_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (overviewList) {
          setOverviewData(
            overviewList
                  .reverse()
                  .map((item) => ({
                    id: item.id,
                    time: formatChartTime(new Date(item.created_at)),
                    timestamp: new Date(item.created_at).toISOString(),
                    temperature: item.temperature,
                    humidity: item.humidity,
                  })),
          )
        }

        // Set up real-time subscription
        // Subscribe to inserts on sensor_data (no time filter) to ensure realtime matches DB
        subscription = supabase
          .channel("sensor_changes")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "sensor_data",
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
      case "water":
        // Good if above 20% (has water), warn if low
        return value > 20 ? "text-green-500" : "text-yellow-500"
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
            title="Kapasitas Tangki Air"
            icon={<FaTint />}
            value={
              sensorStatus === 'offline'
                ? 'Offline'
                : `${sensorData.water_percent}% (${Math.round((sensorData.water_percent / 100) * TANK_CAPACITY_LITERS)} L)`
            }
            unit=""
            normalRange="-"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.water_percent, 'water')}
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
              data={overviewData}
              darkMode={isDarkMode}
            />
          )}

          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
              Aktivitas Terbaru
            </h3>
            {sensorStatus === "offline" ? (
              <p className={`text-sm text-red-500`}>Sensor offline - tidak ada data terbaru</p>
            ) : (
              <div className="space-y-3">
                {recentActivity && recentActivity.length > 0 ? (
                  [...recentActivity].slice().reverse().map((item) => {
                    const time = new Date(item.created_at).toLocaleString()
                    const waterPercent = item.water_percent ?? 0
                    const liters = Math.round((waterPercent / 100) * TANK_CAPACITY_LITERS)
                    return (
                      <div key={item.id} className={`flex items-start justify-between ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        <div>
                          <div className="text-sm font-medium">{time}</div>
                          <div className="text-xs text-gray-500">
                            Suhu: {item.temperature}°C • Kelembaban: {item.humidity}% • Air: {waterPercent}% ({liters} L)
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Belum ada aktivitas tercatat</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
