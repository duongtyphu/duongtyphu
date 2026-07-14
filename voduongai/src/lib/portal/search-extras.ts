"use client";

import { useMemo } from "react";
import { useCollection } from "@/lib/admin/store";
import { templatesSeed, checklistsSeed } from "@/data/admin/resources";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import type { PortalSearchResult } from "@/lib/portal/search";

type CaseStudyItem = { id: string; title: string; summary?: string; status?: string };

/**
 * STABILIZATION-SPR-1101 Task 1 — Case Study canonical source is the jsonb
 * `case_study` table (Admin CRUD, `/admin/case-study`, collectionKey
 * "case-study") — not the typed `case_studies` table this file previously
 * queried directly (a second, write-less table Admin never wrote to). Reads
 * via the same `useCollection` mechanism as Templates/Checklists/Tools above
 * instead of a raw Supabase query, so search results and case-study-page
 * content are now guaranteed to be the same data.
 *
 * Loads the search-relevant fields from Supabase/admin-managed collections
 * that can't be statically imported (Templates, Checklists, Case Study).
 * Returned alongside the static index in PortalSearch so all Portal content
 * is searchable, not just the statically-imported data sources.
 */
export function usePortalSearchExtras(): PortalSearchResult[] {
  const { items: templates } = useCollection("templates", templatesSeed);
  const { items: checklists } = useCollection("checklists", checklistsSeed);
  const { items: tools } = useCollection<AdminTool>("tools", toolsAdminSeed);
  const { items: caseStudyItems } = useCollection<CaseStudyItem>("case-study", []);
  const caseStudies = caseStudyItems.filter((c) => c.status === "Published");

  return useMemo(
    () => [
      ...templates
        .filter((t) => t.status === "Published")
        .map((t) => ({
          id: `template-${t.id}`,
          title: t.name,
          description: t.description,
          href: "/portal/templates",
          type: "Template",
        })),
      ...checklists
        .filter((c) => c.status === "Published")
        .map((c) => ({
          id: `checklist-${c.id}`,
          title: c.name,
          description: c.description,
          href: "/portal/checklists",
          type: "Checklist",
        })),
      ...caseStudies.map((c) => ({
        id: `case-study-${c.id}`,
        title: c.title,
        description: c.summary ?? undefined,
        href: "/portal/case-studies",
        type: "Case Study",
      })),
      ...tools
        .filter((t) => t.status === "Published")
        .map((t) => ({
          id: `tool-${t.id}`,
          title: t.name,
          description: t.shortDescription,
          href: `/portal/tools/${t.slug}`,
          type: "Công cụ AI",
        })),
    ],
    [templates, checklists, tools, caseStudies]
  );
}
