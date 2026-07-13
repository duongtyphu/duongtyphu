"use client";

import { useState } from "react";
import { updateOrderStatus, type Order } from "./actions";
import { useAdminToast } from "@/lib/admin/toast";

const statusLabel: Record<string, string> = {
  pending: "Đang chờ xác nhận",
  confirmed: "Đã xác nhận",
  rejected: "Bị từ chối",
};

export function OrderRow({ order }: { order: Order }) {
  const [saving, setSaving] = useState(false);
  const { push } = useAdminToast();

  async function setStatus(status: "pending" | "confirmed" | "rejected") {
    setSaving(true);
    const result = await updateOrderStatus(order.id, status);
    setSaving(false);
    if (result.error) {
      push(result.error);
      return;
    }
    push(status === "confirmed" ? "Đã xác nhận đơn hàng." : status === "rejected" ? "Đã từ chối đơn hàng." : "Đã lưu.");
  }

  const itemRef = order.course_id
    ? `Khoá học #${order.course_id}`
    : order.product_id
      ? `Sản phẩm #${order.product_id}`
      : order.lesson_id
        ? `Bài học #${order.lesson_id}`
        : "—";

  return (
    <tr className="border-b border-white/5">
      <td className="px-3 py-3 text-sm text-white/80">{order.order_code ?? `#${order.id}`}</td>
      <td className="px-3 py-3 text-sm text-white/80">{order.member_email}</td>
      <td className="px-3 py-3 text-sm text-white/80">{order.product_name ?? "—"}</td>
      <td className="px-3 py-3 text-xs text-white/50">{itemRef}</td>
      <td className="px-3 py-3 text-sm font-semibold text-brand-orange">{order.amount.toLocaleString("vi-VN")}đ</td>
      <td className="px-3 py-3 text-xs text-white/40">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
      <td className="px-3 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            order.status === "confirmed"
              ? "bg-green-500/10 text-green-400"
              : order.status === "rejected"
                ? "bg-red-500/10 text-red-400"
                : "bg-brand-orange/10 text-brand-orange"
          }`}
        >
          {statusLabel[order.status] ?? order.status}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          <button
            onClick={() => setStatus("confirmed")}
            disabled={saving || order.status === "confirmed"}
            className="rounded-lg border border-green-400/20 px-2.5 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/10 disabled:opacity-30"
          >
            Xác nhận
          </button>
          <button
            onClick={() => setStatus("rejected")}
            disabled={saving || order.status === "rejected"}
            className="rounded-lg border border-red-400/20 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-30"
          >
            Từ chối
          </button>
        </div>
      </td>
    </tr>
  );
}
