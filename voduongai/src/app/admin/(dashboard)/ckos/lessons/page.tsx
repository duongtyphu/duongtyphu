"use client";

import { AdminAtmosphere } from "@/components/admin/AdminAtmosphere";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { LessonAdminShell } from "@/components/admin/lessons/LessonAdminShell";

export default function AdminCkosLessonsPage() {
  return (
    <AdminAtmosphere atmosphereClassName="ckos-atmosphere-bg">
      <div className="space-y-4">
        <AdminBreadcrumb
          trail={[
            { label: "Học viện" },
            { label: "Hệ tri thức AI (CKOS)", href: "/admin/ckos" },
            { label: "Lesson (Folder)" },
          ]}
        />
        <LessonAdminShell />
      </div>
    </AdminAtmosphere>
  );
}
