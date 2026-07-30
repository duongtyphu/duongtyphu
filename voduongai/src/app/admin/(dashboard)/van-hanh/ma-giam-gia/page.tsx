import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listCoupons } from "./actions";
import { NewCouponForm, CouponCard } from "./CouponForm";

export const metadata = { title: "Mã giảm giá · Admin" };

/**
 * ADM-V2-03 — "Mã giảm giá" (Vận hành). ĐÍNH CHÍNH so với ghi chú cũ ở
 * `WorkspacePlaceholder`/`nav.ts` ("chưa có code nào đọc/ghi bảng này"):
 * grep trực tiếp `src/app/portal/checkout/actions.ts` xác nhận `applyCoupon()`
 * ĐÃ đọc/validate/trừ tiền/tăng `used_count` thật trên bảng `coupons` — đây
 * là tính năng THẬT đang chạy (2 mã thật, 1 mã đã dùng 2 lần), không phải
 * schema mồ côi. CRUD thật ở đây hợp lệ (Server Actions riêng, bảng typed,
 * cùng pattern `case_studies`/`courses`) — không đụng luồng checkout/
 * `applyCoupon()`.
 */
export default async function MaGiamGiaPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { coupons, configured } = await listCoupons();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Vận hành", href: "/admin/van-hanh/don-hang" }, { label: "Mã giảm giá" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Mã giảm giá</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mã áp dụng thật ở luồng thanh toán (/portal/checkout). Sửa/tạo/xoá ở đây có hiệu lực ngay cho lần
          áp mã tiếp theo — không ảnh hưởng đơn hàng đã tạo trước đó.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền
          service role để quản lý mã giảm giá.
        </div>
      )}

      {configured && (
        <>
          <NewCouponForm />

          <div className="space-y-3">
            {coupons.map((c) => (
              <CouponCard key={c.id} coupon={c} />
            ))}
            {coupons.length === 0 && <p className="text-sm text-gray-400">Chưa có mã giảm giá nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
