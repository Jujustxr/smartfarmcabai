import { useEffect, useState, useCallback } from "react";
import Card from '../components/Card';
import Chart from '../components/Chart';
import { FaThermometerHalf, FaTint, FaFlask } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { supabase } from "../../lib/supabaseClient";

const Dashboard = ({ isDarkMode }) => {
  const [sensorData, setSensorData] = useState({
    suhu: 0,
    kelembaban: 0,
    ph: 0,
    pompa: "Mati"
  });
  const [chartData, setChartData] = useState([]);
  const [sensorStatus, setSensorStatus] = useState("offline");
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Format timestamp for chart
  const formatChartTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Handle new sensor data
  const handleNewSensorData = useCallback((newData) => {
    const timestamp = new Date(newData.created_at);
    setLastUpdateTime(timestamp);

    // Update sensor cards
    setSensorData({
      suhu: newData.temperature,
      kelembaban: newData.humidity,
      ph: newData.soil_percent,
      pompa: newData.pump_status || "Auto"
    });

    // Update chart data
    setChartData(prev => [...prev, {
      time: formatChartTime(timestamp),
      temperature: newData.temperature,
      humidity: newData.humidity
    }].slice(-100)); // Keep last 100 readings

    setSensorStatus('online');
  }, []);

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      try {
        // Get latest sensor reading
        const { data: latestData } = await supabase
          .from('sensor_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestData) {
          handleNewSensorData(latestData);
        }

        // Get historical data for chart
        const { data: historyData } = await supabase
          .from('sensor_data')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(100);

        if (historyData) {
          setChartData(historyData.map(item => ({
            time: formatChartTime(item.created_at),
            temperature: item.temperature,
            humidity: item.humidity
          })));
        }

        // Setup real-time subscription
        subscription = supabase
          .channel('sensor_changes')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'sensor_data',
              filter: `created_at=gt.${new Date().toISOString()}`
            },
            (payload) => handleNewSensorData(payload.new)
          )
          .subscribe();

      } catch (error) {
        console.error("Error initializing dashboard:", error);
        setSensorStatus('offline');
      }
    };

    initialize();

    // Monitor sensor status
    const statusCheck = setInterval(() => {
      if (lastUpdateTime) {
        const timeSinceLastUpdate = (new Date() - lastUpdateTime) / 1000;
        if (timeSinceLastUpdate > 10) {
          setSensorStatus('offline');
        }
      }
    }, 5000);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      clearInterval(statusCheck);
    };
  }, [handleNewSensorData, lastUpdateTime]);

  // Helper function to render sensor value or offline message
  const renderSensorValue = (value, unit) => {
    if (sensorStatus === 'offline') {
      return 'Offline';
    }
    return `${value}${unit}`;
  };

  // Helper function to get status color
  const getStatusColor = (value, type) => {
    if (sensorStatus === 'offline') return 'text-red-500';
    
    switch (type) {
      case 'temperature':
        return value >= 25 && value <= 32 ? 'text-green-500' : 'text-yellow-500';
      case 'humidity':
        return value >= 60 && value <= 80 ? 'text-green-500' : 'text-yellow-500';
      case 'ph':
        return value >= 6.0 && value <= 7.0 ? 'text-green-500' : 'text-yellow-500';
      default:
        return isDarkMode ? 'text-slate-100' : 'text-gray-800';
    }
  };

  return (
    <div className={`p-6 min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}> 
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced status message */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Dashboard</h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Overview sistem monitoring Smart Farm Cabai</p>
          <div className="mt-4">
            <p className={`font-semibold ${sensorStatus === "online" ? 'text-green-500' : 'text-red-500'}`}>
              Status Sensor: {sensorStatus.toUpperCase()}
            </p>
            {sensorStatus === 'offline' && (
              <div className="mt-2 p-4 bg-red-100 border border-red-400 rounded-md">
                <p className="text-red-700">⚠️ Sensor sedang offline. Mohon periksa:</p>
                <ul className="list-disc ml-6 mt-2 text-red-600">
                  <li>Koneksi WiFi pada perangkat sensor</li>
                  <li>Power supply sensor</li>
                  <li>Koneksi internet</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Cards with offline state handling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            title="Sensor Suhu" 
            icon={<FaThermometerHalf />} 
            value={renderSensorValue(sensorData.suhu, "°C")}
            unit=""
            normalRange="25-32°C"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.suhu, 'temperature')}
          />
          <Card 
            title="Sensor Kelembaban" 
            icon={<FaTint />} 
            value={renderSensorValue(sensorData.kelembaban, "%")}
            unit=""
            normalRange="60-80%"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.kelembaban, 'humidity')}
          />
          <Card 
            title="Sensor pH Tanah" 
            icon={<FaFlask />} 
            value={renderSensorValue(sensorData.ph, "")}
            unit=""
            normalRange="6.0-7.0"
            darkMode={isDarkMode}
            statusColor={getStatusColor(sensorData.ph, 'ph')}
          />
          <Card 
            title="Status Pompa Air" 
            icon={<FaGear />} 
            value={sensorStatus === 'offline' ? 'Offline' : sensorData.pompa}
            unit=""
            normalRange="Auto Mode"
            darkMode={isDarkMode}
            statusColor={sensorStatus === 'offline' ? 'text-red-500' : 'text-green-500'}
          />
        </div>

        {/* Charts & Recent Activity with offline state */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sensorStatus === 'offline' ? (
            <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800'}`}>
              <div className="text-center py-8">
                <FaThermometerHalf className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <p className="text-red-500 font-semibold mb-2">Chart tidak tersedia - Sensor offline</p>
                <p className="text-sm text-gray-500">Data akan ditampilkan kembali setelah sensor online</p>
              </div>
            </div>
          ) : (
            <Chart 
              title="Overview Suhu & Kelembaban" 
              data={chartData} 
              timeRanges={['1H','3H','6H']} 
              darkMode={isDarkMode} 
            />
          )}
          
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
              Aktivitas Terbaru
            </h3>
            <p className={`text-sm ${sensorStatus === 'offline' ? 'text-red-500' : 'text-gray-500'}`}>
              {sensorStatus === 'offline' 
                ? 'Sensor offline - tidak ada data terbaru' 
                : `Update terakhir: ${lastUpdateTime ? new Date(lastUpdateTime).toLocaleString() : 'Belum ada data'}`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
