import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Hoạt động gần đây · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Hoạt động gần đây"
      description="Nhật ký đầy đủ mọi thay đổi nội dung trong Admin — ai sửa gì, lúc nào, trên module nào."
      scope={[
        "Danh sách đầy đủ các lần cập nhật gần đây trên mọi bảng dữ liệu (không chỉ 8 dòng rút gọn).",
        "Lọc theo Workspace/module, theo khoảng thời gian.",
        "Xem chi tiết thay đổi (trước/sau) cho từng bản ghi — cần thêm cơ chế audit log chưa có sẵn.",
      ]}
      note="Trang Tổng quan (/admin/dashboard) hiện đã có khối 'Hoạt động gần đây' rút gọn (dữ liệu thật, gộp theo cập nhật gần nhất) — trang này sẽ là bản đầy đủ, có bộ lọc."
      relatedLink={{ label: "Xem Tổng quan", href: "/admin/dashboard" }}
    />
  );
}
