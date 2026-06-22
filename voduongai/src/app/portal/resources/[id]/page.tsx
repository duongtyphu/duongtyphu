import Link from "next/link";
import { notFound } from "next/navigation";
import { freeResources } from "@/data/resources";

export function generateStaticParams() {
  return freeResources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/portal/resources/[id]">) {
  const { id } = await params;
  const resource = freeResources.find((r) => r.id === id);
  return { title: resource?.title ?? "Resource" };
}

export default async function ResourceDetailPage({ params }: PageProps<"/portal/resources/[id]">) {
  const { id } = await params;
  const resource = freeResources.find((r) => r.id === id);
  if (!resource) notFound();

  return (
    <div className="space-y-6">
      <Link href="/portal/resources" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Free Resources
      </Link>

      <div className="rounded-2xl border border-brand-gray-200 bg-white p-8">
        <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {resource.type}
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">{resource.title}</h1>
        <p className="mt-4 leading-relaxed text-brand-gray-700">{resource.description}</p>

        <div className="mt-8">
          <button className="rounded-full gradient-surface px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
            Tải miễn phí
          </button>
        </div>
      </div>
    </div>
  );
}
