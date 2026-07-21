import { notFound } from "next/navigation";
import { getLiveBestPractices } from "@/lib/portal/live-best-practices";
import { PortalBackLink } from "@/components/portal/ui/PortalBackLink";

// Không có generateStaticParams() ở trang này (giống /portal/hetrithucai/[slug])
// — render theo request thật, getLiveBestPractices() (getSupabasePublic())
// gọi trực tiếp ở đây an toàn.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getLiveBestPractices();
  const bp = items.find((b) => b.id === id);
  return { title: bp ? `${bp.title} — Best Practice` : "Best Practice" };
}

export default async function CkosBestPracticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = await getLiveBestPractices();
  const bp = items.find((b) => b.id === id);
  if (!bp) notFound();

  return (
    <div className="space-y-6">
      <PortalBackLink href="/portal/ckos/best-practices" label="Best Practice" tone="light" />

      <div className="card-shine rounded-2xl border border-gray-200 bg-white/[0.04] p-8">
        <h1 className="text-2xl font-extrabold text-gray-900">{bp.title}</h1>
        {bp.description && <p className="mt-3 text-sm leading-relaxed text-gray-900">{bp.description}</p>}

        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-900">Nguyên tắc / cách làm</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-900">{bp.principle}</p>
        </div>
      </div>
    </div>
  );
}
