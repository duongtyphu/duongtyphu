"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * "Mức hoa hồng của bạn" (`/v2/affiliate`) — 3 tầng Người mới/Đối tác/Đại
 * sứ, đúng thiết kế đã chốt trong `vdaiportal2.0.html` (mục 07 "Chương
 * trình Affiliate"). Bảng `affiliate_tier_rules` MỚI — KHÔNG dùng chung
 * "Cấu hình hoa hồng theo sản phẩm" (`affiliate_commission_rules`, trang
 * `/admin/affiliate/cau-hinh-hoa-hong`): bảng đó phục vụ trigger
 * `handle_order_confirmed_commission()` (khớp theo course/product/lesson,
 * không có khái niệm "tầng theo số giao dịch của referrer") và không có
 * cột cho quyền lợi/ngưỡng giao dịch — xem
 * `supabase-giai-doan-6-affiliate-tier-rules.sql`.
 *
 * `minTransactions` = ngưỡng số giao dịch thành công (tích luỹ) để đạt
 * tầng này — Portal (`AffiliateClient.tsx`) tự tính tầng hiện tại của
 * từng người dùng từ `overview.customers` thật, so với ngưỡng đọc ở đây
 * (không hardcode trong UI).
 *
 * `tierKey` giới hạn 3 giá trị cố định (khớp `TIER_ICON_BG` ở
 * `AffiliateClient.tsx` — icon/gradient theo đúng tầng) — không cho gõ
 * tay tự do, tránh lệch icon nếu gõ sai chính tả.
 */
type AffiliateTierRuleItem = {
  id: string;
  tierKey: string;
  label: string;
  ratePercent: number;
  minTransactions: number;
  benefits: string[];
  condition: string;
  isFeatured: boolean;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "tierKey", label: "Mã tầng (khớp icon)", type: "select", options: ["new", "partner", "ambassador"], required: true },
  { key: "label", label: "Tên tầng", type: "text", required: true },
  { key: "ratePercent", label: "Mức hoa hồng mục tiêu (%)", type: "number", required: true },
  { key: "minTransactions", label: "Ngưỡng giao dịch thành công tích luỹ", type: "number", required: true },
  { key: "benefits", label: "Quyền lợi (mỗi dòng 1 quyền lợi)", type: "textarea", full: true, transform: "newline-list" },
  { key: "condition", label: "Điều kiện lên tầng", type: "text", full: true },
  { key: "isFeatured", label: "Đánh dấu \"Phổ biến\" (nếu không phải tầng hiện tại của người xem)", type: "boolean" },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminAffiliateTierRulesPage() {
  return (
    <VisualEditor<AffiliateTierRuleItem>
      collectionKey="affiliate-tier-rules"
      title="Mức hoa hồng của bạn — 3 tầng Affiliate"
      itemNoun="tầng"
      fields={fields}
      breadcrumb={[{ label: "Affiliate", href: "/admin/affiliate" }, { label: "Cấu hình cấp độ" }]}
      renderCard={(item) => (
        <div>
          <p className="text-sm font-bold text-gray-900">
            {item.label} — {item.ratePercent}%
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Từ {item.minTransactions} giao dịch thành công · {item.benefits?.length ?? 0} quyền lợi
            {item.isFeatured ? " · Phổ biến" : ""}
          </p>
        </div>
      )}
    />
  );
}
