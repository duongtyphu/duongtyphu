"use client";

import { useEffect, useMemo, useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { templatesSeed, checklistsSeed } from "@/data/admin/resources";
import { toolsAdminSeed, type AdminTool } from "@/data/admin/tools";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { PortalSearchResult } from "@/lib/portal/search";

type CaseStudyRow = { id: number; title: string; summary: string | null };

/**
 * Loads the search-relevant fields from Supabase/admin-managed collections
 * that can't be statically imported (Templates, Checklists, Case Study).
 * Returned alongside the static index in PortalSearch so all Portal content
 * is searchable, not just the statically-imported data sources.
 */
export function usePortalSearchExtras(): PortalSearchResult[] {
  const { items: templates } = useCollection("templates", templatesSeed);
  const { items: checklists } = useCollection("checklists", checklistsSeed);
  const { items: tools } = useCollection<AdminTool>("tools", toolsAdminSeed);
  const [caseStudies, setCaseStudies] = useState<CaseStudyRow[]>([]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    getSupabaseBrowser()
      .from("case_studies")
      .select("id, title, summary")
      .eq("active", true)
      .then(
        ({ data }) => setCaseStudies(data ?? []),
        () => setCaseStudies([]),
      );
  }, []);

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
