import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Công việc · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Công việc"
      description="Danh sách việc cần Founder xử lý, gom từ toàn bộ hệ thống (nội dung chờ duyệt, dữ liệu thiếu, cảnh báo cấu hình...) về một nơi duy nhất."
      scope={[
        "Gom việc cần xử lý từ các Workspace khác (ví dụ: đơn hàng chờ xác nhận, ticket hỗ trợ chưa trả lời).",
        "Đánh dấu đã xử lý / bỏ qua cho từng việc.",
        "Lọc theo Workspace, mức độ ưu tiên.",
      ]}
      note="Trang Tổng quan (/admin/dashboard) hiện đã có khối 'Việc cần xử lý' rút gọn từ dữ liệu thật (đơn hàng chờ xác nhận, ticket mở) — trang này sẽ là bản đầy đủ, có thể thao tác trực tiếp."
      relatedLink={{ label: "Xem Tổng quan", href: "/admin/dashboard" }}
    />
  );
}
