"use client";

import { createContext, useContext } from "react";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import type { SubProjectRow } from "@/lib/portal/live-subprojects";

type SubProjectChromeContextValue = {
  sub: SubProjectRow;
  update: (id: string, patch: Partial<SubProjectRow>) => void | Promise<void>;
};

const SubProjectChromeCtx = createContext<SubProjectChromeContextValue | null>(null);

/**
 * BUG ĐÃ SỬA (Founder báo "Admin chưa sửa được thông tin, link đăng ký"
 * cho dự án con — AlphaMind/WebWisePay/Sovelmash/AeroNova): trang Live-edit
 * riêng của 1 dự án con (`/admin/duan-cohoi/[ecosystemSlug]/[subProjectSlug]`)
 * trước đó chỉ render lại `SubProjectPage` tĩnh — `name`/`shortDescription`/
 * `fullIntro`/`links` KHÔNG hề bọc `EditableRegion`, chỉ sửa được qua panel
 * CRUD dạng danh sách ở trang hệ sinh thái CHA (`SubProjectsAdminPanel`,
 * `/admin/duan-cohoi/[ecosystemSlug]`) — không nhất quán với mọi module
 * Live-edit khác trong dự án (Cách A: sửa TRỰC TIẾP tại đúng vị trí hiển
 * thị). Cung cấp Context này để `SubProjectOverview`/`SubProjectLinksBox`
 * (mới) sửa trực tiếp ngay trên trang dự án con — cùng pattern
 * `EcosystemChromeContext`/`PremiumChromeContext`: 1 `useCollection()`
 * DUY NHẤT chia sẻ giữa 2 vị trí hiển thị, tránh 2 instance không đồng bộ.
 *
 * Khác `EcosystemChromeContext` (5 dòng, lọc theo id chrome) — bảng
 * `ecosystem_subprojects` có nhiều dòng hơn (mọi dự án con của mọi hệ
 * sinh thái), lọc `.find(s => s.id === seedSub.id)` cùng kỹ thuật.
 */
export function SubProjectChromeProvider({
  seedSub,
  children,
}: {
  seedSub: SubProjectRow;
  children: React.ReactNode;
}) {
  const editMode = useEditMode();
  const { items, update } = useCollection<SubProjectRow>("ecosystem-subprojects", [seedSub], {
    enabled: editMode,
  });
  const sub = items.find((s) => s.id === seedSub.id) ?? seedSub;
  return <SubProjectChromeCtx.Provider value={{ sub, update }}>{children}</SubProjectChromeCtx.Provider>;
}

export function useSubProjectChrome(): SubProjectChromeContextValue {
  const ctx = useContext(SubProjectChromeCtx);
  if (!ctx) throw new Error("useSubProjectChrome must be used inside SubProjectChromeProvider");
  return ctx;
}
