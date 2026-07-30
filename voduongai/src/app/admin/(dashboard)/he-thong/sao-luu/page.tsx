import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Sao lưu · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Sao lưu"
      description="Xem lịch sử sao lưu dữ liệu Supabase và tình trạng khôi phục."
      scope={[
        "Xem thời điểm sao lưu gần nhất.",
        "Kích hoạt sao lưu thủ công khi cần (nếu hạ tầng hỗ trợ).",
      ]}
      note="Sao lưu database hiện do Supabase quản lý ở cấp hạ tầng (ngoài phạm vi ứng dụng) — chưa có UI nào trong Admin đọc lại lịch sử sao lưu. Đây là hành động nhạy cảm (ảnh hưởng toàn bộ dữ liệu), chủ động loại khỏi phạm vi đợt tái cấu trúc này."
    />
  );
}
