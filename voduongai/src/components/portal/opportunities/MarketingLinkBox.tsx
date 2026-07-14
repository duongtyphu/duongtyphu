import { ExternalLink } from "lucide-react";
import type { EcosystemLink } from "@/data/portal/ecosystems";
import { SectionHeader } from "@/components/portal/ui/SectionHeader";

/**
 * Shared "Đường link liên kết dự án" (Marketing/Affiliate Link Box) — a
 * dedicated card listing direct links (label + url), admin-addable in the
 * future. Honestly empty today for every ecosystem/sub-project — NO
 * fabricated affiliate URL is ever seeded to fill this box.
 */
export function MarketingLinkBox({
  links,
  id = "lien-ket-tiep-thi",
  title = "Đường link liên kết dự án",
}: {
  links: EcosystemLink[];
  id?: string;
  title?: string;
}) {
  const visible = links.filter((l) => l.visible && l.url.trim()).sort((a, b) => a.order - b.order);

  return (
    <section id={id}>
      <SectionHeader eyebrow="Liên kết" title={title} />
      {visible.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-4 text-sm font-semibold text-gray-900 shadow-token-sm transition hover:border-blue-300"
            >
              {l.label}
              <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
          <p className="text-sm text-gray-500">Chưa có đường link nào ở đây, sẽ cập nhật khi có.</p>
        </div>
      )}
    </section>
  );
}
