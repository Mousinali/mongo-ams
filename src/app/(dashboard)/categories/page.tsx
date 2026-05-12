"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState([]);

  async function fetchCategories() {
    const res = await fetch(
      "/api/categories"
    );

    const data =
      await res.json();

    setCategories(
      data.data || []
    );
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Categories
          </h1>

          <p className="text-zinc-500 mt-2">
            Manage asset categories
          </p>
        </div>

        <Link
          href="/categories/add"
          className="h-11 px-5 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition-all inline-flex items-center"
        >
          Add Category
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                Category Name
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
            {categories.map(
              (category: any) => (
                <tr
                  key={category._id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/50"
                >
                  <td className="p-4 font-semibold text-zinc-900">
                    {category.name}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        category.status ===
                        "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-500 border border-red-100"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/categories/edit/${category._id}`}
                        className="w-9 h-9 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-all flex items-center justify-center"
                      >
                        <i className="ri-edit-line"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}