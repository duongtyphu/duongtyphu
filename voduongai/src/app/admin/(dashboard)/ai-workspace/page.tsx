import { Sparkles } from "lucide-react";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

/**
 * AI Workspace — Workspace Landing (ADM-SPR-201 Task 4). Workspace MỚI,
 * chính thức hóa bởi "Workspace Navigation bắt buộc" của brief này — chưa
 * có Registry/CRUD nào, chỉ Landing mô tả phạm vi + nguồn Portal thật.
 */
export default function AiWorkspaceAdminPage() {
  return (
    <WorkspaceSectionFoundation
      icon={Sparkles}
      title="AI Workspace"
      scope="Workspace mới (ADM-SPR-201) — sở hữu Portal Area &quot;AI Workspace&quot; (/portal/aiworkspace + 3 route con: [slug]/bai-viet/[slug]/nghe/[slug]). Chưa có Registry/CRUD nào — đây là Landing Foundation, không phải tính năng hoạt động."
      willManage={[
        "Nội dung AI Workspace hiện có trên Portal (4 route thật, xem Page Registry /admin/portal/pages)",
        "Chưa xác định Content Core cụ thể — cần Product Package riêng trước khi xây Registry",
      ]}
      portalSource="Portal Area &quot;AI Workspace&quot; — xem chi tiết tại /admin/portal/areas (chọn AI Workspace) hoặc Page Registry /admin/portal/pages (lọc theo Area &quot;AI Workspace&quot;)."
    />
  );
}
