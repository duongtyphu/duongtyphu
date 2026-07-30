import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Vai trò & Phân quyền · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Vai trò & Phân quyền"
      description="Quản lý vai trò chi tiết hơn mức nhị phân Admin/không hiện tại."
      scope={[
        "Định nghĩa các vai trò (ví dụ: Editor nội dung, Hỗ trợ khách hàng, Admin toàn quyền).",
        "Gán/thu hồi vai trò cho từng người dùng.",
        "Giới hạn quyền truy cập từng Workspace theo vai trò.",
      ]}
      note="Bảng `members` hiện chỉ có cột is_admin (boolean, có/không) — chưa có hệ vai trò (role) nào. Xây tính năng này cần thiết kế schema + cơ chế phân quyền mới, không tự triển khai trong đợt tái cấu trúc này (đúng nguyên tắc 'không tạo hệ thống phân quyền song song')."
    />
  );
}
