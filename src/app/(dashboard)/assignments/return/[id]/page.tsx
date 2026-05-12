"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";
import toast from "react-hot-toast";

export default function ReturnAssetPage() {
  const router = useRouter();

  const params = useParams();

  const [loading, setLoading] =
    useState(false);

  const [assignment, setAssignment] =
    useState<any>(null);

  const [formData, setFormData] =
    useState({
      returnReason: "",
      notes: "",
    });

 async function fetchAssignment() {
  try {
    const res = await fetch(
      "/api/assignments",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch assignments"
      );
    }

    const data =
      await res.json();

    const assignments =
      data?.data || [];

    const found =
      assignments.find(
        (item: any) =>
          item._id ===
          params.id
      );

    setAssignment(found);
  } catch (error) {
    console.log(error);
  }
}

  useEffect(() => {
    fetchAssignment();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/assignments/${params.id}/return`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...formData,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Asset returned successfully");

      router.push(
        "/assignments"
      );

      router.refresh();
    } catch (error) {
      toast.error(
        "Failed to return asset"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!assignment) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Return Asset
        </h1>

        <p className="text-zinc-500 mt-2">
          Return assigned asset
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <p>
            <span className="font-semibold">
              Employee:
            </span>{" "}
            {
              assignment.employee
                ?.name
            }
          </p>

          <p>
            <span className="font-semibold">
              Asset:
            </span>{" "}
            {
              assignment.asset
                ?.name
            }
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Return Reason */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Return Reason
            </label>

            <select
              required
              value={
                formData.returnReason
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnReason:
                    e.target.value,
                })
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <option value="">
                Select Reason
              </option>

              <option value="Resignation">
                Resignation
              </option>

              <option value="Termination">
                Termination
              </option>

              <option value="Asset Upgrade">
                Asset Upgrade
              </option>

              <option value="Project Completed">
                Project Completed
              </option>

              <option value="Temporary Assignment Ended">
                Temporary Assignment
                Ended
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Return Notes
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
              placeholder="Optional notes"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-black text-white font-semibold"
            >
              {loading
                ? "Returning..."
                : "Return Asset"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/assignments"
                )
              }
              className="h-12 px-6 rounded-xl border border-zinc-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}