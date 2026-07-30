import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listCommissionRules } from "./actions";
import { NewCommissionRuleForm, CommissionRuleCard } from "./CommissionRuleForm";

export const metadata = { title: "Affiliate — Cấu hình hoa hồng · Admin" };

/**
 * Cấu hình mức hoa hồng theo sản phẩm — bảng `affiliate_commission_rules`
 * (đề xuất, xem `supabase-phase27-affiliate-program.sql`, CHƯA apply).
 * Trigger `handle_order_confirmed_commission` (đã sửa trong cùng đề xuất)
 * tự tra cứu bảng này khi 1 đơn hàng được xác nhận — không cấu hình rule
 * nào cho 1 sản phẩm thì dùng mức mặc định 10%.
 */
export default async function CommissionRulesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { rules, configured, error } = await listCommissionRules();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Cấu hình hoa hồng theo sản phẩm" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Cấu hình hoa hồng theo sản phẩm</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đặt mức hoa hồng riêng cho từng khoá học/sản phẩm/bài học. Sản phẩm không có cấu hình riêng dùng mức mặc
          định 10%.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — không thể đọc dữ liệu.
        </div>
      )}
      {configured && error && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">{error}</div>
      )}
      {configured && !error && (
        <>
          <NewCommissionRuleForm />
          <div className="space-y-3">
            {rules.map((r) => (
              <CommissionRuleCard key={r.id} rule={r} />
            ))}
            {rules.length === 0 && <p className="text-sm text-gray-400">Chưa có cấu hình riêng nào — mọi sản phẩm đang dùng mức mặc định 10%.</p>}
          </div>
        </>
      )}
    </div>
  );
}
