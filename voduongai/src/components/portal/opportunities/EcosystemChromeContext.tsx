"use client";

import { createContext, useContext } from "react";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";

/**
 * `ecosystem_chrome` giờ cần hiển thị ở NHIỀU vị trí trong 1 trang hệ
 * sinh thái (`EcosystemOverview` — tên/mô tả ngắn/giới thiệu; và
 * `EcosystemLinksBox` — "Đường link liên kết dự án") — cùng tình huống đã
 * gặp với `premium_chrome` (`PremiumChromeContext.tsx`). Nếu để mỗi vị
 * trí tự gọi `useCollection("ecosystem-chrome", ...)` riêng, 2 vị trí sẽ
 * giữ 2 bản sao state không đồng bộ. Giải quyết: DUY NHẤT 1 lệnh gọi
 * `useCollection()` ở `EcosystemChromeProvider`, chia sẻ qua Context.
 *
 * Bảng có 5 dòng (1/hệ sinh thái, khác `premium_chrome` chỉ có 1 dòng
 * tổng) — lọc đúng dòng theo `seedChrome.id` (KHÔNG lấy `items[0]`).
 */
type EcosystemChromeContextValue = {
  chrome: EcosystemChrome;
  update: (id: string, patch: Partial<EcosystemChrome>) => void | Promise<void>;
};

const EcosystemChromeCtx = createContext<EcosystemChromeContextValue | null>(null);

export function EcosystemChromeProvider({
  seedChrome,
  children,
}: {
  seedChrome: EcosystemChrome;
  children: React.ReactNode;
}) {
  const editMode = useEditMode();
  const { items, update } = useCollection<EcosystemChrome>("ecosystem-chrome", [seedChrome], { enabled: editMode });
  const chrome = items.find((c) => c.id === seedChrome.id) ?? seedChrome;

  return <EcosystemChromeCtx.Provider value={{ chrome, update }}>{children}</EcosystemChromeCtx.Provider>;
}

export function useEcosystemChrome(): EcosystemChromeContextValue {
  const ctx = useContext(EcosystemChromeCtx);
  if (!ctx) throw new Error("useEcosystemChrome() phải gọi bên trong <EcosystemChromeProvider>");
  return ctx;
}
