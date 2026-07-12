import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandWordmarkPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Wordmark</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata chữ lockup thương hiệu (&quot;VDAI ACADEMY&quot;) — dùng chung Brand Asset Registry, lọc theo
            category &quot;Wordmark&quot;.
          </p>
        </div>
        <BrandAssetRegistry lockedCategory="Wordmark" />
      </div>
    </BrandWorkspaceShell>
  );
}
