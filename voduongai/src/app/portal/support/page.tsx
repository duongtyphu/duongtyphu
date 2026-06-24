import { getSupabaseServer } from "@/lib/supabase-server";
import { SupportTicketForm } from "@/components/portal/SupportTicketForm";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Hỗ trợ" };

type Ticket = {
  id: number;
  subject: string;
  message: string;
  reply: string | null;
  status: string;
  created_at: string;
};

const statusLabel: Record<string, string> = {
  open: "Đang chờ",
  replied: "Đã phản hồi",
  closed: "Đã đóng",
};

async function getTickets(): Promise<{ email: string | null; tickets: Ticket[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { email: null, tickets: [] };
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? null;
  if (!email) return { email: null, tickets: [] };

  const { data } = await supabase
    .from("support_tickets")
    .select("id, subject, message, reply, status, created_at")
    .eq("member_email", email)
    .order("created_at", { ascending: false });

  return { email, tickets: data ?? [] };
}

export default async function SupportPage() {
  const { email, tickets } = await getTickets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Hỗ trợ</h1>
        <p className="mt-2 text-white">
          Gửi câu hỏi hoặc yêu cầu hỗ trợ — hoặc liên hệ trực tiếp qua {siteConfig.contact.email}.
        </p>
      </div>

      {!email ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white">
          Đăng nhập để gửi yêu cầu hỗ trợ và xem lịch sử ticket của bạn.
        </div>
      ) : (
        <>
          <SupportTicketForm />

          <div>
            <h2 className="text-lg font-bold text-white">Yêu cầu của bạn</h2>
            {tickets.length === 0 ? (
              <p className="mt-3 text-sm text-white/60">Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-white">{t.subject}</h3>
                      <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {statusLabel[t.status] ?? t.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{t.message}</p>
                    {t.reply && (
                      <div className="mt-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Phản hồi</p>
                        <p className="mt-1 text-sm text-white/80">{t.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
