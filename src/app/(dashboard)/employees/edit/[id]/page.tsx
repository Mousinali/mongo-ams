"use client";

import {
  useEffect,
  useState,
} from "react";

import BackButton from "@/components/BackButton";
import SearchableSelect from "@/components/SearchableSelect";
import {
  useParams,
  useRouter,
} from "next/navigation";
import toast from "react-hot-toast";

export default function EditEmployeePage() {
  const router = useRouter();

  const params =
    useParams();

  const [loading, setLoading] =
    useState(false);

  const [departments, setDepartments] =
    useState([]);

  const [designations, setDesignations] =
    useState([]);

  const [
    filteredDesignations,
    setFilteredDesignations,
  ] = useState([]);

  const [formData, setFormData] =
    useState({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      status: "Active",
    });

  async function fetchData() {
    const deptRes = await fetch(
      "/api/departments"
    );

    const deptData =
      await deptRes.json();

    setDepartments(
      deptData.data || []
    );

    const desigRes = await fetch(
      "/api/designations"
    );

    const desigData =
      await desigRes.json();

    setDesignations(
      desigData.data || []
    );
  }

  async function fetchEmployee() {
    const res = await fetch(
      `/api/employees/${params.id}`
    );

    const data =
      await res.json();

    setFormData({
      employeeId:
        data.data
          ?.employeeId || "",

      name:
        data.data?.name || "",

      email:
        data.data?.email || "",

      phone:
        data.data?.phone || "",

      department:
        data.data?.department ||
        "",

      designation:
        data.data
          ?.designation || "",

      status:
        data.data?.status ||
        "Active",
    });
  }

  useEffect(() => {
    fetchData();

    fetchEmployee();
  }, []);

  useEffect(() => {
    if (!formData.department) {
      setFilteredDesignations(
        []
      );

      return;
    }

    const filtered =
      designations.filter(
        (designation: any) =>
          designation.department
            ?._id ===
          formData.department
      );

    setFilteredDesignations(
      filtered
    );
  }, [
    formData.department,
    designations,
  ]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/employees/${params.id}`,
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

      toast.success("Employee updated successfully");

      router.push(
        "/employees"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Failed to update employee"
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
          Edit Employee
        </h1>

        <p className="text-zinc-500 mt-2">
          Update employee record
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Employee ID
              </label>

              <input
                type="text"
                required
                value={
                  formData.employeeId
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employeeId:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
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

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                value={
                  formData.email
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone
              </label>

              <input
                type="text"
                value={
                  formData.phone
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone:
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
              onChange={(val) => setFormData({ ...formData, department: val, designation: "" })}
              placeholder="Select Department"
            />

            {/* Designation */}
            <SearchableSelect
              label="Designation"
              required
              options={filteredDesignations.map((desig: any) => ({
                label: desig.name,
                value: desig._id,
              }))}
              value={formData.designation}
              onChange={(val) => setFormData({ ...formData, designation: val })}
              placeholder={formData.department ? "Select Designation" : "Select Department First"}
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
                : "Update Employee"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/employees"
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