import Link from "next/link";
import { notFound } from "next/navigation";
import { getLiveResources } from "@/lib/portal/live-resources";
import { LeadGate } from "@/components/portal/LeadGate";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

export async function generateStaticParams() {
  const resources = await getLiveResources();
  return resources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/portal/resources/[id]">) {
  const { id } = await params;
  const resources = await getLiveResources();
  const resource = resources.find((r) => r.id === id);
  return { title: resource?.title ?? "Tài nguyên" };
}

export default async function ResourceDetailPage({ params }: PageProps<"/portal/resources/[id]">) {
  const { id } = await params;
  const resources = await getLiveResources();
  const resource = resources.find((r) => r.id === id);
  if (!resource) notFound();

  return (
    <div className="space-y-6">
      <PortalBackLink href="/portal/resources" label="Tài nguyên miễn phí" tone="light" />

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

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Khi nào KHÔNG nên dùng</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">{resource.whenNotToUse}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/portal/workspace"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
          >
            Thực hành ở Workspace →
          </Link>
          {resource.relatedProjectHref && (
            <Link
              href={resource.relatedProjectHref}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              Dự án liên quan →
            </Link>
          )}
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
