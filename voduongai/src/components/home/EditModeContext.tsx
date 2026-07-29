"use client";

import { createContext, useContext } from "react";

/**
 * Cùng pattern mirror/journal/story/journey-map/garden/gem-home/
 * su-menh-companion/opportunities/premium — mặc định `false` (Landing Page
 * thật, công khai). Chỉ `true` khi render qua route Live-edit
 * (`/admin/landing`).
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
