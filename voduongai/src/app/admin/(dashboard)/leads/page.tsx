import { listLeads } from "./actions";
import { LeadRow } from "./LeadRow";

export default async function LeadsAdminPage() {
  const { leads, configured } = await listLeads();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Leads</h1>
        <p className="mt-1 text-sm text-white/50">
          Email đăng ký thật từ form thu thập trên Portal (dữ liệu thật từ Supabase).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để đọc lead thật.
        </div>
      )}

      {configured && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wide text-white/40">
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Nguồn</th>
                <th className="px-3 py-3">Ngày đăng ký</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <LeadRow key={l.id} lead={l} />
              ))}
            </tbody>
          </table>
          {leads.length === 0 && <p className="p-5 text-sm text-white/40">Chưa có lead nào.</p>}
        </div>
      )}
    </div>
  );
}
