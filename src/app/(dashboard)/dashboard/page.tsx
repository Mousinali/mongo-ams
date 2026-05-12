"use client";

import Link from "next/link";
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

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useSWR(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-8 pb-10">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-40 bg-zinc-200 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-zinc-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-zinc-200 rounded-lg animate-pulse" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex justify-between items-center"
            >
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" />
                <div className="h-7 w-16 bg-zinc-200 rounded animate-pulse" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Assets Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl p-6 py-4 shadow-[0_4px_14px_rgba(0,0,0,0.05)] h-full">
              <div className="flex items-center justify-between mb-3 -mx-6 px-6 border-b border-slate-200 pb-3">
                <div className="h-5 w-28 bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" />
              </div>
              <div className="space-y-3 -mx-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-2">
                    <div className="flex-1">
                      <div className="h-4 w-full bg-zinc-100 rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Assignments Skeleton */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
            <div className="px-6 py-3.5 border-b flex items-center justify-between border-slate-100">
              <div className="h-5 w-36 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#d8dff9]">
                    <th className="px-6 py-2.5"><div className="h-4 w-20 bg-indigo-200/50 rounded animate-pulse" /></th>
                    <th className="px-6 py-2.5"><div className="h-4 w-16 bg-indigo-200/50 rounded animate-pulse" /></th>
                    <th className="px-6 py-2.5"><div className="h-4 w-14 bg-indigo-200/50 rounded animate-pulse" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-2.5"><div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-2.5"><div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" /></td>
                      <td className="px-6 py-2.5"><div className="h-5 w-14 bg-zinc-100 rounded-full animate-pulse" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Assets",

      value:
        stats.stats.totalAssets,

      icon: "ri-box-3-line",

      color: "text-blue-600",

      bg: "bg-blue-50/50",

      border: "border-blue-100",
    },

    {
      label: "Total Employees",

      value:
        stats.stats.totalEmployees,

      icon: "ri-group-line",

      color: "text-purple-600",

      bg: "bg-purple-50/50",

      border: "border-purple-100",
    },

    {
      label: "Available Assets",

      value:
        stats.stats
          .availableAssets,

      icon:
        "ri-checkbox-circle-line",

      color: "text-emerald-600",

      bg: "bg-emerald-50/50",

      border:
        "border-emerald-100",
    },

    {
      label: "Assigned Assets",

      value:
        stats.stats
          .assignedAssets,

      icon:
        "ri-user-shared-2-line",

      color: "text-orange-600",

      bg: "bg-orange-50/50",

      border:
        "border-orange-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Dashboard
          </h1>

          <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">
            Manage and track your company assets with ease.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assets/add"
            className="inline-flex py-2 items-center justify-center rounded-lg bg-zinc-900 pr-6 pl-4 text-sm font-medium gap-2 text-zinc-50 transition-all hover:bg-zinc-800 shadow-lg shadow-zinc-200 active:scale-95"
          >
            <i className="ri-add-line"></i>
            New Asset
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="group bg-white border border-slate-200 rounded-xl p-6 shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex justify-between items-center"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 capitalize">
                {kpi.label}
              </p>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {kpi.value.toLocaleString()}
                </h3>
              </div>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl border ${kpi.bg} ${kpi.border} ${kpi.color} flex items-center justify-center transition-transform group-hover:scale-110`}
            >
              <i
                className={`${kpi.icon} text-2xl`}
              ></i>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Assets */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 py-4 shadow-[0_4px_14px_rgba(0,0,0,0.05)] h-full">
            <div className="flex items-center justify-between mb-1 -mx-6 px-6 border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                Recent Assets
              </h3>

              <Link
                href="/assets"
                className="text-sm text-indigo-600 inline-flex items-center gap-1 font-medium transition-colors hover:text-indigo-800"
              >
                View All
                <i className="ri-arrow-right-long-line"></i>
              </Link>
            </div>

            <div className="flex-1 divide-y divide-slate-100 -mx-6">
              {stats.recentAssets?.map(
                (asset: any) => (
                  <div
                    key={asset._id}
                    className="group flex items-center gap-4 px-6 py-2 hover:bg-slate-50/80 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-zinc-900 truncate block">
                        {asset.name}
                      </span>
                    </div>

                    <div className="shrink-0">
                      <span className="text-xs px-2 rounded-full border font-semibold bg-blue-50 text-blue-600 border-blue-100">
                        {asset.category?.name ||
                          asset.status}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Latest Assignments */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
          <div className="px-6 py-3.5 border-b flex items-center justify-between border-slate-100">
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
              Latest Assignments
            </h3>

            <Link
              href="/assignments"
              className="text-sm text-indigo-600 inline-flex items-center gap-1 font-medium transition-colors hover:text-indigo-800"
            >
              View All
              <i className="ri-arrow-right-long-line"></i>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#d8dff9] text-[#4A4A6A] text-sm font-bold">
                  <th className="px-6 py-2.5">
                    Asset Name
                  </th>

                  <th className="px-6 py-2.5">
                    Employee
                  </th>

                  <th className="px-6 py-2.5">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {stats.latestAssignments?.map(
                  (
                    assignment: any
                  ) => (
                    <tr
                      key={
                        assignment._id
                      }
                      className="hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-2.5 text-[13px] text-zinc-700 font-medium">
                        {
                          assignment
                            .asset?.name
                        }
                      </td>

                      <td className="px-6 py-2.5 text-zinc-600 text-[13px]">
                        {
                          assignment
                            .employee
                            ?.name
                        }
                      </td>

                      <td className="px-6 py-2.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 text-xs font-semibold ${
                            assignment.status ===
                            "Returned"
                              ? "bg-[#FDE8EB] text-red-500 border border-red-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {assignment.status ===
                          "Returned"
                            ? "Returned"
                            : "Active"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}