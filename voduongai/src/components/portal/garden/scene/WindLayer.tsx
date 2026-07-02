import type { ReactNode } from "react";

/**
 * Wind Layer — chuyển động duy nhất tác động lên Tree Layer: một nhịp
 * "thở" rất nhẹ (scale ~0.6%, rotate ~0.15deg) mô phỏng gió lay tán lá.
 * Đây là layer độc lập bọc ngoài Tree Layer — Tree Layer không tự
 * animate, mọi chuyển động của cây đi qua Wind Layer để sau này có thể
 * thay đổi "cường độ gió" mà không đụng vào Tree Layer/asset gốc.
 */
export function WindLayer({ children }: { children: ReactNode }) {
  return <div className="garden-tree-photo absolute inset-0">{children}</div>;
}
