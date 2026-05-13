"use client";

import {
  useEffect,
  useState,
} from "react";

import BackButton from "@/components/BackButton";
import SearchableSelect from "@/components/SearchableSelect";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddAssignmentPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [employees, setEmployees] =
    useState([]);

  const [assets, setAssets] =
    useState([]);

  const [formData, setFormData] =
    useState({
      employee: "",
      asset: "",
      assignedDate: "",
      expectedReturnDate: "",
      assignmentReason: "",
      notes: "",
    });

  async function fetchData() {
    /* Employees */
    const employeeRes =
      await fetch(
        "/api/employees"
      );

    const employeeData =
      await employeeRes.json();

    setEmployees(
      employeeData.data || []
    );

    /* Assets */
    const assetRes =
      await fetch("/api/assets");

    const assetData =
      await assetRes.json();

    /* Only available assets */
    const availableAssets =
      (assetData.data || []).filter(
        (asset: any) =>
          asset.status ===
          "Available"
      );

    setAssets(
      availableAssets
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/assignments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...formData,

            status:
              "Assigned",
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Asset assigned successfully");

      router.push(
        "/assignments"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Failed to assign asset"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Assign Asset
        </h1>

        <p className="text-zinc-500 mt-2">
          Assign company asset
          to employee
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee */}
            <SearchableSelect
              label="Employee"
              required
              options={employees.map((emp: any) => ({
                label: emp.name,
                value: emp._id,
                subLabel: emp.employeeId,
              }))}
              value={formData.employee}
              onChange={(val) => setFormData({ ...formData, employee: val })}
              placeholder="Select Employee"
            />

            {/* Asset */}
            <SearchableSelect
              label="Asset"
              required
              options={assets.map((asset: any) => ({
                label: asset.name,
                value: asset._id,
                subLabel: asset.assetId,
              }))}
              value={formData.asset}
              onChange={(val) => setFormData({ ...formData, asset: val })}
              placeholder="Select Asset"
            />

            {/* Assigned Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Assigned Date
              </label>

              <input
                type="date"
                required
                value={
                  formData.assignedDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedDate:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Expected Return */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Expected Return
                Date
              </label>

              <input
                type="date"
                value={
                  formData.expectedReturnDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expectedReturnDate:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>
          </div>

          {/* Assignment Reason */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Assignment Reason
            </label>

            <textarea
              rows={3}
              value={
                formData.assignmentReason
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assignmentReason:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Notes
            </label>

            <textarea
              rows={4}
              value={
                formData.notes
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes:
                    e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-black text-white font-semibold"
            >
              {loading
                ? "Assigning..."
                : "Assign Asset"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/assignments"
                )
              }
              className="h-12 px-6 rounded-xl border border-zinc-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}