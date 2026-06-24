import Link from "next/link";
import { tools } from "@/data/tools";
import { vdaiCourses } from "@/data/courses";
import { freeResources } from "@/data/resources";
import { affiliateResources } from "@/data/affiliate";
import { logoUrl } from "@/lib/logo";
import { getSupabaseServer } from "@/lib/supabase-server";
import { ProfileQuickMenu } from "@/components/portal/ProfileQuickMenu";
import { TodayGoals } from "@/components/portal/TodayGoals";
import { GoalWidget } from "@/components/portal/GoalWidget";
import { SavedRecent } from "@/components/portal/SavedRecent";

export const metadata = { title: "Portal" };

const todayTasks = [
  { label: "Đọc 1 bài trong Học viện AI hoặc Affiliate", href: "/portal/ai-academy" },
  { label: "Copy 1 prompt và áp dụng ngay vào công việc", href: "/portal/prompts" },
  { label: "Xem lại bước hiện tại trong Lộ trình thành công", href: "/portal/roadmap" },
];

async function getProfileSummary() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user?.email) return null;

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("member_email", user.email)
    .eq("status", "confirmed");

  return {
    email: user.email,
    fullName: user.user_metadata?.full_name as string | undefined,
    memberSince: new Date(user.created_at),
    purchasedCount: count ?? 0,
  };
}

export default async function PortalDashboard() {
  const profile = await getProfileSummary();

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Chào mừng đến với Võ Đương AI Portal
          </h1>
          <p className="mt-2 text-white">
            Học AI, làm Affiliate và xây tài sản số — mọi thứ bạn cần đều ở đây.
          </p>
        </div>

        {profile && (
          <ProfileQuickMenu
            email={profile.email}
            fullName={profile.fullName}
            memberSince={profile.memberSince.toLocaleDateString("vi-VN")}
            purchasedCount={profile.purchasedCount}
          />
        )}
      </div>

      <TodayGoals />

      <GoalWidget />

      <section className="card-shine glow-blue rounded-[24px] border border-brand-blue/30 bg-brand-blue/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Tiến độ lộ trình</h2>
            <p className="mt-1 text-sm text-white/70">
              Chưa biết bắt đầu từ đâu? Lộ trình 7 bước sẽ chỉ đúng bước tiếp theo cho bạn.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-brand-blue to-brand-violet" />
              </div>
              <span className="text-xs font-semibold text-white/60">Bước 2/7 · minh hoạ</span>
            </div>
          </div>
          <Link
            href="/portal/roadmap"
            className="shrink-0 rounded-full bg-brand-blue px-5 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            Xem lộ trình của tôi →
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Nhiệm vụ hôm nay</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
            🔥 Streak 1 ngày · minh hoạ
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {todayTasks.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Tiếp tục học</h2>
          <Link href="/portal/vdai-academy" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vdaiCourses.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={c.href}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
            >
              <p className="text-sm font-semibold text-white">{c.title}</p>
              <p className="mt-1 text-xs text-white">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Công cụ nổi bật</h2>
          <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tools.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 p-1.5">
                  <img
                    src={logoUrl(t.id)}
                    alt={`${t.name} logo`}
                    width={20}
                    height={20}
                    className="h-full w-full object-contain"
                  />
                </div>
                {t.iUseThis ? (
                  <span className="rounded-full bg-brand-violet/10 px-2 py-0.5 text-[10px] font-semibold text-brand-violet">
                    Tôi đang dùng
                  </span>
                ) : (
                  <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">
                    Recommended
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{t.name}</p>
              <p className="mt-1 text-xs text-white/60">{t.description}</p>
              <Link
                href={`/portal/tools/${t.id}`}
                className="mt-3 inline-flex text-xs font-semibold text-brand-blue hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Đề xuất hôm nay — Affiliate</h2>
          <Link href="/portal/affiliate-hub" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {affiliateResources.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href="/portal/affiliate-hub"
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
            >
              <p className="text-sm font-semibold text-white">{a.title}</p>
              <p className="mt-1 text-xs text-white">{a.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Tài nguyên mới nhất</h2>
          <Link href="/portal/resources" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {freeResources.slice(0, 3).map((r) => (
            <Link
              key={r.id}
              href={`/portal/resources/${r.id}`}
              className="card-shine rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition hover:shadow-lg hover:shadow-black/30"
            >
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {r.type}
              </span>
              <p className="mt-2 text-sm font-semibold text-white">{r.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <SavedRecent />
    </div>
  );
}
