import { vdaiCourses } from "@/data/courses";
import { tools } from "@/data/tools";
import { freeResources } from "@/data/resources";
import { affiliateResources } from "@/data/affiliate";
import { prompts } from "@/data/prompts";
import { portalNav } from "@/lib/site";

export type PortalSearchResult = {
  id: string;
  title: string;
  description?: string;
  href: string;
  type: string;
};

let cachedIndex: PortalSearchResult[] | null = null;

/**
 * Client-side search index built from the statically-imported data sources
 * (courses, tools, free resources, affiliate resources, prompts) plus the
 * Portal nav map. Templates/Checklists/SOP/Case Study/etc. are managed via
 * Supabase (admin/store collections) and are not included here yet — wiring
 * them in requires either a server search endpoint or loading those
 * collections client-side. Nav links to those sections are still searchable.
 */
export function getPortalSearchIndex(): PortalSearchResult[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = [
    ...portalNav.map((n) => ({
      id: `nav-${n.href}`,
      title: n.label.replace(/^[^\p{L}\p{N}]+/u, "").trim(),
      href: n.href,
      type: "Mục Portal",
    })),
    ...vdaiCourses.map((c) => ({
      id: `course-${c.id}`,
      title: c.title,
      description: c.description,
      href: c.href,
      type: "Khoá học",
    })),
    ...tools.map((t) => ({
      id: `tool-${t.id}`,
      title: t.name,
      description: t.description,
      href: `/portal/tools/${t.id}`,
      type: "Công cụ AI",
    })),
    ...freeResources.map((r) => ({
      id: `resource-${r.id}`,
      title: r.title,
      description: r.description,
      href: `/portal/resources/${r.id}`,
      type: r.type,
    })),
    ...affiliateResources.map((a) => ({
      id: `affiliate-${a.id}`,
      title: a.title,
      description: a.description,
      href: "/portal/affiliate-hub",
      type: "Affiliate",
    })),
    ...prompts.map((p) => ({
      id: `prompt-${p.id}`,
      title: p.title,
      description: p.preview,
      href: "/portal/prompts",
      type: "Prompt",
    })),
  ];
  return cachedIndex;
}

export function searchPortal(query: string, limit = 20): PortalSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getPortalSearchIndex()
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
