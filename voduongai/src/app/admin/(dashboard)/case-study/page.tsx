"use client";

import { ContentManager } from "@/components/admin/ContentManager";
import { caseStudySeed } from "@/data/admin/content";

export default function CaseStudyAdminPage() {
  return <ContentManager title="Case Study" collectionKey="case-study" seed={caseStudySeed} />;
}
