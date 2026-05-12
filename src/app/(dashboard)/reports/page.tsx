import ReportsTable from "@/components/reports/ReportsTable";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Reports
        </h1>

        <p className="text-zinc-500 mt-2">
          Track asset assignments,
          returns, employee usage,
          and audit history.
        </p>
      </div>

      {/* Reports Table */}
      <ReportsTable />
    </div>
  );
}