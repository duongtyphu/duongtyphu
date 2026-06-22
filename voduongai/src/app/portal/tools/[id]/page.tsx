import Link from "next/link";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/portal/tools/[id]">) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  return { title: tool?.name ?? "Tool" };
}

export default async function ToolDetailPage({ params }: PageProps<"/portal/tools/[id]">) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) notFound();

  return (
    <div className="space-y-6">
      <Link href="/portal/tools" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Tool Library
      </Link>

      <div className="rounded-2xl border border-brand-gray-200 bg-white p-8">
        <div className="flex items-start justify-between">
          <div className="h-14 w-14 rounded-xl gradient-surface" />
          <span className="rounded-full bg-brand-gray-50 px-3 py-1 text-xs font-semibold text-brand-gray-500">
            {tool.pricing}
          </span>
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-brand-navy">{tool.name}</h1>
        <p className="mt-1 text-sm text-brand-gray-400">{tool.category}</p>
        <p className="mt-4 leading-relaxed text-brand-gray-700">{tool.description}</p>

        <div className="mt-6 rounded-xl bg-brand-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-400">
            Use case
          </p>
          <p className="mt-1 text-sm text-brand-gray-700">{tool.useCase}</p>
        </div>

        {tool.iUseThis && (
          <span className="mt-6 inline-flex rounded-full bg-brand-violet/10 px-3 py-1 text-xs font-semibold text-brand-violet">
            I Use This
          </span>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={tool.affiliateUrl ?? tool.link}
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
            className="rounded-full border border-brand-gray-200 px-6 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-blue hover:text-brand-blue"
          >
            Website chính thức
          </a>
        </div>
      </div>
    </div>
  );
}
