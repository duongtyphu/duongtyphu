import Link from "next/link";
import { notFound } from "next/navigation";
import { freeResources } from "@/data/resources";
import { LeadGate } from "@/components/portal/LeadGate";

export function generateStaticParams() {
  return freeResources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/portal/resources/[id]">) {
  const { id } = await params;
  const resource = freeResources.find((r) => r.id === id);
  return { title: resource?.title ?? "Tài nguyên" };
}

export default async function ResourceDetailPage({ params }: PageProps<"/portal/resources/[id]">) {
  const { id } = await params;
  const resource = freeResources.find((r) => r.id === id);
  if (!resource) notFound();

  return (
    <div className="space-y-6">
      <Link href="/portal/resources" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Tài nguyên miễn phí
      </Link>

      <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-8">
        <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {resource.type}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-gray-900">{resource.title}</h1>
        <p className="mt-4 leading-relaxed text-gray-900">{resource.description}</p>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Khi nào nên dùng</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-900">{resource.whenToUse}</p>
        </div>

        <div className="mt-8">
          <LeadGate
            source={`resource:${resource.id}`}
            downloadHref={`data:text/plain,${encodeURIComponent(
              `${resource.title}\n\n${resource.description}`
            )}`}
            downloadFilename={`${resource.id}.txt`}
            ctaLabel="Tải miễn phí"
          />
        </div>
      </div>
    </div>
  );
}
