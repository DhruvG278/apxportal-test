"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

type Application = {
  id: string;
  Full_Name: string;
  Email: string;
  Phone: string;
  Programs_Interested_In?: string;
  Program_Deposit?: string;
  Program_Balance_Payment?: string;
  Created_Time?: string;
  Parent_First_Name?: string;
  Parent_Last_Name?: string;
  Parent_2_Email?: string;
  Matching_Status?: string;
  Interview_Status?: string;
  Contact_Status?: string;
};

export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    program: "",
    status: "",
    matchingStatus: "",
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Debounced fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(handler);
  }, [page, filters, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/zoho/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, search, filters }),
      });
      const json = await res.json();
      setData(json.data || []);
      setPagination(json.pagination || { totalPages: 1 });
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // 🧩 Small UI helper for colored statuses
  const statusBadge = (status?: string) => {
    const colorMap: Record<string, string> = {
      Completed: "bg-green-100 text-green-700",
      "In Progress": "bg-blue-100 text-blue-700",
      "ClustDoc In Progress": "bg-yellow-100 text-yellow-700",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          colorMap[status || ""] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status || "—"}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Applications List
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name..."
            className="border rounded-lg pl-9 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-auto"
            value={filters.program}
            onChange={(e) => handleFilterChange("program", e.target.value)}
          >
            <option value="">All Programs</option>
            <option value="Australia Exchange">Australia Exchange</option>
            <option value="France Exchange">France Exchange</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-auto"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="ClustDoc In Progress">ClustDoc In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 text-sm w-full md:w-auto"
            value={filters.matchingStatus}
            onChange={(e) =>
              handleFilterChange("matchingStatus", e.target.value)
            }
          >
            <option value="">All Matching Status</option>
            <option value="Step 1/4 - Not Started">
              Step 1/4 - Not Started
            </option>
            <option value="Step 2/4 - In Progress">
              Step 2/4 - In Progress
            </option>
            <option value="Step 4/4 - Completed">Step 4/4 - Completed</option>
          </select>
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "Full Name",
                "Program",
                "Deposit",
                "Balance Payment",
                "Parent First",
                "Parent Last",
                "Parent 2 Email",
                "Email",
                "Phone",
                "Interview",
                "Matching",
                "Status",
                "Created",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left px-4 py-3 border-b font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="text-center py-8 text-gray-500">
                  <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-8 text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-3 font-medium">{item.Full_Name}</td>
                  <td className="px-4 py-3">
                    {item.Programs_Interested_In || "—"}
                  </td>
                  <td className="px-4 py-3">{item.Program_Deposit || "—"}</td>
                  <td className="px-4 py-3">
                    {item.Program_Balance_Payment || "—"}
                  </td>
                  <td className="px-4 py-3">{item.Parent_First_Name || "—"}</td>
                  <td className="px-4 py-3">{item.Parent_Last_Name || "—"}</td>
                  <td className="px-4 py-3 truncate max-w-[150px]">
                    {item.Parent_2_Email || "—"}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[150px]">
                    {item.Email}
                  </td>
                  <td className="px-4 py-3">{item.Phone}</td>
                  <td className="px-4 py-3">{item.Interview_Status || "—"}</td>
                  <td className="px-4 py-3">{item.Matching_Status || "—"}</td>
                  <td className="px-4 py-3">
                    {statusBadge(item.Contact_Status)}
                  </td>
                  <td className="px-4 py-3">
                    {item.Created_Time?.split("T")[0] || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card View (Mobile) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex justify-center py-8 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading data...
          </div>
        ) : data.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No applications found.
          </p>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-gray-800">
                  {item.Full_Name || "Unnamed"}
                </h3>
                {statusBadge(item.Contact_Status)}
              </div>
              <p className="text-sm text-gray-600">
                {item.Programs_Interested_In || "—"}
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> {item.Email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {item.Phone}
                </p>
                <p>
                  <span className="font-medium">Parent:</span>{" "}
                  {item.Parent_First_Name} {item.Parent_Last_Name}
                </p>
                <p>
                  <span className="font-medium">Matching:</span>{" "}
                  {item.Matching_Status || "—"}
                </p>
                <p>
                  <span className="font-medium">Interview:</span>{" "}
                  {item.Interview_Status || "—"}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {item.Created_Time?.split("T")[0] || "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <p className="text-sm text-gray-600">
          Page <span className="font-semibold">{page}</span> of{" "}
          {pagination.totalPages}
        </p>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
