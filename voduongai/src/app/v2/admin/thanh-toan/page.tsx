import { CheckCircle2, Clock3, Ticket, Wallet } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Thanh toán & Giao dịch — Admin" };

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  rejected: "Đã từ chối",
};
const ORDER_STATUS_STYLE: Record<string, { background: string; color: string }> = {
  pending: { background: "#fdf1e0", color: "#a9822c" },
  confirmed: { background: "#e6f7ed", color: "#189a52" },
  rejected: { background: "#fdeef0", color: "var(--v2-red)" },
};

/**
 * `/v2/admin/thanh-toan` — không có trang Portal 2.0 tương ứng. Đổi từ dữ
 * liệu mock (`@/lib/v2/data/commerce` — "612,8 Tr₫ doanh thu", VNPay/Momo/
 * thẻ quốc tế KHÔNG hề tích hợp thật) sang bảng `orders`/`coupons` thật
 * (cùng nguồn Admin 1.0's `/admin/van-hanh/don-hang`/`/admin/van-hanh/ma-giam-gia`
 * đọc/ghi). Khối "Phương thức thanh toán" đổi từ 4 cổng bịa sang đúng
 * CỔNG DUY NHẤT có thật trong hệ thống — SePay (chuyển khoản ngân hàng +
 * webhook xác nhận tự động, `src/app/api/webhooks/sepay/route.ts`) —
 * tránh gợi ý sai rằng VNPay/Momo/thẻ quốc tế đã sẵn sàng dùng.
 */
export default async function AdminThanhToanPage() {
  const supabase = getSupabaseAdmin();

  const [ordersRes, couponsRes] = supabase
    ? await Promise.all([
        supabase
          .from("orders")
          .select("id, member_email, customer_name, product_name, amount, status, created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase.from("coupons").select("id, code, discount_type, discount_value, used_count, max_uses, expires_at, active"),
      ])
    : [{ data: [] }, { data: [] }];

  const orders = ordersRes.data ?? [];
  const coupons = couponsRes.data ?? [];

  const confirmed = orders.filter((o) => o.status === "confirmed");
  const pending = orders.filter((o) => o.status === "pending");
  const revenue = confirmed.reduce((sum, o) => sum + (o.amount ?? 0), 0);

  const txRows: TableRow[] = orders.map((tx) => ({
    id: String(tx.id),
    tags: [tx.status],
    cells: [
      {
        t: "user",
        initials: (tx.customer_name ?? tx.member_email ?? "??").slice(0, 2).toUpperCase(),
        name: tx.customer_name ?? tx.member_email ?? "—",
        sub: tx.member_email ?? "—",
      },
      { t: "text", v: tx.product_name ?? "—" },
      { t: "strong", v: formatVnd(tx.amount ?? 0) },
      {
        t: "tag",
        label: ORDER_STATUS_LABEL[tx.status] ?? tx.status,
        background: ORDER_STATUS_STYLE[tx.status]?.background ?? "var(--v2-bg)",
        color: ORDER_STATUS_STYLE[tx.status]?.color ?? "var(--v2-muted)",
      },
      { t: "muted", v: formatDateTime(tx.created_at) },
    ],
  }));

  const couponRows: TableRow[] = coupons.map((coupon) => ({
    id: String(coupon.id),
    cells: [
      { t: "strong", v: coupon.code },
      { t: "text", v: coupon.discount_type === "percent" ? `${coupon.discount_value}%` : formatVnd(coupon.discount_value) },
      {
        t: "progress",
        value: coupon.max_uses ? Math.min(100, (coupon.used_count / coupon.max_uses) * 100) : 0,
        label: `${coupon.used_count}/${coupon.max_uses ?? "∞"}`,
      },
      { t: "muted", v: coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString("vi-VN") : "Không giới hạn" },
      {
        t: "status",
        label: coupon.active ? "Đang hoạt động" : "Hết hiệu lực",
        color: coupon.active ? "var(--v2-green)" : "var(--v2-muted)",
      },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Quản trị hệ thống › Thanh toán & Giao dịch"
        title="Thanh toán & Giao dịch"
        description="Đơn hàng/mã giảm giá thật, cùng bảng dữ liệu Admin 1.0 (/admin/van-hanh/don-hang, /admin/van-hanh/ma-giam-gia) đang quản lý."
      />

      <KpiGrid
        items={[
          { id: "revenue", value: formatVnd(revenue), label: "Doanh thu đã xác nhận", icon: Wallet, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)" },
          { id: "success", value: String(confirmed.length), label: "Đơn đã xác nhận", icon: CheckCircle2, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)" },
          { id: "pending", value: String(pending.length), label: "Đơn chờ xác nhận", icon: Clock3, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)" },
          { id: "coupons", value: String(coupons.filter((c) => c.active).length), label: "Mã giảm giá đang hoạt động", icon: Ticket, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ]}
      />

      <DataTable
        title="Đơn hàng gần đây"
        headers={["Khách hàng", "Sản phẩm", "Số tiền", "Trạng thái", "Thời gian"]}
        rows={txRows}
        totalLabel="đơn hàng"
        totalOverride={orders.length}
        searchPlaceholder="Tìm theo khách hàng hoặc sản phẩm..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "confirmed", label: "Đã xác nhận", tag: "confirmed" },
          { id: "pending", label: "Chờ xác nhận", tag: "pending" },
          { id: "rejected", label: "Đã từ chối", tag: "rejected" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-[1.5fr_1fr]">
        <DataTable title="Mã giảm giá" headers={["Mã", "Giảm", "Đã dùng", "Hết hạn", "Trạng thái"]} rows={couponRows} pageSize={6} />

        <Card padding="admin">
          <CardHead title="Phương thức thanh toán" />
          <div className="flex items-center justify-between border-b border-[var(--v2-line)] py-3 last:border-b-0">
            <div>
              <div className="text-[13px] font-bold">SePay — Chuyển khoản ngân hàng</div>
              <div className="text-[11.5px] text-[var(--v2-muted)]">Xác nhận tự động qua webhook</div>
            </div>
            <span className="rounded-md bg-[#e6f7ed] px-[9px] py-[3px] text-[11px] font-extrabold text-[#189a52]">Đang bật</span>
          </div>
          <p className="mt-3 text-[11.5px] text-[var(--v2-muted)]">
            Đây là cổng thanh toán DUY NHẤT đang tích hợp thật trong hệ thống — quản lý CRUD mã giảm giá đầy đủ tại{" "}
            <a href="/admin/van-hanh/ma-giam-gia" className="font-bold text-[var(--v2-violet)]">
              Admin 1.0
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
