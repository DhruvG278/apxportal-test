"use client";
import { useEffect, useState } from "react";

interface Enquiry {
  id: string;
  Lead_Status?: string;
  Created_Time?: string;
  Programs_Interested_In1?: string;
  Full_Name?: string;
  Email?: string;
  Phone?: string;
  Parent_First_Name?: string;
  Parent_Last_Name?: string;
  School_Year_Level?: string;
  Who_Are_You?: string;
  Gender?: string;
  Date_of_Birth?: string;
  Country?: string;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
  moreRecords: boolean;
  count: number;
}

export default function EnquiriesPage() {
  const [data, setData] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({ status: "", gender: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Set up debounce timeout
    const handler = setTimeout(() => {
      fetchData(page, filters, search);
    }, 500); // 500ms delay — adjust as needed

    // Cleanup function — runs before next effect or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [page, filters, search]);
  const fetchData = async (
    pageNum: number,
    filters: any,
    searchValue: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/zoho/enquires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageNum,
          filters,
          search: searchValue,
        }),
      });
      const result = await res.json();
      setData(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    "Enquiry Status",
    "Created Time",
    "Programs Interested In",
    "Full Name",
    "Email",
    "Phone",
    "Parent First Name",
    "Parent Last Name",
    "School Year Level",
    "Who Are You?",
    "Gender",
    "Date of Birth",
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Enquiries</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search name, email, phone..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-72 focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="To Contact">To Contact</option>
          <option value="Welcome Call Attempted">Welcome Call Attempted</option>
          <option value="Welcome Call/Video Call Completed">
            Welcome Call/Video Call Completed
          </option>
          <option value="Follow up call">Follow up call</option>
          <option value="Unqualified enquiry">Unqualified enquiry</option>
          <option value="Spam enquiry">Spam enquiry</option>
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.gender}
          onChange={(e) => handleFilterChange("gender", e.target.value)}
        >
          <option value="">All Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* TABLE - desktop */}
      <div className="hidden md:block overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No enquiries found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-sm">
                    {row.Lead_Status || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {row.Created_Time
                      ? new Date(row.Created_Time).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {row.Programs_Interested_In1 || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">{row.Full_Name || "-"}</td>
                  <td className="px-4 py-2 text-sm">{row.Email || "-"}</td>
                  <td className="px-4 py-2 text-sm">{row.Phone || "-"}</td>
                  <td className="px-4 py-2 text-sm">
                    {row.Parent_First_Name || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {row.Parent_Last_Name || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {row.School_Year_Level || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {row.Who_Are_You || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm">{row.Gender || "-"}</td>
                  <td className="px-4 py-2 text-sm">
                    {row.Date_of_Birth || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW - mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No enquiries found</p>
        ) : (
          data.map((row, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow-sm border space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">
                  {row.Full_Name || "Unnamed"}
                </span>
                <span className="text-xs text-gray-500">
                  {row.Created_Time
                    ? new Date(row.Created_Time).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {row.Lead_Status || "-"}
                </p>
                <p>
                  <span className="font-medium">Gender:</span>{" "}
                  {row.Gender || "-"}
                </p>
                <p>
                  <span className="font-medium">Program:</span>{" "}
                  {row.Programs_Interested_In1 || "-"}
                </p>
                <p>
                  <span className="font-medium">Year:</span>{" "}
                  {row.School_Year_Level || "-"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {row.Email || "-"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {row.Phone || "-"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-6 text-sm">
          <p className="text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={`px-3 py-1 border rounded-md ${
                page === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <button
              disabled={!pagination.moreRecords}
              onClick={() =>
                setPage((p) =>
                  pagination && pagination.currentPage < pagination.totalPages
                    ? p + 1
                    : p
                )
              }
              className={`px-3 py-1 border rounded-md ${
                !pagination.moreRecords
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
