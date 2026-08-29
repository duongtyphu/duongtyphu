"use client";

import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import type { PremiumChrome, PremiumPaymentStep } from "@/lib/portal/live-premium";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";

/**
 * "Thanh toán hoạt động thế nào?" — port nguyên nội dung THẬT từ Portal
 * 1.0 (`premium_chrome.paymentSectionTitle` + `premium_payment_steps`,
 * đã admin-editable từ trước qua `/admin/premium/dashboard`), thiết kế
 * lại theo ngôn ngữ thị giác `.pm` (thẻ trắng bo góc, số thứ tự tròn màu
 * tím) thay vì canvas tối của 1.0. Sửa qua Admin ở `/admin/premium/dashboard`
 * (đã có sẵn) PHẢN ÁNH ĐÚNG ở đây — Single Source of Truth, không tạo
 * bảng trùng.
 */

const TITLE_FIELDS: FieldConfig[] = [{ key: "paymentSectionTitle", label: "Tiêu đề khối", type: "text" }];
const STEP_FIELDS: FieldConfig[] = [
  { key: "title", label: "Tiêu đề bước", type: "text" },
  { key: "text", label: "Mô tả", type: "textarea" },
];

export function PremiumPaymentStepsBlock({
  seedChrome,
  seedSteps,
}: {
  seedChrome: PremiumChrome;
  seedSteps: PremiumPaymentStep[];
}) {
  const editMode = useEditMode();
  const { items: chromeItems, update: updateChrome } = useCollection<PremiumChrome>("premium-chrome", [seedChrome], {
    enabled: editMode,
  });
  const { items: stepItems, update: updateStep } = useCollection<PremiumPaymentStep>("premium-payment-steps", seedSteps, {
    enabled: editMode,
  });
  const chrome = chromeItems.find((c) => c.id === seedChrome.id) ?? seedChrome;
  const steps = stepItems.filter((s) => s.status === "Published");

  return (
    <div style={{ marginTop: 24 }}>
      <div className="section-head">
        <EditableRegion record={chrome} fields={TITLE_FIELDS} update={updateChrome}>
          <h3>{chrome.paymentSectionTitle}</h3>
        </EditableRegion>
      </div>
      <div className="payment-steps-grid">
        {steps.map((s) => (
          <div className="payment-step-card" key={s.id}>
            <div className="step-num">{s.step}</div>
            <EditableRegion record={s} fields={STEP_FIELDS} update={updateStep}>
              <h6>{s.title}</h6>
              <p>{s.text}</p>
            </EditableRegion>
          </div>
        ))}
      </div>
    </div>
  );
}
