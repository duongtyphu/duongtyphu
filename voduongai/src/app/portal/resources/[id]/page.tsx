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

      <div className="card-shine rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {resource.type}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-white">{resource.title}</h1>
        <p className="mt-4 leading-relaxed text-white/70">{resource.description}</p>

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
