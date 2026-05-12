import AssetTable from "@/components/assets/AssetTable";

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Assets
        </h1>

        <p className="text-zinc-500 mt-2">
          Manage company assets
        </p>
      </div>

      <AssetTable />
    </div>
  );
}