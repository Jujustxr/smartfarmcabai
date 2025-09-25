import { useEffect, useState, useCallback } from "react";
import Card from '../components/Card';
import Chart from '../components/Chart';
import { FaThermometerHalf, FaTint, FaFlask } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { fetchLatestSensorData, fetchHistoricalData, subscribeToSensorData } from "./API/api";

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
        const latestData = await fetchLatestSensorData();
        if (latestData) {
          handleNewSensorData(latestData);
        }

        // Get historical data for chart
        const historyData = await fetchHistoricalData(100);
        if (historyData) {
          setChartData(historyData.map(item => ({
            time: formatChartTime(item.created_at),
            temperature: item.temperature,
            humidity: item.humidity
          })));
        }

        // Setup real-time subscription
        subscription = subscribeToSensorData(handleNewSensorData);

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

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Dashboard</h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Overview sistem monitoring Smart Farm Cabai</p>
          <p className={`font-semibold mt-2 ${sensorStatus === "online" ? 'text-green-500' : 'text-red-500'}`}>
            Sensor Status: {sensorStatus.toUpperCase()}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card title="Sensor Suhu" icon={<FaThermometerHalf />} value={sensorData.suhu} unit="°C" normalRange="25-32°C" darkMode={isDarkMode} />
          <Card title="Sensor Kelembaban" icon={<FaTint />} value={sensorData.kelembaban} unit="%" normalRange="60-80%" darkMode={isDarkMode} />
          <Card title="Sensor pH Tanah" icon={<FaFlask />} value={sensorData.ph} unit="" normalRange="6.0-7.0" darkMode={isDarkMode} />
          <Card title="Status Pompa Air" icon={<FaGear />} value={sensorData.pompa} unit="" normalRange="Auto Mode" darkMode={isDarkMode} />
        </div>

        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart title="Overview Suhu & Kelembaban" data={chartData} timeRanges={['1H','3H','6H']} darkMode={isDarkMode} />
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Aktivitas Terbaru</h3>
            <p className="text-sm text-gray-500">
              Last update: {lastUpdateTime ? new Date(lastUpdateTime).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
