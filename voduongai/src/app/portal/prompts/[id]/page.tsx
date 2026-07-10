import Link from "next/link";
import { notFound } from "next/navigation";
import { prompts } from "@/data/prompts";
import { LeadGate } from "@/components/portal/LeadGate";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

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
      <PortalBackLink href="/portal/prompts" label="Thư viện Prompt" tone="light" />

      <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-8">
        <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {prompt.category}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-gray-900">{prompt.title}</h1>

        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-900">
            Prompt
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
            {prompt.preview}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Khi nào nên dùng</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-900">{prompt.whenToUse}</p>
        </div>

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Khi nào KHÔNG nên dùng</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">{prompt.whenNotToUse}</p>
        </div>

        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Bước tiếp theo</p>
          <p className="mt-2 text-sm leading-relaxed text-violet-900">{prompt.nextStep}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/portal/workspace"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
          >
            Thực hành ở Workspace →
          </Link>
          {prompt.relatedProjectHref && (
            <Link
              href={prompt.relatedProjectHref}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              Dự án liên quan →
            </Link>
          )}
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
