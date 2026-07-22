"use client";

import { createContext, useContext } from "react";

/**
 * Cùng pattern `mirror/EditModeContext.tsx`/`journal/EditModeContext.tsx`
 * — mặc định `false` (Portal thật). Chỉ `true` khi render qua route
 * Live-edit của My Story (`/admin/hanh-trinh-cua-toi/story`).
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
