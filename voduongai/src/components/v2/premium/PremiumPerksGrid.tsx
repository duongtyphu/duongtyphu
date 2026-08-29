"use client";

import { useCollection } from "@/lib/admin/store";
import type { FieldConfig } from "@/lib/admin/fields";
import type { PremiumPerk } from "@/lib/portal/live-premium-v2";
import { useEditMode } from "./EditModeContext";
import { EditableRegion } from "./EditableRegion";

/**
 * Giai đoạn 5 — thay 2 mảng perk-grid hardcode ("Vì sao nên nâng cấp
 * Premium?" ở trạng thái chưa mua / "Quyền lợi dành riêng cho Premium
 * Member" ở trạng thái đã mua) bằng dữ liệu thật từ `premium_perks`
 * (admin-editable qua `/admin/premium/v2-dashboard`). 1 bảng dùng chung
 * cho cả 2 trạng thái, lọc theo field `audience`.
 */

const ICON_MAP: Record<string, { path: React.ReactNode; bg: string }> = {
  book: {
    bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
    path: <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />,
  },
  graduation: {
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    path: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </>
    ),
  },
  tool: {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    path: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </>
    ),
  },
  handshake: {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    path: <path d="M8 12l3 3 5-6M12 22c5.5-1.5 9-6 9-11V5l-9-3-9 3v6c0 5 3.5 9.5 9 11z" />,
  },
  companion: {
    bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r=".5" fill="#fff" />
      </>
    ),
  },
  community: {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    path: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="3" />
        <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
      </>
    ),
  },
  support: {
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    path: (
      <>
        <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 01-3.4 0" />
      </>
    ),
  },
  update: {
    bg: "linear-gradient(145deg,#e879b9,#b4348a)",
    path: <path d="M4 4v6h6M20 20v-6h-6M4.5 15a8 8 0 0014.5 3.5M19.5 9a8 8 0 00-14.5-3.5" />,
  },
};
const ICON_OPTIONS = Object.keys(ICON_MAP);

const PERK_FIELDS: FieldConfig[] = [
  { key: "audience", label: "Hiển thị ở trạng thái", type: "select", options: ["guest", "member"] },
  { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
  { key: "title", label: "Tiêu đề", type: "text" },
  { key: "description", label: "Mô tả", type: "textarea" },
];

export function PremiumPerksGrid({ seed, audience }: { seed: PremiumPerk[]; audience: "guest" | "member" }) {
  const editMode = useEditMode();
  const { items, update } = useCollection<PremiumPerk>("premium-perks", seed, { enabled: editMode });
  const perks = items.filter((p) => p.status === "Published" && p.audience === audience);

  return (
    <div className="perk-grid">
      {perks.map((p) => {
        const icon = ICON_MAP[p.icon] ?? ICON_MAP.book;
        return (
          // `.perk-card` giữ trên <div> thật (không đặt trên EditableRegion —
          // className của nó chỉ áp dụng khi editMode=true, đặt layout ở đó sẽ
          // biến mất trên Portal thật, xem CLAUDE.md "bug margin EditableRegion").
          <div className="perk-card" key={p.id}>
            <EditableRegion record={p} fields={PERK_FIELDS} update={update}>
              <div className="ico" style={{ background: icon.bg }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  {icon.path}
                </svg>
              </div>
              <h5>{p.title}</h5>
              <p>{p.description}</p>
            </EditableRegion>
          </div>
        );
      })}
    </div>
  );
}
