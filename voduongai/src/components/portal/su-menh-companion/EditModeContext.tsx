"use client";

import { createContext, useContext } from "react";

/**
 * THÍ ĐIỂM (pilot) — Inline editing cách A, chỉ áp dụng cho
 * /portal/su-menh-companion. Mặc định `false` (Portal thật) — chỉ
 * `true` khi render qua /admin/su-menh-companion/live-edit (component
 * page.tsx GỐC được import lại, bọc bằng Provider này, không phải bản
 * sao/iframe). Không có Provider ở giữa (Portal thật) → context giữ
 * nguyên default `false`, EditableRegion render y hệt children, không
 * lộ bất kỳ UI admin nào.
 */
const EditModeContext = createContext(false);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  return <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): boolean {
  return useContext(EditModeContext);
}
