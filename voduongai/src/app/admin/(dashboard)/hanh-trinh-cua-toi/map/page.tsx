import { redirect } from "next/navigation";
import JourneyMapPage from "@/app/portal/hanhtrinhcuatoi/ban-do/page";
import { EditModeProvider } from "@/components/portal/journey-map/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Bản đồ hành trình (Live-edit) · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn trang VisualEditor cũ
 * (`map-chrome` — đã xoá, gộp vào route DUY NHẤT này). Render lại ĐÚNG
 * component gốc `/portal/hanhtrinhcuatoi/ban-do/page.tsx`
 * (`JourneyMapPage`, import thẳng), bọc `<EditModeProvider>` — cùng
 * pattern Mirror/Journal/My Story.
 *
 * CHỈ quản 12 field `map_chrome` an toàn. KHÔNG đụng CHAPTER_DESTINATIONS
 * (mảng không key, gắn chương bằng vị trí index) hay PORTAL_CONNECTIONS
 * (field `module` là key tra cứu thật vào `getModuleActivitySummary()`)
 * — 2 cấu trúc này vẫn giữ nguyên trong `JourneyMapAtlas.tsx`, không qua
 * `useCollection()`. Không có kéo-thả — `map_chrome` là singleton.
 */
export default async function MapLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <JourneyMapPage />
    </EditModeProvider>
  );
}
