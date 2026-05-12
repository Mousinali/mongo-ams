"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

export default function AssetTable() {
  const [assets, setAssets] = useState([]);

  const [loading, setLoading] = useState(true);

  async function fetchAssets() {
    try {
      setLoading(true);

      const res = await fetch("/api/assets", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch assets");
      }

      const data = await res.json();

      setAssets(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-100">
        <div>
          <h2 className="text-xl font-bold">Asset List</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Total Assets:
            {assets.length}
          </p>
        </div>

        <Link
          href="/assets/add"
          className="h-11 px-5 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition-all inline-flex items-center"
        >
          Add Asset
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                {["w-16", "w-20", "w-20", "w-14", "w-14", "w-16"].map((w, i) => (
                  <th key={i} className="text-left p-4">
                    <div className={`h-4 ${w} bg-zinc-200 rounded animate-pulse`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="p-4"><div className="h-4 w-20 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 w-20 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-5 w-16 bg-zinc-100 rounded-full animate-pulse" /></td>
                  <td className="p-4"><div className="flex gap-3 items-center justify-end"><div className="w-9 h-9 bg-zinc-100 rounded-lg animate-pulse" /><div className="w-9 h-9 bg-zinc-100 rounded-lg animate-pulse" /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : assets.length === 0 ? (
        /* Empty State */
        <div className="p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <i className="ri-macbook-line text-3xl text-zinc-400"></i>
          </div>

          <h3 className="text-lg font-bold text-zinc-800">No Assets</h3>

          <p className="text-zinc-500 mt-2">Start by adding assets</p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Asset ID
                </th>

                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Asset Name
                </th>

                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Category
                </th>

                <th className="text-left p-4 text-sm font-semibold text-zinc-600">
                  Brand
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
              {assets.map((asset: any) => (
                <tr
                  key={asset._id}
                  className="border-b border-zinc-100 hover:bg-zinc-50/50"
                >
                  {/* Asset ID */}
                  <td className="p-4 font-medium text-zinc-700">
                    {asset.assetId}
                  </td>

                  {/* Name */}
                  <td className="p-4 font-semibold text-zinc-900">
                    {asset.name}
                  </td>

                  {/* Category */}
                  <td className="p-4 text-zinc-600">{asset.category?.name}</td>

                  {/* Brand */}
                  <td className="p-4 text-zinc-600">{asset.brand}</td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        asset.status === "Available"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : asset.status === "Assigned"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : asset.status === "Repair"
                              ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                              : "bg-red-50 text-red-500 border border-red-100"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex gap-3 items-center justify-end">
                      <Link
                        href={`/assets/${asset._id}`}
                        className="w-9 h-9 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-all flex items-center justify-center"
                      >
                        <i className="ri-eye-line"></i>
                      </Link>
                      <Link
                        href={`/assets/edit/${asset._id}`}
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
