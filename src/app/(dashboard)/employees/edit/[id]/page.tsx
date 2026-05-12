"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

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

      router.push(
        "/employees"
      );

      router.refresh();
    } catch (error) {
      alert(
        "Failed to update employee"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
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
                    designation:
                      "",
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

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Designation
              </label>

              <select
                required
                value={
                  formData.designation
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    designation:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              >
                <option value="">
                  Select Designation
                </option>

                {filteredDesignations.map(
                  (
                    designation: any
                  ) => (
                    <option
                      key={
                        designation._id
                      }
                      value={
                        designation._id
                      }
                    >
                      {
                        designation.name
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