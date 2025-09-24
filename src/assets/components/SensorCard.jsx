const SensorCard = ({ 
  title, 
  icon, 
  value, 
  unit, 
  status = 'normal', 
  normalRange, 
  progressValue = 0,
  bgColor = 'bg-white',
  valueColor = 'text-gray-800',
  progressColor = 'bg-green-500'
}) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'normal':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'danger':
        return 'bg-red-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-green-500'
    }
  }

  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-6 h-6 text-gray-600">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className={`w-3 h-3 ${getStatusColor(status)} rounded-full animate-pulse`}></div>
      </div>
      
      <div className="text-center">
        <div className={`text-4xl font-bold ${valueColor} mb-2`}>
          {value}{unit && <span className="text-2xl">{unit}</span>}
        </div>
        {normalRange && (
          <div className="text-sm text-gray-500 mb-4">Normal Range: {normalRange}</div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${progressColor} h-2 rounded-full transition-all duration-300`}
            style={{width: `${progressValue}%`}}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default SensorCard