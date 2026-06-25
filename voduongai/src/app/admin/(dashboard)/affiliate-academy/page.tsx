"use client";

import { LessonManager } from "@/components/admin/LessonManager";
import { affiliateAcademySeed } from "@/data/admin/learning";

export default function AffiliateAcademyAdminPage() {
  return <LessonManager title="Học viện Affiliate" collectionKey="affiliate-academy" seed={affiliateAcademySeed} />;
}
