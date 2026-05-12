"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddDepartmentPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [status, setStatus] =
    useState("Active");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/departments",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            status,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Department created successfully");

      router.push(
        "/departments"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Failed to create department"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Add Department
        </h1>

        <p className="text-zinc-500 mt-2">
          Create a department
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Department Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Department Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-black/5"
            >
              <option>
                Active
              </option>

              <option>
                Inactive
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 transition-all"
            >
              {loading
                ? "Saving..."
                : "Create Department"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/departments"
                )
              }
              className="h-12 px-6 rounded-xl border border-zinc-200 font-semibold hover:bg-zinc-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}