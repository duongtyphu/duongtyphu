"use client";

import CompanionHomePage from "@/app/portal/su-menh-companion/page";
import { EditModeProvider } from "@/components/portal/su-menh-companion/EditModeContext";

/**
 * Nhóm 3, Phần C — Live-edit (Cách A) CHÍNH THỨC, thay thế hẳn 6 trang
 * VisualEditor cũ (Sứ mệnh/Triết lý/Điều lệ/Bộ gene/Hành trình tiến hoá/
 * Dòng thời gian — đã xoá, gộp vào route DUY NHẤT này). Bắt đầu từ THÍ
 * ĐIỂM (pilot) chỉ 2 vùng đại diện (Điều lệ, Bộ gene), giờ mở rộng đủ 6
 * khối — xem EditableRegion.tsx.
 *
 * Render lại ĐÚNG component gốc `/portal/su-menh-companion/page.tsx`
 * (import thẳng, không copy/không iframe), bọc thêm EditModeProvider để
 * bật affordance sửa tại chỗ cho cả 6 khối. requireAdmin() đã được gate ở
 * src/app/admin/(dashboard)/layout.tsx (mọi route dưới nhóm này đều qua
 * lớp phòng hộ đó), không cần thêm ở đây.
 *
 * KHÔNG merge Flipbook (`/admin/su-menh-companion/flipbook`) vào route
 * này — Flipbook là carousel xem 1 trang/lần (không phải danh sách 6 khối
 * văn bản), kéo-thả đổi thứ tự cần nhìn thấy TẤT CẢ trang cùng lúc mà
 * VisualEditor (card grid) đã làm tốt hơn hẳn — chuyển sang Cách A ở đây
 * sẽ làm UX đổi thứ tự tệ hơn, không phải tốt hơn. Giữ nguyên
 * `/admin/su-menh-companion/flipbook` (VisualEditor) như 1 route riêng.
 */
export default function CompanionLiveEditPilotPage() {
  return (
    <EditModeProvider>
      <CompanionHomePage />
    </EditModeProvider>
  );
}
