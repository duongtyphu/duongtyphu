import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Popup & Banner · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Popup & Banner"
      description="Tạo và quản lý popup/banner thông báo hiển thị trên Website hoặc Portal (khuyến mãi, thông báo bảo trì, sự kiện...)."
      scope={[
        "Tạo banner hiển thị theo thời gian (bắt đầu/kết thúc).",
        "Chọn hiển thị trên Landing Page, Portal, hoặc cả hai.",
        "Bật/tắt nhanh khi cần.",
      ]}
      note="Hiện chưa có hệ thống popup/banner nào trong sản phẩm — cần thiết kế component mới ở tầng hiển thị (Landing Page/Portal) trước khi có UI quản lý."
    />
  );
}
