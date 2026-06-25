import Link from "next/link";
import type { DigitalAssetProject } from "@/data/digitalAssets";
import { digitalAssetCategories, digitalAssetLinks } from "@/data/digitalAssets";

const BADGE_TONE: Record<DigitalAssetProject["badge"], string> = {
  "Đang theo dõi": "bg-white/10 text-white/70",
  "Đang tham gia": "bg-brand-blue/10 text-brand-blue",
  "Đề xuất": "bg-brand-violet/10 text-brand-violet",
  Mới: "bg-brand-orange/10 text-brand-orange",
};

export function DigitalAssetProjectCard({ project }: { project: DigitalAssetProject }) {
  const category = digitalAssetCategories.find((c) => c.key === project.category);
  const linkCount = digitalAssetLinks.filter((l) => l.projectId === project.id && l.status === "Active").length;
  const primaryLink = digitalAssetLinks
    .filter((l) => l.projectId === project.id && l.status === "Active")
    .sort((a, b) => a.order - b.order)[0];

  return (
    <div className="card-shine flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-lg">{project.logo}</div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${BADGE_TONE[project.badge]}`}>
          {project.badge}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold text-white">{project.name}</h3>
      <p className="mt-0.5 text-xs text-white/40">{category?.name}</p>
      <p className="mt-2 line-clamp-3 text-sm text-white/70">{project.shortDescription}</p>
      <p className="mt-3 text-[11px] text-white/40">{linkCount} link liên quan</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link href={`/portal/digital-assets/${project.slug}`} className="text-xs font-semibold text-brand-blue hover:underline">
          Xem chi tiết →
        </Link>
        {primaryLink && (
          <a
            href={primaryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white/60 hover:text-white"
          >
            Truy cập dự án ↗
          </a>
        )}
      </div>
    </div>
  );
}
