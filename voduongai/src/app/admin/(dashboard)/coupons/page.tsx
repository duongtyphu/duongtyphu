import { listCoupons } from "./actions";
import { CouponRow } from "./CouponRow";
import { CouponForm } from "./CouponForm";

export default async function CouponsAdminPage() {
  const { coupons, configured } = await listCoupons();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Mã giảm giá</h1>
        <p className="mt-1 text-sm text-white/50">
          Tạo và quản lý mã giảm giá dùng tại Checkout (dữ liệu thật từ Supabase).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để quản lý mã giảm giá.
        </div>
      )}

      {configured && (
        <>
          <CouponForm />
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wide text-white/40">
                  <th className="px-3 py-3">Mã</th>
                  <th className="px-3 py-3">Giảm giá</th>
                  <th className="px-3 py-3">Đã dùng</th>
                  <th className="px-3 py-3">Hết hạn</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <CouponRow key={c.id} coupon={c} />
                ))}
              </tbody>
            </table>
            {coupons.length === 0 && <p className="p-5 text-sm text-white/40">Chưa có mã giảm giá nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
