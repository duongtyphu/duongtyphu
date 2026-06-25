"use client";

import { LessonManager } from "@/components/admin/LessonManager";
import { personalBrandSeed } from "@/data/admin/learning";

export default function PersonalBrandAdminPage() {
  return <LessonManager title="Thương hiệu cá nhân" collectionKey="personal-brand" seed={personalBrandSeed} />;
}
