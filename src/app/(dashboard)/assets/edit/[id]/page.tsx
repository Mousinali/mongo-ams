"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

export default function EditAssetPage() {
  const router = useRouter();

  const params =
    useParams();

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState([]);

  const [formData, setFormData] =
    useState({
      assetId: "",
      name: "",
      category: "",
      brand: "",
      model: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiry: "",
      notes: "",
      status: "Available",
    });

  async function fetchCategories() {
    const res = await fetch(
      "/api/categories"
    );

    const data =
      await res.json();

    setCategories(
      data.data || []
    );
  }

  async function fetchAsset() {
    const res = await fetch(
      `/api/assets/${params.id}`
    );

    const data =
      await res.json();

    setFormData({
      assetId:
        data.data?.assetId ||
        "",

      name:
        data.data?.name || "",

      category:
        data.data?.category ||
        "",

      brand:
        data.data?.brand || "",

      model:
        data.data?.model || "",

      serialNumber:
        data.data
          ?.serialNumber ||
        "",

      purchaseDate:
        data.data
          ?.purchaseDate
          ?.split("T")[0] ||
        "",

      warrantyExpiry:
        data.data
          ?.warrantyExpiry
          ?.split("T")[0] ||
        "",

      notes:
        data.data?.notes ||
        "",

      status:
        data.data?.status ||
        "Available",
    });
  }

  useEffect(() => {
    fetchCategories();

    fetchAsset();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/assets/${params.id}`,
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

      router.push("/assets");

      router.refresh();
    } catch (error) {
      alert(
        "Failed to update asset"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Asset
        </h1>

        <p className="text-zinc-500 mt-2">
          Update asset details
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset ID */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Asset ID
              </label>

              <input
                type="text"
                required
                value={
                  formData.assetId
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetId:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Asset Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Asset Name
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

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category
              </label>

              <select
                required
                value={
                  formData.category
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (
                    category: any
                  ) => (
                    <option
                      key={
                        category._id
                      }
                      value={
                        category._id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Brand
              </label>

              <input
                type="text"
                value={
                  formData.brand
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Model
              </label>

              <input
                type="text"
                value={
                  formData.model
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    model:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Serial Number
              </label>

              <input
                type="text"
                value={
                  formData.serialNumber
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serialNumber:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Purchase Date
              </label>

              <input
                type="date"
                value={
                  formData.purchaseDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseDate:
                      e.target
                        .value,
                  })
                }
                className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
              />
            </div>

            {/* Warranty */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Warranty Expiry
              </label>

              <input
                type="date"
                value={
                  formData.warrantyExpiry
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warrantyExpiry:
                      e.target
                        .value,
                  })
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
                  Available
                </option>

                <option>
                  Assigned
                </option>

                <option>
                  Repair
                </option>

                <option>
                  Retired
                </option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Notes
            </label>

            <textarea
              rows={4}
              value={formData.notes}
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
                ? "Updating..."
                : "Update Asset"}
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/assets"
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