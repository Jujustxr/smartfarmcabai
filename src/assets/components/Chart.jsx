import React, { useState } from 'react'

const Chart = ({ title = "Real-time Chart", data = [], timeRanges = ['1H', '6H', '24H'] }) => {
  const [activeTimeRange, setActiveTimeRange] = useState(timeRanges[0])

  // Filter data berdasarkan time range yang dipilih
  const getFilteredData = () => {
    const now = new Date()
    let hours = 1
    
    switch(activeTimeRange) {
      case '1H':
        hours = 1
        break
      case '6H':
        hours = 6
        break
      case '24H':
        hours = 24
        break
      default:
        hours = 1
    }
    
    const cutoffTime = new Date(now.getTime() - (hours * 60 * 60 * 1000))
    return data.filter(item => new Date(item.timestamp) >= cutoffTime)
  }

  const filteredData = getFilteredData()

  // Fungsi untuk mendapatkan koordinat SVG
  const getSVGCoordinates = (dataPoints, width, height, padding = 40) => {
    if (!dataPoints.length) return []
    
    const maxValue = Math.max(...dataPoints.map(d => Math.max(d.temperature, d.humidity)))
    const minValue = Math.min(...dataPoints.map(d => Math.min(d.temperature, d.humidity)))
    const valueRange = maxValue - minValue || 1
    
    return dataPoints.map((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / (dataPoints.length - 1 || 1)
      const tempY = height - padding - ((point.temperature - minValue) / valueRange) * (height - 2 * padding)
      const humidityY = height - padding - ((point.humidity - minValue) / valueRange) * (height - 2 * padding)
      
      return {
        x,
        tempY,
        humidityY,
        temperature: point.temperature,
        humidity: point.humidity,
        time: point.time
      }
    })
  }

  const chartWidth = 600
  const chartHeight = 300
  const coordinates = getSVGCoordinates(filteredData, chartWidth, chartHeight)

  // Fungsi untuk membuat path SVG
  const createPath = (coords, yKey) => {
    if (!coords.length) return ""
    
    let path = `M ${coords[0].x} ${coords[0][yKey]}`
    coords.slice(1).forEach(coord => {
      path += ` L ${coord.x} ${coord[yKey]}`
    })
    return path
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                activeTimeRange === range
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            {/* Legend */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Suhu (°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Kelembaban (%)</span>
              </div>
            </div>

            {/* Chart SVG */}
            <div className="overflow-x-auto">
              <svg 
                width={chartWidth} 
                height={chartHeight} 
                className="border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Temperature line */}
                {coordinates.length > 1 && (
                  <path
                    d={createPath(coordinates, 'tempY')}
                    stroke="#f97316"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                )}

                {/* Humidity line */}
                {coordinates.length > 1 && (
                  <path
                    d={createPath(coordinates, 'humidityY')}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                )}

                {/* Data points */}
                {coordinates.map((coord, index) => (
                  <g key={index}>
                    {/* Temperature point */}
                    <circle
                      cx={coord.x}
                      cy={coord.tempY}
                      r="4"
                      fill="#f97316"
                      className="hover:r-6 transition-all duration-200"
                    >
                      <title>{`Suhu: ${coord.temperature}°C - ${coord.time}`}</title>
                    </circle>
                    
                    {/* Humidity point */}
                    <circle
                      cx={coord.x}
                      cy={coord.humidityY}
                      r="4"
                      fill="#3b82f6"
                      className="hover:r-6 transition-all duration-200"
                    >
                      <title>{`Kelembaban: ${coord.humidity}% - ${coord.time}`}</title>
                    </circle>
                  </g>
                ))}

                {/* Y-axis labels */}
                {[0, 25, 50, 75, 100].map((value, index) => (
                  <g key={value}>
                    <text
                      x="10"
                      y={chartHeight - 40 - (index * (chartHeight - 80) / 4)}
                      fontSize="10"
                      fill="#6b7280"
                    >
                      {value}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Current Values */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredData[filteredData.length - 1]?.temperature}°C
                </div>
                <div className="text-sm text-gray-600">Suhu Saat Ini</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredData[filteredData.length - 1]?.humidity}%
                </div>
                <div className="text-sm text-gray-600">Kelembaban Saat Ini</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-500 mb-2">📊</div>
              <p className="text-gray-500">Tidak ada data untuk periode {activeTimeRange}</p>
              <p className="text-sm text-gray-400 mt-1">Silakan pilih rentang waktu lain</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chart