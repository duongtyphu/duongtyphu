import { CheckCircle2, CreditCard, Ticket, Wallet } from "lucide-react";

import { Card, CardHead } from "@/components/v2/ui/Card";
import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead } from "@/components/v2/ui/PageHead";
import { formatDateTime, formatVnd } from "@/lib/v2/data/client";
import {
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_STYLE,
  listCoupons,
  listTransactions,
} from "@/lib/v2/data/commerce";

export const metadata = { title: "Thanh toán & Giao dịch — Admin" };

const METHODS = [
  { id: "vnpay", name: "VNPay", note: "Thẻ nội địa & QR", enabled: true },
  { id: "momo", name: "Momo", note: "Ví điện tử", enabled: true },
  { id: "bank", name: "Chuyển khoản ngân hàng", note: "Đối soát thủ công", enabled: true },
  { id: "card", name: "Thẻ quốc tế", note: "Visa / Mastercard", enabled: false },
];

export default async function AdminThanhToanPage() {
  const [transactions, coupons] = await Promise.all([listTransactions(), listCoupons()]);

  const txRows: TableRow[] = transactions.map((tx) => ({
    id: tx.id,
    tags: [tx.status],
    cells: [
      {
        t: "user",
        initials: tx.buyerName.slice(0, 2).toUpperCase(),
        name: tx.buyerName,
        sub: tx.buyerEmail,
      },
      { t: "text", v: tx.productName },
      { t: "strong", v: formatVnd(tx.amount) },
      { t: "muted", v: tx.method },
      {
        t: "tag",
        label: PAYMENT_STATUS_LABEL[tx.status],
        background: PAYMENT_STATUS_STYLE[tx.status].background,
        color: PAYMENT_STATUS_STYLE[tx.status].color,
      },
      { t: "muted", v: formatDateTime(tx.createdAt) },
    ],
  }));

  const couponRows: TableRow[] = coupons.map((coupon) => ({
    id: coupon.id,
    cells: [
      { t: "strong", v: coupon.code },
      { t: "text", v: coupon.discount },
      { t: "progress", value: (coupon.usedCount / coupon.limit) * 100, label: `${coupon.usedCount}/${coupon.limit}` },
      { t: "muted", v: coupon.expiresAt },
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
        description="Theo dõi giao dịch, quản lý mã giảm giá và cấu hình phương thức thanh toán trên Portal."
      />

      <KpiGrid
        items={[
          { id: "revenue", value: "612,8 Tr₫", label: "Tổng doanh thu (30 ngày)", icon: Wallet, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "15,7%", trend: "up" },
          { id: "success", value: "3.047", label: "Giao dịch thành công", icon: CheckCircle2, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "8,9%", trend: "up" },
          { id: "failed", value: "2,6%", label: "Thất bại / hoàn tiền", icon: CreditCard, gradient: "linear-gradient(145deg,#ff9d52,#c2660a)", delta: "0,4%", trend: "down" },
          { id: "coupons", value: "14", label: "Mã giảm giá đang hoạt động", icon: Ticket, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ]}
      />

      <DataTable
        title="Giao dịch gần đây"
        headers={["Khách hàng", "Sản phẩm", "Số tiền", "Phương thức", "Trạng thái", "Thời gian"]}
        rows={txRows}
        totalLabel="giao dịch"
        totalOverride={3047}
        searchPlaceholder="Tìm theo khách hàng hoặc sản phẩm..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "succeeded", label: "Thành công", tag: "succeeded" },
          { id: "pending", label: "Đang xử lý", tag: "pending" },
          { id: "failed", label: "Thất bại", tag: "failed" },
          { id: "refunded", label: "Hoàn tiền", tag: "refunded" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 min-[1180px]:grid-cols-[1.5fr_1fr]">
        <DataTable
          title="Mã giảm giá"
          headers={["Mã", "Giảm", "Đã dùng", "Hết hạn", "Trạng thái"]}
          rows={couponRows}
          pageSize={6}
        />

        <Card padding="admin">
          <CardHead title="Phương thức thanh toán" />
          {METHODS.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between border-b border-[var(--v2-line)] py-3 last:border-b-0"
            >
              <div>
                <div className="text-[13px] font-bold">{method.name}</div>
                <div className="text-[11.5px] text-[var(--v2-muted)]">{method.note}</div>
              </div>
              <span
                className="rounded-md px-[9px] py-[3px] text-[11px] font-extrabold"
                style={{
                  background: method.enabled ? "#e6f7ed" : "var(--v2-bg)",
                  color: method.enabled ? "#189a52" : "var(--v2-muted)",
                }}
              >
                {method.enabled ? "Đang bật" : "Đã tắt"}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
