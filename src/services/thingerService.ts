// src/services/thingerService.ts
const API_BASE = 'https://ba5c-202-47-188-225.ngrok-free.app/api'; // Replace with your actual Laravel backend URL
// Note: For production, consider using environment variables for the base URL

// src/services/thingerService.ts
interface SensorData {
  temperature: number;
  humidity: number;
  fanStatus: boolean;
  pumpStatus: boolean;
  mode: 'otomatis' | 'manual'; // Tambahkan ini
}

export async function getSensorData(): Promise<SensorData> {
  const response = await fetch(`${API_BASE}/sensor-data/latest`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include' // If you're using session/cookie authentication
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function setMode(mode: 'otomatis' | 'manual'): Promise<void> {
  const response = await fetch(`${API_BASE}/relay-control/update-mode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ mode }),
    credentials: 'include' // If you're using session/cookie authentication
  });
  
  if (!response.ok) throw new Error(`Failed to set mode`);
}

export async function setPumpStatus(status: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/relay-control/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({  status_relay: status, }),
    credentials: 'include' // If you're using session/cookie authentication
  });
  
  if (!response.ok) throw new Error(`Failed to set pump status`);
}

export async function setFanStatus(status: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/relay-control/update-fan-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({  status_relay_fan: status, }),
    credentials: 'include' // If you're using session/cookie authentication
  });
  
  if (!response.ok) throw new Error(`Failed to set fan status`);
}