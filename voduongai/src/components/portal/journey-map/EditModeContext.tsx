"use client";

import { createContext, useContext } from "react";

/**
 * Cùng pattern `mirror`/`journal`/`story` — mặc định `false` (Portal
 * thật). Chỉ `true` khi render qua route Live-edit của Bản đồ hành trình
 * (`/admin/hanh-trinh-cua-toi/map`).
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
