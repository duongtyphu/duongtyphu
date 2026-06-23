import Link from "next/link";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/portal/tools/[id]">) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  return { title: tool?.name ?? "Công cụ" };
}

export default async function ToolDetailPage({ params }: PageProps<"/portal/tools/[id]">) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) notFound();

  return (
    <div className="space-y-6">
      <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Thư viện công cụ
      </Link>

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-start justify-between">
          <div className="h-14 w-14 rounded-xl gradient-surface" />
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white">
            {tool.pricing}
          </span>
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-white">{tool.name}</h1>
        <p className="mt-1 text-sm text-white">{tool.category}</p>
        <p className="mt-4 leading-relaxed text-white">{tool.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white">
              Dùng để làm gì
            </p>
            <p className="mt-1 text-sm text-white">{tool.useCase}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white">
              Phù hợp với ai
            </p>
            <p className="mt-1 text-sm text-white">{tool.audience}</p>
          </div>
        </div>

        {tool.iUseThis && (
          <span className="mt-6 inline-flex rounded-full bg-brand-violet/10 px-3 py-1 text-xs font-semibold text-brand-violet">
            Tôi đang dùng
          </span>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={tool.affiliateUrl || tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Truy cập {tool.name}
          </a>
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-brand-violet hover:text-brand-violet"
          >
            Website chính thức
          </a>
        </div>
      </div>
    </div>
  );
}
