"use client";

import type { FieldConfig } from "@/lib/admin/fields";
import { EditableRegion } from "./EditableRegion";
import { usePremiumChrome } from "./PremiumChromeContext";
import type { PremiumChrome } from "@/lib/portal/live-premium";

/**
 * Premium — Dashboard Live-edit. Component dùng chung cho 2 nhãn section
 * ("Lớp học AI"/"Ba lớp học — ba cấp độ năng lực" và "Chương trình hệ
 * thống"/"Xây hệ thống Affiliate bằng AI — một mình hoặc cùng đội nhóm")
 * — cùng 1 cặp field eyebrow+title, chỉ khác key nào trong `PremiumChrome`
 * đang được bind, nên dùng 1 component nhận key làm tham số thay vì viết
 * lặp lại 2 lần.
 */
export function PremiumSectionHeading({
  eyebrowKey,
  titleKey,
}: {
  eyebrowKey: keyof PremiumChrome;
  titleKey: keyof PremiumChrome;
}) {
  const { chrome, update } = usePremiumChrome();
  const fields: FieldConfig[] = [
    { key: eyebrowKey, label: "Eyebrow (nhãn nhỏ phía trên)", type: "text", required: true },
    { key: titleKey, label: "Tiêu đề section", type: "textarea", full: true, required: true },
  ];

  return (
    <EditableRegion record={chrome} fields={fields} update={update}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">{chrome[eyebrowKey]}</p>
        <h2 className="mt-1 text-xl font-extrabold text-white md:text-2xl">{chrome[titleKey]}</h2>
      </div>
    </EditableRegion>
  );
}
