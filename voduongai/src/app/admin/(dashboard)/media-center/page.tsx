import { Image as ImageIcon } from "lucide-react";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

/**
 * Media Center — Workspace Landing (ADM-SPR-201 Task 4, nâng cấp từ
 * ComingSoon đơn giản sang WorkspaceSectionFoundation để nhất quán với
 * mọi Workspace Landing khác trong Main Shell).
 */
export default function MediaCenterAdminPage() {
  return (
    <WorkspaceSectionFoundation
      icon={ImageIcon}
      title="Media Center"
      scope="Thư viện media dùng chung (ảnh, video, file) cho các Workspace khác. Trước là một phần của mục &quot;Brand & Media&quot; — nay tách khỏi Brand Studio (BRAND-SPR-001) sau khi Brand Studio trở thành Workspace riêng. Chưa có Product Package chính thức."
      willManage={[
        "Upload/thư viện file dùng chung (chưa có route/CRUD nào)",
        "Kết nối với Brand Asset Registry (Brand Studio) và Open Graph Image một khi có Product Package",
      ]}
      portalSource="Chưa có Product Package chính thức — xem docs/admin/workspaces/media-center.md (skeleton Draft, cập nhật ADM-SPR-201: xác nhận tách khỏi Brand Studio)."
    />
  );
}
