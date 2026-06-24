import Link from "next/link";
import { prompts } from "@/data/prompts";
import { getSupabaseServer } from "@/lib/supabase-server";
import { CopyPromptButton } from "@/components/portal/CopyPromptButton";

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
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư viện Prompt</h1>
        <p className="mt-2 text-white">
          Prompt thực chiến theo từng danh mục — copy và dùng ngay.
        </p>
      </div>

      {livePrompts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">
            Prompt mới từ VDAI Academy
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {livePrompts.map((p) => (
              <div key={p.id} className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                  {p.category}
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-white/70">{p.content}</p>
                <CopyPromptButton content={p.content} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Prompt mẫu</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {prompts.map((p) => (
            <Link
              key={p.id}
              href={`/portal/prompts/${p.id}`}
              className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:shadow-lg hover:shadow-black/30"
            >
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-semibold text-brand-blue">
                {p.category}
              </span>
              <h3 className="mt-3 text-sm font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-white">{p.preview}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
