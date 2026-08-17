import { getPremiumResourceCounts } from "@/lib/portal/live-premium-v2";

import "../../inter-gf.css";
import "../../premium/premium.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Premium — Admin" };

/**
 * `/v2/admin/premium` — khớp trực quan `/v2/premium` (CSS `.pm`). Trang
 * Premium 2.0 gộp nhiều nguồn thật đã có Admin 1.0 quản lý riêng: Hero/2
 * nhãn section/thanh toán/FAQ (bảng `premium_chrome`/`premium_payment_steps`/
 * `premium_faq`, quản qua `/admin/premium/dashboard`), 3 gói Premium thuê
 * bao (`premium_plans`, quản qua `/admin/premium/plans` — Phase 38, thay
 * thế 5 chương trình mua đứt cũ), và số tài nguyên CKOS
 * (`getPremiumResourceCounts()`). Không xây trùng UI — chỉ hiện số liệu
 * thật + trỏ đúng nơi quản lý.
 */
export default async function AdminPremiumPage() {
  const counts = await getPremiumResourceCounts();

  return (
    <AdminPortalMirror
      prefix="pm"
      title="Quản lý Premium"
      description="Nội dung trang Premium 2.0 (Hero/nhãn section/thanh toán/FAQ/3 gói thuê bao/tài nguyên CKOS) đến từ nhiều bảng đã có sẵn Admin 1.0 quản lý — không xây trùng."
      stats={[
        { label: "Prompt", value: String(counts.prompts) },
        { label: "Workflow", value: String(counts.workflows) },
        { label: "Template", value: String(counts.templates) },
        { label: "Ebook", value: String(counts.ebooks) },
        { label: "Checklist", value: String(counts.checklists) },
        { label: "Case Study", value: String(counts.caseStudies) },
      ]}
      links={[
        { label: "Dashboard Premium — Hero/thanh toán/FAQ (Admin 1.0) →", href: "/admin/premium/dashboard" },
        { label: "3 gói Premium (Tháng/6 Tháng/12 Tháng) (Admin 1.0) →", href: "/admin/premium/plans" },
      ]}
    />
  );
}
