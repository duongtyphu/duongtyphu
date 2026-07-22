"use client";

import { createContext, useContext } from "react";
import { useCollection } from "@/lib/admin/store";
import { useEditMode } from "./EditModeContext";
import type { PremiumChrome } from "@/lib/portal/live-premium";

/**
 * Premium — Dashboard Live-edit. `premium_chrome` là 1 bảng singleton
 * (1 dòng) nhưng cần hiển thị ở NHIỀU vị trí rải rác trong
 * `/portal/premium/page.tsx` (Hero, 2 nhãn section, tiêu đề khối thanh
 * toán, tiêu đề FAQ) — xen kẽ với `PremiumAdvisor`/`PremiumConsult`/
 * `FounderSpotlight` (không đụng). Nếu để mỗi vị trí tự gọi
 * `useCollection("premium-chrome", ...)` riêng, mỗi vị trí sẽ giữ 1 bản
 * sao state cục bộ KHÔNG đồng bộ với nhau — sửa ở Hero xong, nhãn section
 * vẫn hiện giá trị cũ cho tới khi tải lại trang.
 *
 * Giải quyết: DUY NHẤT 1 lệnh gọi `useCollection()` ở `PremiumChromeProvider`
 * (bọc quanh toàn bộ phần nội dung Premium cần chrome này), chia sẻ qua
 * React Context — mọi component con (`PremiumHeroBlock`/
 * `PremiumSectionHeading`/tiêu đề trong `PremiumPaymentSteps`/
 * `PremiumFaqList`) đọc CHUNG 1 nguồn `chrome`/`update` qua
 * `usePremiumChrome()`, luôn đồng bộ ngay sau khi lưu.
 */
type PremiumChromeContextValue = {
  chrome: PremiumChrome;
  update: (id: string, patch: Partial<PremiumChrome>) => void | Promise<void>;
};

const PremiumChromeCtx = createContext<PremiumChromeContextValue | null>(null);

export function PremiumChromeProvider({
  seedChrome,
  children,
}: {
  seedChrome: PremiumChrome;
  children: React.ReactNode;
}) {
  const editMode = useEditMode();
  const { items, update } = useCollection<PremiumChrome>("premium-chrome", [seedChrome], { enabled: editMode });
  const chrome = items[0] ?? seedChrome;

  return <PremiumChromeCtx.Provider value={{ chrome, update }}>{children}</PremiumChromeCtx.Provider>;
}

export function usePremiumChrome(): PremiumChromeContextValue {
  const ctx = useContext(PremiumChromeCtx);
  if (!ctx) throw new Error("usePremiumChrome() phải gọi bên trong <PremiumChromeProvider>");
  return ctx;
}
