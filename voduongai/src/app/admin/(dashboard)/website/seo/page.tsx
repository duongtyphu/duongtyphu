import { Search } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteSeoPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={Search}
        title="SEO"
        scope="Quản lý metadata SEO (title/description/OG) cho từng trang thuộc Website Workspace (Homepage/Landing/Static). LƯU Ý: sidebar Admin đã có sẵn một mục 'SEO' đứng độc lập ở cấp cao nhất (/admin/seo, đặt ở ADM-SPR-002, hiện là ComingSoon) — có thể có phạm vi rộng hơn (SEO cho mọi nội dung, không riêng Website). Đây là khác biệt giữa Product Package (Website Workspace có SEO riêng) và cấu trúc Admin đã duyệt trước đó — đã ghi nhận, KHÔNG tự gộp/xóa mục nào, trình PMO quyết định ở WEB-SPR-002."
        willManage={[
          "Title/description/OG image cho từng trang trong Pages",
          "SEO mặc định toàn site (hiện: một phần đã có ở /admin/settings)",
        ]}
        portalSource="Metadata hardcoded literal trong từng page.tsx (VD: src/app/portal/premium/page.tsx). Chỉ SEO mặc định toàn site đã admin-editable qua SiteSettings (/admin/settings). Xem docs/admin/PORTAL_COVERAGE_AUDIT.md §5."
      />
    </WebsiteWorkspaceShell>
  );
}
