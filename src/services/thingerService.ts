const API_BASE = 'http://127.0.0.1:8000/api';

interface SensorData {
  temperature: number;
  humidity: number;
  fanStatus: boolean;
  pumpStatus: boolean;
  mode: 'otomatis' | 'manual';
}

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// Helper function to redirect to login if not authenticated
function checkAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/';
    throw new Error('Authentication required');
  }
}

// Modified API functions to include authorization
export async function getSensorData(): Promise<SensorData> {
  checkAuth();
  
  const response = await fetch(`${API_BASE}/sensor-data/latest`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    credentials: 'include'
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('auth_token');
    checkAuth();
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export async function setMode(mode: 'otomatis' | 'manual'): Promise<void> {
  checkAuth();
  
  const response = await fetch(`${API_BASE}/relay-control/update-mode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ mode }),
    credentials: 'include'
  });
  
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    checkAuth();
  }
  
  if (!response.ok) throw new Error(`Failed to set mode`);
}

// Similar modifications for setPumpStatus and setFanStatus
export async function setPumpStatus(status: boolean): Promise<void> {
  checkAuth();
  
  const response = await fetch(`${API_BASE}/relay-control/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ status_relay: status }),
    credentials: 'include'
  });
  
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    checkAuth();
  }
  
  if (!response.ok) throw new Error(`Failed to set pump status`);
}

export async function setFanStatus(status: boolean): Promise<void> {
  checkAuth();
  
  const response = await fetch(`${API_BASE}/relay-control/update-fan-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ status_relay_fan: status }),
    credentials: 'include'
  });
  
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    checkAuth();
  }
  
  if (!response.ok) throw new Error(`Failed to set fan status`);
}