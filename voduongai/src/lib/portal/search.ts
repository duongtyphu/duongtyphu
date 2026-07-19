import { freeResources } from "@/data/resources";
import { prompts } from "@/data/prompts";
import { sops } from "@/data/sop";
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
 * (free resources, prompts, SOP) plus
 * the Portal nav map. Templates/Checklists/Case Study are managed via
 * Supabase (admin/store collections or dedicated tables) and are loaded
 * separately at query time by `usePortalSearchExtras` (see search-extras.ts)
 * since they require a hook/fetch rather than a static import.
 */
export function getPortalSearchIndex(): PortalSearchResult[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = [
    ...portalNav.map((n) => ({
      id: `nav-${n.href}`,
      title: n.label.replace(/^[^\p{L}\p{N}]+/u, "").trim(),
      href: n.href,
      type: "Mục Học viện",
    })),
    ...freeResources.map((r) => ({
      id: `resource-${r.id}`,
      title: r.title,
      description: r.description,
      href: `/portal/resources/${r.id}`,
      type: r.type,
    })),
    ...prompts.map((p) => ({
      id: `prompt-${p.id}`,
      title: p.title,
      description: p.preview,
      href: "/portal/prompts",
      type: "Prompt",
    })),
    ...sops.map((s) => ({
      id: `sop-${s.title}`,
      title: s.title,
      description: s.description,
      href: "/portal/sop",
      type: "SOP",
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
