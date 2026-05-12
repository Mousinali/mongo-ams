"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddCategoryPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState("");

  const [status, setStatus] =
    useState("Active");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/categories",
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

      toast.success("Category created successfully");

      router.push(
        "/categories"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Failed to create category"
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
          Add Category
        </h1>

        <p className="text-zinc-500 mt-2">
          Create asset category
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Category Name
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
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
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
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
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
              className="h-12 px-6 rounded-xl bg-black text-white font-semibold"
            >
              {loading
                ? "Saving..."
                : "Create Category"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/categories"
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