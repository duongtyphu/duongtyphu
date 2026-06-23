import Link from "next/link";
import { notFound } from "next/navigation";
import { prompts } from "@/data/prompts";
import { LeadGate } from "@/components/portal/LeadGate";

export function generateStaticParams() {
  return prompts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/portal/prompts/[id]">) {
  const { id } = await params;
  const prompt = prompts.find((p) => p.id === id);
  return { title: prompt?.title ?? "Prompt" };

}

export default async function PromptDetailPage({ params }: PageProps<"/portal/prompts/[id]">) {
  const { id } = await params;
  const prompt = prompts.find((p) => p.id === id);
  if (!prompt) notFound();

  return (
    <div className="space-y-6">
      <Link href="/portal/prompts" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Thư viện Prompt
      </Link>

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {prompt.category}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-white">{prompt.title}</h1>

        <div className="mt-6 rounded-xl bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-white">
            Prompt
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white">
            {prompt.preview}
          </p>
        </div>

        <div className="mt-6">
          <LeadGate
            source={`prompt:${prompt.id}`}
            downloadHref={`data:text/plain,${encodeURIComponent(prompt.preview)}`}
            downloadFilename={`${prompt.id}.txt`}
            ctaLabel="Tải prompt"
          />
        </div>
      </div>
    </div>
  );
}
