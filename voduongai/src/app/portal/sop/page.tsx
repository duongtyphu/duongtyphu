import Link from "next/link";
import { prompts } from "@/data/prompts";
import { getSupabaseServer } from "@/lib/supabase-server";
import { CompanionGuide } from "@/components/portal/CompanionGuide";
import { KnowledgeJourneyStrip } from "@/components/portal/ui/KnowledgeJourneyStrip";

export const metadata = { title: "SOP", description: "Quy trình chuẩn (SOP) vận hành Affiliate Marketing và sản xuất nội dung của VO DUONG AI." };

type LiveSop = {
  id: string;
  title: string;
  description: string;
  whenToUse: string;
  whenNotToUse: string;
  steps: string[];
  relatedPromptId?: string;
};

async function getLiveSops(): Promise<LiveSop[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("sop")
    .select("id, data")
    .eq("status", "Published")
    .order("order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => {
    const d = (row.data ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      title: String(d.name ?? ""),
      description: String(d.description ?? ""),
      whenToUse: String(d.whenToUse ?? ""),
      whenNotToUse: String(d.whenNotToUse ?? ""),
      steps: Array.isArray(d.steps) ? (d.steps as string[]) : [],
      relatedPromptId: d.relatedPromptId ? String(d.relatedPromptId) : undefined,
    };
  });
}

export default async function SopPage() {
  const sops = await getLiveSops();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">SOP — Quy trình vận hành</h1>
        <p className="mt-2 text-gray-900">
          Quy trình chuẩn hoá để bạn (và đội nhóm) làm việc nhất quán, không phụ thuộc cảm hứng.
        </p>
      </div>
      {sops.length === 0 && (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Chưa có SOP nào được đăng.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {sops.map((s) => {
          const relatedPrompt = s.relatedPromptId ? prompts.find((p) => p.id === s.relatedPromptId) : undefined;
          return (
            <div key={s.id} className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-5">
              <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-900">{s.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">Khi nào dùng</p>
              <p className="mt-1 text-sm text-gray-600">{s.whenToUse}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-600">Khi nào KHÔNG nên dùng</p>
              <p className="mt-1 text-sm text-gray-600">{s.whenNotToUse}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">Các bước</p>
              <ol className="mt-1 space-y-1.5">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="shrink-0 font-semibold text-gray-400">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {relatedPrompt && (
                <Link
                  href={`/portal/prompts/${relatedPrompt.id}`}
                  className="mt-3 block text-xs font-semibold text-brand-blue hover:underline"
                >
                  Prompt dùng trong quy trình này: {relatedPrompt.title} →
                </Link>
              )}
              <Link
                href="/portal/workspace"
                className="mt-3 block text-xs font-semibold text-gray-500 hover:text-blue-600"
              >
                Thực hành quy trình này ở Workspace →
              </Link>
            </div>
          );
        })}
      </div>

      {/* CKOS Navigation Audit — trang này trước đây không có gợi ý bước
       * tiếp theo ở cấp trang (mỗi thẻ có link riêng, nhưng cả trang thì
       * không dẫn đi đâu tiếp — dead end thật ở cấp trang). */}
      <CompanionGuide
        message="Một quy trình chỉ có giá trị khi bạn làm theo nó thật, không chỉ đọc qua. Nếu chưa chắc quy trình nào phù hợp, hỏi Companion trước khi chọn."
        action={{ label: "Hỏi Companion", href: "/portal/companion" }}
      />

      <KnowledgeJourneyStrip
        title="Chọn xong quy trình, tiếp theo là gì?"
        steps={[
          { label: "Thực hành ở Workspace", description: "Làm theo quy trình ngay trong một phiên làm việc thật.", href: "/portal/workspace" },
          { label: "Xem Prompt liên quan", description: "Nhiều quy trình đi kèm một Prompt cụ thể để bắt đầu.", href: "/portal/prompts" },
          { label: "Quay lại Hệ tri thức AI (CKOS)", description: "Xem toàn bộ 7 loại tri thức khác.", href: "/portal/ckos" },
        ]}
      />
    </div>
  );
}
