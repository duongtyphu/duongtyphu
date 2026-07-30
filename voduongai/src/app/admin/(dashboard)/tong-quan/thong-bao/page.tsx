import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Thông báo · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Thông báo"
      description="Trung tâm thông báo hệ thống — đơn hàng mới, ticket hỗ trợ mới, cảnh báo cấu hình (ví dụ thiếu biến môi trường)."
      scope={[
        "Thông báo thời gian thực khi có đơn hàng/ticket/khách hàng tiềm năng mới.",
        "Đánh dấu đã đọc, lưu trữ lịch sử thông báo.",
        "Tuỳ chọn nhận thông báo qua email cho một số sự kiện.",
      ]}
      note="Hiện chưa có cơ chế thông báo thời gian thực nào trong hệ thống — cần hạ tầng riêng (Supabase Realtime hoặc tương tự), ngoài phạm vi đợt tái cấu trúc này."
    />
  );
}
