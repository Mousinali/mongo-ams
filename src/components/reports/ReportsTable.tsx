"use client";

import {
  useMemo,
  useState,
} from "react";

import useSWR from "swr";

import * as XLSX from "xlsx";

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

export default function ReportsTable() {
  const [search, setSearch] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const { data, isLoading } =
    useSWR(
      "/api/reports",
      fetcher,
      {
        refreshInterval: 5000,
        revalidateOnFocus: true,
        dedupingInterval: 2000,
      }
    );

  const reports =
    data?.data || [];

  /* Filter */
  const filteredReports =
    useMemo(() => {
      return reports.filter(
        (report: any) => {
          const searchText =
            search.toLowerCase();

          const assignedDate =
            new Date(
              report.assignedDate
            );

          const from =
            fromDate
              ? new Date(
                  fromDate
                )
              : null;

          const to = toDate
            ? new Date(
                toDate
              )
            : null;

          if (
            from &&
            assignedDate < from
          ) {
            return false;
          }

          if (to) {
            to.setHours(
              23,
              59,
              59,
              999
            );

            if (
              assignedDate > to
            ) {
              return false;
            }
          }

          return (
            report.employee?.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            report.employee?.employeeId
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            report.asset?.name
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            report.asset?.assetId
              ?.toLowerCase()
              .includes(
                searchText
              ) ||
            report.status
              ?.toLowerCase()
              .includes(
                searchText
              )
          );
        }
      );
    }, [
      reports,
      search,
      fromDate,
      toDate,
    ]);

  /* Pagination */
  const totalPages =
    Math.ceil(
      filteredReports.length /
        itemsPerPage
    );

  const paginatedReports =
    filteredReports.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage
    );

  /* Export */
  const exportData =
    filteredReports.map(
      (report: any) => ({
        Employee:
          report.employee?.name,

        EmployeeID:
          report.employee
            ?.employeeId,

        Department:
          report.employee
            ?.department
            ?.name,

        Asset:
          report.asset?.name,

        AssetID:
          report.asset
            ?.assetId,

        Category:
          report.asset
            ?.category
            ?.name,

        AssignedDate:
          new Date(
            report.assignedDate
          ).toLocaleDateString(),

        ReturnedDate:
          report.returnedDate
            ? new Date(
                report.returnedDate
              ).toLocaleDateString()
            : "-",

        Status:
          report.status,

        ReturnReason:
          report.returnReason ||
          "-",
      })
    );

  const exportCSV = () => {
    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    XLSX.writeFile(
      workbook,
      "asset-reports.csv"
    );
  };

  const exportExcel = () => {
    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    XLSX.writeFile(
      workbook,
      "asset-reports.xlsx"
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-3xl p-10 text-center text-zinc-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b border-zinc-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Asset Reports
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Total Records:
              {
                filteredReports.length
              }
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={
                exportCSV
              }
              className="h-11 px-5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-sm font-medium transition-all inline-flex items-center gap-2"
            >
              <i className="ri-file-text-line"></i>

              CSV
            </button>

            <button
              onClick={
                exportExcel
              }
              className="h-11 px-5 rounded-xl bg-black text-white hover:bg-zinc-800 text-sm font-medium transition-all inline-flex items-center gap-2"
            >
              <i className="ri-file-excel-2-line"></i>

              Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"></i>

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(
                  1
                );
              }}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none transition-all focus:border-zinc-400"
            />
          </div>

          {/* Date Range */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-zinc-200 px-4 text-sm outline-none"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-zinc-200 px-4 text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          <thead className="bg-[#d8dff9] text-[#4A4A6A] text-sm font-bold">
            <tr>
              <th className="text-left px-6 py-3">
                Employee
              </th>

              <th className="text-left px-6 py-3">
                Department
              </th>

              <th className="text-left px-6 py-3">
                Asset
              </th>

              <th className="text-left px-6 py-3">
                Category
              </th>

              <th className="text-left px-6 py-3">
                Assigned
              </th>

              <th className="text-left px-6 py-3">
                Returned
              </th>

              <th className="text-left px-6 py-3">
                Status
              </th>

              <th className="text-left px-6 py-3">
                Return Reason
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedReports.map(
              (report: any) => (
                <tr
                  key={report._id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
                >
                  {/* Employee */}
                  <td className="px-6 py-3">
                    <p className="font-semibold text-zinc-900">
                      {
                        report.employee
                          ?.name
                      }
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      {
                        report.employee
                          ?.employeeId
                      }
                    </p>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {
                      report.employee
                        ?.department
                        ?.name
                    }
                  </td>

                  {/* Asset */}
                  <td className="px-6 py-3">
                    <p className="font-semibold text-zinc-900">
                      {
                        report.asset
                          ?.name
                      }
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      {
                        report.asset
                          ?.assetId
                      }
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {
                      report.asset
                        ?.category
                        ?.name
                    }
                  </td>

                  {/* Assigned */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {new Date(
                      report.assignedDate
                    ).toLocaleDateString()}
                  </td>

                  {/* Returned */}
                  <td className="px-6 py-3 text-sm text-zinc-600">
                    {report.returnedDate
                      ? new Date(
                          report.returnedDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        report.status ===
                        "Returned"
                          ? "bg-red-50 text-red-500 border border-red-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {
                        report.status
                      }
                    </span>
                  </td>

                  {/* Return Reason */}
                  <td className="px-6 py-3 text-sm text-zinc-600 max-w-[240px] truncate">
                    {report.returnReason ||
                      "-"}
                  </td>
                </tr>
              )
            )}

            {paginatedReports.length ===
              0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-14 text-zinc-500"
                >
                  No reports found.
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
            filteredReports.length
          )}{" "}
          of{" "}
          {
            filteredReports.length
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