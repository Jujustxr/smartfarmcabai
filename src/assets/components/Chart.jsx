import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { FaChartLine } from 'react-icons/fa';
import useDarkMode from '../hooks/useDarkMode';

const Chart = ({ title = "Real-time Chart", data = [], darkMode }) => {
  const { isDarkMode: globalDarkMode } = useDarkMode();
  const docDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const isDarkMode = darkMode !== undefined ? darkMode : (globalDarkMode ?? docDark);

  const filteredData = useMemo(() => {
    if (!data || !data.length) return [];
    return data
      .map((item) => {
        // Normalize fields and types
        const ts = item.timestamp ? new Date(item.timestamp) : item.time ? (() => {
          const parts = `${item.time}`.split(':').map(Number);
          const d = new Date();
          d.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
          return d;
        })() : new Date();

        return {
          id: item.id ?? item.quarterKey ?? ts.toISOString(),
          time: item.time ?? ts.toLocaleTimeString(),
          timestamp: ts.toISOString(),
          parsedTimestamp: ts,
          temperature: Number(item.temperature) || 0,
          humidity: Number(item.humidity) || 0,
        }
      })
      .sort((a, b) => a.parsedTimestamp - b.parsedTimestamp)
  }, [data]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[300px]">
      <FaChartLine className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
      <p className={`text-lg font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        Belum ada data untuk periode ini
      </p>
    </div>
  );

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{title}</h3>
      </div>

      <div className="relative">
        {(() => {
          try {
            if (filteredData.length > 0) {
              return (
                <div className="w-full">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredData}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={isDarkMode ? '#334155' : '#E5E7EB'}
                        />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(val) => {
                            try {
                              const d = new Date(val)
                              return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            } catch (err) {
                              return val
                            }
                          }}
                          stroke={isDarkMode ? '#CBD5E1' : '#1F2937'}
                        />
                        <YAxis 
                          stroke={isDarkMode ? '#CBD5E1' : '#1F2937'}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                            borderColor: isDarkMode ? '#334155' : '#E5E7EB',
                            color: isDarkMode ? '#CBD5E1' : '#1F2937'
                          }}
                          labelFormatter={(label) => {
                            // format timestamp label
                            try {
                              const d = new Date(label)
                              return d.toLocaleString()
                            } catch (err) { return label }
                          }}
                          formatter={(value, name) => [`${value}`, `${name}`]}
                          cursor={{ stroke: isDarkMode ? '#334155' : '#E5E7EB', strokeWidth: 1 }}
                        />
                        <Legend verticalAlign="bottom" align="center" />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          name="Suhu (°C)"
                          stroke="#EF4444"
                          dot={false}
                          isAnimationActive={false}
                          activeDot={{ r: 6 }}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          name="Kelembaban (%)"
                          stroke="#3B82F6"
                          dot={false}
                          isAnimationActive={false}
                          activeDot={{ r: 6 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className={`text-center p-3 rounded-lg ${
                      isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        {filteredData[filteredData.length - 1]?.temperature}°C
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>Suhu Saat Ini</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${
                      isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {filteredData[filteredData.length - 1]?.humidity}%
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>Kelembaban Saat Ini</div>
                    </div>
                  </div>
                </div>
              )
            }
            return <EmptyState />
          } catch (err) {
            console.error('Chart render error:', err)
            return (
              <div className="p-6 text-center">
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Terjadi kesalahan saat menampilkan grafik.</p>
              </div>
            )
          }
        })()}
      </div>
    </div>
  )
}

export default React.memo(Chart, (prevProps, nextProps) => {
  // If dark mode changed - re-render
  if (prevProps.darkMode !== nextProps.darkMode) return false
  // If data length differs - re-render
  const pLen = prevProps.data?.length ?? 0
  const nLen = nextProps.data?.length ?? 0
  if (pLen !== nLen) return false
  // If last item timestamp differs - re-render
  const pLastTs = prevProps.data?.[pLen - 1]?.timestamp
  const nLastTs = nextProps.data?.[nLen - 1]?.timestamp
  if (pLastTs !== nLastTs) return false
  return true // skip re-render if no relevant change
})