import { useState, useMemo } from 'react';
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

const Chart = ({ title = "Real-time Chart", data = [], timeRanges = ['1H', '3H', '6H'], darkMode }) => {
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);
  const { isDarkMode: globalDarkMode } = useDarkMode();
  const isDarkMode = darkMode !== undefined ? darkMode : globalDarkMode;

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    const now = new Date();
    const hours = parseInt(selectedRange);
    const cutoff = new Date(now - hours * 60 * 60 * 1000);

    return data.filter(item => {
      const itemTime = new Date();
      const [hours, minutes, seconds] = item.time.split(':');
      itemTime.setHours(hours, minutes, seconds);
      return itemTime >= cutoff;
    });
  }, [data, selectedRange]);

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
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-slate-100' : 'text-gray-800'
        }`}>{title}</h3>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                selectedRange === range
                  ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-green-100 text-green-700')
                  : (isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {filteredData.length > 0 ? (
          <div className="w-full">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDarkMode ? '#334155' : '#E5E7EB'}
                  />
                  <XAxis 
                    dataKey="time" 
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
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Suhu (°C)"
                    stroke="#EF4444"
                    dot={true}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Kelembaban (%)"
                    stroke="#3B82F6"
                    dot={true}
                    activeDot={{ r: 8 }}
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
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

export default Chart