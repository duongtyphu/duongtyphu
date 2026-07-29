"use client";

import { createContext, useContext } from "react";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import type { LandingChromeRow } from "@/lib/portal/live-landing-chrome";

/**
 * `landing_chrome` có 8 dòng (1/section) cần đọc/sửa từ 8 component khác
 * nhau trong CÙNG 1 trang (`HomeClient.tsx`) — cùng tình huống đã gặp với
 * `ecosystem_chrome` (5 dòng, `EcosystemChromeContext.tsx`). DUY NHẤT 1 lệnh
 * gọi `useCollection()` ở `LandingChromeProvider` (bọc quanh toàn bộ
 * `HomeClient`), chia sẻ qua Context — mỗi section tự lọc đúng dòng của
 * mình qua `useLandingChrome(sectionId)`.
 */
type LandingChromeContextValue = {
  rows: LandingChromeRow[];
  update: (id: string, patch: Partial<LandingChromeRow>) => void | Promise<void>;
};

const LandingChromeCtx = createContext<LandingChromeContextValue | null>(null);

export function LandingChromeProvider({
  seedChrome,
  children,
}: {
  seedChrome: LandingChromeRow[];
  children: React.ReactNode;
}) {
  const editMode = useEditMode();
  const { items, update } = useCollection<LandingChromeRow>("landing-chrome", seedChrome, { enabled: editMode });

  return <LandingChromeCtx.Provider value={{ rows: items, update }}>{children}</LandingChromeCtx.Provider>;
}

export function useLandingChrome(sectionId: string): LandingChromeRow & { update: LandingChromeContextValue["update"] } {
  const ctx = useContext(LandingChromeCtx);
  if (!ctx) throw new Error("useLandingChrome() phải gọi bên trong <LandingChromeProvider>");
  const row = ctx.rows.find((r) => r.id === sectionId);
  if (!row) throw new Error(`Không tìm thấy landing_chrome row "${sectionId}"`);
  return { ...row, update: ctx.update };
}
