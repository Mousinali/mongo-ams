"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import useSWR from "swr";

const fetcher = async (
  url: string
) => {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      "Failed to fetch"
    );
  }

  return res.json();
};

export default function EmployeeTable() {
  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const { data, isLoading } =
    useSWR(
      "/api/employees",
      fetcher,
      {
        refreshInterval: 5000,
        revalidateOnFocus: true,
        dedupingInterval: 2000,
      }
    );

  const employees =
    data?.data || [];

  /* Search Filter */
  const filteredEmployees =
    useMemo(() => {
      return employees.filter(
        (employee: any) => {
          const searchText =
            search.toLowerCase();

          return (
            employee.employeeId
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            employee.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            employee.department?.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            employee.designation?.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            employee.status
              ?.toLowerCase()
              .includes(
                searchText
              )
          );
        }
      );
    }, [employees, search]);

  /* Pagination */
  const totalPages =
    Math.ceil(
      filteredEmployees.length /
        itemsPerPage
    );

  const paginatedEmployees =
    filteredEmployees.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage
    );

  if (isLoading) {
    return (
      <div className="p-10">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b border-zinc-100">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">
            Total Employees:{" "}
            {
              filteredEmployees.length
            }
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(
                  1
                );
              }}
              className="h-11 w-full sm:w-72 rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-[#d8dff9] text-[#4A4A6A] text-sm font-bold">
            <tr>
              <th className="text-left px-6 py-3">
                Employee ID
              </th>

              <th className="text-left px-6 py-3">
                Name
              </th>

              <th className="text-left px-6 py-3">
                Department
              </th>

              <th className="text-left px-6 py-3">
                Designation
              </th>

              <th className="text-left px-6 py-3">
                Status
              </th>

              <th className="text-right px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.map(
              (
                employee: any
              ) => (
                <tr
                  key={
                    employee._id
                  }
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
                >
                  {/* Employee ID */}
                  <td className="px-6 py-3 text-[15px] text-zinc-700 font-medium">
                    {
                      employee.employeeId
                    }
                  </td>

                  {/* Name */}
                  <td className="px-6 py-3">
                    <p className="font-semibold text-zinc-900 text-[15px]">
                      {
                        employee.name
                      }
                    </p>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {
                      employee
                        .department
                        ?.name
                    }
                  </td>

                  {/* Designation */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {
                      employee
                        .designation
                        ?.name
                    }
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        employee.status ===
                        "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-500 border border-red-100"
                      }`}
                    >
                      {
                        employee.status
                      }
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/employees/edit/${employee._id}`}
                        className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-zinc-100"
                      >
                        <i className="ri-pencil-line transition-transform duration-200 group-hover:rotate-12"></i>

                        <span>
                          Edit
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            )}

            {paginatedEmployees.length ===
              0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-14 text-zinc-500"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100">
        <p className="text-sm text-zinc-500">
          Showing{" "}
          {(currentPage - 1) *
            itemsPerPage +
            1}{" "}
          -
          {" "}
          {Math.min(
            currentPage *
              itemsPerPage,
            filteredEmployees.length
          )}{" "}
          of{" "}
          {
            filteredEmployees.length
          }
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  Math.max(
                    prev - 1,
                    1
                  )
              )
            }
            disabled={
              currentPage === 1
            }
            className="h-10 px-4 rounded-lg border border-zinc-200 text-sm font-medium disabled:opacity-50 hover:bg-zinc-100 transition-all"
          >
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  Math.min(
                    prev + 1,
                    totalPages
                  )
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
            className="h-10 px-4 rounded-lg border border-zinc-200 text-sm font-medium disabled:opacity-50 hover:bg-zinc-100 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}