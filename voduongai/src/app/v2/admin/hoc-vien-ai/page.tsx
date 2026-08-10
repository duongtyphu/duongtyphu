import { CheckCircle2, GraduationCap, UserCog, Users } from "lucide-react";

import { DataTable } from "@/components/v2/ui/DataTable";
import type { TableRow } from "@/components/v2/ui/DataTable";
import { KpiGrid } from "@/components/v2/ui/KpiGrid";
import { PageHead, SaveButton } from "@/components/v2/ui/PageHead";
import { COURSE_STATUS_LABEL, LEVEL_LABEL, listCourses } from "@/lib/v2/data/catalog";

export const metadata = { title: "Học viện AI — Admin" };

const STATUS_STYLE = {
  published: { background: "#e6f7ed", color: "#189a52" },
  draft: { background: "#fdf1e0", color: "#a9822c" },
  archived: { background: "var(--v2-bg)", color: "var(--v2-muted)" },
} as const;

const LEVEL_STYLE = {
  "co-ban": { background: "var(--v2-violet-light)", color: "var(--v2-violet)" },
  "nang-cao": { background: "#e6f0ff", color: "#1d5fd8" },
  "chuyen-sau": { background: "#fdeee6", color: "#b45309" },
} as const;

export default async function AdminHocVienPage() {
  const courses = await listCourses();

  const rows: TableRow[] = courses.map((course) => ({
    id: course.id,
    tags: [course.status, course.level],
    cells: [
      { t: "strong", v: course.title },
      {
        t: "tag",
        label: LEVEL_LABEL[course.level],
        background: LEVEL_STYLE[course.level].background,
        color: LEVEL_STYLE[course.level].color,
      },
      { t: "text", v: course.enrolledCount.toLocaleString("vi-VN") },
      { t: "muted", v: `${course.lessonCount} bài · ${Math.round(course.durationMinutes / 60)} giờ` },
      {
        t: "tag",
        label: COURSE_STATUS_LABEL[course.status],
        background: STATUS_STYLE[course.status].background,
        color: STATUS_STYLE[course.status].color,
      },
    ],
  }));

  return (
    <div className="flex flex-col gap-5 px-7 py-6">
      <PageHead
        crumb="Admin › Nội dung Portal › Học viện AI"
        title="Quản lý Học viện AI"
        description="Quản lý khoá học, lộ trình học tập và giảng viên trên Học viện AI."
        action={<SaveButton />}
      />

      <KpiGrid
        items={[
          { id: "courses", value: "312", label: "Khoá học đang mở", icon: GraduationCap, gradient: "linear-gradient(145deg,#a08bff,#6d4aff)", delta: "4,3%", trend: "up" },
          { id: "students", value: "6.120", label: "Học viên đang học", icon: Users, gradient: "linear-gradient(145deg,#5f8fff,#1d5fd8)", delta: "9,8%", trend: "up" },
          { id: "completion", value: "78%", label: "Tỷ lệ hoàn thành TB", icon: CheckCircle2, gradient: "linear-gradient(145deg,#3ecf7e,#189a52)", delta: "2,1%", trend: "up" },
          { id: "teachers", value: "18", label: "Giảng viên", icon: UserCog, gradient: "linear-gradient(145deg,#e2b23c,#a9660f)" },
        ]}
      />

      <DataTable
        title="Danh sách khoá học"
        headers={["Khoá học", "Cấp độ", "Học viên", "Nội dung", "Trạng thái"]}
        rows={rows}
        totalLabel="khoá học"
        totalOverride={312}
        searchPlaceholder="Tìm khoá học..."
        filterTabs={[
          { id: "all", label: "Tất cả" },
          { id: "published", label: "Đang mở", tag: "published" },
          { id: "draft", label: "Bản nháp", tag: "draft" },
          { id: "archived", label: "Lưu trữ", tag: "archived" },
        ]}
      />
    </div>
  );
}
