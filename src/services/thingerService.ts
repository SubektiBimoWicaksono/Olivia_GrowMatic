// src/services/thingerService.ts
const API_BASE = 'https://backend.thinger.io/v3/users/growmatic/devices/growmatic_project/resources';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJncm93bWF0aWNfb2xpdmlhIiwic3ZyIjoiYXAtc291dGhlYXN0LmF3cy50aGluZ2VyLmlvIiwidXNyIjoiZ3Jvd21hdGljIn0.FrNpAk3hemmw59Qo460ESJwXyXNhg15xSv_Jj5Gkkls';

interface SensorData {
  temperature: number;
  humidity: number;
  fanStatus: boolean;
  pumpStatus: boolean;
}

export async function getSensorData(): Promise<SensorData> {
  const response = await fetch(`${API_BASE}/sensor`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function setMode(mode: 'auto' | 'manual'): Promise<void> {
  const response = await fetch(`${API_BASE}/mode`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: mode })
  });
  
  if (!response.ok) throw new Error(`Failed to set mode`);
}

export async function setPumpStatus(status: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/relay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: status })
  });
  
  if (!response.ok) throw new Error(`Failed to set pump status`);
}

export async function setFanStatus(status: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/relay2`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: status })
  });
  
  if (!response.ok) throw new Error(`Failed to set fan status`);
}