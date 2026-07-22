import { redirect } from "next/navigation";
import LearningJournalPage from "@/app/portal/nhatkyhoctap/page";
import { EditModeProvider } from "@/components/portal/journal/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Nhật ký học tập (Live-edit) · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn 2 trang VisualEditor cũ
 * (`journal-chrome`, `journal-intentions` — đã xoá, gộp vào route DUY
 * NHẤT này). Render lại ĐÚNG component gốc
 * `/portal/nhatkyhoctap/page.tsx` (`LearningJournalPage`, import thẳng),
 * bọc `<EditModeProvider>` — cùng pattern `/admin/home-cards` +
 * `/admin/hanh-trinh-cua-toi/mirror`.
 *
 * Không có kéo-thả (giống Mirror) — `journal_chrome` là singleton,
 * `journal_intentions` xoay vòng theo ngày, không theo vị trí hiển thị.
 */
export default async function JournalLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <LearningJournalPage />
    </EditModeProvider>
  );
}
