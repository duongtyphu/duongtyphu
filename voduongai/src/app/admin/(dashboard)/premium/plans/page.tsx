import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listPremiumPlans } from "./actions";
import { NewPlanForm, PlanCard } from "./PlanForm";

export const metadata = { title: "Gói Premium · Admin" };

/**
 * Phase 38 — "Gói Premium (Tháng/6 Tháng/12 Tháng)" thay thế 5 chương trình
 * mua đứt trên `/v2/premium` ("Bản thử 2.0"), theo yêu cầu riêng của
 * Founder: mua bất kỳ gói nào mở khoá TOÀN BỘ tính năng Portal (CKOS/Học
 * viện AI/AI Workspace — `getPremiumStatus()` đã dùng chung, không cần sửa
 * gì thêm ở đó). Mỗi gói vẫn thanh toán 1 LẦN qua đúng luồng SePay đang
 * chạy — hệ thống chưa có cổng thanh toán hỗ trợ gia hạn tự động — nhưng
 * mở Premium có THỜI HẠN thật (`duration_days`, ngày), gia hạn qua trigger
 * DB `on_order_confirmed_premium_plan` khi đơn xác nhận.
 *
 * KHÔNG đụng "Giá khoá học Premium" (`/admin/course-pricing`, bảng
 * `courses`) — vẫn phục vụ Portal 1.0 (`/portal/premium`) như cũ.
 */
export default async function PremiumPlansPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { plans, configured } = await listPremiumPlans();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Học viện", href: "/admin/dashboard" }, { label: "Premium", href: "/admin/course-pricing" }, { label: "Gói Premium" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Gói Premium — Tháng / 6 Tháng / 12 Tháng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Hiển thị thật trên <code className="text-brand-blue">/v2/premium</code> (Bản thử 2.0). Mua bất kỳ gói nào (chỉ
          gói ở trạng thái &quot;Đã xuất bản&quot; mới mở bán) đều mở khoá toàn bộ tính năng Portal đúng số ngày hiệu lực
          của gói — không phân biệt gói nào.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền service role để
          quản lý gói Premium.
        </div>
      )}

      {configured && (
        <>
          <NewPlanForm />

          <div className="space-y-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
            {plans.length === 0 && <p className="text-sm text-gray-400">Chưa có gói Premium nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
