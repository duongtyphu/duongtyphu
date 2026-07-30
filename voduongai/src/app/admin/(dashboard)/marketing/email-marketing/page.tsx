import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { WorkspacePlaceholder } from "@/components/admin/WorkspacePlaceholder";

export const metadata = { title: "Email Marketing · Admin" };

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <WorkspacePlaceholder
      title="Email Marketing"
      description="Gửi email marketing/bản tin tới danh sách khách hàng tiềm năng và thành viên."
      scope={[
        "Soạn và gửi email hàng loạt (newsletter, ra mắt khoá học mới).",
        "Phân đoạn danh sách nhận theo nguồn (leads) hoặc theo khoá học đã mua.",
        "Theo dõi tỷ lệ mở/click.",
      ]}
      note="Dự án hiện chưa tích hợp dịch vụ email marketing bên ngoài nào (không có API key/cấu hình cho Mailchimp, SendGrid...) — theo nguyên tắc 'không tự tích hợp dịch vụ email/pixel/analytics bên ngoài', việc chọn và tích hợp nhà cung cấp cần Founder quyết định trước."
    />
  );
}
