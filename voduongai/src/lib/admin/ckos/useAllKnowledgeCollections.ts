"use client";

import { useCollection } from "@/lib/admin/store";
import type { KnowledgeItem, KnowledgeModuleKey } from "@/lib/admin/ckos/metadata";

type Item = KnowledgeItem & Record<string, unknown>;

/**
 * Reads all 13 CKOS collections (9 modules; Resources splits into 5
 * sibling collections) in one place — used by the CKOS Dashboard
 * (aggregate counts) and RelationshipPicker (cross-module search).
 *
 * Canonicalized in ADM-SPR-004: every collection now stores the shared
 * KnowledgeItem shape (Title/Summary/Body aliased onto whatever field name
 * Portal/Runtime already reads for that module — see metadata.ts), so this
 * hook can read all 13 uniformly through the same `useCollection()` call,
 * no more split between "canonical" and "legacy" shapes. React hooks can't
 * be called in a loop, so each collection gets one explicit call.
 */
export function useAllKnowledgeCollections() {
  const goals = useCollection<Item>("ckos-goals", []);
  const tools = useCollection<Item>("tools", []);
  const prompts = useCollection<Item>("prompts", []);
  const workflows = useCollection<Item>("ckos-workflows", []);
  const evaluations = useCollection<Item>("ckos-evaluations", []);
  const resources = useCollection<Item>("resources", []);
  const templates = useCollection<Item>("templates", []);
  const ebooks = useCollection<Item>("ebooks", []);
  const checklists = useCollection<Item>("checklists", []);
  const sop = useCollection<Item>("sop", []);
  const caseStudies = useCollection<Item>("case-study", []);
  const bestPractices = useCollection<Item>("ckos-best-practices", []);
  const faqs = useCollection<Item>("ckos-faqs", []);

  const byModule: Record<KnowledgeModuleKey, ReturnType<typeof useCollection<Item>>> = {
    goals,
    tools,
    prompts,
    workflows,
    evaluations,
    resources,
    templates,
    ebooks,
    checklists,
    sop,
    "case-studies": caseStudies,
    "best-practices": bestPractices,
    faqs,
  };

  const ready = Object.values(byModule).every((c) => c.ready);

  return { byModule, ready };
}
