"use client";

import { useEffect, useState } from "react";
import { useCollection } from "@/lib/admin/store";
import { listCaseStudies, type CaseStudy } from "@/app/admin/(dashboard)/case-study/actions";
import type { KnowledgeItem } from "@/lib/admin/ckos/metadata";

type LegacyStatusItem = { id: string; status?: string };

/**
 * Reads CKOS module data in one place — used by the CKOS Dashboard
 * (aggregate counts) and RelationshipPicker (cross-module search).
 *
 * Only the 5 modules built this sprint (Goals/Workflows/Evaluations/
 * Best Practices/FAQs) actually store the shared `KnowledgeItem` shape —
 * Tools/Prompts/Resources keep their own pre-existing, purpose-built field
 * shapes (name/pricing/content/fileUrl/etc., not title/summary/body), and
 * Case Studies keeps its own typed-table shape. Casting those to
 * `KnowledgeItem` would silently show wrong/blank titles everywhere they're
 * used, so this hook deliberately does NOT include them in the
 * KnowledgeItem-shaped collections — it only reads their `status` field
 * (which does exist with the same meaning) for the Dashboard's separate
 * legacy-modules reference row. Full relationship-linking to those 4
 * modules is out of this sprint's scope — see docs/admin/CKOS_MANAGEMENT.md.
 */
export function useAllKnowledgeCollections() {
  const goals = useCollection<KnowledgeItem>("ckos-goals", []);
  const workflows = useCollection<KnowledgeItem>("ckos-workflows", []);
  const evaluations = useCollection<KnowledgeItem>("ckos-evaluations", []);
  const bestPractices = useCollection<KnowledgeItem>("ckos-best-practices", []);
  const faqs = useCollection<KnowledgeItem>("ckos-faqs", []);

  const tools = useCollection<LegacyStatusItem>("tools", []);
  const prompts = useCollection<LegacyStatusItem>("prompts", []);
  const resources = useCollection<LegacyStatusItem>("resources", []);

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [caseStudiesReady, setCaseStudiesReady] = useState(false);

  useEffect(() => {
    // Server Action fetch-on-mount — no render-time equivalent for a remote load.
    listCaseStudies().then(({ caseStudies }) => {
      setCaseStudies(caseStudies);
      setCaseStudiesReady(true);
    });
  }, []);

  const byModule: Record<"goals" | "workflows" | "evaluations" | "best-practices" | "faqs", ReturnType<typeof useCollection<KnowledgeItem>>> = {
    goals,
    workflows,
    evaluations,
    "best-practices": bestPractices,
    faqs,
  };

  const legacyByModule: Record<"tools" | "prompts" | "resources", ReturnType<typeof useCollection<LegacyStatusItem>>> = {
    tools,
    prompts,
    resources,
  };

  const ready = Object.values(byModule).every((c) => c.ready) && Object.values(legacyByModule).every((c) => c.ready) && caseStudiesReady;

  return { byModule, legacyByModule, caseStudies, caseStudiesReady, ready };
}
