import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Phân tích Marketing · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Phân tích Marketing"
      description="Tổng hợp số liệu marketing (lượt truy cập, nguồn traffic, hiệu suất chiến dịch) trong 1 dashboard riêng."
      scope={[
        "Tổng hợp số liệu từ Google Analytics theo nguồn traffic.",
        "Kết hợp với dữ liệu Chiến dịch/CTA/Chuyển đổi khi các module đó có dữ liệu thật.",
      ]}
      note="Dự án đã có NEXT_PUBLIC_GA_ID (Google Analytics) chạy trên frontend, nhưng chưa có Admin dashboard nào đọc lại số liệu từ Google Analytics — theo nguyên tắc 'không tự tích hợp dịch vụ analytics bên ngoài', việc này cần API/quyền truy cập Google Analytics riêng do Founder cấp trước."
    />
  );
}
