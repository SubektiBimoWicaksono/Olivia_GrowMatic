import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { getTableData, TableSensorData, PaginatedSensorData } from "../../../services/thingerService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// Initial state untuk data
const initialDataState: PaginatedSensorData = {
  current_page: 1,
  data: [],
  last_page: 1,
  per_page: 10,
  total: 0
};

export default function SensorDataTable() {
  const [data, setData] = useState<PaginatedSensorData>(initialDataState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    from: null as Date | null,
    to: null as Date | null,
    page: 1,
    perPage: 10,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getTableData(
        filters.from ? filters.from.toISOString().split('T')[0] : undefined,
        filters.to ? filters.to.toISOString().split('T')[0] : undefined,
        filters.page,
        filters.perPage
      );

      // Validasi response dari API
      if (!result || !Array.isArray(result.data)) {
        throw new Error('Invalid data structure from API');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Reset data ke initial state jika terjadi error
      setData(initialDataState);
    } finally {
      setLoading(false);
    }
  };

  // Gunakan useCallback untuk mencegah pembuatan fungsi baru setiap render
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setFilters(prev => ({
      ...prev,
      from: start,
      to: end,
      page: 1, // Reset ke halaman pertama saat filter berubah
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };



// Ganti kode export PDF dengan ini:
const handleExportPDF = async () => {
  const from = filters.from ? filters.from.toISOString().split('T')[0] : undefined;
  const to = filters.to ? filters.to.toISOString().split('T')[0] : undefined;

  try {
    // Ambil semua data sesuai filter tanggal
    const allData = await getTableData(from, to, 1, 1000); // 1000 = limit besar

    const doc = new jsPDF();
    doc.text("Data Sensor Report", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Date Range: ${from || "-"} to ${to || "-"}`,
      14,
      22
    );

    // Siapkan data untuk tabel
    const tableRows = allData.data.map((sensor) => [
      new Date(sensor.created_at).toLocaleString(),
      `${sensor.temperature.toFixed(2)} °C`,
      `${sensor.humidity.toFixed(2)} %`,
      sensor.mode,
      sensor.status_relay ? "ON" : "OFF",
      sensor.status_relay_fan ? "ON" : "OFF",
    ]);

    // Gunakan autoTable langsung
    autoTable(doc, {
      head: [
        [
          "Date & Time",
          "Temperature (°C)",
          "Humidity (%)",
          "Mode",
          "Pump Status",
          "Fan Status",
        ],
      ],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 9 },
    });

    doc.save(`sensor-data-${from || "all"}-to-${to || "all"}.pdf`);
  } catch (err) {
    console.error("Export PDF error:", err);
    alert("Failed to export PDF: " + (err instanceof Error ? err.message : "Unknown error"));
  }
};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Gunakan useEffect dengan dependencies yang tepat
  useEffect(() => {
    const abortController = new AbortController();
    
    fetchData();

    // Cleanup function untuk cancel request jika komponen unmount
    return () => {
      abortController.abort();
    };
  }, [filters.page, filters.from, filters.to]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Filter Controls */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <DatePicker
            selectsRange
            startDate={filters.from}
            endDate={filters.to}
            onChange={handleDateChange}
            placeholderText="Filter by date range"
            className="border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
            isClearable
          />
          <button
            onClick={handleExportPDF}
            className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
            disabled={loading}
            type="button"
          >
            Export PDF
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {filters.page} of {data.last_page}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= data.last_page || loading}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-4 text-center">Loading data...</div>
      )}

      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Date & Time
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Temperature (°C)
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Humidity (%)
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Mode
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Pump Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Fan Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.data.length > 0 ? (
              data.data.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {formatDate(sensor.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {sensor.temperature.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {sensor.humidity.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={sensor.mode === "otomatis" ? "success" : "warning"}
                    >
                      {sensor.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={sensor.status_relay ? "success" : "error"}
                    >
                      {sensor.status_relay ? "ON" : "OFF"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={sensor.status_relay_fan ? "success" : "error"}
                    >
                      {sensor.status_relay_fan ? "ON" : "OFF"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No sensor data found
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}