import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { ACADEMY_WORKSPACE_SECTIONS } from "@/lib/admin/academy/navigation";
import { listSubmissions } from "./actions";
import { SubmissionRow } from "./SubmissionRow";

export default async function ProjectsAdminPage() {
  const { submissions, configured } = await listSubmissions();
  const pending = submissions.filter((s) => s.status !== "reviewed");
  const reviewed = submissions.filter((s) => s.status === "reviewed");

  return (
    <AdminWorkspaceShell title="Academy Workspace" description="" rootHref="/admin/academy" sections={ACADEMY_WORKSPACE_SECTIONS}>
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Dự án thực chiến</h1>
        <p className="mt-1 text-sm text-white/50">
          Chấm và phản hồi bài thực chiến học viên nộp tại Portal (dữ liệu thật từ Supabase).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — trang này cần quyền service role để đọc/chấm bài của
          mọi học viên. Lấy key tại Supabase Dashboard → Project Settings → API → service_role secret.
        </div>
      )}

      {configured && submissions.length === 0 && (
        <p className="text-sm text-white/40">Chưa có bài nộp nào.</p>
      )}

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Đang chờ chấm ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((s) => (
              <SubmissionRow key={s.id} submission={s} />
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Đã chấm ({reviewed.length})</h2>
          <div className="space-y-4">
            {reviewed.map((s) => (
              <SubmissionRow key={s.id} submission={s} />
            ))}
          </div>
        </div>
      )}
    </div>
    </AdminWorkspaceShell>
  );
}
