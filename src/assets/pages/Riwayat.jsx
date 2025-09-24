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

const Riwayat = () => {
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
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    if (type === 'sensor') {
      return <FaChartLine className="w-5 h-5" />
    }
    return <FaClock className="w-5 h-5" />
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Data</h1>
          <p className="text-gray-600">Catatan historis sistem monitoring dan kontrol</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode Waktu
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parameter
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaInfoCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Uptime</p>
                <p className="text-2xl font-bold text-green-600">99.2%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Temp</p>
                <p className="text-2xl font-bold text-orange-600">28.5°C</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaThermometerHalf className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Historical Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Historis</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Grafik data historis akan ditampilkan di sini</p>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Log Aktivitas</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {historyData.map((event, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(event.status)}`}>
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          {event.parameter} - {event.value}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{event.date}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More */}
          <div className="p-6 border-t border-gray-200 text-center">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Riwayat