import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { listDocuments } from "./actions";
import { NewDocumentForm, DocumentCard } from "./DocumentForm";

export const metadata = { title: "Tài liệu · Admin" };

/**
 * ADM-V2-04 — "Tài liệu" (Thương hiệu & Media). ĐÍNH CHÍNH phạm vi so với
 * ghi chú gốc của nav item này (từng mô tả "đọc lại file Markdown trong
 * docs/ ngay trong Admin", chưa từng có gì backing thật): audit phát hiện
 * bảng `documents` (title/description/url/icon/bg_color/display_order/
 * active) đã có 4 dòng dữ liệu thật, đã được `/portal/resources` ("Tài
 * nguyên miễn phí" → khối "Tài liệu từ VO DUONG AI Academy") đọc thật —
 * nhưng CHƯA từng có Admin UI. CRUD thật (Server Actions riêng, bảng
 * typed, cùng pattern `case_studies`/`coupons`).
 */
export default async function TaiLieuPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { documents, configured } = await listDocuments();

  return (
    <div className="space-y-6">
      <AdminBreadcrumb trail={[{ label: "Thương hiệu & Media", href: "/admin/thuong-hieu-media/tai-lieu" }, { label: "Tài liệu" }]} />
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">Tài liệu</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tài liệu tải xuống hiển thị ở Portal → Tài nguyên miễn phí (dữ liệu thật, bảng{" "}
          <code className="text-gray-700">documents</code>).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền
          service role để quản lý tài liệu.
        </div>
      )}

      {configured && (
        <>
          <NewDocumentForm />
          <div className="space-y-3">
            {documents.map((d) => (
              <DocumentCard key={d.id} doc={d} />
            ))}
            {documents.length === 0 && <p className="text-sm text-gray-400">Chưa có tài liệu nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
