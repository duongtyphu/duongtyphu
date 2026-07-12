import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { BrandAssetRegistry } from "@/components/admin/brand/BrandAssetRegistry";

export default function BrandLogoPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Logo</h2>
          <p className="mt-1 text-sm text-white/60">
            Metadata các phiên bản logo — dùng chung Brand Asset Registry, lọc theo category &quot;Logo&quot;. Chưa có
            upload/thư viện file thật (không Asset Editor). Lưu ý: 2 phiên bản logo trong dữ liệu mẫu có 2 mã màu
            accent khác nhau (#FF7A00 vs #F97316) — xem báo cáo BRAND-SPR-001. Logo sáng/Logo tối (BRAND-SPR-201,
            Task 2) hiện là khoảng trống thật — chưa có biến thể riêng, chỉ có 1 logo dùng chung mọi nền.
          </p>
        </div>
        <BrandAssetRegistry lockedCategory="Logo" />
      </div>
    </BrandWorkspaceShell>
  );
}
