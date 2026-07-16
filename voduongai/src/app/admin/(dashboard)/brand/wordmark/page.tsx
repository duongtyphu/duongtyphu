import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandWordmarkPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Wordmark</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata chữ lockup thương hiệu (&quot;VDAI ACADEMY&quot;) — dùng chung thư viện nhận diện thương hiệu, lọc theo
            category &quot;Wordmark&quot;. Gồm Quy chuẩn sử dụng (BRAND-SPR-201, Task 3) — hiện là khoảng trống thật,
            chưa có văn bản guideline chính thức ngoài mẫu code trong root CLAUDE.md.
          </p>
        </div>
        <BrandAssetRegistry lockedCategory="Wordmark" />
      </div>
    </BrandWorkspaceShell>
  );
}
