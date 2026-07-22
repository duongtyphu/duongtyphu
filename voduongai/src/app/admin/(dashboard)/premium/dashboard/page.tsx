import { redirect } from "next/navigation";
import PremiumPage from "@/app/portal/premium/page";
import { EditModeProvider } from "@/components/portal/premium/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Premium Dashboard (Live-edit) · Admin" };

/**
 * Premium — Dashboard Live-edit (Cách A), theo yêu cầu riêng của Founder.
 * "Giá khoá học Premium" (`/admin/course-pricing`, bảng `courses`) GIỮ
 * NGUYÊN không đổi — route này KHÔNG thay thế nó, chỉ thêm mới bên cạnh.
 *
 * Render lại ĐÚNG component gốc `/portal/premium/page.tsx` (`PremiumPage`,
 * import thẳng), bọc `<EditModeProvider>` — cùng pattern mọi module
 * Live-edit khác trong dự án.
 *
 * CHỈ quản phần chữ tĩnh an toàn: Hero (eyebrow/title 2 dòng/subtitle,
 * qua `PremiumHeroBlock`), 2 nhãn section (qua `PremiumSectionHeading`),
 * 4 bước thanh toán (`premium_payment_steps`) + 4 câu FAQ (`premium_faq`,
 * qua `PremiumPaymentSteps`/`PremiumFaqList`). KHÔNG đụng `PREMIUM_PROGRAMS`
 * (5 chương trình, icon/accent màu), `PremiumAdvisor` (6 tình huống,
 * targetHref gắn anchor thật), `PremiumConsult` (số điện thoại/Zalo),
 * `FounderSpotlight` (hồ sơ Founder) — tất cả vẫn tĩnh trong code.
 */
export default async function PremiumDashboardLiveEditPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <PremiumPage />
    </EditModeProvider>
  );
}
