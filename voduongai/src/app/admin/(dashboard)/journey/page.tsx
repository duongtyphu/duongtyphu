import { Map as MapIcon } from "lucide-react";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

/**
 * Journey — Workspace Landing (ADM-SPR-201 Task 4). Workspace MỚI, chính
 * thức hóa bởi "Workspace Navigation bắt buộc" của brief này — sở hữu
 * Portal Area "Hành trình của tôi" và các trang con của Journey Hub.
 */
export default function JourneyAdminPage() {
  return (
    <WorkspaceSectionFoundation
      icon={MapIcon}
      title="Journey"
      scope="Workspace mới (ADM-SPR-201) — sở hữu Portal Area &quot;Hành trình của tôi&quot; (/portal/hanhtrinhcuatoi + route con: ban-do, story, mirror, nhatkyhoctap, khuvuoncuaban theo Journey Hub 5 cửa). Chưa có Registry/CRUD nào — đây là Landing Foundation, không phải tính năng hoạt động."
      willManage={[
        "Nội dung Journey Hub hiện có trên Portal (My Story/Mirror/Nhật ký học tập/Khu vườn của bạn, xem Page Registry /admin/portal/pages)",
        "Chưa xác định Content Core cụ thể — cần Product Package riêng trước khi xây Registry",
      ]}
      portalSource="Portal Area &quot;Hành trình của tôi&quot; — xem chi tiết tại /admin/portal/areas (chọn Hành trình của tôi) hoặc Page Registry /admin/portal/pages (lọc theo Area)."
    />
  );
}
