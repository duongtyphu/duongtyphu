import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandAssetsPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Brand Assets Registry</h2>
          <p className="mt-1 text-sm text-white/60">
            Danh sách tổng hợp toàn bộ Brand Asset thuộc mọi category (Logo/Wordmark/Icon/Open Graph Image) — dùng
            chung 1 schema, không lọc. Xem từng mục riêng ở Logo/Wordmark/Icons/Open Graph.
          </p>
        </div>
        <BrandAssetRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
