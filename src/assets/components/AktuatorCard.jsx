import useDarkMode from '../hooks/useDarkMode'

const AktuatorCard = ({ 
  name, 
  description, 
  icon, 
  status, 
  onToggle, 
  color = 'blue',
  darkMode
}) => {
  const { isDarkMode: globalDarkMode } = useDarkMode()
  const isDarkMode = darkMode !== undefined ? darkMode : globalDarkMode

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        bg: isActive ? 'bg-blue-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-300'),
        text: isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400' : 'text-gray-600'),
        border: isDarkMode ? 'border-blue-400' : 'border-blue-200',
        bgLight: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
      },
      green: {
        bg: isActive ? 'bg-green-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-300'),
        text: isActive ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-slate-400' : 'text-gray-600'),
        border: isDarkMode ? 'border-green-400' : 'border-green-200',
        bgLight: isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
      },
      yellow: {
        bg: isActive ? 'bg-yellow-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-300'),
        text: isActive ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') : (isDarkMode ? 'text-slate-400' : 'text-gray-600'),
        border: isDarkMode ? 'border-yellow-400' : 'border-yellow-200',
        bgLight: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
      },
      purple: {
        bg: isActive ? 'bg-purple-500' : (isDarkMode ? 'bg-slate-600' : 'bg-gray-300'),
        text: isActive ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : (isDarkMode ? 'text-slate-400' : 'text-gray-600'),
        border: isDarkMode ? 'border-purple-400' : 'border-purple-200',
        bgLight: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(color, status)

  return (
    <div className={`p-6 rounded-lg shadow-md border transition-all duration-300 hover:shadow-lg ${
      isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
    } ${colorClasses.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${colorClasses.bgLight} ${colorClasses.text}`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-slate-100' : 'text-gray-800'
            }`}>{name}</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>{description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            {status ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        
        <button
          onClick={onToggle}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
            ${colorClasses.bg}
            focus:ring-${color}-500
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${status ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  )
}

export default AktuatorCard