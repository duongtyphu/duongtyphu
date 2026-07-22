import { redirect } from "next/navigation";
import MirrorPage from "@/app/portal/mirror/page";
import { EditModeProvider } from "@/components/portal/mirror/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Mirror (Live-edit) · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn 2 trang VisualEditor cũ
 * (`mirror-chrome`, `mirror-questions` — đã xoá, gộp vào route DUY NHẤT
 * này). Render lại ĐÚNG component gốc `/portal/mirror/page.tsx`
 * (`MirrorPage`, import thẳng, không copy/không iframe), bọc
 * `<EditModeProvider>` để bật affordance sửa tại chỗ (xem
 * `MirrorChamber.tsx`'s panel "Live-edit — Nội dung Mirror", chỉ hiện khi
 * `editMode=true`) + kéo-thả... (Mirror không có khái niệm thứ tự card —
 * `mirror_chrome` là 1 dòng singleton, `mirror_questions` không cần đổi
 * thứ tự hiển thị vì chỉ xoay vòng theo NGÀY, không theo vị trí — không
 * cần kéo-thả cho module này, khác `home_cards`).
 *
 * `MirrorPage` là Server Component (`async function`, gọi
 * `getSupabaseServer()` cho reflections/memory_capsules thật) — page.tsx
 * này CŨNG là Server Component (không "use client"), truyền
 * `<MirrorPage/>` làm `children` vào `EditModeProvider` (Client) — cùng
 * pattern đã dùng cho `/admin/home-cards` (Nhóm 3, Phần B).
 *
 * requireAdmin() tự gate riêng (2 lớp phòng hộ, cùng nguyên tắc
 * `DataTable.tsx`).
 */
export default async function MirrorLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <MirrorPage />
    </EditModeProvider>
  );
}
