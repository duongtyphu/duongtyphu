"use client";

import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import type { PremiumFounder } from "@/lib/portal/live-premium-v2";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";

/**
 * "🤝 NGƯỜI ĐỒNG HÀNH" — port nội dung THẬT từ `FounderSpotlight.tsx`
 * (Portal 1.0 — hồ sơ thật của Founder, không bịa), thiết kế lại theo
 * ngôn ngữ thị giác `.pm` (thẻ trắng, không phải canvas tối/modal Tailwind
 * của 1.0 — trang này là hand-CSS, một modal kiểu 1.0 sẽ lệch hệ thiết
 * kế). Hiện trực tiếp trong 1 thẻ, không cần bấm "Xem hồ sơ" mới thấy.
 * Admin-editable qua `premium_founder` (singleton, `/admin/premium/v2-dashboard`).
 */

const FOUNDER_FIELDS: FieldConfig[] = [
  { key: "name", label: "Tên", type: "text" },
  { key: "role", label: "Vai trò", type: "text" },
  { key: "photoUrl", label: "URL ảnh", type: "text" },
  { key: "tags", label: "Thẻ (cách nhau dấu phẩy)", type: "tags" },
  { key: "intro", label: "Giới thiệu", type: "textarea" },
  { key: "expertise", label: "Lĩnh vực chuyên môn (mỗi dòng 1 mục)", type: "textarea", transform: "newline-list" },
  { key: "philosophy", label: "Triết lý", type: "textarea" },
  { key: "achievements", label: "Hành trình thật (mỗi dòng 1 mục)", type: "textarea", transform: "newline-list" },
];

export function PremiumFounderBlock({ seed }: { seed: PremiumFounder }) {
  const editMode = useEditMode();
  const { items, update } = useCollection<PremiumFounder>("premium-founder", [seed], { enabled: editMode });
  const founder = items.find((f) => f.id === seed.id) ?? seed;

  return (
    <div style={{ marginTop: 24 }}>
      <div className="section-head">
        <h3>🤝 Người đồng hành cùng bạn</h3>
      </div>
      <div className="founder-card">
        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh thật, URL Admin-editable, không phải asset tĩnh cố định */}
        <img src={founder.photoUrl} alt={founder.name} className="founder-photo" />
        {/* `.founder-body` giữ trên <div> thật — className của EditableRegion
         * chỉ áp dụng khi editMode=true, đặt layout ở đó sẽ mất trên Portal
         * thật (xem CLAUDE.md "bug margin EditableRegion"). */}
        <div className="founder-body">
          <EditableRegion record={founder} fields={FOUNDER_FIELDS} update={update}>
            <h4>{founder.name}</h4>
            <div className="founder-role">{founder.role}</div>
            <p className="founder-intro">{founder.intro}</p>
            <div className="founder-tags">
              {founder.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="founder-expertise">
              <p className="founder-label">Lĩnh vực chuyên môn</p>
              <ul>
                {founder.expertise.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
            <div className="founder-philosophy">“{founder.philosophy}”</div>
            <div className="founder-achievements">
              <p className="founder-label">Hành trình thật</p>
              <ul>
                {founder.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </EditableRegion>
        </div>
      </div>
    </div>
  );
}
