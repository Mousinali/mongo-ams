"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all group mb-4 shadow-sm active:scale-95"
    >
      <i className="ri-arrow-left-line transition-transform group-hover:-translate-x-1"></i>
      <span className="text-sm font-semibold">Back</span>
    </button>
  );
}
