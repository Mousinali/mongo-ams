"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Login failed"
        );
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        "Something went wrong"
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black/10">
            <i className="ri-shield-keyhole-line text-3xl"></i>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            MY AMS
          </h1>

          <p className="text-zinc-500 mt-2">
            Asset Management System
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-black/5 border border-zinc-100">
          <h2 className="text-xl font-bold mb-6">
            Welcome back
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Email
              </label>

              <div className="relative">
                <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"></i>

                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Password
              </label>

              <div className="relative">
                <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"></i>

                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
                <i className="ri-error-warning-line text-lg"></i>

                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-black/10"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>

                  <span>
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Sign In
                  </span>

                  <i className="ri-arrow-right-line"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100">
            <p className="text-center text-sm text-zinc-400">
              Login:
              <span className="font-medium text-zinc-600 ml-1">
                admin@gmail.com
              </span>
              {" / "}
              <span className="font-medium text-zinc-600">
                123456
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}