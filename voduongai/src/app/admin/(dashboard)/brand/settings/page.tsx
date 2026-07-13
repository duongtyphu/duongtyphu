import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { GlobalBrandSettingsForm } from "@/components/admin/brand/GlobalBrandSettingsForm";

export default function BrandSettingsPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Global Brand Settings</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu hình thương hiệu tổng thể (1 record duy nhất) — Brand Name/Logo/Favicon/Color/Tagline/Copyright/Brand
            Voice/Open Graph mặc định. <strong>Lưu ý:</strong> một phần field (logo/favicon, tagline) chồng lấn với
            System Settings hiện có (/admin/settings) — đã ghi nhận, KHÔNG tự gộp 2 trang, xem báo cáo
            BRAND-SPR-001.
          </p>
        </div>
        <GlobalBrandSettingsForm />
      </div>
    </BrandWorkspaceShell>
  );
}
