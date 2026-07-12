import { FileText } from "lucide-react";
import { WebsiteWorkspaceShell } from "@/components/admin/website/WebsiteWorkspaceShell";
import { WorkspaceSectionFoundation } from "@/components/admin/website/WorkspaceSectionFoundation";

export default function WebsitePagesPage() {
  return (
    <WebsiteWorkspaceShell>
      <WorkspaceSectionFoundation
        icon={FileText}
        title="Pages"
        scope="Danh sách tổng hợp mọi trang thuộc Website Workspace — gộp Homepage, Landing Pages, Static Pages vào một chỗ để xem tổng quan trạng thái (Draft/Published/Pending Review) trước khi đi vào từng loại trang riêng."
        willManage={[
          "Bảng tổng hợp tất cả trang (loại trang, trạng thái, cập nhật gần nhất)",
          "Tìm kiếm/lọc theo loại trang, trạng thái",
          "Điều hướng nhanh sang Homepage / Landing Pages / Static Pages",
        ]}
        portalSource="Chưa có khái niệm 'Pages' tổng hợp nào trên Portal hiện tại — mỗi loại trang (Home, Premium, Academy...) là route riêng lẻ, không có danh sách quản trị chung. Đây là khái niệm mới của Admin, không kế thừa từ Portal."
      />
    </WebsiteWorkspaceShell>
  );
}
