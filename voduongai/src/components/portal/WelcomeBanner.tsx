import { getSupabaseServer } from "@/lib/supabase-server";

type Reminder = { id: string; text: string };

function formatDateTime(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function WelcomeBanner() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const email = user.email ?? "";
  const meta = user.user_metadata ?? {};
  const fullName: string | undefined = meta.full_name;
  const lastSignInAt = formatDateTime(user.last_sign_in_at ?? null);

  const [{ data: orders }, { data: tickets }, { data: notices }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, product_name, status")
      .eq("member_email", email)
      .eq("status", "pending"),
    supabase
      .from("support_tickets")
      .select("id, subject, status")
      .eq("member_email", email)
      .eq("status", "open"),
    supabase
      .from("notifications")
      .select("id, title, message")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const reminders: Reminder[] = [];

  const profileMissing = !meta.phone || !meta.birthday || !meta.occupation;
  if (profileMissing) {
    reminders.push({ id: "profile", text: "Bạn chưa hoàn thiện hồ sơ cá nhân — vào Hồ sơ để bổ sung thông tin." });
  }
  for (const o of orders ?? []) {
    reminders.push({ id: `order-${o.id}`, text: `Đơn hàng "${o.product_name ?? "sản phẩm"}" đang chờ xác nhận thanh toán.` });
  }
  for (const t of tickets ?? []) {
    reminders.push({ id: `ticket-${t.id}`, text: `Yêu cầu hỗ trợ "${t.subject}" đang chờ được phản hồi.` });
  }
  for (const n of notices ?? []) {
    reminders.push({ id: `notice-${n.id}`, text: `${n.title} — ${n.message}` });
  }

  if (reminders.length === 0) return null;

  return (
    <div className="border-b border-brand-blue/20 bg-gradient-to-r from-brand-blue/15 via-brand-blue/5 to-brand-blue/15 px-5 py-3">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold text-brand-blue">
          👋 Chào mừng {fullName || email} trở lại!
          {lastSignInAt && (
            <span className="ml-2 font-medium text-brand-blue/70">Lần truy cập trước: {lastSignInAt}</span>
          )}
        </p>
        <ul className="mt-1.5 space-y-1">
          {reminders.map((r) => (
            <li key={r.id} className="text-sm font-semibold text-brand-blue/90">
              • {r.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
