import { redirect } from "next/navigation";
import OpportunitiesHubPage from "@/app/portal/duan-cohoi/page";
import { EditModeProvider } from "@/components/portal/opportunities/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Dự án & Cơ hội (Live-edit) · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn `/admin/projects` (DataTable
 * cũ — đã xoá). Render lại ĐÚNG component gốc
 * `/portal/duan-cohoi/page.tsx` (`OpportunitiesHubPage`, import thẳng),
 * bọc `<EditModeProvider>` — cùng pattern `/admin/home-cards` và 5 Cửa
 * Hành trình.
 *
 * `ProjectCards.tsx` (tách từ khối JSX render lưới ecosystem cũ) nhận
 * `seed` (kết quả `getLiveProjects()`, fetch server-side ở
 * `OpportunitiesHubPage`) và gọi `useCollection("projects", seed,
 * {enabled: useEditMode()})` — Portal thật (`/portal/duan-cohoi`,
 * `editMode=false`) pass-through đúng `seed`, 0 request mạng thừa; ở đây
 * (`editMode=true`) mới thật sự fetch/phản ứng để sửa 9 field + kéo-thả
 * đổi thứ tự (dùng `reorder()` có sẵn, cùng cơ chế `home_cards` đã dùng).
 *
 * Route con `/admin/duan-cohoi/[ecosystemSlug]` (5 trang chi tiết hệ sinh
 * thái, đã xây trước đó) không đổi gì — vẫn Live-edit riêng cho 2 field
 * an toàn (name/shortDescription) của từng trang chi tiết.
 */
export default async function DuanCohoiLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <OpportunitiesHubPage />
    </EditModeProvider>
  );
}
