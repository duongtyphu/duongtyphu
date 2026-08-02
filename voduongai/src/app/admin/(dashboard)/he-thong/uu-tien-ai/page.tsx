"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * "Ưu tiên AI Provider" (Hệ thống) — Founder tự kéo-thả đổi thứ tự ưu
 * tiên AI Provider (trên xuống = ưu tiên cao xuống thấp), áp dụng NGAY
 * cho mọi lời gọi AI thật trong hệ thống (Companion chat, writer-agent,
 * reviewer-agent... — mọi caller đều đi qua `providerManager.execute()`,
 * xem `src/ai/providers/provider-manager.ts` + `priority-store.ts`).
 * Bảng `ai_provider_priority`, seed sẵn đúng 12 providerId thật trong
 * `registry.ts` — xem `supabase-phase29-ai-provider-priority.sql`.
 *
 * "Trạng thái ưu tiên" dùng lại đúng cột `status` chuẩn của hệ thống:
 * "Published" = được tính vào danh sách ưu tiên; "Hidden" = tạm loại
 * khỏi danh sách ưu tiên (Provider vẫn có thể được chọn ở bước xếp hạng
 * tự động phía sau nếu còn API key cấu hình, chỉ là không còn ưu tiên
 * tuyệt đối theo thứ tự thủ công này).
 *
 * LƯU Ý (cùng tiền lệ trang "Ảnh Companion" —
 * su-menh-companion/flipbook/page.tsx): VisualEditor là component dùng
 * chung, luôn có sẵn 2 nút "Thêm mới"/"Xoá" cho MỌI collection — trang
 * này CHỈ nên dùng để kéo-thả đổi thứ tự + đổi "Trạng thái ưu tiên" trên
 * 12 dòng đã seed sẵn. KHÔNG dùng "Thêm mới" để thêm 1 provider lạ (id
 * không khớp `registry.ts` sẽ không có tác dụng gì). KHÔNG "Xoá" hẳn 1
 * dòng — muốn tạm ngừng ưu tiên 1 Provider, đổi "Trạng thái ưu tiên"
 * sang "Hidden" thay vì xoá.
 */
type ProviderPriorityRow = {
  id: string;
  displayName: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "displayName", label: "Tên hiển thị", type: "text", required: true },
  {
    key: "status",
    label: "Trạng thái ưu tiên",
    type: "select",
    options: ["Published", "Hidden"],
    required: true,
  },
];

export default function AdminAiProviderPriorityPage() {
  return (
    <VisualEditor<ProviderPriorityRow>
      collectionKey="ai-provider-priority"
      title="Ưu tiên AI Provider"
      itemNoun="provider"
      fields={fields}
      breadcrumb={[
        { label: "Hệ thống", href: "/admin/he-thong/moi-truong" },
        { label: "Ưu tiên AI Provider" },
      ]}
      renderCard={(item) => (
        <div>
          <p className="text-sm font-bold text-gray-900">{item.displayName || item.id}</p>
          <p className="mt-1 font-mono text-[11px] text-gray-400">{item.id}</p>
          <span
            className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              item.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.status === "Published" ? "Đang ưu tiên" : "Đã tắt ưu tiên"}
          </span>
        </div>
      )}
    />
  );
}
