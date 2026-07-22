"use client";

import type { FieldConfig } from "@/lib/admin/fields";
import { EditableRegion } from "./EditableRegion";
import { usePremiumChrome } from "./PremiumChromeContext";

/**
 * Premium — Dashboard Live-edit. Tách khỏi khối Hero cũ (hardcode trong
 * `/portal/premium/page.tsx`), CHỈ bọc 4 field an toàn (eyebrow/2 dòng
 * title/subtitle). 2 CTA ("Chọn lộ trình phù hợp"/"Tôi chưa chắc mình cần
 * Premium") GIỮ NGUYÊN trong code — đều là anchor link neo tới section
 * tĩnh khác trên cùng trang (`#chuong-trinh`/`#companion-advisor`), Founder
 * xác nhận không cần quản qua Admin.
 */
const HERO_FIELDS: FieldConfig[] = [
  { key: "heroEyebrow", label: "Eyebrow (dòng nhỏ phía trên tiêu đề)", type: "text", required: true },
  { key: "heroTitleLine1", label: "Tiêu đề — dòng 1", type: "textarea", full: true, required: true },
  { key: "heroTitleLine2", label: "Tiêu đề — dòng 2 (có gradient)", type: "textarea", full: true, required: true },
  { key: "heroSubtitle", label: "Câu phụ đề", type: "textarea", full: true, required: true },
];

export function PremiumHeroBlock() {
  const { chrome, update } = usePremiumChrome();

  return (
    <EditableRegion record={chrome} fields={HERO_FIELDS} update={update}>
      <div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-white/40">{chrome.heroEyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
          {chrome.heroTitleLine1}
          <span className="mt-1 block bg-gradient-to-r from-blue-400 via-violet-400 to-orange-300 bg-clip-text text-transparent">
            {chrome.heroTitleLine2}
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
          {chrome.heroSubtitle}
        </p>
      </div>
    </EditableRegion>
  );
}
