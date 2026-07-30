import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "CTA · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="CTA"
      description="Theo dõi hiệu suất các nút kêu gọi hành động (CTA) trên toàn hệ sinh thái — không phải nơi sửa nội dung CTA."
      scope={[
        "Xem tỷ lệ click theo từng CTA (Landing Page, Portal, Premium...).",
        "So sánh hiệu suất CTA giữa các phiên bản khi thử A/B.",
      ]}
      note="Sửa NHÃN/nội dung của từng CTA vẫn thực hiện tại đúng module sở hữu nó — ví dụ CTA Hero/Final CTA của Landing Page sửa ở 'Landing Page' (Workspace Website), không sửa ở đây để tránh 2 nơi cùng quản 1 nội dung. Trang này (khi triển khai thật) chỉ đọc số liệu hiệu suất, cần tích hợp analytics trước."
      relatedLink={{ label: "Sửa CTA của Landing Page", href: "/admin/landing" }}
    />
  );
}
