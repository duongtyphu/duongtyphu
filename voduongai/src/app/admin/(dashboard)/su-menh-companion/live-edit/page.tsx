"use client";

import CompanionHomePage from "@/app/portal/su-menh-companion/page";
import { EditModeProvider } from "@/components/portal/su-menh-companion/EditModeContext";

/**
 * THÍ ĐIỂM (pilot) — Inline editing "cách A": render lại ĐÚNG component
 * gốc của /portal/su-menh-companion/page.tsx (import thẳng, không copy/
 * không iframe), chỉ bọc thêm EditModeProvider để bật affordance sửa tại
 * chỗ cho 2 vùng đại diện (Điều lệ, Bộ gene — xem EditableRegion.tsx).
 *
 * KHÔNG thay thế /admin/su-menh-companion/* (6 trang VisualEditor của
 * Việc 6) — đây là 1 chế độ bổ sung để Founder đánh giá, giữ nguyên các
 * trang VisualEditor song song. requireAdmin() đã được gate ở
 * src/app/admin/(dashboard)/layout.tsx (mọi route dưới nhóm này đều qua
 * lớp phòng hộ đó), không cần thêm ở đây.
 */
export default function CompanionLiveEditPilotPage() {
  return (
    <EditModeProvider>
      <CompanionHomePage />
    </EditModeProvider>
  );
}
