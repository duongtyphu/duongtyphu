import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Mã giảm giá · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Mã giảm giá"
      description="Tạo và quản lý mã giảm giá áp dụng khi thanh toán khoá học/sản phẩm."
      scope={[
        "Tạo mã giảm giá (phần trăm hoặc số tiền cố định), giới hạn số lần dùng, ngày hết hạn.",
        "Bật/tắt mã, xem số lần đã sử dụng.",
        "Áp dụng mã vào luồng thanh toán ở /portal/checkout.",
      ]}
      note="Bảng `coupons` đã tồn tại trong schema Supabase nhưng CHƯA có bất kỳ code nào (kể cả luồng checkout) đọc/ghi bảng này — đây là schema chuẩn bị sẵn, chưa phải chức năng thật. Xây UI quản lý trước khi checkout áp dụng được sẽ tạo cảm giác 'có mã nhưng không dùng được' — cần nối cả 2 phía cùng lúc, ngoài phạm vi đợt tái cấu trúc Admin này."
    />
  );
}
