"use client";
import { useState, useEffect } from "react";

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
  const [pagination, setPagination] = useState({
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/zoho/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // example
        },
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

  useEffect(() => {
    fetchData();
  }, [page, filters, search]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Applications List</h1>

      {/* 🔍 Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name..."
          className="border rounded-lg px-3 py-2 w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={filters.program}
          onChange={(e) => handleFilterChange("program", e.target.value)}
        >
          <option value="">All Programs</option>
          <option value="Australia Exchange">Australia Exchange</option>
          <option value="France Exchange">France Exchange</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="In Progress">In Progress</option>
          <option value="ClustDoc In Progress">ClustDoc In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={filters.matchingStatus}
          onChange={(e) => handleFilterChange("matchingStatus", e.target.value)}
        >
          <option value="">All Matching Status</option>
          <option value="Step 1/4 - Not Started">Step 1/4 - Not Started</option>
          <option value="Step 2/4 - In Progress">Step 2/4 - In Progress</option>
          <option value="Step 4/4 - Completed">Step 4/4 - Completed</option>
        </select>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Full Name",
                "Programs Interested In",
                "Program Deposit Payment",
                "Program Balance Payment",
                "Parent First Name",
                "Parent Last Name",
                "Parent 2 Email",
                "Email (Applicants List)",
                "Phone (Applicants List)",
                "Interview Status",
                "Matching Status",
                "Application Status",
                "Created Time",
              ].map((header) => (
                <th key={header} className="text-left px-4 py-2 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-6">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="px-4 py-2">{item.Full_Name}</td>
                  <td className="px-4 py-2">{item.Programs_Interested_In}</td>
                  <td className="px-4 py-2">{item.Program_Deposit}</td>
                  <td className="px-4 py-2">{item.Program_Balance_Payment}</td>
                  <td className="px-4 py-2">{item.Parent_First_Name}</td>
                  <td className="px-4 py-2">{item.Parent_Last_Name}</td>
                  <td className="px-4 py-2">{item.Parent_2_Email}</td>
                  <td className="px-4 py-2">{item.Email}</td>
                  <td className="px-4 py-2">{item.Phone}</td>
                  <td className="px-4 py-2">{item.Interview_Status}</td>
                  <td className="px-4 py-2">{item.Matching_Status}</td>
                  <td className="px-4 py-2">{item.Contact_Status}</td>
                  <td className="px-4 py-2">{item.Created_Time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center mt-5">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <p className="text-sm">
          Page {page} of {pagination.totalPages}
        </p>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
