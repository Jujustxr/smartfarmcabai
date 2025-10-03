"use client"

import useDarkMode from "../hooks/useDarkMode"

const SensorCard = ({ title, icon, value, unit, normalRange, progressValue = 0, darkMode }) => {
  const { isDarkMode: globalDarkMode } = useDarkMode()
  const isDarkMode = darkMode !== undefined ? darkMode : globalDarkMode

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
        isDarkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-emerald-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && <div className={`w-6 h-6 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>{icon}</div>}
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>{title}</h3>
        </div>
      </div>

      <div className="text-center">
        <div className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
          {value}
          {unit && <span className="text-2xl">{unit}</span>}
        </div>
        {normalRange && (
          <div className={`text-sm mb-4 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            Normal Range: {normalRange}
          </div>
        )}
        {progressValue > 0 && (
          <div className={`w-full rounded-full h-2 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isDarkMode ? "bg-emerald-500" : "bg-emerald-500"
              }`}
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SensorCard
