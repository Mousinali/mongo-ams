"use client";

import {
  useEffect,
  useState,
} from "react";

export default function SettingsPage() {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",

      password: "",
    });

  async function fetchSettings() {
    try {
      const res = await fetch(
        "/api/settings",
        {
          cache: "no-store",
        }
      );

      const data =
        await res.json();

      setFormData({
        email:
          data.data?.email ||
          "",

        password:
          data.data
            ?.password || "",
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "/api/settings",
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

      alert(
        "Settings updated successfully"
      );
    } catch (error) {
      alert(
        "Failed to update settings"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Settings
        </h1>

        <p className="text-zinc-500 mt-2">
          Manage admin account
          settings.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Admin Email
            </label>

            <input
              type="email"
              required
              value={
                formData.email
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  email:
                    e.target.value,
                })
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Admin Password
            </label>

            <input
              type="text"
              required
              value={
                formData.password
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  password:
                    e.target.value,
                })
              }
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50"
            />
          </div>

          {/* Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-black text-white font-semibold"
            >
              {loading
                ? "Updating..."
                : "Update Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}