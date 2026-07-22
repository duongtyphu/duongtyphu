import { redirect } from "next/navigation";
import KnowledgeGardenPage from "@/app/portal/khuvuoncuaban/page";
import { EditModeProvider } from "@/components/portal/garden/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Khu vườn của bạn (Live-edit) · Admin" };

/**
 * Nhóm 3 — Live-edit (Cách A), thay thế hẳn trang VisualEditor cũ
 * (`garden-chrome` — đã xoá, gộp vào route DUY NHẤT này). Render lại
 * ĐÚNG component gốc `/portal/khuvuoncuaban/page.tsx`
 * (`KnowledgeGardenPage`, import thẳng), bọc `<EditModeProvider>` — cùng
 * pattern Mirror/Journal/My Story/Bản đồ hành trình.
 *
 * Khác 4 module trước: KHÔNG cần dựng atmosphere riêng cho route Admin —
 * `GardenExperience` (component thật) đã tự render đủ 4 lớp `garden-sky`
 * + `data-garden-period` (theo giờ thiết bị thật) ngay trong JSX của nó,
 * không như VisualEditor cũ phải tự dựng `GardenAdminAtmosphere` giả lập.
 *
 * CHỈ quản 5 field `garden_chrome`. KHÔNG đụng `companionLineFor()`/
 * `treeStage()`/`buildElements()` (template nội suy runtime + ngưỡng dữ
 * liệu thật) hay cặp CTA (nhãn+href cùng đổi theo `gardenEmpty`, giữ
 * nguyên cả khối trong code). Không có kéo-thả — `garden_chrome` là
 * singleton.
 */
export default async function GardenLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <KnowledgeGardenPage />
    </EditModeProvider>
  );
}
