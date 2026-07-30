import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Nhật ký hệ thống · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Nhật ký hệ thống"
      description="Xem log lỗi/sự kiện kỹ thuật của ứng dụng (khác với 'Hoạt động gần đây' — đó là log THAY ĐỔI NỘI DUNG do Admin thực hiện)."
      scope={[
        "Xem log lỗi server/API gần đây.",
        "Lọc theo route, theo mức độ nghiêm trọng.",
      ]}
      note="Hiện log kỹ thuật chỉ xem được qua Vercel Dashboard/Runtime Logs (ngoài sản phẩm) — chưa có UI đọc lại log này ngay trong Admin."
    />
  );
}
