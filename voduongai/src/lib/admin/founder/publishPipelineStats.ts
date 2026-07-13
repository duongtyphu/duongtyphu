"use client";

import { useCollection } from "@/lib/admin/store";
import { useAllKnowledgeCollections } from "@/lib/admin/ckos/useAllKnowledgeCollections";
import { KNOWLEDGE_MODULES } from "@/lib/admin/ckos/metadata";
import { WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED, type WebsitePage } from "@/lib/admin/website/pageRegistry";
import { SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED, type SharedSection } from "@/lib/admin/website/sharedSectionRegistry";

export type PublishTrackedItem = {
  id: string;
  title: string;
  status: string;
  updatedDate: string;
  sourceLabel: string;
  workspace: string;
};

/**
 * Publish Pipeline aggregation (FOUNDER-SPR-1001 Task 2/3) — 15 collection
 * THẬT trong toàn Admin CMS có khái niệm Draft→Review→Published→Archived
 * (13 CKOS collection dùng KNOWLEDGE_STATUSES 6-state; Website Pages +
 * Shared Sections dùng PAGE_LIFECYCLE_STATUSES/SECTION_STATUSES 5-state).
 *
 * ĐÍNH CHÍNH quan trọng: đây KHÔNG phải toàn bộ Admin. Mọi collection khác
 * (Brand Studio, Media Center, Academy, Premium, Projects & Opportunities,
 * Community, Journey, Companion, Portal Management Area/Page/Section/
 * Content) chỉ dùng trạng thái nhị phân Active/Inactive (hoặc 4-state
 * Draft/Active/Inactive/Archived cho Portal Management — không có khái
 * niệm "Review") — không có pipeline Publish thật để gộp vào đây. Không
 * suy diễn/ép các collection đó vào 4 giai đoạn brief yêu cầu.
 */
export function usePublishPipelineStats() {
  const { byModule, ready: ckosReady } = useAllKnowledgeCollections();
  const pages = useCollection<WebsitePage>(WEBSITE_PAGES_COLLECTION_KEY, WEBSITE_PAGES_SEED);
  const sections = useCollection<SharedSection>(SHARED_SECTIONS_COLLECTION_KEY, SHARED_SECTIONS_SEED);

  const ready = ckosReady && pages.ready && sections.ready;

  const items: PublishTrackedItem[] = [
    ...Object.entries(byModule).flatMap(([key, col]) => {
      const mod = KNOWLEDGE_MODULES.find((m) => m.key === key);
      return col.items.map((it) => ({
        id: `ckos-${key}-${it.id}`,
        title: it.title,
        status: it.status,
        updatedDate: it.updatedDate,
        sourceLabel: `CKOS · ${mod?.label ?? key}`,
        workspace: "CKOS",
      }));
    }),
    ...pages.items.map((p) => ({
      id: `page-${p.id}`,
      title: p.title,
      status: p.status,
      updatedDate: p.updatedDate,
      sourceLabel: "Website · Pages",
      workspace: "Website",
    })),
    ...sections.items.map((s) => ({
      id: `section-${s.id}`,
      title: s.title,
      status: s.status,
      updatedDate: s.updatedDate,
      sourceLabel: "Website · Shared Sections",
      workspace: "Website",
    })),
  ];

  return { items, ready, trackedCollectionCount: Object.keys(byModule).length + 2 };
}
