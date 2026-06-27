import Link from "next/link";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { vdaiCourses } from "@/data/courses";
import { freeResources } from "@/data/resources";
import { affiliateResources } from "@/data/affiliate";
import { getSupabaseServer } from "@/lib/supabase-server";
import { TodayGoals } from "@/components/portal/TodayGoals";
import { GoalWidget } from "@/components/portal/GoalWidget";
import { OnboardingSummary } from "@/components/portal/OnboardingSummary";
import { SavedRecent } from "@/components/portal/SavedRecent";
import { ProgressOverview } from "@/components/portal/ProgressOverview";
import { CourseCard } from "@/components/portal/CourseCard";
import { ToolCard } from "@/components/portal/ToolCard";
import { ResourceCard } from "@/components/portal/ResourceCard";

export const metadata = { title: "Portal", description: "Portal học viên VO DUONG AI — lộ trình học, công cụ AI, tài nguyên và Affiliate Marketing.", robots: { index: false } };

const todayTasks = [
  { label: "Đọc 1 bài trong Học viện AI hoặc Affiliate", href: "/portal/ai-academy" },
  { label: "Copy 1 prompt và áp dụng ngay vào công việc", href: "/portal/prompts" },
  { label: "Xem lại bước hiện tại trong Lộ trình thành công", href: "/portal/roadmap" },
];

async function getProfileSummary() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  // A Supabase/cookie failure here must not 500 the whole dashboard —
  // fall back to the logged-out view instead.
  try {
    return await fetchProfileSummary();
  } catch {
    return null;
  }
}

async function fetchProfileSummary() {
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

async function getFeaturedTools(): Promise<AdminTool[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 4);
  }
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from("tools")
      .select("id, data")
      .eq("status", "Published")
      .order("order", { ascending: true })
      .limit(4);
    if (error || !data) return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 4);
    return data.map((row) => ({ ...(row.data as AdminTool), id: row.id }));
  } catch {
    return toolsAdminSeed.filter((t) => t.status === "Published").slice(0, 4);
  }
}

export default async function PortalDashboard() {
  const profile = await getProfileSummary();
  const featuredTools = await getFeaturedTools();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white">
          Chào mừng đến với Võ Đương AI Portal
        </h1>
        <p className="mt-2 text-white">
          Học AI, làm Affiliate và xây tài sản số — mọi thứ bạn cần đều ở đây.
        </p>
        <div className="mt-3">
          <OnboardingSummary />
        </div>
      </div>

      <GoalWidget />

      <section className="card-shine glow-blue rounded-[24px] border border-brand-blue/30 bg-brand-blue/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Lộ trình thành công</h2>
            <p className="mt-1 text-sm text-white/70">
              Chưa biết bắt đầu từ đâu? Lộ trình 7 bước sẽ chỉ đúng bước tiếp theo cho bạn.
            </p>
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
        <h2 className="text-lg font-bold text-white">Việc nên làm tiếp theo</h2>
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

      <ProgressOverview purchasedCount={profile?.purchasedCount ?? 0} />

      <TodayGoals />

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">Tiếp tục học</h2>
          <Link href="/portal/vdai-academy" className="text-sm font-semibold text-brand-blue hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {vdaiCourses.slice(0, 4).map((c) => (
            <CourseCard key={c.id} title={c.title} description={c.description} href={c.href} />
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
          {featuredTools.map((t) => (
            <ToolCard
              key={t.id}
              id={t.id}
              href={`/portal/tools/${t.slug}`}
              name={t.name}
              description={t.shortDescription}
              pricing={t.pricing}
              iUseThis={t.badge === "Tôi đang dùng"}
            />
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
            <ResourceCard key={a.id} title={a.title} description={a.description} href="/portal/affiliate-hub" />
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
            <ResourceCard key={r.id} title={r.title} type={r.type} href={`/portal/resources/${r.id}`} />
          ))}
        </div>
      </section>

      <SavedRecent />
    </div>
  );
}
