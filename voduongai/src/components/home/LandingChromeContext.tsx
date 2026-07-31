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
 *
 * BUG ĐÃ SỬA: `useSupabaseCollection` khởi tạo `items = []` khi
 * `enabled=true` (Admin edit mode) cho tới khi fetch xong — nếu chỉ dùng
 * thẳng `items` (bản đầu tiên của file này), MỌI lần render đầu tiên tại
 * `/admin/landing` đều có `rows=[]`, khiến `useLandingChrome(sectionId)`
 * không tìm thấy dòng nào và `throw Error` ngay lập tức → crash toàn
 * trang. Đã sửa bằng cách merge `items` đè lên `seedChrome` theo đúng
 * `id` (cùng kỹ thuật fallback `items.find(...) ?? seedChrome` đã dùng ở
 * `EcosystemChromeContext`/`PremiumChromeContext`) — luôn có đủ 8 dòng
 * ngay từ lần render đầu, không bao giờ throw.
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
  const rows = seedChrome.map((seed) => items.find((r) => r.id === seed.id) ?? seed);

  return <LandingChromeCtx.Provider value={{ rows, update }}>{children}</LandingChromeCtx.Provider>;
}

export function useLandingChrome(sectionId: string): LandingChromeRow & { update: LandingChromeContextValue["update"] } {
  const ctx = useContext(LandingChromeCtx);
  if (!ctx) throw new Error("useLandingChrome() phải gọi bên trong <LandingChromeProvider>");
  const row = ctx.rows.find((r) => r.id === sectionId);
  if (!row) throw new Error(`Không tìm thấy landing_chrome row "${sectionId}"`);
  return { ...row, update: ctx.update };
}
