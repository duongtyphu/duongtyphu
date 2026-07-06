import { listCaseStudies } from "./actions";
import { NewCaseStudyForm, CaseStudyCard } from "./CaseStudyForm";

// Phase F.2 — this page now writes/reads `case_studies` (typed) directly via
// dedicated server actions, matching what /portal/case-studies + the search
// index actually read. Previously used the generic ContentManager/CrudPage
// path, which wrote to the legacy `case_study` (jsonb) table instead — that
// table is preserved untouched (not deleted), see supabase-phase-e-sync-*.

export default async function CaseStudyAdminPage() {
  const { caseStudies, configured } = await listCaseStudies();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Case Study</h1>
        <p className="mt-1 text-sm text-white/50">
          Quản lý case study hiển thị tại Portal → Case Study (dữ liệu thật từ Supabase, bảng <code>case_studies</code>).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để quản lý case study.
        </div>
      )}

      {configured && (
        <>
          <NewCaseStudyForm />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((c) => (
              <CaseStudyCard key={c.id} caseStudy={c} />
            ))}
            {caseStudies.length === 0 && <p className="text-sm text-white/40">Chưa có case study nào.</p>}
          </div>
        </>
      )}
    </div>
  );
}
