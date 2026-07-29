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
 */
export default async function LandingLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <HomePage />
    </EditModeProvider>
  );
}
