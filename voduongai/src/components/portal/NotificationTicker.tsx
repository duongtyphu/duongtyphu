import { getSupabaseServer } from "@/lib/supabase-server";

type Notice = { id: number; title: string; message: string };

async function getNotices(): Promise<Notice[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, message")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function NotificationTicker() {
  const notices = await getNotices();
  if (notices.length === 0) return null;

  return (
    <div className="mb-6 flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-orange/15 via-brand-orange/5 to-brand-orange/15 py-2">
      <span className="ml-5 shrink-0 text-sm">🔔</span>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        <div className="notice-ticker-track inline-flex w-max gap-14 whitespace-nowrap">
          {notices.map((n) => (
            <span key={n.id} className="text-sm font-bold text-brand-orange">
              {n.title} — <span className="font-semibold text-white/80">{n.message}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
