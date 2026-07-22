import { redirect } from "next/navigation";
import EcosystemMiniSitePage from "@/app/portal/duan-cohoi/[ecosystemSlug]/page";
import { EditModeProvider } from "@/components/portal/opportunities/EditModeContext";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata = { title: "Trang chi tiết hệ sinh thái (Live-edit) · Admin" };

/**
 * Nhóm 3, Phần D (mở rộng) — Live-edit (Cách A) cho 5 trang chi tiết hệ
 * sinh thái (/portal/duan-cohoi/[ecosystemSlug]). MỘT route dynamic duy
 * nhất phục vụ cả 5 trang (digiu/solargroup/blockchain-crypto/lam-affilate/
 * sangiaodich) — cùng kỹ thuật route `[courseId]` đã dùng ở Course Builder.
 *
 * Render lại ĐÚNG component gốc `/portal/duan-cohoi/[ecosystemSlug]/page.tsx`
 * (`EcosystemMiniSitePage`, import thẳng), bọc `<EditModeProvider>` — cùng
 * pattern 5 Cửa Hành trình. CHỈ 2 field an toàn (name/shortDescription của
 * `EcosystemOverview`) sửa được — KHÔNG đụng highlights/whoFor/whoNotReady/
 * expectedOutcome/fullIntro/statusBadge hay marketingLinks/subProjects/
 * fields/affiliateOffers/exchanges/potentialAnalysis (vẫn đọc tĩnh từ
 * src/data/portal/ecosystems.ts, ngoài phạm vi việc này — Founder xác nhận).
 */
export default async function EcosystemLiveEditPage({
  params,
}: {
  params: Promise<{ ecosystemSlug: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <EditModeProvider>
      <EcosystemMiniSitePage params={params} />
    </EditModeProvider>
  );
}
