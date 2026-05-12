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

export default function AssignmentTable() {
  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const { data, isLoading } =
    useSWR(
      "/api/assignments",
      fetcher,
      {
        refreshInterval: 5000,
        revalidateOnFocus: true,
        dedupingInterval: 2000,
      }
    );

  const assignments =
    data?.data || [];

  /* Search Filter */
  const filteredAssignments =
    useMemo(() => {
      return assignments.filter(
        (assignment: any) => {
          const searchText =
            search.toLowerCase();

          return (
            assignment.employee?.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            assignment.asset?.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            assignment.asset?.assetId
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            assignment.status
              ?.toLowerCase()
              .includes(
                searchText
              )
          );
        }
      );
    }, [assignments, search]);

  /* Pagination */
  const totalPages =
    Math.ceil(
      filteredAssignments.length /
        itemsPerPage
    );

  const paginatedAssignments =
    filteredAssignments.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage
    );

  if (isLoading) {
    return (
      <div className="p-10">
        Loading assignments...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b border-zinc-100">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Total Assignments:{" "}
            {
              filteredAssignments.length
            }
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>

            <input
              type="text"
              placeholder="Search assignment..."
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
        <table className="w-full min-w-[1100px]">
          <thead className="bg-[#d8dff9] text-[#4A4A6A] text-sm font-bold">
            <tr>
              <th className="text-left px-6 py-3">
                Employee
              </th>

              <th className="text-left px-6 py-3">
                Asset
              </th>

              <th className="text-left px-6 py-3">
                Assigned Date
              </th>

              <th className="text-left px-6 py-3">
                Return Date
              </th>

              <th className="text-left px-6 py-3">
                Return Reason
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
            {paginatedAssignments.map(
              (
                assignment: any
              ) => (
                <tr
                  key={
                    assignment._id
                  }
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
                >
                  {/* Employee */}
                  <td className="px-6 py-3">
                    <p className="font-semibold text-zinc-900">
                      {
                        assignment
                          .employee
                          ?.name
                      }
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      {
                        assignment
                          .employee
                          ?.department
                          ?.name
                      }
                    </p>
                  </td>

                  {/* Asset */}
                  <td className="px-6 py-3">
                    <p className="font-semibold text-zinc-900">
                      {
                        assignment
                          .asset
                          ?.name
                      }
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      {
                        assignment
                          .asset
                          ?.assetId
                      }
                    </p>
                  </td>

                  {/* Assigned Date */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {new Date(
                      assignment.assignedDate
                    ).toLocaleDateString()}
                  </td>

                  {/* Return Date */}
                  <td className="px-6 py-3 text-sm">
                    {assignment.returnedDate ? (
                      <span className="text-zinc-600">
                        {new Date(
                          assignment.returnedDate
                        ).toLocaleDateString()}
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
                    {assignment.returnReason ||
                      "-"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        assignment.status ===
                        "Returned"
                          ? "bg-[#FDE8EB] text-red-500 border border-red-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {
                        assignment.status
                      }
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {assignment.status ===
                        "Assigned" && (
                        <Link
                          href={`/assignments/return/${assignment._id}`}
                          className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <i className="ri-inbox-unarchive-line transition-transform duration-200 group-hover:-rotate-12"></i>

                          <span>
                            Return
                          </span>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}

            {paginatedAssignments.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-14 text-zinc-500"
                >
                  No assignments
                  found.
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
            filteredAssignments.length
          )}{" "}
          of{" "}
          {
            filteredAssignments.length
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