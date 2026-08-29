import { redirect } from "next/navigation";
import PremiumPage from "@/app/v2/premium/page";
import { EditModeProvider } from "@/components/v2/premium/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Premium 2.0 — Live-edit · Admin" };

/**
 * Giai đoạn 5 — Live-edit (Cách A) cho `/v2/premium`, cùng pattern
 * `/admin/premium/dashboard` (Portal 1.0). Route RIÊNG, KHÔNG gộp vào
 * `/admin/premium/dashboard` — 2 trang Portal khác nhau (`/portal/premium`
 * 1.0 vs `/v2/premium` 2.0), mỗi trang 1 route Live-edit độc lập, đúng
 * nguyên tắc "1 module = 1 route Live-edit chính thức" đã áp dụng xuyên
 * suốt dự án.
 *
 * Render lại ĐÚNG component gốc `/v2/premium/page.tsx` (`PremiumPage`,
 * import thẳng), bọc `<EditModeProvider>` (module `v2/premium`, KHÁC
 * `portal/premium`'s Context dù cùng chủ đề — 2 route độc lập).
 *
 * Quản lý qua đây: 2 lưới quyền lợi (`premium_perks`), cố vấn chọn gói
 * (`premium_advisor_situations`), người đồng hành (`premium_founder`).
 * Khối "Thanh toán hoạt động thế nào?" tái dùng `premium_chrome`/
 * `premium_payment_steps` — sửa ở ĐÂY cũng được (Single Source of Truth),
 * nhưng `/admin/premium/dashboard` (1.0) vẫn là nơi chính thức quản field
 * đó. "Câu hỏi thường gặp" (`premium_faq`) và giá/trạng thái 3 gói
 * (`premium_plans`) đã có route riêng — `/admin/premium/dashboard`/
 * `/admin/premium/plans` — không lặp lại ở đây.
 */
export default async function PremiumV2DashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-4">
      <AdminBreadcrumb
        trail={[
          { label: "Premium", href: "/admin/premium/plans" },
          { label: "Premium 2.0 (Live-edit)" },
        ]}
      />
      <EditModeProvider>
        <PremiumPage />
      </EditModeProvider>
    </div>
  );
}
