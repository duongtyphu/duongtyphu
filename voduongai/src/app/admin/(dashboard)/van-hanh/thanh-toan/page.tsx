import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Thanh toán · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Thanh toán"
      description="Đối soát giao dịch thanh toán SePay — hiện trạng thái thanh toán (pending/confirmed/rejected) đã hiển thị trong cột 'Trạng thái' ở trang Đơn hàng."
      scope={[
        "Xem chi tiết log webhook SePay cho từng giao dịch (đối soát khi có tranh chấp).",
        "Đối chiếu thủ công khi webhook không khớp tự động.",
      ]}
      note="Trạng thái thanh toán là 1 cột của bảng Đơn hàng (order.status), không tạo trang riêng cùng sở hữu nguồn dữ liệu này — tránh 2 menu quản cùng 1 bảng."
      relatedLink={{ label: "Xem Đơn hàng", href: "/admin/van-hanh/don-hang" }}
    />
  );
}
