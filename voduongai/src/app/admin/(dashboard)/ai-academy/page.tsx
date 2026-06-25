"use client";

import { LessonManager } from "@/components/admin/LessonManager";
import { aiAcademySeed } from "@/data/admin/learning";

export default function AiAcademyAdminPage() {
  return <LessonManager title="Học viện AI" collectionKey="ai-academy" seed={aiAcademySeed} />;
}
