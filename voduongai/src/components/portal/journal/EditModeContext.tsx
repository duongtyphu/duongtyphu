"use client";

import { createContext, useContext } from "react";

/** Cùng pattern mirror/gem-home/su-menh-companion — mặc định `false`
 * (Portal thật). Chỉ `true` khi render qua route Live-edit
 * (`/admin/hanh-trinh-cua-toi/journal`). */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
