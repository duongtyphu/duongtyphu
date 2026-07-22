"use client";

import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";
import { usePremiumChrome } from "./PremiumChromeContext";
import type { PremiumFaqItem } from "@/lib/portal/live-premium";

const FAQ_FIELDS: FieldConfig[] = [
  { key: "q", label: "Câu hỏi", type: "text", required: true },
  { key: "a", label: "Trả lời", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

/**
 * Premium — Dashboard Live-edit. Tách khỏi `PREMIUM_FAQ` hardcode cũ, đọc
 * live qua `useCollection("premium-faq", seed, {enabled})`. Tiêu đề khối
 * ("Câu hỏi thường gặp") lấy từ `usePremiumChrome()`.
 */
export function PremiumFaqList({ seed }: { seed: PremiumFaqItem[] }) {
  const editMode = useEditMode();
  const { chrome } = usePremiumChrome();
  const { items, update } = useCollection<PremiumFaqItem>("premium-faq", seed, { enabled: editMode });
  const faqItems = editMode ? items : items.filter((f) => f.status === "Published");

  return (
    <div className="mt-8 space-y-3">
      <h2 className="text-lg font-extrabold text-white">{chrome.faqSectionTitle}</h2>
      {faqItems.map((item) => (
        <EditableRegion key={item.id} record={item} fields={FAQ_FIELDS} update={update}>
          <details className="group rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-white/85 [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden className="text-white/40 transition group-open:rotate-45">
                ＋
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-white/60">{item.a}</p>
          </details>
        </EditableRegion>
      ))}
    </div>
  );
}
