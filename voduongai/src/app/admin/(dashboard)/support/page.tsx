import { listTickets } from "./actions";
import { TicketRow } from "./TicketRow";

export default async function SupportAdminPage() {
  const { tickets, configured } = await listTickets();
  const open = tickets.filter((t) => t.status !== "closed");
  const closed = tickets.filter((t) => t.status === "closed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white">Hỗ trợ học viên</h1>
        <p className="mt-1 text-sm text-white/50">
          Xem và phản hồi ticket hỗ trợ từ Portal (dữ liệu thật từ Supabase).
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5 text-sm text-white/80">
          Chưa cấu hình <code className="text-brand-orange">SUPABASE_SERVICE_ROLE_KEY</code> trong{" "}
          <code className="text-brand-orange">.env.local</code> — cần quyền service role để đọc/trả lời ticket của
          mọi học viên.
        </div>
      )}

      {configured && tickets.length === 0 && <p className="text-sm text-white/40">Chưa có ticket nào.</p>}

      {open.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Đang xử lý ({open.length})</h2>
          <div className="space-y-4">
            {open.map((t) => (
              <TicketRow key={t.id} ticket={t} />
            ))}
          </div>
        </div>
      )}

      {closed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white">Đã đóng ({closed.length})</h2>
          <div className="space-y-4">
            {closed.map((t) => (
              <TicketRow key={t.id} ticket={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
