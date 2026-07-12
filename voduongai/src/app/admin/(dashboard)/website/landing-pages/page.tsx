import { Rocket } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteLandingPagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={Rocket}
        title="Landing Pages"
        scope="Quản lý các trang landing chuyên biệt (chương trình, chiến dịch, hệ sinh thái đầu tư...). Portal hiện tại chưa có khái niệm 'Landing Page' tách biệt — các trang gần nhất với vai trò này (Premium, các trang hệ sinh thái) đang là trang hub cố định, không phải landing page có thể tạo mới tự do."
        willManage={[
          "Trang chương trình Premium (hiện: copy hardcoded trong premium-programs.ts)",
          "Trang hệ sinh thái đầu tư (hiện: ecosystems.ts — tự ghi chú là 'CMS placeholder')",
          "Landing page chiến dịch tạo mới tự do (chưa tồn tại khái niệm này trên Portal)",
        ]}
        portalSource="Chưa có landing-page builder nào trên Portal. Nội dung gần nhất: src/components/portal/premium/premium-programs.ts, src/data/portal/ecosystems.ts — cả hai đều hardcoded. Xem docs/admin/PORTAL_COVERAGE_AUDIT.md §3 (Premium, Projects & Opportunities)."
      />
    </WebsiteWorkspaceShell>
  );
}
