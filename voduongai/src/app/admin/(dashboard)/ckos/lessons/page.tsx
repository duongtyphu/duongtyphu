"use client";

import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { LessonAdminShell } from "@/components/admin/lessons/LessonAdminShell";

export default function AdminCkosLessonsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <LessonAdminShell />
    </AdminAtmosphere>
  );
}
