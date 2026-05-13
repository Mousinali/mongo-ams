"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import * as XLSX from "xlsx";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};

export default function AssignmentTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading } = useSWR("/api/assignments", fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  const assignments = data?.data || [];

  /* Search & Status Filter */
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment: any) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        assignment.employee?.name?.toLowerCase().includes(searchText) ||
        assignment.asset?.name?.toLowerCase().includes(searchText) ||
        assignment.asset?.assetId?.toLowerCase().includes(searchText) ||
        assignment.status?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || assignment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [assignments, search, statusFilter]);

  /* CSV Export */
  const exportToCSV = () => {
    const exportData = filteredAssignments.map((assignment: any) => ({
      "Employee Name": assignment.employee?.name || "-",
      "Employee ID": assignment.employee?.employeeId || "-",
      "Department": assignment.employee?.department?.name || "-",
      "Asset Name": assignment.asset?.name || "-",
      "Asset ID": assignment.asset?.assetId || "-",
      "Assigned Date": new Date(assignment.assignedDate).toLocaleDateString(),
      "Return Date": assignment.returnedDate
        ? new Date(assignment.returnedDate).toLocaleDateString()
        : "Active",
      "Return Reason": assignment.returnReason || "-",
      "Status": assignment.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");
    XLSX.writeFile(workbook, `Assignments_Export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  /* Pagination */
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b border-zinc-100">
          <div className="h-5 w-40 bg-zinc-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-11 w-72 bg-zinc-100 rounded-xl animate-pulse" />
            <div className="h-11 w-32 bg-zinc-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-[#d8dff9]">
              <tr>
                {["w-20", "w-16", "w-24", "w-20", "w-24", "w-14", "w-16"].map((w, i) => (
                  <th key={i} className="text-left px-6 py-3">
                    <div className={`h-4 ${w} bg-indigo-200/50 rounded animate-pulse`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="px-6 py-3"><div className="space-y-1"><div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" /><div className="h-3 w-20 bg-zinc-50 rounded animate-pulse" /></div></td>
                  <td className="px-6 py-3"><div className="space-y-1"><div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" /><div className="h-3 w-16 bg-zinc-50 rounded animate-pulse" /></div></td>
                  <td className="px-6 py-3"><div className="h-4 w-20 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-4 w-20 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-8 w-20 bg-zinc-100 rounded-lg animate-pulse ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b border-zinc-100">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Total Assignments: {filteredAssignments.length}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full sm:w-40 appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm outline-none transition-all focus:border-zinc-400 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Assigned">Assigned</option>
              <option value="Returned">Returned</option>
              <option value="Lost">Lost</option>
              <option value="Damaged">Damaged</option>
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-lg"></i>
          </div>

          {/* Search */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <input
              type="text"
              placeholder="Search assignment..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full sm:w-72 rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-400"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="h-11 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-zinc-800 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
          >
            <i className="ri-file-download-line text-lg"></i>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-[#d8dff9] text-[#4A4A6A] text-sm font-bold">
            <tr>
              <th className="text-left px-6 py-3">Employee</th>
              <th className="text-left px-6 py-3">Asset</th>
              <th className="text-left px-6 py-3">Assigned Date</th>
              <th className="text-left px-6 py-3">Return Date</th>
              <th className="text-left px-6 py-3">Return Reason</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAssignments.map((assignment: any) => (
              <tr
                key={assignment._id}
                className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
              >
                {/* Employee */}
                <td className="px-6 py-3">
                  <p className="font-semibold text-zinc-900">
                    {assignment.employee?.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {assignment.employee?.department?.name}
                  </p>
                </td>

                {/* Asset */}
                <td className="px-6 py-3">
                  <p className="font-semibold text-zinc-900">
                    {assignment.asset?.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {assignment.asset?.assetId}
                  </p>
                </td>

                {/* Assigned Date */}
                <td className="px-6 py-3 text-sm text-zinc-600">
                  {new Date(assignment.assignedDate).toLocaleDateString()}
                </td>

                {/* Return Date */}
                <td className="px-6 py-3 text-sm">
                  {assignment.returnedDate ? (
                    <span className="text-zinc-600">
                      {new Date(assignment.returnedDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Active
                    </span>
                  )}
                </td>

                {/* Return Reason */}
                <td className="px-6 py-3 text-sm text-zinc-600 max-w-[220px] truncate">
                  {assignment.returnReason || "-"}
                </td>

                {/* Status */}
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      assignment.status === "Returned"
                        ? "bg-[#FDE8EB] text-red-500 border border-red-100"
                        : assignment.status === "Assigned"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {assignment.status === "Assigned" && (
                      <Link
                        href={`/assignments/return/${assignment._id}`}
                        className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <i className="ri-inbox-unarchive-line transition-transform duration-200 group-hover:-rotate-12"></i>
                        <span>Return</span>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {paginatedAssignments.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14 text-zinc-500">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100">
        <p className="text-sm text-zinc-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, filteredAssignments.length)} of{" "}
          {filteredAssignments.length}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-10 px-4 rounded-lg border border-zinc-200 text-sm font-medium disabled:opacity-50 hover:bg-zinc-100 transition-all"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-10 px-4 rounded-lg border border-zinc-200 text-sm font-medium disabled:opacity-50 hover:bg-zinc-100 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}