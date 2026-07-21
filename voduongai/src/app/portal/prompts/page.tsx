import { prompts } from "@/data/prompts";
import { getSupabaseServer } from "@/lib/supabase-server";
import { CopyPromptButton } from "@/components/portal/CopyPromptButton";
import { AdminPromptsSection } from "@/components/portal/AdminPromptsSection";
import { ResourceCard } from "@/components/portal/ResourceCard";
import { GemCard } from "@/components/portal/ui/GemCard";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

export const metadata = { title: "Thư viện Prompt" };

type LivePrompt = { id: number; title: string; category: string; content: string };

async function getLivePrompts(): Promise<LivePrompt[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("prompt_templates")
    .select("id, title, category, content")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function PromptsPage() {
  const livePrompts = await getLivePrompts();

  return (
    <div className="space-y-8">
      <PortalBackLink href="/portal/ckos" label="Hệ tri thức AI (CKOS)" tone="light" />
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Thư viện Prompt</h1>
        <p className="mt-2 text-gray-900">
          Prompt thực chiến theo từng danh mục — copy và dùng ngay.
        </p>
      </div>

      {livePrompts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
            Prompt mới từ VO DUONG AI Academy
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {livePrompts.map((p) => (
              <GemCard key={p.id} className="flex h-full flex-col">
                <span className="inline-flex w-fit rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                  {p.category}
                </span>
                <h3 className="gemos-card-title mt-3 text-sm font-bold text-gray-900">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{p.content}</p>
                <div className="mt-3">
                  <CopyPromptButton content={p.content} />
                </div>
              </GemCard>
            ))}
          </div>
        </div>
      )}

      <AdminPromptsSection />

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Prompt mẫu</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {prompts.map((p) => (
            <ResourceCard
              key={p.id}
              title={p.title}
              description={p.preview}
              type={p.category}
              href={`/portal/prompts/${p.id}`}
            />
          ))}
        </div>
      </div>

      {/* CKOS Navigation Audit — trang này trước đây kết thúc ngay sau
       * lưới Prompt, không có gợi ý bước tiếp theo (dead end thật). */}
      <CompanionGuide
        message="Một Prompt hay chỉ có giá trị khi dùng đúng công cụ và đúng quy trình. Nếu bạn chưa chắc dùng Prompt này với gì, xem Workflow liên quan."
        action={{ label: "Xem Workflow", href: "/portal/sop" }}
      />

      <KnowledgeJourneyStrip
        title="Có Prompt rồi, tiếp theo là gì?"
        steps={[
          { label: "Thực hành ở Workspace", description: "Dùng Prompt ngay trong một phiên làm việc thật.", href: "/portal/workspace" },
          { label: "Xem Workflow liên quan", description: "Ghép Prompt vào một quy trình lặp lại được.", href: "/portal/sop" },
          { label: "Quay lại Hệ tri thức AI (CKOS)", description: "Xem toàn bộ 7 loại tri thức khác.", href: "/portal/ckos" },
        ]}
      />
    </div>
  );
}
