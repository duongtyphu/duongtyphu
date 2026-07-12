import { ClipboardCheck } from "lucide-react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

/** Review Queue — Placeholder (Task 7, brief ghi rõ "Placeholder"). */
export default function ReviewQueuePage() {
  return (
    <AdminWorkspaceShell
      title="Review Queue"
      description="Placeholder — chưa triển khai gộp hàng chờ duyệt thật."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <WorkspaceSectionFoundation
        icon={ClipboardCheck}
        title="Review Queue"
        scope="Gộp mọi nội dung đang ở trạng thái chờ duyệt (Review) từ mọi Workspace vào 1 nơi, thay vì Founder phải vào từng Workspace tự lọc theo Status. Đề xuất kỹ thuật đầy đủ: docs/admin/ADMIN_FOUNDATION_V2.md Task 9."
        willManage={[
          "Review Manifest — khai báo Registry nào có khái niệm \"chờ duyệt\", field Status tên gì, giá trị pending nào",
          "Chỉ 2/10 collection hiện có trạng thái Review thật: Website Pages, Website Shared Sections",
          "Navigation/SEO/Redirect/mọi Registry Brand Studio dùng Status 4 trạng thái, không có bước Review — sẽ không xuất hiện ở Queue",
        ]}
        portalSource="Chưa có implementation nào — đây là Placeholder mô tả phạm vi tương lai. Trong lúc chờ, lọc thủ công theo Status &quot;Review&quot; ngay tại Page Registry (/admin/website/pages) hoặc Shared Sections (/admin/website/shared-sections)."
      />
    </AdminWorkspaceShell>
  );
}
