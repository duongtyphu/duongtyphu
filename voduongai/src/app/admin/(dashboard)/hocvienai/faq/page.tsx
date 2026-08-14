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
// Phase 28 (Schema v2, Bước 1): key trong `data` jsonb đổi `q`->`question`,
// `a`->`answer` — xem supabase-phase28-schema-v2-step1-alter.sql.
type FaqItem = {
  id: string;
  question: string;
  answer: string;
  status: string;
};

const fields: FieldConfig[] = [
  { key: "question", label: "Câu hỏi", type: "text", required: true },
  { key: "answer", label: "Câu trả lời", type: "textarea", full: true, required: true },
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
        breadcrumb={[
          { label: "Học viện" },
          { label: "Học viện AI", href: "/admin/hocvienai/work-needs" },
          { label: "Câu hỏi thường gặp" },
        ]}
        renderCard={(item) => (
          <div>
            <p className="text-sm font-bold text-gray-900">{item.question}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.answer}</p>
          </div>
        )}
      />
    </AdminAtmosphere>
  );
}
