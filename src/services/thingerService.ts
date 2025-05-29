// src/services/thingerService.ts
const API_BASE = 'http://localhost:8000/api'; // Replace with your actual Laravel backend URL
// Note: For production, consider using environment variables for the base URL

// src/services/thingerService.ts
interface SensorData {
  temperature: number;
  humidity: number;
  fanStatus: boolean;
  pumpStatus: boolean;
  mode: 'otomatis' | 'manual'; // Tambahkan ini
}



export interface DailySensorData {
  date: string; // format: YYYY-MM-DD
  avg_temperature: number;
  avg_humidity: number;
}


// src/services/thingerService.ts

// Tambahkan interface untuk data tabel
export interface TableSensorData {
  id: number;
  temperature: number;
  humidity: number;
  mode: 'otomatis' | 'manual';
  status_relay: boolean;
  status_relay_fan: boolean;
  created_at: string; // ISO format date string
}

export interface PaginatedSensorData {
  current_page: number;
  data: TableSensorData[];
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * Mendapatkan data sensor untuk tabel dengan filter tanggal
 * @param from Tanggal awal (format YYYY-MM-DD)
 * @param to Tanggal akhir (format YYYY-MM-DD)
 * @param page Halaman saat ini (untuk pagination)
 * @param perPage Jumlah item per halaman
 */
export async function getTableData(
  from?: string,
  to?: string,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedSensorData> {
  // Membangun query parameters
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (from && to) {
    params.append('from', from);
    params.append('to', to);
  }

  const response = await fetch(`${API_BASE}/sensor-data/table?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch table data: ${response.status}`);
  }

  return await response.json();
}

/**
 * Mendapatkan semua data sensor tanpa pagination (untuk ekspor)
 * @param from Tanggal awal (format YYYY-MM-DD)
 * @param to Tanggal akhir (format YYYY-MM-DD)
 */
export async function getAllTableData(
  from?: string,
  to?: string
): Promise<TableSensorData[]> {
  // Membangun query parameters
  const params = new URLSearchParams();
  
  if (from && to) {
    params.append('from', from);
    params.append('to', to);
  }

  const response = await fetch(`${API_BASE}/sensor-data/table/all?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch all table data: ${response.status}`);
  }

  return await response.json();
}

export async function getChartData(): Promise<DailySensorData[]> {
  const response = await fetch(`${API_BASE}/sensor-data/chart`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include' // jika diperlukan autentikasi
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chart data: ${response.status}`);
  }

  return await response.json();
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