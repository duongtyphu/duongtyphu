"use client";

import { VisualEditor } from "@/components/admin/VisualEditor";
import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import type { FieldConfig } from "@/lib/admin/fields";

/**
 * Việc 10 — /portal/hocvienai, khối "Câu hỏi thường gặp" (cuối trang).
 * Thay mảng tĩnh `FAQ` khai báo inline trong
 * `src/app/portal/hocvienai/page.tsx` (không phải file dữ liệu riêng, giữ
 * lại inline @deprecated tham khảo/rollback). KHÔNG liên quan tới "Goals/
 * FAQ" của CKOS (mục đó không tồn tại thật trong hệ thống — xem plan
 * Companion Admin).
 */
type FaqItem = {
  id: string;
  q: string;
  a: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "q", label: "Câu hỏi", type: "text", required: true },
  { key: "a", label: "Câu trả lời", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

export default function AdminHocvienaiFaqPage() {
  return (
    <AdminAtmosphere atmosphereClassName="academy-atmosphere-bg">
      <VisualEditor<FaqItem>
        collectionKey="hocvienai-faq"
        title="Học viện AI — Câu hỏi thường gặp"
        itemNoun="câu hỏi"
        fields={fields}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.q}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.a}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
