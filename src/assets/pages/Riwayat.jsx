import React, { useState } from 'react'
import { 
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaFilter,
  FaClock,
  FaDownload,
  FaThermometerHalf
} from 'react-icons/fa'

const Riwayat = ({ isDarkMode }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')

  const periods = [
    { value: '24h', label: '24 Jam' },
    { value: '7d', label: '7 Hari' },
    { value: '30d', label: '30 Hari' },
    { value: '90d', label: '3 Bulan' }
  ]

  const metrics = [
    { value: 'all', label: 'Semua Parameter' },
    { value: 'temperature', label: 'Suhu' },
    { value: 'humidity', label: 'Kelembaban' },
    { value: 'ph', label: 'pH Tanah' },
    { value: 'soil', label: 'Kelembaban Tanah' }
  ]

  const historyData = [
    {
      date: '2025-09-23',
      time: '14:30',
      type: 'sensor',
      parameter: 'Suhu',
      value: '32°C',
      status: 'warning',
      message: 'Suhu melebihi batas normal'
    },
    {
      date: '2025-09-23',
      time: '14:25',
      type: 'actuator',
      parameter: 'Pompa Air',
      value: 'ON',
      status: 'success',
      message: 'Pompa air dihidupkan secara otomatis'
    },
    {
      date: '2025-09-23',
      time: '14:20',
      type: 'sensor',
      parameter: 'Kelembaban Tanah',
      value: '42%',
      status: 'error',
      message: 'Kelembaban tanah sangat rendah'
    },
    {
      date: '2025-09-23',
      time: '12:15',
      type: 'actuator',
      parameter: 'Kipas',
      value: 'ON',
      status: 'success',
      message: 'Kipas dihidupkan untuk sirkulasi udara'
    },
    {
      date: '2025-09-23',
      time: '10:00',
      type: 'sensor',
      parameter: 'pH',
      value: '6.5',
      status: 'success',
      message: 'pH tanah dalam kondisi optimal'
    },
    {
      date: '2025-09-22',
      time: '18:30',
      type: 'actuator',
      parameter: 'Lampu LED',
      value: 'ON',
      status: 'success',
      message: 'Pencahayaan tambahan dimulai'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return isDarkMode 
          ? 'bg-green-900/30 text-green-400 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return isDarkMode 
          ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return isDarkMode 
          ? 'bg-red-900/30 text-red-400 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-200'
      default:
        return isDarkMode 
          ? 'bg-slate-700 text-slate-300 border-slate-600' 
          : 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    if (type === 'sensor') {
      return <FaChartLine className="w-5 h-5" />
    }
    return <FaClock className="w-5 h-5" />
  }

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Riwayat Data</h1>
          <p className={`${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>Catatan historis sistem monitoring dan kontrol</p>
        </div>

        {/* Filters */}
        <div className={`p-6 rounded-lg shadow-md mb-6 ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Periode Waktu
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-slate-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Parameter
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-slate-100' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {metrics.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Total Events</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-slate-100' : 'text-gray-800'
                }`}>156</p>
              </div>
              <div className={`p-3 rounded-full ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaInfoCircle className={`w-6 h-6 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Alerts</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>8</p>
              </div>
              <div className={`p-3 rounded-full ${
                isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'
              }`}>
                <FaExclamationTriangle className={`w-6 h-6 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Uptime</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>99.2%</p>
              </div>
              <div className={`p-3 rounded-full ${
                isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <FaCheckCircle className={`w-6 h-6 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Avg Temp</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>28.5°C</p>
              </div>
              <div className={`p-3 rounded-full ${
                isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'
              }`}>
                <FaThermometerHalf className={`w-6 h-6 ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md mb-6 ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-slate-100' : 'text-gray-800'
          }`}>Grafik Historis</h3>
          <div className={`h-64 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
          }`}>
            <p className={`${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>Grafik data historis akan ditampilkan di sini</p>
          </div>
        </div>

        <div className={`rounded-lg shadow-md ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className={`p-6 border-b ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-slate-100' : 'text-gray-800'
            }`}>Log Aktivitas</h3>
          </div>
          <div className={`divide-y ${
            isDarkMode ? 'divide-slate-700' : 'divide-gray-200'
          }`}>
            {historyData.map((event, index) => (
              <div key={index} className={`p-6 transition-colors ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full border ${getStatusColor(event.status)}`}>
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-sm font-semibold ${
                          isDarkMode ? 'text-slate-100' : 'text-gray-800'
                        }`}>
                          {event.parameter} - {event.value}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>{event.message}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        }`}>{event.date}</p>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        }`}>{event.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`p-6 border-t text-center ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <button className={`px-6 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}>
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Riwayat