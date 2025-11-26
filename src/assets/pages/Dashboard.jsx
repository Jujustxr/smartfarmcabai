"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import Card from "../components/Card"
import Chart from "../components/Chart"
import { FaThermometerHalf, FaTint } from "react-icons/fa"
import { FaGear } from "react-icons/fa6"
import { supabase } from "../../lib/supabaseClient"

const Dashboard = ({ isDarkMode }) => {
  // Default tank capacity (liters). Adjust if you know the tank capacity in your project.
  const TANK_CAPACITY_LITERS = 200
  const CHART_FLUSH_MS = 2000 // flush interval to reduce updates
  const CHART_MAX_POINTS = 100

  // Helper to format a date/time consistently for Chart & Overview labels
  const formatChartTime = (date) => {
    try {
      if (!date) return ""
      const d = new Date(date)
      // Show hours:minutes:seconds for clarity; Chart component will convert timestamps as needed
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch (err) {
      return String(date)
    }
  }

  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0,
    ph: 0,
    water_percent: 0,
    water_adc: 0,
    pompa: "Mati",
  })
  const [chartData, setChartData] = useState([]) // uses numeric timestamp in .timestamp field
  const chartDataRef = useRef([]) // buffer ref - reduce frequent setState
  const chartFlushIntervalRef = useRef(null)

  // Runtime/connection state
  const [recentActivity, setRecentActivity] = useState([])
  const [sensorStatus, setSensorStatus] = useState("offline")
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [connectionStability, setConnectionStability] = useState({ lastHeartbeats: [], isStable: true })
  const [subscriptionEvents, setSubscriptionEvents] = useState(0)
  const [fetchCounter, setFetchCounter] = useState(0)

  // Overview refs and tracking
  const overviewMapRef = useRef({}) // per-quarter aggregations
  const lastOverviewUpdateRef = useRef(0)
  const lastQuarterKeyRef = useRef(formatChartTime(new Date()))

  // Overview/aggregate state (quarterly) — these were accidentally removed; re-declare here
  const [overviewData, setOverviewData] = useState([])
  const [smoothedOverview, setSmoothedOverview] = useState([])

  // helper for shallow comparison of point arrays (by length+last timestamp+values)
  const arePointsSame = (a, b) => {
    if (!a || !b) return false
    if (a.length !== b.length) return false
    // check first/last timestamps and a median sample value for stability
    const la = a[a.length - 1]
    const lb = b[b.length - 1]
    const fa = a[0]
    const fb = b[0]
    const ma = a[Math.floor(a.length / 2)]
    const mb = b[Math.floor(b.length / 2)]
    if (!la || !lb || !fa || !fb || !ma || !mb) return false
    if (la.timestamp !== lb.timestamp) return false
    if (fa.timestamp !== fb.timestamp) return false
    if (ma.timestamp !== mb.timestamp) return false
    // compare sample value changes (temperature + humidity) to avoid tiny diffs
    if (Math.abs(la.temperature - lb.temperature) > 0.001) return false
    if (Math.abs(la.humidity - lb.humidity) > 0.001) return false
    return true
  }

  // Memoize displayed overview to stabilize prop identity for Chart
  const displayedOverview = useMemo(() => {
    const lastPoints = chartData.slice(-CHART_MAX_POINTS)
    return lastPoints
  }, [chartData])

  // Helper: set overview dataset only if it has changed to avoid unnecessary re-render
  const setOverviewIfChanged = (points, smoothPoints) => {
    setOverviewData((prev) => {
      if (arePointsSame(prev, points)) return prev
      return points
    })
    setSmoothedOverview((prev) => {
      if (arePointsSame(prev, smoothPoints)) return prev
      return smoothPoints
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

    // push new point into chart buffer ref (NO setState here)
    // Use numeric timestamp (ms) and avoid pushing duplicate timestamps
    try {
      const ptTimestampMs = timestamp.getTime()
      const lastPt = chartDataRef.current[chartDataRef.current.length - 1]
      const newTemp = Number(newData.temperature) || 0
      const newHum = Number(newData.humidity) || 0
      // If last exists and timestamp identical
      if (lastPt && lastPt.timestamp === ptTimestampMs) {
        // If values are identical, skip (prevents duplicates/chatter)
        if (Math.abs(lastPt.temperature - newTemp) < 0.001 && Math.abs(lastPt.humidity - newHum) < 0.001) {
          // nothing changed for this timestamp
        } else {
          // replace last point with updated values
          chartDataRef.current[chartDataRef.current.length - 1] = {
            time: formatChartTime(timestamp),
            timestamp: ptTimestampMs,
            temperature: newTemp,
            humidity: newHum,
            id: newData.id ?? null,
          }
        }
      } else {
        // only push monotonically increasing timestamps
        if (!lastPt || ptTimestampMs > lastPt.timestamp) {
          chartDataRef.current.push({
            time: formatChartTime(timestamp),
            timestamp: ptTimestampMs,
            temperature: newTemp,
            humidity: newHum,
            id: newData.id ?? null,
          })
        }
      }
    } catch (err) {
      console.error('Failed push chart point', err)
    }

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

    // no per-quarter overview updates: chart will update via buffered chartDataRef flush

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

  // --- Debug helpers: fetch latest, fetch history, insert test row ---
  const fetchLatest = async () => {
    try {
      setFetchCounter((c) => c + 1)
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) throw error
      if (data && data.length > 0) {
        console.debug('fetchLatest got', data[0])
        handleNewSensorData(data[0])
        return data[0]
      }
      console.debug('fetchLatest: no data returned')
      return null
    } catch (err) {
      console.error('fetchLatest unexpected err', err)
      return null
    }
  }

  const fetchHistory = async (limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(limit)
      if (error) throw error
      console.debug('fetchHistory got', data?.length ?? 0, 'rows')
      return data
    } catch (err) {
      console.error('fetchHistory unexpected err', err)
      return null
    }
  }

  const insertTestRow = async (opts = {}) => {
    try {
      const now = new Date().toISOString()
      const payload = {
        temperature: opts.temperature ?? (Math.random() * 7 + 25).toFixed(2),
        humidity: opts.humidity ?? Math.round(Math.random() * 30 + 50),
        water_percent: opts.water_percent ?? Math.round(Math.random() * 60 + 20),
        water_adc: opts.water_adc ?? Math.round(Math.random() * 4096),
        pump_status: opts.pump_status ?? 'Auto',
        soil_percent: opts.soil_percent ?? Math.round(Math.random() * 100),
        created_at: opts.created_at ?? now,
      }
      const { data, error } = await supabase.from('sensor_data').insert([payload]).select()
      if (error) throw error
      console.debug('insertTestRow inserted', data)
      return data
    } catch (err) {
      console.error('insertTestRow error', err)
      return null
    }
  }

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
              timestamp: new Date(item.created_at).getTime(),
              temperature: Number(item.temperature) || 0,
              humidity: Number(item.humidity) || 0,
            })),
          )

          // no per-quarter overview map — rely on chartData for visual overview
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
          const mappedOverview = overviewList
            .reverse()
            .map((item) => ({
              id: item.id,
              time: formatChartTime(new Date(item.created_at)),
              timestamp: new Date(item.created_at).getTime(),
              temperature: Number(item.temperature) || 0,
              humidity: Number(item.humidity) || 0,
            }))
          // compute basic smoothing, but chart uses chartData directly
          const windowSizeList = 3
          const smoothList = mappedOverview.map((p, i, arr) => {
            const start = Math.max(0, i - Math.floor(windowSizeList / 2))
            const end = Math.min(arr.length - 1, i + Math.floor(windowSizeList / 2))
            const slice = arr.slice(start, end + 1)
            const avgT = slice.reduce((s, it) => s + Number(it.temperature), 0) / slice.length
            const avgH = slice.reduce((s, it) => s + Number(it.humidity), 0) / slice.length
            return {
              ...p,
              temperature: Number(avgT.toFixed(2)),
              humidity: Number(avgH.toFixed(2)),
            }
          })
          // keep initial overview points (not used in real-time)
          setOverviewIfChanged(mappedOverview, smoothList)
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
            (payload) => {
              try {
                console.debug('realtime insert', payload)
                setSubscriptionEvents((s) => s + 1)
                handleNewSensorData(payload.new)
              } catch (e) {
                console.error('realtime handler error', e)
              }
            },
          )
          .subscribe()
      } catch (error) {
        console.error("Error initializing dashboard:", error)
        setSensorStatus("offline")
      }
    }

    initialize()

    const updateOverviewFromMap = () => {
      try {
        const map = overviewMapRef.current || {}
        const currentQuarterKey = quarterKeyForTimestamp(new Date())
        if (currentQuarterKey !== lastQuarterKeyRef.current) {
          lastQuarterKeyRef.current = currentQuarterKey
          const keys = Object.keys(map).sort()
          const completedKeys = keys.filter(k => k < currentQuarterKey)
          const lastKeys = completedKeys.slice(-10)
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
          const window = 3
          const smooth = points.map((p, i, arr) => {
            const start = Math.max(0, i - Math.floor(window / 2))
            const end = Math.min(arr.length - 1, i + Math.floor(window / 2))
            const slice = arr.slice(start, end + 1)
            const avgT = slice.reduce((s, it) => s + Number(it.temperature), 0) / slice.length
            const avgH = slice.reduce((s, it) => s + Number(it.humidity), 0) / slice.length
            return {
              ...p,
              temperature: Number(avgT.toFixed(2)),
              humidity: Number(avgH.toFixed(2)),
            }
          })
          setOverviewIfChanged(points, smooth)
        }
      } catch (err) {
        console.error('updateOverviewFromMap error', err)
      }
    }
    // no overview per-quarter updates - remove timer/logic
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
      clearInterval(statusCheck)
      // no quarterTimer to clear
      if (chartFlushIntervalRef.current) {
        clearInterval(chartFlushIntervalRef.current)
        chartFlushIntervalRef.current = null
      }
    }
  }, [handleNewSensorData, lastUpdateTime, connectionStability.isStable])

  // Flush chart buffer periodically to state to reduce re-renders
  useEffect(() => {
    if (chartFlushIntervalRef.current) return
    chartFlushIntervalRef.current = setInterval(() => {
      const buffer = chartDataRef.current || []
      if (!buffer || buffer.length === 0) return
      setChartData((prev) => {
        // merge and dedup by numeric timestamp to avoid jitter/duplicates
        const merged = [...prev, ...buffer]
        // build map keyed by timestamp (ms)
        const map = new Map()
        for (const it of merged) {
          // Here we prefer the value with latest id or timestamp if duplicates occur
          const existing = map.get(it.timestamp)
          if (!existing || (it.id && existing.id !== it.id)) {
            map.set(it.timestamp, it)
          } else {
            map.set(it.timestamp, it)
          }
        }
        // reconstruct ordered array
        const deduped = Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp)
        // keep last CHART_MAX_POINTS points
        const next = deduped.slice(-CHART_MAX_POINTS)
        if (arePointsSame(prev, next)) return prev
        return next
      })
      chartDataRef.current = []
    }, CHART_FLUSH_MS) // throttle updates

    return () => {
      if (chartFlushIntervalRef.current) {
        clearInterval(chartFlushIntervalRef.current)
        chartFlushIntervalRef.current = null
      }
    }
  }, [])

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

        {/* Debug Panel: Only show when running locally or when dev mode is enabled (keeps UI clean) */}
        <div className="mt-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>Debug Panel</h3>
              <div className="text-xs text-gray-400">Counters: sub {subscriptionEvents} • fetch {fetchCounter}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fetchLatest()}
                className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm"
              >
                Fetch Latest
              </button>
              <button
                onClick={() => fetchHistory(20).then((d) => console.debug('Fetched history', d?.length))}
                className="px-3 py-1 rounded-md bg-gray-600 text-white text-sm"
              >
                Fetch History (20)
              </button>
              <button
                onClick={() => insertTestRow()}
                className="px-3 py-1 rounded-md bg-green-600 text-white text-sm"
              >
                Insert Test Row
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Subscription events will increase when realtime inserts are received. Use Insert Test Row to trigger events from the browser.
            </div>
          </div>
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
              data={displayedOverview}
              darkMode={isDarkMode}
              disableAnimations={true} // pass-through prop — update Chart to respect it if needed
              maxPoints={CHART_MAX_POINTS}
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
