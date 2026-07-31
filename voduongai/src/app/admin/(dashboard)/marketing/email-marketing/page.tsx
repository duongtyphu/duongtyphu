import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Mail } from "lucide-react";

export const metadata = { title: "Email Marketing · Admin" };

/**
 * ADM-V2-06 — "Email Marketing" (Marketing). Re-audit xác nhận đúng ghi
 * chú gốc: dự án KHÔNG tích hợp dịch vụ gửi email hàng loạt nào (đã grep
 * — không có Resend/SendGrid/Nodemailer/SMTP). `EmailOptInForm` (dùng ở
 * /contact) chỉ POST vào bảng `leads` (thu thập, không gửi) — đã quản qua
 * "Khách hàng tiềm năng" (Vận hành). Chọn nhà cung cấp email marketing là
 * quyết định cần Founder xác nhận trước (chi phí, tuân thủ chống spam).
 */
export default async function EmailMarketingPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Marketing", href: "/admin/marketing/chuyen-doi" }, { label: "Email Marketing" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Email Marketing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gửi email marketing/bản tin tới danh sách khách hàng tiềm năng và thành viên.
        </p>
      </div>

      <AdminEmptyState
        icon={Mail}
        title="Chưa tích hợp dịch vụ gửi email hàng loạt nào"
        description="Không có API key/cấu hình cho Mailchimp/SendGrid/Resend... — cần Founder xác nhận nhà cung cấp trước khi tích hợp. Form thu email hiện có (/contact) chỉ lưu vào bảng leads, không gửi email."
        action={{ label: "Xem Khách hàng tiềm năng (Vận hành)", href: "/admin/van-hanh/khach-hang-tiem-nang" }}
      />
    </div>
  );
}
