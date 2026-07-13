import { Search } from "lucide-react";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

/**
 * Global Search — Placeholder (Task 6, brief ghi rõ "Placeholder").
 * Tái dùng WorkspaceSectionFoundation (component thuần, không có logic
 * riêng Website) thay vì viết lại — đúng tinh thần "Main Shell" dùng
 * chung component xuyên Workspace.
 */
export default function GlobalSearchPage() {
  return (
    <AdminWorkspaceShell
      title="Global Search"
      description="Placeholder — chưa triển khai tìm kiếm thật."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <WorkspaceSectionFoundation
        icon={Search}
        title="Global Search"
        scope="Tìm kiếm xuyên mọi Workspace (Page/Asset/Prompt/Lead...) mà không cần biết trước nó thuộc Workspace nào. Đề xuất kỹ thuật đầy đủ: docs/admin/ADMIN_FOUNDATION_V2.md Task 6."
        willManage={[
          "Search Index Contract — mỗi Registry tự khai báo toSearchEntry(item)",
          "Gộp kết quả client-side (không cần search engine/AI riêng ở Foundation)",
          "Chỉ tìm được nội dung từ Registry đã canonical hóa (Website, Brand Studio) — CKOS/Academy/Premium chưa tham gia được tới khi canonical hóa",
        ]}
        portalSource="Chưa có implementation nào — đây là Placeholder mô tả phạm vi tương lai, không phải tính năng hoạt động. Xem Content Registry (/admin/portal/content) để tìm thủ công trong lúc chờ."
      />
    </AdminWorkspaceShell>
  );
}
