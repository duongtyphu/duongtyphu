import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { listCaseStudies } from "./actions";
import { NewCaseStudyForm, CaseStudyCard } from "./CaseStudyForm";

export const metadata = { title: "Câu chuyện thành công (Folder) · Admin" };

// Case Study đi qua Server Actions riêng (actions.ts), KHÔNG dùng
// /api/admin/collections/[table] — bảng `case_studies` là typed, không phải
// schema generic id/data/status/order. Xem CLAUDE.md "Case Study".
export default async function AdminCkosCaseStudiesPage() {
  const { caseStudies, configured } = await listCaseStudies();

  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <div className="space-y-8">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Câu chuyện thành công (Folder)</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý Case Study hiển thị tại Portal → Case Study (dữ liệu thật từ Supabase, bảng{" "}
            <code>case_studies</code>).
          </p>
        </div>

        {!configured && (
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
            Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền service
            role để quản lý Case Study.
          </div>
        )}

        {configured && (
          <>
            <NewCaseStudyForm />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((c) => (
                <CaseStudyCard key={c.id} caseStudy={c} />
              ))}
              {caseStudies.length === 0 && <p className="text-sm text-gray-400">Chưa có Case Study nào.</p>}
            </div>
          </>
        )}
      </div>
    </AdminAtmosphere>
  );
}
