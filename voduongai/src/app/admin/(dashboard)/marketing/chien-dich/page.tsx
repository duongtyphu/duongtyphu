import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Chiến dịch · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Chiến dịch"
      description="Lập kế hoạch và theo dõi các chiến dịch marketing (ra mắt khoá học, khuyến mãi theo mùa...)."
      scope={[
        "Tạo chiến dịch với mục tiêu, thời gian chạy, kênh sử dụng.",
        "Gắn chiến dịch với landing page/CTA/mã giảm giá liên quan.",
        "Theo dõi kết quả cơ bản (lượt xem, chuyển đổi).",
      ]}
      note="Chưa có module quản lý chiến dịch nào trong sản phẩm — cần thiết kế mới hoàn toàn."
    />
  );
}
