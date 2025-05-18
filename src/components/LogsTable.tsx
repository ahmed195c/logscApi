// This is a manually fixed version
import { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { fetchLogs } from "../api.js";

// Define the type for our log data based on the API response
type Employee = {
  id: number;
  ceoNumber: string;
  ceoName: string;
  phoneNumber: string;
  jobTtile: string;
  department: string;
  unit: string;
  nationality: string;
};

type Car = {
  id: number;
  carNumber: string;
  vType: string;
  carYear: number;
  cownerName: string;
  section: string;
};

type Log = {
  id: number;
  employee: Employee;
  car: Car;
  carIsInUse: boolean;
  created_at: string;
  taken_date: string;
  taken_time: string;
  ended_at: string;
  return_date: string;
  return_time: string;
  carNote?: string;
};

// Helper function to convert 24-hour time format to AM/PM format
const formatTimeToAMPM = (timeString: string): string => {
  try {
    // Split the time string to get hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Determine if it's AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const displayHours = hours % 12 || 12;

    // Format minutes to always show two digits
    const displayMinutes = minutes.toString().padStart(2, "0");

    // Return formatted time
    return `${displayHours}:${displayMinutes} ${period}`;
  } catch (error) {
    // Return original value if parsing fails
    console.error("Time formatting error:", error);
    return timeString;
  }
};

const columnHelper = createColumnHelper<Log>();

function LogsTable() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [showFilterForm, setShowFilterForm] = useState<boolean>(false);
  const [employeeIdFilter, setEmployeeIdFilter] = useState<string>("");
  const [carNumberFilter, setCarNumberFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.car.carNumber, {
        id: "car_number",
        header: "رقم المركبة",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.employee.ceoNumber, {
        id: "employee_id",
        header: "الرقم الاداري",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.employee.ceoName, {
        id: "employee_name",
        header: "الاســــــــــــــــــــم  ",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("taken_date", {
        header: "تاريخ الاستلام",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("taken_time", {
        header: "وقت الاستلام",
        cell: (info) => {
          const timeValue = info.getValue();
          if (!timeValue) return "-";
          return formatTimeToAMPM(timeValue);
        },
      }),
      columnHelper.accessor("return_date", {
        header: "تاريخ التسليم",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("return_time", {
        header: "وقت التسليم",
        cell: (info) => {
          const timeValue = info.getValue();
          if (!timeValue) return "-";
          return formatTimeToAMPM(timeValue);
        },
      }),
      columnHelper.accessor("carNote", {
        header: "ملاحظات",
        cell: (info) => info.getValue() || "-",
      }),
    ],
    []
  );

  // Function to apply filters to logs data
  const applyFilters = () => {
    const filtered = logs.filter((log) => {
      // Employee ID filter (exact match)
      if (employeeIdFilter && log.employee.ceoNumber !== employeeIdFilter) {
        return false;
      }

      // Car number filter (exact match)
      if (carNumberFilter && log.car.carNumber !== carNumberFilter) {
        return false;
      }

      // Date filter (match by date)
      if (dateFilter && log.taken_date !== dateFilter) {
        return false;
      }

      return true;
    });

    setFilteredLogs(filtered);
    setIsFiltering(true);
    setShowFilterForm(false);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setEmployeeIdFilter("");
    setCarNumberFilter("");
    setDateFilter("");
    setFilteredLogs(logs);
    setIsFiltering(false);
    setShowFilterForm(false);
  };

  useEffect(() => {
    const getLogs = async () => {
      try {
        setLoading(true);
        console.log("Fetching logs data from API...");
        const data = await fetchLogs();
        console.log("API response received:", data);

        // Check if data has the expected structure
        if (data && data.results && Array.isArray(data.results)) {
          setLogs(data.results);
          setFilteredLogs(data.results);
        } else {
          // If API returns direct array instead of paginated structure
          const logsData = Array.isArray(data) ? data : [];
          setLogs(logsData);
          setFilteredLogs(logsData);
        }

        setError(null);
      } catch (err) {
        console.log("API error details:", err);
        setError("Failed to fetch logs data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, []);

  // Set up the table with react-table
  const table = useReactTable({
    data: isFiltering ? filteredLogs : logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-700">
          جاري تحميل البيانات...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-500">
          خطأ في تحميل البيانات
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto" dir="rtl">
     
      {/* Search Button and Show All Logs Button */}
      <div className="flex justify-center mb-4 gap-4 ">
        <button
          onClick={() => setShowFilterForm(!showFilterForm)}
          className={`px-6 py-2 ${
            isFiltering
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium rounded-md shadow transition-colors flex items-center `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isFiltering ? "فلاتر نشطة" : "عرض الفلاتر"}
          {isFiltering && (
            <span className="bg-white text-green-600 text-xs font-bold rounded-full w-6 h-5 flex items-center justify-center mr-2">
              {filteredLogs.length}
            </span>
          )}
        </button>

        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow transition-colors"
        >
          عرض جميع السجلات
        </button>
      </div>

      {/* Filter Section - Conditionally rendered based on showFilterForm */}
      {showFilterForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
           بحث عن طريق
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Employee ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الرقم الاداري 
              </label>
              <input
                type="text"
                value={employeeIdFilter}
                onChange={(e) => setEmployeeIdFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل الرقم الاداري بالضبط..."
              />
            </div>

            {/* Car Number Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم المركبة 
              </label>
              <input
                type="text"
                value={carNumberFilter}
                onChange={(e) => setCarNumberFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل رقم المركبة بالضبط..."
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
               حسب التاريخ
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors"
            >
           بحث
            </button>

            <button
              onClick={() => setShowFilterForm(false)}
              className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-md shadow transition-colors"
            >
              إغلاق
            </button>
          </div>

          {/* Display filter status if filtering is active */}
          {isFiltering && (
            <div className="mt-4 text-center text-sm text-blue-600">
              تم تطبيق التصفية - يتم عرض {filteredLogs.length} من أصل{" "}
              {logs.length} سجل
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
        <table
          className="w-full border-separate border-spacing-5"
          style={{ borderSpacing: "20px" }}
        >
          <thead className="bg-blue-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-8 py-6 text-center text-sm font-bold text-blue-700 tracking-wider bg-blue-50 rounded"
                    dir="rtl"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-8 py-6 text-sm text-gray-700 bg-white rounded shadow-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-8 py-10 text-center text-sm text-gray-500 bg-white rounded shadow-sm"
                >
                  لا يوجد سجلات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Centered */}
      <div className="flex flex-col items-center justify-center mt-6">
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm text-gray-700 font-medium">
            صفحة{" "}
            <span className="font-bold text-blue-600">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            من{" "}
            <span className="font-bold text-blue-600">
              {table.getPageCount()}
            </span>
            {isFiltering && (
              <span className="mr-2">
                {" "}
                - يتم عرض{" "}
                <span className="font-bold text-blue-600">
                  {filteredLogs.length}
                </span>{" "}
                من أصل{" "}
                <span className="font-bold text-blue-600">{logs.length}</span>{" "}
                سجل
              </span>
            )}
          </span>
        </div>
        <div className="flex space-x-4 justify-center space-x-reverse">
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors
              ${
                !table.getCanNextPage()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow"
              }`}
          >
            التالي
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors
              ${
                !table.getCanPreviousPage()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow"
              }`}
          >
            السابق
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogsTable;
