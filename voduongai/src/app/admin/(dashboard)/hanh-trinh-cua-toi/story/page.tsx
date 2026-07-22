import { redirect } from "next/navigation";
import MyStoryPage from "@/app/portal/story/page";
import { EditModeProvider } from "@/components/portal/story/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "My Story (Live-edit) · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn trang VisualEditor cũ
 * (`story-chrome` — đã xoá, gộp vào route DUY NHẤT này). Render lại ĐÚNG
 * component gốc `/portal/story/page.tsx` (`MyStoryPage`, import thẳng),
 * bọc `<EditModeProvider>` — cùng pattern `/admin/home-cards` +
 * `/admin/hanh-trinh-cua-toi/mirror`/`journal`.
 *
 * Không có kéo-thả — `story_chrome` là singleton (1 dòng), không có
 * danh sách cần đổi thứ tự.
 */
export default async function StoryLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <MyStoryPage />
    </EditModeProvider>
  );
}
