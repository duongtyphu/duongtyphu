import type { LucideIcon } from "lucide-react";

/**
 * Foundation-status content block for the 9 non-Dashboard Website Workspace
 * sections (WEB-SPR-001) — richer than the generic <ComingSoon/> used for
 * entirely-unbuilt Workspaces (Brand & Media, Companion Studio, SEO,
 * Website itself before this sprint): it states exactly what the section
 * will manage, grounded in the real Portal content found in
 * docs/admin/PORTAL_COVERAGE_AUDIT.md, without offering any CRUD — Task 1
 * explicitly forbids that in this sprint.
 */
export function WorkspaceSectionFoundation({
  icon: Icon,
  title,
  scope,
  willManage,
  portalSource,
}: {
  icon: LucideIcon;
  title: string;
  scope: string;
  willManage: string[];
  /** Where this content currently lives on Portal today, per PORTAL_COVERAGE_AUDIT.md. */
  portalSource: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
              Foundation
            </span>
          </div>
          <p className="mt-1.5 text-sm text-white/60">{scope}</p>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-white/40">Sẽ quản lý (WEB-SPR-002+)</p>
            <ul className="mt-2 space-y-1.5">
              {willManage.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <p className="text-xs font-bold uppercase tracking-wide text-white/40">Hiện đang nằm ở đâu trên Portal</p>
            <p className="mt-1.5 text-sm text-white/60">{portalSource}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
