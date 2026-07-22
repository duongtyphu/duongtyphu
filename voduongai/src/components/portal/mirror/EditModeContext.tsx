"use client";

import { createContext, useContext } from "react";

/**
 * Cùng pattern `su-menh-companion/EditModeContext.tsx` /
 * `gem-home/EditModeContext.tsx` — mặc định `false` (Portal thật). Chỉ
 * `true` khi render qua route Live-edit của Mirror
 * (`/admin/hanh-trinh-cua-toi/mirror`).
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
