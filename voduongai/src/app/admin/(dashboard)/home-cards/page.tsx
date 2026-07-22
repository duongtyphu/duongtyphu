import { redirect } from "next/navigation";
import GemHomePage from "@/app/portal/page";
import { EditModeProvider } from "@/components/portal/gem-home/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Trang chủ Học viện · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn VisualEditor cũ của
 * `home_cards`. Render lại ĐÚNG component gốc `/portal/page.tsx`
 * (`GemHomePage`, import thẳng, không copy/không iframe), bọc
 * `<EditModeProvider>` để bật affordance sửa tại chỗ (`EditableRegion`
 * nhúng trong `PillarEntranceCard`, xem `HomePillarCards.tsx`) + kéo-thả
 * đổi thứ tự 7 card.
 *
 * `GemHomePage` là Server Component (`async function`, gọi
 * `getSupabaseServer()`) — page.tsx này CŨNG là Server Component (không
 * "use client"), truyền `<GemHomePage/>` (đã render sẵn ở server) làm
 * `children` vào `EditModeProvider` (Client) — React hỗ trợ đúng pattern
 * này (Server Component làm con của Client Component). Khác Companion
 * pilot (page.tsx đó "use client" vì `/portal/su-menh-companion/page.tsx`
 * vốn đã "use client" toàn bộ) — ở đây bắt buộc giữ Server Component vì
 * `/portal/page.tsx` cần chạy async fetch thật (profile/reflections/
 * home_cards) trước khi render.
 *
 * requireAdmin() tự gate riêng (2 lớp phòng hộ, cùng nguyên tắc
 * `DataTable.tsx`) dù layout nhóm `(dashboard)` đã gate — không dựa hoàn
 * toàn vào layout do Partial Rendering.
 */
export default async function HomeCardsLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <GemHomePage />
    </EditModeProvider>
  );
}
