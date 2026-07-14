import { MediaWorkspaceShell } from "@/components/admin/media/MediaWorkspaceShell";
import { MediaSettingsForm } from "@/components/admin/media/MediaSettingsForm";

export default function MediaSettingsPage() {
  return (
    <MediaWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Cài đặt</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu hình chung cho Thư viện Media (1 bản ghi duy nhất) — Quy tắc tải lên/Thư mục mặc định/Hiển thị/Chính
            sách lưu trữ. Chưa có cơ chế tải file lên thật để áp dụng các quy tắc này.
          </p>
        </div>
        <MediaSettingsForm />
      </div>
    </MediaWorkspaceShell>
  );
}
