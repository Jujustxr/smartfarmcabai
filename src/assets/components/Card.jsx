const Card = ({ 
  title, 
  icon, 
  value, 
  unit, 
  status = 'normal', 
  normalRange, 
  bgColor = 'bg-white',
  borderColor = 'border-green-500',
  iconBg = 'bg-green-100',
  iconColor = 'text-green-600',
  valueColor = 'text-gray-800'
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

  const getStatusText = (status) => {
    switch(status) {
      case 'normal':
        return 'Normal'
      case 'warning':
        return 'Peringatan'
      case 'danger':
        return 'Bahaya'
      case 'offline':
        return 'Offline'
      default:
        return 'Normal'
    }
  }

  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md border-l-4 ${borderColor} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${iconBg} p-3 rounded-full`}>
            <div className={`w-6 h-6 ${iconColor}`}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {normalRange && (
              <p className="text-sm text-gray-500">Range: {normalRange}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${getStatusColor(status)} rounded-full animate-pulse`}></div>
          <span className="text-sm font-medium text-gray-600">{getStatusText(status)}</span>
        </div>
      </div>
      
      <div className="text-center">
        <div className={`text-4xl font-bold ${valueColor} mb-2`}>
          {value}{unit && <span className="text-2xl ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

export default Card
