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
    <div className="mb-4 overflow-hidden rounded-lg border border-brand-orange/20 bg-brand-orange/5 px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/80">
        <span className="font-bold text-brand-orange">📢 Thông báo:</span>
        {notices.map((n, i) => (
          <span key={n.id}>
            <strong className="text-white">{n.title}</strong> — {n.message}
            {i < notices.length - 1 && <span className="ml-2 text-white/30">•</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
