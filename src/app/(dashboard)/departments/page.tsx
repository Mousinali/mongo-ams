"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);

  async function fetchDepartments() {
    const res = await fetch("/api/departments");

    const data = await res.json();

    setDepartments(data.data || []);
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>

          <p className="text-zinc-500 mt-2">Manage departments</p>
        </div>

        <Link
          href="/departments/add"
          className="h-11 px-5 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition-all inline-flex items-center"
        >
          Add Department
        </Link>
      </div>

      {/* Empty State */}
      {departments.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <i className="ri-building-line text-3xl text-zinc-400"></i>
          </div>

          <h3 className="text-lg font-bold text-zinc-800">No Departments</h3>

          <p className="text-zinc-500 mt-2">Start by adding a department</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Department Name
                </th>

                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Status
                </th>

                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Created
                </th>
                <th className="text-right p-4 text-sm font-semibold text-zinc-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {departments.map((department: any) => (
                <tr
                  key={department._id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/50"
                >
                  <td className="p-4 font-semibold text-zinc-900">
                    {department.name}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        department.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-500 border border-red-100"
                      }`}
                    >
                      {department.status}
                    </span>
                  </td>

                  <td className="p-4 text-zinc-500">
                    {new Date(department.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/departments/edit/${department._id}`}
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
      )}
    </div>
  );
}
