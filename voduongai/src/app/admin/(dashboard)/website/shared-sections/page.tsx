import { LayoutGrid } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteSharedSectionsPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={LayoutGrid}
        title="Shared Sections"
        scope="Quản lý các khối nội dung dùng chung nhiều nơi: Footer, CTA, Banner/Announcement. Đây cũng là nơi chuẩn bị nền tảng cho 3 khái niệm Footer/CTA/Announcement mà Task 5 (Presentation Foundation) yêu cầu — không tách thành nhóm IA riêng vì Product Package chỉ định đúng 10 nhóm, 3 khái niệm này là sub-scope của Shared Sections."
        willManage={[
          "Footer (cột link, mạng xã hội — hiện: hardcoded Footer.tsx)",
          "CTA blocks (hiện: bảng portal_cta đã có Admin CRUD nhưng ORPHAN — Portal không đọc)",
          "Banner/Announcement (hiện: chỉ portal_banners → NotificationTicker là đã nối dây thật; portal_featured/portal_sections/portal_welcome cũng orphan)",
        ]}
        portalSource="src/components/site/Footer.tsx (hardcoded); bảng portal_cta/portal_featured/portal_sections/portal_welcome đã có Admin CRUD ở /admin/portal-builder/* nhưng ORPHAN (Portal không đọc) — phát hiện quan trọng nhất của ADM-SPR-005 §Tóm tắt điều hành, mục 2. Chỉ portal_banners (NotificationTicker) đã nối dây thật."
      />
    </WebsiteWorkspaceShell>
  );
}
