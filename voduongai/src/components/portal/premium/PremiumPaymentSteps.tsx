"use client";

import { ShieldCheck } from "lucide-react";
import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";
import { usePremiumChrome } from "./PremiumChromeContext";
import type { PremiumPaymentStep } from "@/lib/portal/live-premium";

const STEP_FIELDS: FieldConfig[] = [
  { key: "step", label: "Số thứ tự hiển thị (vd. \"1\")", type: "text", required: true },
  { key: "title", label: "Tiêu đề bước", type: "text", required: true },
  { key: "text", label: "Mô tả", type: "textarea", full: true, required: true },
  { key: "status", label: "Trạng thái", type: "select", options: ["Draft", "Published", "Hidden"], required: true },
];

/**
 * Premium — Dashboard Live-edit. Tách khỏi `PAYMENT_STEPS` hardcode cũ,
 * đọc live qua `useCollection("premium-payment-steps", seed, {enabled})`.
 * Tiêu đề khối ("Thanh toán hoạt động thế nào") lấy từ
 * `usePremiumChrome()` — cùng nguồn `premium_chrome` chia sẻ qua Context,
 * không phải field riêng của bảng này.
 */
export function PremiumPaymentSteps({ seed }: { seed: PremiumPaymentStep[] }) {
  const editMode = useEditMode();
  const { chrome } = usePremiumChrome();
  const { items, update } = useCollection<PremiumPaymentStep>("premium-payment-steps", seed, { enabled: editMode });
  const steps = editMode ? items : items.filter((s) => s.status === "Published");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-5 w-5 text-emerald-400" />
        <h2 className="text-lg font-extrabold text-white">{chrome.paymentSectionTitle}</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <EditableRegion key={s.id} record={s} fields={STEP_FIELDS} update={update}>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
                {s.step}
              </span>
              <p className="mt-2.5 text-sm font-bold text-white">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">{s.text}</p>
            </div>
          </EditableRegion>
        ))}
      </div>
    </div>
  );
}
