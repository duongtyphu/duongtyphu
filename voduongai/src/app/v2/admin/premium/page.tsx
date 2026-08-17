import { getPremiumResourceCounts } from "@/lib/portal/live-premium-v2";

import "../../inter-gf.css";
import "../../premium/premium.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Premium — Admin" };

/**
 * `/v2/admin/premium` — khớp trực quan `/v2/premium` (CSS `.pm`). Trang
 * Premium 2.0 gộp nhiều nguồn thật đã có Admin 1.0 quản lý riêng: Hero/2
 * nhãn section/thanh toán/FAQ (bảng `premium_chrome`/`premium_payment_steps`/
 * `premium_faq`, quản qua `/admin/premium/dashboard`), giá 5 chương trình
 * (`courses`, quản qua `/admin/course-pricing`), và số tài nguyên CKOS
 * (`getPremiumResourceCounts()`). Không xây trùng UI — chỉ hiện số liệu
 * thật + trỏ đúng nơi quản lý.
 */
export default async function AdminPremiumPage() {
  const counts = await getPremiumResourceCounts();

  return (
    <AdminPortalMirror
      prefix="pm"
      title="Quản lý Premium"
      description="Nội dung trang Premium 2.0 (Hero/nhãn section/thanh toán/FAQ/giá 5 chương trình/tài nguyên CKOS) đến từ nhiều bảng đã có sẵn Admin 1.0 quản lý — không xây trùng."
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
        { label: "Giá 5 chương trình khoá học (Admin 1.0) →", href: "/admin/course-pricing" },
      ]}
    />
  );
}
