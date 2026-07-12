import { File } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsiteStaticPagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={File}
        title="Static Pages"
        scope="Quản lý các trang tĩnh (Giới thiệu, Liên hệ...). Lưu ý riêng cho nhóm trang pháp lý: Portal Coverage Audit (ADM-SPR-005) khuyến nghị KHÔNG đưa Terms/Privacy/Refund/Disclaimer vào CRUD tự do — nội dung pháp lý cần được review qua code, không nên sửa tùy ý qua Admin. Mục này vẫn tồn tại trong IA theo đúng Product Package, nhưng phạm vi CRUD thật (WEB-SPR-002+) cần PMO xác nhận có bao gồm nhóm trang pháp lý hay không."
        willManage={[
          "Trang Giới thiệu (About)",
          "Trang Liên hệ (Contact)",
          "Trang pháp lý (Terms/Privacy/Refund/Disclaimer) — CẦN PMO XÁC NHẬN phạm vi trước khi cho CRUD tự do",
        ]}
        portalSource="src/app/{about,contact,terms,privacy,refund-policy,disclaimer}/page.tsx — body nội dung hardcoded trong từng file. Xem docs/admin/PORTAL_COVERAGE_AUDIT.md §5 (mục 'No — nên giữ nguyên trong code')."
      />
    </WebsiteWorkspaceShell>
  );
}
