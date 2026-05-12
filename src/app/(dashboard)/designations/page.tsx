"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

export default function DesignationsPage() {
  const [designations, setDesignations] = useState([]);

  async function fetchData() {
    const res = await fetch("/api/designations");

    const data = await res.json();

    setDesignations(data.data || []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Designations</h1>

          <p className="text-zinc-500 mt-2">Manage employee designations</p>
        </div>

        <Link
          href="/designations/add"
          className="h-11 px-5 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition-all inline-flex items-center"
        >
          Add Designation
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                Designation
              </th>

              <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                Department
              </th>

              <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                Status
              </th>
              <th className="text-right p-4 text-sm font-semibold text-zinc-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {designations.map((designation: any) => (
              <tr
                key={designation._id}
                className="border-b border-zinc-100 hover:bg-zinc-50/50"
              >
                <td className="p-4 font-semibold text-zinc-900">
                  {designation.name}
                </td>

                <td className="p-4 text-zinc-600">
                  {designation.department?.name}
                </td>

                <td className="p-4">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    {designation.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/designations/edit/${designation._id}`}
                      className="w-9 h-9 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-all flex items-center justify-center"
                    >
                      <i className="ri-edit-line"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
