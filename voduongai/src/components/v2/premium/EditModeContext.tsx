"use client";

import { createContext, useContext } from "react";

/**
 * Bản sao thứ 10 của pattern Live-edit dùng chung (mirror/journal/story/
 * journey-map/garden/gem-home/su-menh-companion/opportunities/premium [1.0]
 * — xem `src/components/portal/opportunities/EditModeContext.tsx`) — module
 * RIÊNG cho `/v2/premium` (khác `src/components/portal/premium/` phục vụ
 * `/portal/premium` 1.0), vì đây là 2 route/2 Context độc lập dù cùng chủ
 * đề Premium. Mặc định `false` (Portal thật). Chỉ `true` khi render qua
 * `/admin/premium/v2-dashboard`.
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
