"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

export default function EditDesignationPage() {
  const router = useRouter();

  const params =
    useParams();

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

  async function fetchDesignation() {
    const res = await fetch(
      `/api/designations/${params.id}`
    );

    const data =
      await res.json();

    setFormData({
      name:
        data.data?.name || "",
      department:
        data.data?.department ||
        "",
      status:
        data.data?.status ||
        "Active",
    });
  }

  useEffect(() => {
    fetchDepartments();

    fetchDesignation();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/designations/${params.id}`,
        {
          method: "PUT",

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

      router.push(
        "/designations"
      );

      router.refresh();
    } catch (error) {
      alert(
        "Failed to update"
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
          Edit Designation
        </h1>

        <p className="text-zinc-500 mt-2">
          Update designation
          details
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
          <div>
            <label className="block text-sm font-semibold mb-2">
              Department
            </label>

            <select
              required
              value={
                formData.department
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  department:
                    e.target
                      .value,
                })
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <option value="">
                Select Department
              </option>

              {departments.map(
                (
                  department: any
                ) => (
                  <option
                    key={
                      department._id
                    }
                    value={
                      department._id
                    }
                  >
                    {
                      department.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Status
            </label>

            <select
              value={
                formData.status
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status:
                    e.target
                      .value,
                })
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
                ? "Updating..."
                : "Update Designation"}
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