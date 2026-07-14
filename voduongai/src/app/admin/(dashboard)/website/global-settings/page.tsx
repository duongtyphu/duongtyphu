import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { GlobalWebsiteSettingsForm } from "@/components/admin/website/GlobalWebsiteSettingsForm";

export default function WebsiteGlobalSettingsPage() {
  return (
    <WebsiteWorkspaceShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Cài đặt</h2>
          <p className="mt-1 text-sm text-white/60">
            Cấu hình tổng thể cho Website (1 bản ghi duy nhất): Thông báo, Trang chủ mặc định, Hiển thị, cấu hình
            trình bày. Riêng với mục &quot;Cài đặt&quot; chung của toàn Admin — mỗi khu vực giữ đúng cấu hình thuộc
            phạm vi của mình, không gộp chung một trang.
          </p>
        </div>
        <GlobalWebsiteSettingsForm />
      </div>
    </WebsiteWorkspaceShell>
  );
}
