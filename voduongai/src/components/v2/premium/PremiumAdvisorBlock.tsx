"use client";

import { useState } from "react";
import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import type { PremiumAdvisorSituation } from "@/lib/portal/live-premium-v2";
import type { PremiumPlan } from "@/lib/portal/live-premium-plans";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";

/**
 * "KHÔNG CHẮC NÊN CHỌN GÌ?" — port Ý TƯỞNG "Companion Advisor" của Portal
 * 1.0 (`PremiumAdvisor.tsx`, 6 tình huống nhắm 5 chương trình mua đứt cũ)
 * nhưng KHÔNG copy nguyên văn (đích không còn tồn tại — `/v2/premium` chỉ
 * còn 3 gói thuê bao thật) — viết lại 6 tình huống mới nhắm đúng
 * `premium-thang`/`premium-6-thang`/`premium-12-thang` +  1 tình huống
 * "chưa chắc" định tuyến sang Companion, đúng tinh thần bản gốc "không bán
 * hàng, chỉ giúp chọn đúng". Admin-editable qua `premium_advisor_situations`.
 */

const SITUATION_FIELDS: FieldConfig[] = [
  { key: "label", label: "Tình huống (nút bấm)", type: "text" },
  { key: "recommendation", label: "Gợi ý", type: "textarea" },
  { key: "targetPlanId", label: "id gói đề xuất (để trống = Companion)", type: "text" },
  { key: "targetLabel", label: "Nhãn nút CTA", type: "text" },
];

export function PremiumAdvisorBlock({
  seed,
  plans,
}: {
  seed: PremiumAdvisorSituation[];
  plans: PremiumPlan[];
}) {
  const editMode = useEditMode();
  const { items, update } = useCollection<PremiumAdvisorSituation>("premium-advisor-situations", seed, {
    enabled: editMode,
  });
  const situations = items.filter((s) => s.status === "Published");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = situations.find((s) => s.id === selectedId) ?? null;
  const targetPlan = selected ? plans.find((p) => p.id === selected.targetPlanId) : null;
  const targetHref = targetPlan ? "#chuong-trinh" : "/v2/companion";

  return (
    <div className="advisor-card" style={{ marginTop: 24 }}>
      <div className="advisor-head">
        <div className="advisor-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M8 12l3 3 5-6M12 22c5.5-1.5 9-6 9-11V5l-9-3-9 3v6c0 5 3.5 9.5 9 11z" />
          </svg>
        </div>
        <div>
          <div className="advisor-eyebrow">Companion Advisor</div>
          <h3>Không chắc nên chọn gì?</h3>
        </div>
      </div>
      <p className="advisor-desc">
        Companion không bán hàng. Chọn đúng tình huống của bạn — Companion chỉ đường tới đúng một gói, hoặc khuyên bạn
        chưa nên mua gì cả.
      </p>
      <div className="advisor-chips">
        {situations.map((s) => (
          <button
            key={s.id}
            type="button"
            className={s.id === selectedId ? "advisor-chip active" : "advisor-chip"}
            onClick={() => setSelectedId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className="advisor-result">
          <p>{selected.recommendation}</p>
          <a href={targetHref} className="btn-primary" style={targetPlan ? undefined : { background: "linear-gradient(135deg,#6d4aff,#9b7bff)" }}>
            {selected.targetLabel}
          </a>
        </div>
      )}
      {editMode && (
        // Panel Live-edit riêng — KHÔNG bọc EditableRegion quanh chip bấm-để-
        // chọn ở trên: click sẽ vừa chọn tình huống vừa mở popover sửa (2
        // onClick chồng nhau trên cùng 1 phần tử) — cùng lý do panel "Live-
        // edit — Nội dung Mirror" luôn hiện riêng thay vì gắn vào vị trí hiển
        // thị tự nhiên (xem CLAUDE.md "Nhóm 3, Phần A — Mirror").
        <div className="advisor-edit-panel">
          <p className="advisor-edit-title">Live-edit — Danh sách tình huống</p>
          {situations.map((s) => (
            <EditableRegion key={s.id} record={s} fields={SITUATION_FIELDS} update={update} className="advisor-edit-row">
              <b>{s.label}</b>
              <span>{s.targetLabel}</span>
            </EditableRegion>
          ))}
        </div>
      )}
    </div>
  );
}
