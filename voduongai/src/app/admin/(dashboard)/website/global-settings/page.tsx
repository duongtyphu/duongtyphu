import { Settings } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteGlobalSettingsPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={Settings}
        title="Global Settings"
        scope="Cấu hình tổng thể của Website Workspace: Website Settings, Global Presentation Settings, Homepage Configuration, Visibility Configuration. LƯU Ý: sidebar Admin đã có sẵn mục 'System Settings' đứng độc lập (/admin/settings) với một phần nội dung trùng lặp (tên site, logo, favicon, SEO mặc định, social link, footer text). Đây là khác biệt giữa Product Package và cấu trúc Admin đã duyệt trước đó — đã ghi nhận từ WEB-SPR-001, nhắc lại ở WEB-SPR-002 đến WEB-SPR-006, vẫn CHƯA được PMO quyết định — KHÔNG tự gộp hai trang."
        willManage={[
          "Website Settings (cấu hình riêng Website Workspace)",
          "Global Presentation Settings (theme/layout mặc định cho trang công khai)",
          "Homepage Configuration (bật/tắt từng section trên trang chủ)",
          "Visibility Configuration (ẩn/hiện trang, theo lịch xuất bản)",
        ]}
        portalSource="/admin/settings (System Settings, đã tồn tại từ trước EPIC-02) hiện quản lý tên site/logo/favicon/SEO mặc định/social link/footer text qua bảng Supabase settings — có phạm vi chồng lấn một phần với Global Settings của Website Workspace."
      />
    </WebsiteWorkspaceShell>
  );
}
