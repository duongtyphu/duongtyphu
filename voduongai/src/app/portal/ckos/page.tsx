import Link from "next/link";
import { Brain, Search, GraduationCap, Rocket, ArrowRight } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { GemBadge } from "@/components/portal/ui/GemBadge";
import { Button } from "@/components/portal/ui/Button";
import { CkosQuickSearch } from "@/components/portal/ckos/CkosQuickSearch";
import { JourneyStatusCard } from "@/components/portal/ui/JourneyStatusCard";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { ExperienceFlow } from "@/components/portal/ui/ExperienceFlow";
import { CompanionMemoryLine } from "@/components/portal/companion/CompanionMemoryLine";
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
  const featuredTool: AdminTool | undefined = toolsAdminSeed.find((t) => t.status === "Published");

  return (
    <div className="space-y-10">
      <PillarHero
        icon={Brain}
        tone="knowledge"
        eyebrow="CKOS — Nơi tri thức được kết nối"
        title="Mọi thứ bạn biết, nối lại thành một hệ thống"
        subtitle="Một Prompt hay không có giá trị nếu bạn không biết dùng nó với công cụ nào, theo quy trình nào, để đạt kết quả gì. CKOS tồn tại để làm đúng một việc: khi bạn tìm một mảnh tri thức, nó chỉ ra ngay những mảnh khác cần đi cùng — rồi Companion giúp bạn ráp chúng lại thành hành động."
        quickActions={[
          { label: "Tìm trong CKOS", href: "/portal/ckos#search" },
          { label: "Xem Công cụ AI", href: "/portal/tools" },
        ]}
      />

      <ExperienceFlow
        stages={[
          { icon: Search, label: "Khám phá", description: "Tìm đúng Tool/Prompt/Workflow bạn cần." },
          { icon: GraduationCap, label: "Học", description: "Hiểu cách dùng thông qua Academy." },
          { icon: Rocket, label: "Áp dụng", description: "Mang vào Workspace hoặc một dự án thật." },
          { icon: ArrowRight, label: "Tiếp tục", description: "Companion gợi ý bước kế tiếp." },
        ]}
      />

      {/* Quick Search */}
      <section id="search">
        <SectionHeader eyebrow="Quick Search" title="Tìm trong CKOS" />
        <CkosQuickSearch />
      </section>

      {/* Portal 4.0 Content Creation — CKOS trước đây chỉ liệt kê 7 loại tri
       * thức mà không giải thích khác nhau ra sao hay nên bắt đầu từ đâu.
       * Đây là nội dung giáo dục thật (không phải tổ chức lại dữ liệu). */}
      <section>
        <SectionHeader
          eyebrow="Mới bắt đầu?"
          title="7 loại tri thức khác nhau ra sao"
          description="Mỗi loại trả lời một câu hỏi khác nhau — biết câu hỏi nào cần trả lời sẽ giúp bạn tìm đúng thứ nhanh hơn."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Tool", q: "Tôi nên dùng công cụ gì?" },
            { label: "Prompt", q: "Tôi nên yêu cầu AI thế nào?" },
            { label: "Workflow", q: "Các bước cần làm theo thứ tự nào?" },
            { label: "Resource", q: "Tôi cần đọc/xem thêm tài liệu gì?" },
            { label: "Lesson", q: "Tôi cần hiểu khái niệm nào trước?" },
            { label: "Best Practice", q: "Người khác đã làm đúng cách như thế nào?" },
            { label: "Case Study", q: "Việc này thực tế đã tạo ra kết quả gì?" },
          ].map((item) => (
            <GemCard key={item.label}>
              <p className="gemos-card-title text-sm font-bold text-gray-900">{item.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{item.q}</p>
            </GemCard>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Chưa biết bắt đầu từ đâu? Nếu bạn mới, hãy xem <span className="font-semibold text-gray-900">Tool</span> trước
          — nó cụ thể và dễ dùng ngay. Nếu bạn đã có công cụ nhưng chưa biết dùng hiệu quả, xem{" "}
          <span className="font-semibold text-gray-900">Prompt</span> và <span className="font-semibold text-gray-900">Workflow</span> tiếp theo.
        </p>
      </section>

      {/* Portal 4.0 Phase 2 — Companion Presence: giọng "tò mò", riêng cho
       * CKOS. Trước đây khối này lặp lại y hệt flow.nextBestAction/reason đã
       * hiển thị ở Home (cùng engine, cùng câu chữ) — xoá lặp, thay bằng 1
       * câu Companion đúng ngữ cảnh "đang khám phá tri thức", không phải gợi
       * ý hành động trong ngày (đó là việc của Home). */}
      <CompanionMemoryLine
        emptyMessage="Companion chưa biết bạn đã xem qua phần nào trong CKOS — cứ khám phá tự do, mỗi lần tìm một Tool hay Prompt, thử nhìn thêm phần 'Tri thức liên quan' bên dưới."
        contextTemplate="Lần gần nhất bạn ở đây, bạn đã {activity}. Thử tìm một mảnh tri thức liên quan đến việc đó xem sao."
        action={{ label: "Tìm trong CKOS", href: "/portal/ckos#search" }}
      />

      {/* Dashboard: Continue Learning / Recently Viewed / Suggested Knowledge */}
      <section>
        <SectionHeader eyebrow="Ngay bây giờ" title="Bạn đang ở đâu trong hành trình tri thức" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <JourneyStatusCard
            eyebrow="Continue Learning"
            emptyMessage="Bạn chưa có hành trình học nào đang dang dở trong CKOS — bắt đầu từ Học viện AI."
            ctaLabel="Tiếp tục học"
            ctaHref="/portal/hocvienai"
          />

          <GemCard>
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
              Vừa xem gần đây
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Companion chưa nhớ được bạn vừa xem gì — tính năng ghi nhớ lịch sử sẽ tới trong một bản cập
              nhật sau. Cho tới lúc đó, dùng ô tìm kiếm phía trên mỗi khi muốn quay lại thứ vừa đọc.
            </p>
          </GemCard>

          <GemCard>
            <p className="gemos-card-title text-xs font-bold uppercase tracking-widest text-gray-400">
              Companion chọn cho bạn
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

      <KnowledgeJourneyStrip
        title="Tri thức không dừng ở việc đọc"
        steps={[
          { label: "Học có hệ thống", description: "Đưa tri thức vào một hành trình học thật ở Academy.", href: "/portal/hocvienai" },
          { label: "Áp dụng vào dự án", description: "Xem cơ hội và dự án bạn có thể áp dụng tri thức này.", href: "/portal/duan-cohoi" },
          { label: "Hỏi Companion", description: "Nhờ Companion gợi ý nên bắt đầu từ đâu.", href: "/portal/companion" },
        ]}
      />
    </div>
  );
}
