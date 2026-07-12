import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { GlobalWebsiteSettingsForm } from "@/components/admin/website/GlobalWebsiteSettingsForm";

export default function WebsiteGlobalSettingsPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Global Settings</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu hình tổng thể Website Workspace (1 record duy nhất): Website Announcement, Default Homepage,
            Visibility, Presentation Settings (WEB-SPR-201 Task 10). <strong>Lưu ý:</strong> sidebar Admin đã có sẵn
            mục &quot;System Settings&quot; đứng độc lập (/admin/settings) với một phần nội dung trùng lặp — đã ghi
            nhận từ WEB-SPR-001, nhắc lại nhiều sprint, vẫn CHƯA được PMO quyết định — KHÔNG tự gộp hai trang.
          </p>
        </div>
        <GlobalWebsiteSettingsForm />
      </div>
    </WebsiteWorkspaceShell>
  );
}
