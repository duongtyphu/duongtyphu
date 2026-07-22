"use client";

import { createContext, useContext } from "react";

/**
 * Cùng pattern `src/components/portal/su-menh-companion/EditModeContext.tsx`
 * (pilot Live-edit) — mặc định `false` (Portal thật). Chỉ `true` khi render
 * qua route live-edit của Trang chủ Học viện (Nhóm 3, module kế tiếp —
 * CHƯA build ở bước nối dây này). Dựng sẵn ở đây để `HomePillarCards.tsx`
 * không cần sửa lại lần 2 khi Live-edit build xong.
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
