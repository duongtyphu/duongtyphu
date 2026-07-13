import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandIconsPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Icons</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata icon thương hiệu (favicon, App Icon...) — dùng chung Brand Asset Registry, lọc theo category
            &quot;Icon&quot;. Favicon hiện đã có Admin CRUD ở System Settings (/admin/settings) — chồng lấn, xem báo
            cáo BRAND-SPR-001. App Icon (BRAND-SPR-201, Task 2) hiện là khoảng trống thật — chưa tìm thấy asset
            riêng (VD apple-touch-icon, manifest icon PWA) trong code.
          </p>
        </div>
        <BrandAssetRegistry lockedCategory="Icon" />
      </div>
    </BrandWorkspaceShell>
  );
}
