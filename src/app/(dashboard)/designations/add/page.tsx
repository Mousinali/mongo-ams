"use client";

import {
  useEffect,
  useState,
} from "react";

import BackButton from "@/components/BackButton";
import SearchableSelect from "@/components/SearchableSelect";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddDesignationPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [departments, setDepartments] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      department: "",
      status: "Active",
    });

  async function fetchDepartments() {
    const res = await fetch(
      "/api/departments"
    );

    const data =
      await res.json();

    setDepartments(
      data.data || []
    );
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/designations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Designation created successfully");

      router.push(
        "/designations"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Failed to create designation"
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
          Add Designation
        </h1>

        <p className="text-zinc-500 mt-2">
          Create designation
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
              Designation Name
            </label>

            <input
              type="text"
              required
              value={
                formData.name
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name:
                    e.target
                      .value,
                })
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
            />
          </div>

          {/* Department */}
          <SearchableSelect
            label="Department"
            required
            options={departments.map((dept: any) => ({
              label: dept.name,
              value: dept._id,
            }))}
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
            placeholder="Select Department"
          />

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Status
            </label>

            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full h-12 px-4 pr-10 appearance-none rounded-xl border border-zinc-200 bg-zinc-50 outline-none transition-all focus:border-zinc-400 cursor-pointer"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-lg"></i>
            </div>
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
                : "Create Designation"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/designations"
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