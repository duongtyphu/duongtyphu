import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Phiên đăng nhập · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Phiên đăng nhập"
      description="Xem và quản lý các phiên đăng nhập đang hoạt động của người dùng."
      scope={[
        "Danh sách phiên đăng nhập đang hoạt động theo từng tài khoản.",
        "Thu hồi (đăng xuất từ xa) 1 phiên cụ thể khi nghi ngờ bất thường.",
        "Lịch sử đăng nhập gần đây (thiết bị/vị trí nếu Supabase Auth hỗ trợ).",
      ]}
      note="Trang 'Danh sách người dùng' hiện có hiển thị lần đăng nhập gần nhất — nhưng chưa có danh sách phiên đang hoạt động hay khả năng thu hồi phiên. Đây là hành động nhạy cảm (ảnh hưởng phiên đăng nhập thật), chủ động loại khỏi phạm vi đợt này."
      relatedLink={{ label: "Xem Danh sách người dùng", href: "/admin/users" }}
    />
  );
}
