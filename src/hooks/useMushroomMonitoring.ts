import { useState, useEffect } from 'react';
import axios from 'axios';

const THINGER_API_URL = 'https://backend.thinger.io/v3/users';
const USERNAME = "subektibimowicaksono";
const DEVICE_ID = "grow_matic";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ0b2tlbl9kYXNoYm9hcmQiLCJzdnIiOiJhcC1zb3V0aGVhc3QuYXdzLnRoaW5nZXIuaW8iLCJ1c3IiOiJzdWJla3RpYmltb3dpY2Frc29ubyJ9.7HTrMx-WqDai4QAEkje9OLYZ61GJFpnMUp5D_8EE7BQ";

export default function useMushroomMonitoring() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    fanStatus: false,
    pumpStatus: false,
    mode: 'auto'
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time data from Thinger.io
  const fetchThingerData = async () => {
    try {
      const [sensorRes, relayRes, modeRes] = await Promise.all([
        axios.get(`${THINGER_API_URL}/${USERNAME}/devices/${DEVICE_ID}/resources/sensor`, {
          headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        }),
        axios.get(`${THINGER_API_URL}/${USERNAME}/devices/${DEVICE_ID}/resources/relay`, {
          headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        }),
        axios.get(`${THINGER_API_URL}/${USERNAME}/devices/${DEVICE_ID}/resources/mode`, {
          headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        })
      ]);

      setSensorData({
        temperature: sensorRes.data.temperature,
        humidity: sensorRes.data.humidity,
        fanStatus: relayRes.data.fanStatus,
        pumpStatus: relayRes.data.pumpStatus,
        mode: modeRes.data ? 'auto' : 'manual'
      });
      
      // Save to database
      await saveToDatabase(sensorRes.data.temperature, sensorRes.data.humidity);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save data to your database
  const saveToDatabase = async (temp, hum) => {
    try {
      await axios.post('https://growmatic.tifpsdku.com/api/save-data', {
        temperature: temp,
        humidity: hum
      });
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get('https://growmatic.tifpsdku.com/api/get-data');
      setHistoricalData(response.data.slice(0, 7).reverse());
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  // Control devices
  const controlDevice = async (device, status) => {
    try {
      await axios.post(
        `${THINGER_API_URL}/${USERNAME}/devices/${DEVICE_ID}/resources/${device}`,
        status,
        { headers: { 'Authorization': `Bearer ${API_TOKEN}` } }
      );
      
      setSensorData(prev => ({
        ...prev,
        [`${device}Status`]: status
      }));
    } catch (err) {
      console.error(`Error controlling ${device}:`, err);
    }
  };

  // Set mode
  const setMode = async (mode) => {
    try {
      await axios.post(
        `${THINGER_API_URL}/${USERNAME}/devices/${DEVICE_ID}/resources/mode`,
        mode === 'auto',
        { headers: { 'Authorization': `Bearer ${API_TOKEN}` } }
      );
      
      setSensorData(prev => ({
        ...prev,
        mode
      }));
    } catch (err) {
      console.error('Error setting mode:', err);
    }
  };

  useEffect(() => {
    fetchThingerData();
    fetchHistoricalData();
    
    const interval = setInterval(() => {
      fetchThingerData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    sensorData,
    historicalData,
    loading,
    error,
    controlDevice,
    setMode
  };
}