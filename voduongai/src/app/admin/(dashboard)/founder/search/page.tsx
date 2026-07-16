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
      title="Tìm kiếm toàn Admin"
      description="Placeholder — chưa triển khai tìm kiếm thật."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <WorkspaceSectionFoundation
        icon={Search}
        title="Tìm kiếm toàn Admin"
        scope="Tìm kiếm xuyên mọi khu vực (trang/media/prompt/lead...) mà không cần biết trước nó thuộc khu vực nào. Đề xuất kỹ thuật đầy đủ: docs/admin/ADMIN_FOUNDATION_V2.md Task 6."
        willManage={[
          "Chuẩn chỉ mục tìm kiếm — mỗi nhóm dữ liệu tự khai báo toSearchEntry(item)",
          "Gộp kết quả phía trình duyệt (không cần công cụ tìm kiếm/AI riêng ở giai đoạn nền)",
          "Chỉ tìm được nội dung từ nhóm dữ liệu đã chuẩn hóa (Website, Thương hiệu) — Hệ tri thức AI/Học viện AI/Premium tham gia sau khi chuẩn hóa",
        ]}
        portalSource="Chưa triển khai — đây là phần giữ chỗ mô tả phạm vi tương lai, không phải tính năng hoạt động."
      />
    </AdminWorkspaceShell>
  );
}
