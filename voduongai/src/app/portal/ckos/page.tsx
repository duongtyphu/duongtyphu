import Link from "next/link";
import { Brain, Search, GraduationCap, Rocket, ArrowRight } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase-server";
import { PillarHero } from "@/components/portal/ui/PillarHero";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";
import { GemCard } from "@/components/portal/ui/GemCard";
import { Button } from "@/components/portal/ui/Button";
import { CkosQuickSearch } from "@/components/portal/ckos/CkosQuickSearch";
import { JourneyStatusCard } from "@/components/portal/ui/JourneyStatusCard";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { ExperienceFlow } from "@/components/portal/ui/ExperienceFlow";
import { CompanionMemoryLine } from "@/components/portal/companion/CompanionMemoryLine";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { getAllKnowledgeSeeds, getAllKnowledgeCollections } from "@/features/knowledge";
import { prompts } from "@/data/prompts";
import { sops } from "@/data/sop";
import { freeResources } from "@/data/resources";

export const metadata = {
  title: "Hệ tri thức AI (CKOS)",
  description: "Hệ tri thức AI (CKOS) — bộ não tri thức chuẩn hoá đứng sau Companion, không phải một thư viện tĩnh.",
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
  /** false = chưa có route thật để "Xem" (vd. Best Practice) — hiển thị lý do trung thực thay vì nút dẫn tới nội dung mượn tạm. */
  hasRoute: boolean;
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

/**
 * Portal 4.0 CKOS Reconstruction — theo CKOS_KNOWLEDGE_OBJECT_ARCHITECTURE.md:
 * Lesson canonical = features/knowledge (11 seed thật), KHÔNG phải bảng
 * Supabase `lessons` (nguồn khác, không thuộc hợp đồng CKOS đã đóng băng).
 * Prompt/Workflow/Resource cộng cả nội dung biên tập thật (src/data/*.ts)
 * với bảng live (nếu có) — trước đây hub chỉ đếm bảng Supabase rỗng, nên
 * hiển thị "Trống" cho cả Prompt dù thực tế đã có 12 Prompt thật. Best
 * Practice KHÔNG có route thật (bảng chưa triển khai) — không mượn route
 * Lesson để trông có nội dung.
 */
async function getKnowledgeCategories(): Promise<CategoryCount[]> {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const lessonCount = getAllKnowledgeSeeds().length;
  const promptCount = prompts.length;
  const workflowCount = sops.length;
  const resourceCount = freeResources.length;

  if (!configured) {
    return [
      { key: "tool", label: "Công cụ AI", count: 0, href: "/portal/tools", configured: false, hasRoute: true },
      { key: "prompt", label: "Prompt", count: promptCount, href: "/portal/prompts", configured: false, hasRoute: true },
      { key: "workflow", label: "Workflow", count: workflowCount, href: "/portal/sop", configured: false, hasRoute: true },
      { key: "resource", label: "Resource", count: resourceCount, href: "/portal/resources", configured: false, hasRoute: true },
      { key: "lesson", label: "Lesson", count: lessonCount, href: "/portal/hetrithucai", configured: false, hasRoute: true },
      { key: "best_practice", label: "Best Practice", count: 0, href: "", configured: false, hasRoute: false },
      { key: "case_study", label: "Case Study", count: 0, href: "/portal/case-studies", configured: false, hasRoute: true },
    ];
  }
  const supabase = await getSupabaseServer();
  const [tool, liveBestPractice, caseStudy] = await Promise.all([
    safeCount(supabase, "tools", "status", "Published"),
    safeCount(supabase, "ckos_best_practices", "status", "Published"),
    safeCount(supabase, "case_studies", "active", true),
  ]);
  return [
    { key: "tool", label: "Công cụ AI", count: tool, href: "/portal/tools", configured: true, hasRoute: true },
    { key: "prompt", label: "Prompt", count: promptCount, href: "/portal/prompts", configured: true, hasRoute: true },
    { key: "workflow", label: "Workflow", count: workflowCount, href: "/portal/sop", configured: true, hasRoute: true },
    { key: "resource", label: "Resource", count: resourceCount, href: "/portal/resources", configured: true, hasRoute: true },
    { key: "lesson", label: "Lesson", count: lessonCount, href: "/portal/hetrithucai", configured: true, hasRoute: true },
    { key: "best_practice", label: "Best Practice", count: liveBestPractice, href: "", configured: true, hasRoute: false },
    { key: "case_study", label: "Case Study", count: caseStudy, href: "/portal/case-studies", configured: true, hasRoute: true },
  ];
}

/**
 * Card Redesign — mỗi loại tri thức một "chất cảm" riêng, theo đúng gợi ý:
 * Tool = thực dụng, Prompt = sáng tạo, Workflow = hệ thống, Lesson = giáo
 * dục, Resource = hỗ trợ, Case Study = bằng chứng, Best Practice = kinh
 * nghiệm chắt lọc. Không đổi ý nghĩa dữ liệu — chỉ đổi cách "cảm" của thẻ.
 */
const CATEGORY_SURFACE: Record<string, { card: string; badge: string; feel: string }> = {
  tool: {
    card: "border-slate-200 bg-white",
    badge: "bg-slate-100 text-slate-700",
    feel: "Thực dụng",
  },
  prompt: {
    card: "border-violet-100 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.14)_1px,transparent_0)] bg-[length:12px_12px]",
    badge: "bg-violet-100 text-violet-700",
    feel: "Sáng tạo",
  },
  workflow: {
    card: "border-blue-100 bg-[linear-gradient(rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[length:16px_16px]",
    badge: "bg-blue-100 text-blue-700",
    feel: "Hệ thống",
  },
  resource: {
    card: "border-emerald-100 bg-emerald-50/40",
    badge: "bg-emerald-100 text-emerald-700",
    feel: "Hỗ trợ",
  },
  lesson: {
    card: "rounded-[1.5rem] border-teal-100 bg-teal-50/30",
    badge: "bg-teal-100 text-teal-700",
    feel: "Giáo dục",
  },
  best_practice: {
    card: "border-gray-200 bg-gray-50/60",
    badge: "bg-gray-200 text-gray-600",
    feel: "Kinh nghiệm chắt lọc",
  },
  case_study: {
    card: "border-2 border-amber-300 bg-amber-50/50",
    badge: "bg-amber-200 text-amber-800",
    feel: "Bằng chứng thực tế",
  },
};

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
        eyebrow="Hệ tri thức AI (CKOS)"
        title="Mọi thứ bạn biết, nối lại thành một hệ thống"
        subtitle="Một Prompt hay không có giá trị nếu bạn không biết dùng nó với công cụ nào, theo quy trình nào, để đạt kết quả gì. CKOS tồn tại để làm đúng một việc: khi bạn tìm một mảnh tri thức, nó chỉ ra ngay những mảnh khác cần đi cùng — rồi Companion giúp bạn ráp chúng lại thành hành động."
        quickActions={[
          { label: "Tìm trong CKOS", href: "/portal/ckos#danh-muc-tri-thuc" },
          { label: "Vào Thư viện AI", href: "/portal/ckos#thu-vien-ai" },
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
            { label: "Công cụ AI", q: "Tôi nên dùng công cụ gì?" },
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
          Chưa biết bắt đầu từ đâu? Nếu bạn mới, hãy xem <span className="font-semibold text-gray-900">Công cụ AI</span> trước
          — nó cụ thể và dễ dùng ngay. Nếu bạn đã có công cụ nhưng chưa biết dùng hiệu quả, xem{" "}
          <span className="font-semibold text-gray-900">Prompt</span> và <span className="font-semibold text-gray-900">Workflow</span> tiếp theo.
        </p>

        {/* Phase 4 — Guided Learning: hướng dẫn theo trình độ + theo tình
         * huống dùng, không chỉ mô tả mỗi loại là gì. */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Người mới nên bắt đầu từ</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-900">Tool → Lesson.</span> Dùng thử một công cụ cụ
              thể trước, sau đó xem Lesson liên quan để hiểu vì sao nó hoạt động như vậy. Đừng bắt đầu từ
              Workflow hay Best Practice khi bạn chưa từng dùng công cụ nào — sẽ khó hình dung.
            </p>
          </GemCard>
          <GemCard>
            <p className="gemos-card-title text-sm font-bold text-gray-900">Người đã có kinh nghiệm nên dùng</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-900">Workflow → Best Practice → Case Study.</span> Bạn
              đã biết công cụ, giờ cần quy trình lặp lại được, đối chiếu với cách người khác đã làm đúng, và
              xem kết quả thực tế trước khi áp dụng vào việc lớn hơn.
            </p>
          </GemCard>
        </div>
      </section>

      {/* Companion trong CKOS = Knowledge Guide, không phải chatbot/search
       * engine — luôn gợi ý ĐÚNG MỘT bước nhỏ nhất có giá trị, không bao
       * giờ nói "hãy đọc hết mọi thứ". Giọng tò mò riêng cho CKOS, không
       * lặp lại câu chữ đã dùng ở Home (cùng engine dữ liệu, khác câu). */}
      <CompanionMemoryLine
        emptyMessage="Companion sẽ không bảo bạn đọc hết CKOS — cứ chọn một Tool bất kỳ để thử trước, đó luôn là bước nhỏ nhất đáng làm khi chưa biết bắt đầu từ đâu."
        contextTemplate="Lần gần nhất bạn ở đây, bạn đã {activity}. Bước nhỏ nhất đáng làm tiếp theo: tìm một mảnh tri thức liên quan đến việc đó — không cần đọc thêm gì khác."
        action={{ label: "Tìm trong CKOS", href: "/portal/ckos#search" }}
      />

      {/* Trung tâm điều khiển tri thức — không phải dashboard số liệu, chỉ
       * trả lời đúng 3 câu: bạn đang dở gì, gần đây đã xem gì (trung thực
       * nếu chưa có), và Companion chọn gì cho bạn hôm nay. */}
      <section>
        <SectionHeader eyebrow="Trung tâm điều khiển" title="Bạn đang ở đâu trong hành trình tri thức" />
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

      {/* Knowledge Categories — mỗi loại một "chất cảm" riêng (Card Redesign):
       * Công cụ AI = thực dụng (phẳng, gọn); Prompt = sáng tạo (nền chấm nhẹ);
       * Workflow = hệ thống (lưới kẻ); Lesson = giáo dục (bo tròn, dịu); Resource
       * = hỗ trợ (nền mềm); Case Study = bằng chứng (viền đậm, số liệu nổi);
       * Best Practice = kinh nghiệm chắt lọc (trung tính, trung thực). Người
       * dùng nhận ra LOẠI trước khi đọc chữ, không còn 7 thẻ giống hệt nhau. */}
      <section id="danh-muc-tri-thuc">
        <SectionHeader eyebrow="7 Intelligence" title="Danh mục tri thức" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const surface = CATEGORY_SURFACE[c.key] ?? CATEGORY_SURFACE.tool;
            return (
              <div key={c.key} className={`rounded-2xl border p-5 shadow-sm ${surface.card}`}>
                <div className="flex items-center justify-between">
                  <p className="gemos-card-title text-sm font-bold text-gray-900">{c.label}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${surface.badge}`}>
                    {c.count > 0 ? c.count : "Trống"}
                  </span>
                </div>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">{surface.feel}</p>
                {c.hasRoute ? (
                  <>
                    <p className="mt-2 text-xs text-gray-500">
                      {c.count > 0
                        ? `${c.count} mục đã sẵn sàng.`
                        : "Chưa có dữ liệu công khai cho danh mục này."}
                    </p>
                    <Button href={c.href} variant="secondary" className="mt-3">
                      Xem
                    </Button>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">
                    Chưa có nội dung Best Practice thật nào — hệ thống lưu trữ riêng cho loại tri thức này
                    chưa được triển khai. Trong lúc chờ, cách gần nhất là xem Case Study (kết quả thực tế) hoặc
                    hỏi Companion cách người khác đã làm đúng.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Gộp trang — "Thư viện AI" (trước đây là trang /portal/hetrithucai
       * độc lập tên "Hệ tri thức AI") giờ là MỘT MỤC CON của trang mẹ này,
       * trình bày như lối vào một thư viện thật — không phải một link
       * "Xem" chung chung nữa. Nội dung bên dưới (2 Bộ sưu tập, số Lesson
       * thật) là xem trước thật của kệ sách bên trong, không phải trang trí. */}
      <section id="thu-vien-ai">
        <div className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">📚 Mục con của Hệ tri thức AI (CKOS)</p>
          <h3 className="mt-2 text-xl font-extrabold text-gray-900">Thư viện AI</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            Cùng một hệ thống, một góc riêng — Thư viện AI là nơi các Lesson được xếp lên &ldquo;kệ&rdquo;
            theo từng Bộ sưu tập, có thứ tự đọc rõ ràng như một cuốn sách thật. Nếu bạn chưa biết nên bắt
            đầu từ Lesson nào, Companion trong Thư viện AI sẽ giúp bạn tìm đúng &ldquo;cuốn sách&rdquo; cần đọc.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {getAllKnowledgeCollections().map((collection) => (
              <div key={collection.slug} className="rounded-xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                <p className="gemos-card-title text-sm font-bold text-gray-900">{collection.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{collection.description}</p>
                <p className="mt-2 text-xs text-gray-400">{collection.seedSlugs.length} Lesson trên kệ này.</p>
                <Link
                  href={`/portal/hetrithucai/collection/${collection.slug}`}
                  className="mt-3 inline-block text-xs font-semibold text-brand-blue hover:underline"
                >
                  Xem kệ sách này →
                </Link>
              </div>
            ))}
          </div>

          <Button href="/portal/hetrithucai" variant="primary" className="mt-6">
            Vào Thư viện AI →
          </Button>
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
