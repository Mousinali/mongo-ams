"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

export default function AssetDetailsPage() {
  const params =
    useParams();

  const [asset, setAsset] =
    useState<any>(null);

  const [logs, setLogs] =
    useState<any[]>([]);

  async function fetchData() {
    /* Asset */
    const assetRes =
      await fetch(
        "/api/assets",
        {
          cache: "no-store",
        }
      );

    const assetData =
      await assetRes.json();

    const foundAsset =
      assetData.data.find(
        (item: any) =>
          item._id ===
          params.id
      );

    setAsset(foundAsset);

    /* Assignment Logs */
    const assignmentRes =
      await fetch(
        "/api/assignments",
        {
          cache: "no-store",
        }
      );

    const assignmentData =
      await assignmentRes.json();

    const assetLogs =
      assignmentData.data.filter(
        (item: any) =>
          item.asset?._id ===
          params.id
      );

    setLogs(assetLogs);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!asset) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {asset.name}
        </h1>

        <p className="text-zinc-500 mt-2">
          Asset history & logs
        </p>
      </div>

      {/* Asset Details */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-zinc-500">
              Asset ID
            </p>

            <p className="font-semibold mt-1">
              {asset.assetId}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Category
            </p>

            <p className="font-semibold mt-1">
              {
                asset.category
                  ?.name
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Brand
            </p>

            <p className="font-semibold mt-1">
              {asset.brand}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Status
            </p>

            <p className="font-semibold mt-1">
              {asset.status}
            </p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold">
            Asset Logs
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No logs found
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {logs.map(
              (
                log: any
              ) => (
                <div
                  key={log._id}
                  className="p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg">
                        {
                          log.employee
                            ?.name
                        }
                      </p>

                      <p className="text-sm text-zinc-500 mt-1">
                        {
                          log.employee
                            ?.department
                            ?.name
                        }
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        log.status ===
                        "Assigned"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                      <p className="text-sm text-zinc-500">
                        Assigned Date
                      </p>

                      <p className="font-medium mt-1">
                        {new Date(
                          log.assignedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        Returned Date
                      </p>

                      <p className="font-medium mt-1">
                        {log.returnedDate
                          ? new Date(
                              log.returnedDate
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        Return Reason
                      </p>

                      <p className="font-medium mt-1">
                        {log.returnReason ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        Notes
                      </p>

                      <p className="font-medium mt-1">
                        {log.notes ||
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}