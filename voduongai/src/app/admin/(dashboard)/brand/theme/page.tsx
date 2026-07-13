import { BrandWorkspaceShell } from "@/components/admin/brand/BrandWorkspaceShell";
import { ThemeRegistry } from "@/components/admin/brand/ThemeRegistry";

export default function BrandThemePage() {
  return (
    <BrandWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Theme</h2>
          <p className="mt-1 text-sm text-white/60">
            Ghi nhận các theme (tổ hợp nền/chữ/accent) đang thực sự tồn tại trong code — không phải Theme Builder,
            không có cơ chế switch theme thật. Phát hiện: Portal/Admin dùng nền tối hardcode trực tiếp trong từng
            component, không đi qua token --background/--foreground định nghĩa ở :root.
          </p>
        </div>
        <ThemeRegistry />
      </div>
    </BrandWorkspaceShell>
  );
}
