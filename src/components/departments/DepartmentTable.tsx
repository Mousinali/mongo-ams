"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};

export default function DepartmentTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading } = useSWR("/api/departments", fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  const departments = data?.data || [];

  /* Search Filter */
  const filteredDepartments = useMemo(() => {
    return departments.filter((department: any) => {
      const searchText = search.toLowerCase();
      return (
        department.name?.toLowerCase().includes(searchText) ||
        department.status?.toLowerCase().includes(searchText)
      );
    });
  }, [departments, search]);

  /* Pagination */
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b border-zinc-100">
          <div className="h-5 w-40 bg-zinc-200 rounded animate-pulse" />
          <div className="h-11 w-72 bg-zinc-100 rounded-xl animate-pulse" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#d8dff9]">
              <tr>
                {["w-32", "w-14", "w-20", "w-16"].map((w, i) => (
                  <th key={i} className="text-left px-6 py-3">
                    <div className={`h-4 ${w} bg-indigo-200/50 rounded animate-pulse`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="px-6 py-3"><div className="h-4 w-40 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-5 w-14 bg-zinc-100 rounded-full animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-3"><div className="h-8 w-16 bg-zinc-100 rounded-lg animate-pulse ml-auto" /></td>
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
          <h2 className="text-lg font-bold text-zinc-900">
            Total Departments: {filteredDepartments.length}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full sm:w-72 rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#d8dff9] text-[#4A4A6A] text-sm font-bold">
            <tr>
              <th className="text-left px-6 py-3">Department Name</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Created</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedDepartments.map((department: any) => (
              <tr
                key={department._id}
                className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
              >
                {/* Name */}
                <td className="px-6 py-3 font-semibold text-zinc-900 text-[15px]">
                  {department.name}
                </td>

                {/* Status */}
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      department.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-red-50 text-red-500 border border-red-100"
                    }`}
                  >
                    {department.status}
                  </span>
                </td>

                {/* Created */}
                <td className="px-6 py-3 text-sm text-zinc-500">
                  {new Date(department.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/departments/edit/${department._id}`}
                      className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-zinc-100"
                    >
                      <i className="ri-pencil-line transition-transform duration-200 group-hover:rotate-12"></i>
                      <span>Edit</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedDepartments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-14 text-zinc-500">
                  No departments found.
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
          {Math.min(currentPage * itemsPerPage, filteredDepartments.length)} of{" "}
          {filteredDepartments.length}
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
