import AssignmentTable from "@/components/assignments/AssignmentTable";
import Link from "next/link";

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Assignments
          </h1>

          <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">
            Track assigned assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assignments/add"
            className="inline-flex py-2 items-center justify-center rounded-lg bg-zinc-900 pr-6 pl-4 text-sm font-medium gap-2 text-zinc-50 transition-all hover:bg-zinc-800 shadow-lg shadow-zinc-200 active:scale-95"
          >
            <i className="ri-add-line"></i> Assign Asset
          </Link>
        </div>
      </div>

      <AssignmentTable />
    </div>
  );
}
