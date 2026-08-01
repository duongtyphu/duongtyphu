import { redirect } from "next/navigation";
import HomePage from "@/app/page";
import { EditModeProvider } from "@/components/home/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Landing Page (Live-edit) · Admin" };

/**
 * Landing Page CMS (Phase 25) — Live-edit (Cách A), cùng pattern
 * `/admin/home-cards`/`/admin/premium/dashboard`. Render lại ĐÚNG component
 * gốc `/page.tsx` (`HomePage`, import thẳng), bọc `<EditModeProvider>` để
 * bật affordance sửa tại chỗ (`EditableRegion` nhúng trong 8 section
 * component dưới `src/components/home/`).
 *
 * `HomePage` là Server Component (`async function`, gọi
 * `getLiveLandingChrome()`) — page.tsx này CŨNG là Server Component,
 * truyền `<HomePage/>` làm children vào `EditModeProvider` (Client) — cùng
 * pattern đã dùng cho `GemHomePage`/`PremiumPage`.
 *
 * CHỈ quản field text an toàn (Tier 1 "An toàn") — xem comment đầu
 * `src/lib/portal/live-landing-chrome.ts` cho danh sách đầy đủ những gì
 * KHÔNG đưa vào (mảng ITEMS/STEPS/LIST/FEATURES/VALUES gắn icon cố định,
 * toàn bộ QuizAssessment, danh sách `tools`, ảnh tĩnh, mọi href).
 *
 * NỀN/CHỮ — khác mọi module Live-edit Portal khác: `/portal/*` dùng chung
 * `<GemBackground/>` ở CẢ 2 tầng Shell (`PortalShell.tsx` lẫn
 * `AdminShell.tsx` — xem CLAUDE.md mục "Nguyên tắc giao diện Admin"), nên
 * nền Admin và nền Portal thật LUÔN khớp nhau tự nhiên. Landing Page thì
 * KHÔNG dùng `GemBackground` — nền thật của nó là `.mesh-navy` (render ở
 * `src/app/layout.tsx`, ngoài mọi Shell) + `body` có `text-white` mặc
 * định, và `HomeClient.tsx` tự phủ `bg-white` lên trên khi
 * `theme === "light"`. Bọc `<HomePage/>` thẳng vào `<AdminShell>` (nền
 * `GemBackground` sáng + `text-gray-900` + `<main className="p-6">`) làm
 * lệch cả nền lẫn màu chữ so với `/` thật. Wrapper dưới đây tái tạo đúng
 * 2 lớp nền/chữ gốc của `body` (`mesh-navy` + `text-white`) VÀ triệt tiêu
 * đúng `p-6` của `AdminShell` bằng `-m-6` (giá trị cố định, không có biến
 * thể responsive nên không cần `md:` riêng như các trang Live-edit Portal
 * khác) — chỉ sửa ở file Admin-only này, không đụng `HomePage`/
 * `HomeClient`/`layout.tsx` thật.
 */
export default async function LandingLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mesh-navy -m-6 overflow-hidden text-white">
      <EditModeProvider>
        <HomePage />
      </EditModeProvider>
    </div>
  );
}
