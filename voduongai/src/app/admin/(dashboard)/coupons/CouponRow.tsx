"use client";

import { useState } from "react";
import { toggleCouponActive, deleteCoupon, type Coupon } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

export function CouponRow({ coupon }: { coupon: Coupon }) {
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function handleToggle() {
    setSaving(true);
    const result = await toggleCouponActive(coupon.id, !coupon.active);
    setSaving(false);
    if (result.error) push(result.error);
    else push(coupon.active ? "Đã tạm dừng mã." : "Đã kích hoạt mã.");
  }

  async function handleDelete() {
    if (!confirm(`Xoá mã giảm giá "${coupon.code}"?`)) return;
    setSaving(true);
    const result = await deleteCoupon(coupon.id);
    setSaving(false);
    if (result.error) push(result.error);
    else push("Đã xoá mã giảm giá.");
  }

  const expired = coupon.expires_at ? new Date(coupon.expires_at) < new Date() : false;
  const exhausted = coupon.max_uses ? coupon.used_count >= coupon.max_uses : false;

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-3 text-sm font-semibold text-white/80">{coupon.code}</td>
      <td className="px-3 py-3 text-sm text-white/80">
        {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : `${coupon.discount_value.toLocaleString("vi-VN")}đ`}
      </td>
      <td className="px-3 py-3 text-sm text-white/60">
        {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
      </td>
      <td className="px-3 py-3 text-xs text-white/40">
        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString("vi-VN") : "Không hết hạn"}
      </td>
      <td className="px-3 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            coupon.active && !expired && !exhausted
              ? "bg-green-500/10 text-green-400"
              : "bg-white/5 text-white/40"
          }`}
        >
          {!coupon.active ? "Tạm dừng" : expired ? "Hết hạn" : exhausted ? "Hết lượt" : "Đang hoạt động"}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          <button
            onClick={handleToggle}
            disabled={saving}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-30"
          >
            {coupon.active ? "Tạm dừng" : "Kích hoạt"}
          </button>
          <button
            onClick={handleDelete}
            disabled={saving}
            className="rounded-lg border border-red-400/20 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-30"
          >
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}
