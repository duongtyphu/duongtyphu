"use client";

import { createContext, useContext } from "react";

/**
 * Cùng pattern mirror/journal/story/journey-map/garden/gem-home/
 * su-menh-companion/opportunities — mặc định `false` (Portal thật). Chỉ
 * `true` khi render qua route Live-edit của Premium Dashboard
 * (`/admin/premium/dashboard`).
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
