import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Thành viên · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Thành viên"
      description="Góc nhìn thành viên theo gói/khoá học đã sở hữu (Premium, VDAI SOLO/SCALE...), khác với danh sách tài khoản chung."
      scope={[
        "Lọc thành viên theo khoá học/gói đã mua (dựa trên bảng orders).",
        "Xem lịch sử mua hàng của từng thành viên.",
        "Phân biệt thành viên miễn phí và thành viên đã mua Premium.",
      ]}
      note="Cùng nguồn dữ liệu người dùng với 'Danh sách người dùng' (bảng members) — trang này sẽ KHÔNG tách thành 1 nơi quản lý riêng biệt cho tới khi có tiêu chí phân loại rõ ràng, tránh 2 menu cùng sở hữu 1 nguồn dữ liệu."
      relatedLink={{ label: "Xem Danh sách người dùng", href: "/admin/users" }}
    />
  );
}
