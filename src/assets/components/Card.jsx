import useDarkMode from '../hooks/useDarkMode'

const Card = ({ 
  title, 
  icon, 
  value, 
  unit, 
  normalRange,
  darkMode
}) => {
  const { isDarkMode: globalDarkMode } = useDarkMode()
  const isDarkMode = darkMode !== undefined ? darkMode : globalDarkMode

  return (
    <div className={`p-6 rounded-lg shadow-md border-l-4 transition-all duration-300 hover:shadow-lg ${
      isDarkMode 
        ? 'bg-slate-800 border-emerald-400 hover:bg-slate-700' 
        : 'bg-white border-pink-500 hover:bg-pink-50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${
            isDarkMode 
              ? 'bg-emerald-900/30' 
              : 'bg-pink-100'
          }`}>
            <div className={`w-6 h-6 ${
              isDarkMode 
                ? 'text-emerald-400' 
                : 'text-pink-600'
            }`}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode 
                ? 'text-slate-100' 
                : 'text-slate-800'
            }`}>{title}</h3>
            {normalRange && (
              <p className={`text-sm ${
                isDarkMode 
                  ? 'text-slate-400' 
                  : 'text-slate-500'
              }`}>Range: {normalRange}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`text-4xl font-bold mb-2 ${
          isDarkMode 
            ? 'text-slate-100' 
            : 'text-slate-800'
        }`}>
          {value}{unit && <span className="text-2xl ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

export default Card
