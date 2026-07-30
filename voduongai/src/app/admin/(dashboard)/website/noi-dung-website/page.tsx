import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { FileText } from "lucide-react";

export const metadata = { title: "Nội dung Website · Admin" };

/**
 * ADM-V2-02 — "Nội dung Website" (Website). Route thật — 6 trang tĩnh
 * (/about, /contact, /privacy, /terms, /disclaimer, /refund-policy) hiện
 * là component React với nội dung pháp lý/giới thiệu khá dài, cấu trúc
 * phức tạp hơn hẳn 1 vài field text đơn giản (khác Header & Footer/SEO
 * Website — 2 module đã chuyển thành thật ở sprint này). Biến các trang
 * NÀY thành CMS cần quyết định phạm vi cụ thể trước (mỗi trang 1 field rich
 * text lớn, hay tách theo từng section có cấu trúc?) — đặc biệt rủi ro với
 * nội dung pháp lý (Điều khoản/Chính sách bảo mật/Hoàn phí) nếu sửa sai qua
 * UI generic. CHƯA lập đề xuất migration cho tới khi có quyết định phạm vi.
 */
export default async function NoiDungWebsitePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Website", href: "/admin/landing" }, { label: "Nội dung Website" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Nội dung Website</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nội dung các trang tĩnh công khai ngoài Landing Page — /about, /contact, /privacy, /terms,
          /disclaimer, /refund-policy.
        </p>
      </div>

      <AdminEmptyState
        icon={FileText}
        title="Cần quyết định phạm vi trước khi xây CMS"
        description="6 trang này hiện là component React với nội dung dài, có cấu trúc — khác các module chrome đơn giản đã Live-edit. Cần Founder quyết định: mỗi trang 1 khối rich-text lớn, hay tách theo từng section? Đặc biệt cẩn trọng với nội dung pháp lý (Điều khoản/Chính sách bảo mật/Hoàn phí) — sai sót ở đây có rủi ro pháp lý thật, không chỉ rủi ro hiển thị."
        action={{ label: "Xem Landing Page (đã có Live-edit)", href: "/admin/landing" }}
      />
    </div>
  );
}
