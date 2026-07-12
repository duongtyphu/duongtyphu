import { Navigation } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteNavigationPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={Navigation}
        title="Navigation"
        scope="Quản lý menu điều hướng của trang web công khai và sidebar Portal — hiện cả hai đều là mảng hardcode trong code, cần deploy để đổi một mục menu."
        willManage={[
          "Menu header trang công khai (mainNav — Trang chủ/Học viện AI/AI Workspace/Blog AI...)",
          "Sidebar Portal (portalNavSections — 10 mục hiện có)",
          "Thêm/sửa/xóa/sắp xếp mục menu, không cần deploy code",
        ]}
        portalSource="src/lib/site.ts (mainNav, menu công khai) và src/lib/portal/hubs.ts (portalNavSections, sidebar Portal) — cả hai đều hardcoded TypeScript, không có bảng dữ liệu. Xem docs/admin/PORTAL_COVERAGE_AUDIT.md §1.2."
      />
    </WebsiteWorkspaceShell>
  );
}
