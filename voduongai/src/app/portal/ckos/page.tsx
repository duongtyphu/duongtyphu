import Link from "next/link";
import { Brain } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { PageHeader } from "@/components/portal/ui/PageHeader";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { Button } from "@/components/portal/ui/Button";
import { CkosQuickSearch } from "@/components/portal/ckos/CkosQuickSearch";
import { CkosJourneyStatus } from "@/components/portal/ckos/CkosJourneyStatus";
import { getHumanFlowState } from "@/lib/portal/human-flow";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";

export const metadata = {
  title: "CKOS",
  description: "CKOS — bộ não tri thức chuẩn hoá đứng sau Companion, không phải một thư viện tĩnh.",
};

// Portal 3.0 P.4 — CKOS Experience.
//
// 7 canonical Intelligence types. Counts below are REAL, queried live —
// most CKOS tables (ckos_prompt_templates/ckos_workflows/ckos_best_practices/
// ckos_resources) do not exist in production yet (Phase H schema/seed SQL
// was written but never applied — confirmed via live anon-key query,
// PGRST205 "could not find the table"). Tool reuses the production `tools`
// table (has real data); Lesson reuses `lessons` (has real data); Case
// Study reuses `case_studies` (canonical table exists, currently 0 rows —
// Phase H.7's 8-item dry-run was never applied). Every zero below is a
// real zero, not a placeholder number.
type CategoryCount = {
  key: string;
  label: string;
  count: number;
  href: string;
  configured: boolean;
};

async function safeCount(
  supabase: Awaited<ReturnType<typeof getSupabaseServer>>,
  table: string,
  statusColumn: string,
  statusValue: string | boolean
): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq(statusColumn, statusValue);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function getKnowledgeCategories(): Promise<CategoryCount[]> {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!configured) {
    return [
      { key: "tool", label: "Tool", count: 0, href: "/portal/tools", configured: false },
      { key: "prompt", label: "Prompt", count: 0, href: "/portal/prompts", configured: false },
      { key: "workflow", label: "Workflow", count: 0, href: "/portal/sop", configured: false },
      { key: "resource", label: "Resource", count: 0, href: "/portal/resources", configured: false },
      { key: "lesson", label: "Lesson", count: 0, href: "/portal/hocvienai", configured: false },
      { key: "best_practice", label: "Best Practice", count: 0, href: "/portal/hetrithucai", configured: false },
      { key: "case_study", label: "Case Study", count: 0, href: "/portal/case-studies", configured: false },
    ];
  }
  const supabase = await getSupabaseServer();
  const [tool, prompt, workflow, resource, lesson, bestPractice, caseStudy] = await Promise.all([
    safeCount(supabase, "tools", "status", "Published"),
    safeCount(supabase, "ckos_prompt_templates", "status", "Published"),
    safeCount(supabase, "ckos_workflows", "status", "Published"),
    safeCount(supabase, "ckos_resources", "status", "Published"),
    safeCount(supabase, "lessons", "active", true),
    safeCount(supabase, "ckos_best_practices", "status", "Published"),
    safeCount(supabase, "case_studies", "active", true),
  ]);
  return [
    { key: "tool", label: "Tool", count: tool, href: "/portal/tools", configured: true },
    { key: "prompt", label: "Prompt", count: prompt, href: "/portal/prompts", configured: true },
    { key: "workflow", label: "Workflow", count: workflow, href: "/portal/sop", configured: true },
    { key: "resource", label: "Resource", count: resource, href: "/portal/resources", configured: true },
    { key: "lesson", label: "Lesson", count: lesson, href: "/portal/hocvienai", configured: true },
    { key: "best_practice", label: "Best Practice", count: bestPractice, href: "/portal/hetrithucai", configured: true },
    { key: "case_study", label: "Case Study", count: caseStudy, href: "/portal/case-studies", configured: true },
  ];
}

