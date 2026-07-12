import { Image as ImageIcon } from "lucide-react";
import { ComingSoon } from "@/components/admin/ComingSoon";

export default function MediaCenterAdminPage() {
  return (
    <ComingSoon
      icon={ImageIcon}
      title="Media Center"
      description="Thư viện media dùng chung (ảnh, video, file) cho các Workspace khác. Trước là một phần của mục 'Brand & Media' — nay tách khỏi Brand Studio (BRAND-SPR-001) sau khi Brand Studio trở thành Workspace riêng. Chưa có Product Package chính thức, xem docs/admin/workspaces/media-center.md (skeleton Draft)."
    />
  );
}
