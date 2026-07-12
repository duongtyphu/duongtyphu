import { ArrowRightLeft } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteRedirectPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={ArrowRightLeft}
        title="Redirect"
        scope="Quản lý chuyển hướng URL. Hiện tất cả redirect của Portal đều khai báo tĩnh trong next.config.ts, cần deploy code để thêm/sửa/xóa — kể cả 2 route đã xác nhận 'chết' (student-success, updates) ở ADM-SPR-005."
        willManage={[
          "Danh sách redirect hiện có (student-success→congdongai, updates→congdongai#tin-tuc, hanh-trinh-cua-toi→hanhtrinhcuatoi)",
          "Thêm/sửa/xóa redirect mới không cần deploy code",
        ]}
        portalSource="next.config.ts (dòng 31, 38-39) — redirect khai báo tĩnh. 2 file page.tsx tương ứng (student-success, updates) đã thành dead code, không thể render. Xem docs/admin/PORTAL_COVERAGE_AUDIT.md §1.1."
      />
    </WebsiteWorkspaceShell>
  );
}
