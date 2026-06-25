import { getSupabaseServer } from "@/lib/supabase-server";
import { LogoutButton } from "@/components/portal/LogoutButton";
import { ProfileForm } from "@/components/portal/ProfileForm";
import { SecurityPanel } from "@/components/portal/SecurityPanel";
import { NotificationSettingsPanel } from "@/components/portal/NotificationSettingsPanel";
import { ProfileTabs } from "@/components/portal/ProfileTabs";

export const metadata = { title: "Tài khoản", description: "Quản lý hồ sơ, bảo mật và đơn hàng tài khoản VO DUONG AI của bạn.", robots: { index: false } };

type Order = {
  id: number;
  product_name: string | null;
  status: string;
  created_at: string;
  confirmed_at: string | null;
  products: { title: string; icon: string | null; video_url: string | null; pdf_url: string | null } | null;
  lessons: { title: string; video_url: string | null; pdf_url: string | null } | null;
};

async function getAccountData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { user: null, orders: [] as Order[] };
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user?.email) return { user, orders: [] as Order[] };

  const { data } = await supabase
    .from("orders")
    .select("id, product_name, status, created_at, confirmed_at, products(title, icon, video_url, pdf_url), lessons(title, video_url, pdf_url)")
    .eq("member_email", user.email)
    .order("created_at", { ascending: false });

  return { user, orders: (data as unknown as Order[]) ?? [] };
}

export default async function AccountPage() {
  const { user, orders } = await getAccountData();

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-white">Tài khoản</h1>
        <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white">
            Portal đang ở chế độ truy cập công khai (chưa yêu cầu đăng nhập).
          </p>
        </div>
      </div>
    );
  }

  const meta = user.user_metadata ?? {};
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const memberSince = new Date(user.created_at);
  const daysSince = Math.max(0, Math.floor((Date.now() - memberSince.getTime()) / 86_400_000));
  const initial = (meta.full_name || user.email || "?").trim().charAt(0).toUpperCase();

  const activities = [
    { id: "joined", dot: "#5B8CFF", text: "Tham gia VO DUONG AI Academy", time: memberSince },
    ...orders.map((o) => ({
      id: `order-${o.id}`,
      dot: o.status === "confirmed" ? "#10B981" : o.status === "pending" ? "#F59E0B" : "#EF4444",
      text:
        o.status === "confirmed"
          ? `✅ Mua thành công: ${o.products?.title ?? o.lessons?.title ?? o.product_name ?? "sản phẩm"}`
          : o.status === "pending"
            ? `⏳ Đang xử lý đơn hàng: ${o.products?.title ?? o.lessons?.title ?? o.product_name ?? "sản phẩm"}`
            : `❌ Đơn hàng bị từ chối: ${o.products?.title ?? o.lessons?.title ?? o.product_name ?? "sản phẩm"}`,
      time: new Date(o.confirmed_at ?? o.created_at),
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  const tabs = [
    {
      key: "info",
      label: "Thông tin",
      icon: "📋",
      content: <ProfileForm meta={meta} />,
    },
    {
      key: "security",
      label: "Bảo mật",
      icon: "🔒",
      content: <SecurityPanel />,
    },
    {
      key: "courses",
      label: "Khoá học",
      icon: "🎓",
      content: (
        <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-white">Sản phẩm đã mua</h3>
          <p className="mt-1 text-xs text-white/60">Nội dung bạn đã thanh toán và được xác nhận</p>
          {confirmedOrders.length === 0 ? (
            <p className="mt-4 text-center text-sm text-white/60">
              Bạn chưa mua sản phẩm nào.{" "}
              <a href="/portal/vdai-academy" className="font-semibold text-brand-blue hover:underline">
                Xem khoá học →
              </a>
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {confirmedOrders.map((o) => {
                const title = o.products?.title ?? o.lessons?.title ?? o.product_name ?? "Sản phẩm";
                const icon = o.products?.icon ?? (o.lessons ? "📚" : "💡");
                const video = o.products?.video_url ?? o.lessons?.video_url;
                const pdf = o.products?.pdf_url ?? o.lessons?.pdf_url;
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{icon} {title}</h4>
                      <p className="mt-0.5 text-xs text-white/60">
                        Xác nhận {new Date(o.confirmed_at ?? o.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {video && (
                          <a href={video} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-brand-blue hover:border-brand-blue">
                            ▶ Video
                          </a>
                        )}
                        {pdf && (
                          <a href={pdf} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-green-400 hover:border-green-400">
                            📄 PDF
                          </a>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                      Đã sở hữu
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "notif",
      label: "Thông báo",
      icon: "🔔",
      content: <NotificationSettingsPanel />,
    },
    {
      key: "activity",
      label: "Hoạt động",
      icon: "📊",
      content: (
        <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-white">Lịch sử hoạt động</h3>
          <p className="mt-1 text-xs text-white/60">Các hoạt động gần đây trong tài khoản của bạn</p>
          <div className="mt-4 space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: a.dot }} />
                <div>
                  <p className="text-sm text-white">{a.text}</p>
                  <span className="text-xs text-white/50">{a.time.toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Tài khoản</h1>
        <p className="mt-2 text-white">Thông tin đăng nhập của bạn trên Portal.</p>
      </div>

      <div className="card-shine flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-xl font-bold text-brand-orange">
            {initial}
          </span>
          <div>
            <p className="text-sm font-bold text-white">{meta.full_name || "Học viên"}</p>
            <p className="text-xs text-white/60">{user.email}</p>
            <span className="mt-1 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">
              📅 Đăng ký từ {memberSince.toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-extrabold text-white">{confirmedOrders.length}</p>
            <p className="text-xs text-white/50">Đã mua</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold text-white">{daysSince}</p>
            <p className="text-xs text-white/50">Ngày học</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <ProfileTabs tabs={tabs} />
    </div>
  );
}