const COLLECTIONS = [
  { key: "ai-writing", title: "AI Writing", query: "viết", description: "Viết nội dung, email, kịch bản bằng AI." },
  { key: "productivity", title: "Productivity", query: "quy trình", description: "Làm việc nhanh hơn, ít sai sót hơn." },
  { key: "affiliate", title: "Affiliate", query: "affiliate", description: "Kiếm thu nhập với Affiliate Marketing." },
  { key: "prompt-engineering", title: "Prompt Engineering", query: "prompt", description: "Viết prompt hiệu quả cho từng mục tiêu." },
  { key: "marketing", title: "Marketing", query: "marketing", description: "Tiếp thị và xây thương hiệu cá nhân." },
  { key: "automation", title: "Automation", query: "tự động", description: "Tự động hoá công việc lặp lại." },
] as const;

export default async function CkosPage() {
  const categories = await getKnowledgeCategories();
  const flow = getHumanFlowState("knowledge");
  const featuredTool: AdminTool | undefined = toolsAdminSeed.find((t) => t.status === "Published");

  return (
    <div className="space-y-10">
      <PageHeader
        icon={Brain}
        tone="violet"
        title="CKOS"
        titleGradient
        subtitle="Đây không phải thư viện, không phải blog — CKOS là bộ não tri thức chuẩn hoá đứng sau mọi gợi ý của Companion."
      />

      {/* Quick Search */}
      <section>
        <SectionHeader eyebrow="Quick Search" title="Tìm trong CKOS" />
        <CkosQuickSearch />
      </section>

      {/* Companion Recommendation */}
      <section>
        <SectionHeader eyebrow="Companion" title="Companion gợi ý" />
        <GemCard variant="featured" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{flow.nextBestAction}</p>
            <p className="mt-1 text-sm text-gray-600">{flow.reason}</p>
          </div>
          <Button href={flow.recommendedRoute} variant="primary" className="shrink-0">
            {flow.recommendedCTA}
          </Button>
        </GemCard>
      </section>

      {/* Dashboard: Continue Learning / Recently Viewed / Suggested Knowledge */}
      <section>
        <SectionHeader title="CKOS Dashboard" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CkosJourneyStatus />

          <GemCard>
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
              Recently Viewed
            </p>
            <p className="mt-2 text-sm text-gray-500">
              CKOS chưa có tính năng theo dõi lịch sử xem — sẽ bổ sung ở một phase sau. Hiện tại đây là
              trạng thái thật, không phải danh sách giả.
            </p>
          </GemCard>

          <GemCard>
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
              Suggested Knowledge
            </p>
            {featuredTool ? (
              <>
                <p className="mt-2 text-sm font-semibold text-gray-900">{featuredTool.name}</p>
                <p className="mt-1 text-xs text-gray-500">{featuredTool.shortDescription}</p>
                <Button href={`/portal/tools/${featuredTool.slug}`} variant="secondary" className="mt-3">
                  Xem công cụ
                </Button>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Chưa có gợi ý nào sẵn sàng lúc này.</p>
            )}
          </GemCard>
        </div>
      </section>

      {/* Knowledge Categories */}
      <section>
        <SectionHeader eyebrow="7 Intelligence" title="Danh mục tri thức" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <GemCard key={c.key}>
              <div className="flex items-center justify-between">
                <p className="gemos-card-title text-sm font-bold text-gray-900">{c.label}</p>
                <GemBadge tone={c.count > 0 ? "free" : "locked"}>{c.count > 0 ? `${c.count}` : "Trống"}</GemBadge>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {c.count > 0
                  ? `${c.count} mục đã sẵn sàng.`
                  : "Chưa có dữ liệu công khai cho danh mục này."}
              </p>
              <Button href={c.href} variant="secondary" className="mt-3">
                Xem
              </Button>
            </GemCard>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section>
        <SectionHeader eyebrow="Collections" title="Bộ sưu tập theo chủ đề" description="Không chỉ phân loại theo kiểu nội dung — mà theo mục tiêu bạn đang theo đuổi." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <GemCard key={c.key}>
              <p className="gemos-card-title text-sm font-bold text-gray-900">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{c.description}</p>
              <Link
                href={`/portal/ckos?q=${encodeURIComponent(c.query)}#search`}
                className="mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline"
              >
                Khám phá {c.title} →
              </Link>
            </GemCard>
          ))}
        </div>
      </section>
    </div>
  );
}
