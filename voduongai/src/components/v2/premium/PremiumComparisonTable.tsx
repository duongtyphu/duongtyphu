"use client";

import type { PremiumPlan } from "@/lib/portal/live-premium-plans";

/**
 * "So sánh quyền lợi" — Founder yêu cầu thêm lại đúng bảng đã có trong bản
 * thiết kế gốc (`Premium.html`, CSS `.comp-table` vẫn còn nguyên trong
 * `premium.css`, chỉ JSX từng bị bỏ ở đợt Giai đoạn 5 vì "3 thẻ giá đã đủ").
 *
 * KHÔNG hardcode nội dung bảng — dựng THẬT từ `premium_plans.features`
 * (admin-editable qua `/admin/premium/plans`), vì mỗi gói viết theo kiểu
 * CỘNG DỒN ("Tất cả quyền lợi Gói Tháng" + vài dòng riêng của gói đó, xem
 * dữ liệu seed thật). `resolvePlanFeatures()` đệ quy: 1 dòng bắt đầu bằng
 * "Tất cả quyền lợi " được thay bằng TOÀN BỘ danh sách đã resolve của gói
 * được nhắc tới (tra theo `name`, chỉ nhận gói đứng TRƯỚC trong mảng —
 * tránh vòng lặp), các dòng khác giữ nguyên. Hàng của bảng = hợp các dòng
 * đã resolve của MỌI gói (thứ tự xuất hiện lần đầu, từ gói rẻ nhất trở
 * đi) — gói nào có dòng đó thì tick, không có thì gạch ngang. Tự động
 * đúng nếu Admin sửa `features` sau này, không cần sửa code.
 */

function resolvePlanFeatures(plans: PremiumPlan[], index: number, cache: Map<number, string[]>): string[] {
  const cached = cache.get(index);
  if (cached) return cached;

  const plan = plans[index];
  const resolved: string[] = [];
  for (const line of plan.features) {
    if (line.startsWith("Tất cả quyền lợi ")) {
      const refName = line.replace("Tất cả quyền lợi ", "").trim();
      const refIndex = plans.findIndex((p) => p.name === refName);
      if (refIndex >= 0 && refIndex < index) {
        for (const inherited of resolvePlanFeatures(plans, refIndex, cache)) {
          if (!resolved.includes(inherited)) resolved.push(inherited);
        }
      }
      continue;
    }
    if (!resolved.includes(line)) resolved.push(line);
  }

  cache.set(index, resolved);
  return resolved;
}

export function PremiumComparisonTable({ plans }: { plans: PremiumPlan[] }) {
  if (plans.length === 0) return null;

  const cache = new Map<number, string[]>();
  const resolvedByPlan = plans.map((_, i) => resolvePlanFeatures(plans, i, cache));

  const rows: string[] = [];
  for (const resolved of resolvedByPlan) {
    for (const line of resolved) {
      if (!rows.includes(line)) rows.push(line);
    }
  }

  if (rows.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-head">
        <h4>So sánh quyền lợi</h4>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="comp-table">
          <thead>
            <tr>
              <th></th>
              {plans.map((p) => (
                <th key={p.id}>{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td>{row}</td>
                {resolvedByPlan.map((resolved, i) => (
                  <td key={plans[i].id}>
                    {resolved.includes(row) ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className="dash">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
