import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { GlobalBrandSettingsForm } from "@/components/admin/brand/GlobalBrandSettingsForm";

export default function BrandSettingsPage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Cài đặt</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu hình thương hiệu tổng thể (1 bản ghi duy nhất) — Tên thương hiệu/Logo/Favicon/Màu/Khẩu hiệu/Bản
            quyền/Giọng thương hiệu/Ảnh chia sẻ mặc định.
          </p>
        </div>
        <GlobalBrandSettingsForm />
      </div>
    </BrandWorkspaceShell>
  );
}
