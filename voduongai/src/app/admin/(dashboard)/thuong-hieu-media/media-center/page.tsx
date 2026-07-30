import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Media Center · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Media Center"
      description="Thư viện tập trung cho toàn bộ hình ảnh/video dùng trong Website, Portal và Học viện."
      scope={[
        "Tải lên, tìm kiếm, gắn thẻ ảnh/video.",
        "Xem ảnh nào đang được dùng ở trang nào (tránh xoá nhầm ảnh đang dùng).",
        "Tối ưu dung lượng khi tải lên.",
      ]}
      note="Hiện ảnh/video nằm rải rác trong thư mục public/images/ theo từng module (duan-cohoi/, landing-preview/, garden/...), gắn trực tiếp qua đường dẫn code — chưa có thư viện quản lý tập trung nào. Xây Media Center KHÔNG được di chuyển/đổi tên các file/URL ảnh hiện có (đang được Landing Page/Portal tham chiếu trực tiếp)."
    />
  );
}
