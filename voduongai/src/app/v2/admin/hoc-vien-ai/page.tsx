import { getAcademyFeaturedCourses, getAcademyPaths } from "@/lib/portal/live-academy";

import "../../inter-gf.css";
import "../../hoc-vien-ai/hoc-vien-ai.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Học viện AI — Admin" };

/**
 * `/v2/admin/hoc-vien-ai` — khớp trực quan `/v2/hoc-vien-ai` (CSS `.hva`).
 * Dữ liệu thật: `learning_paths` (4 giai đoạn) + `courses`/`course_sections`/
 * `course_lessons` (Course Builder, 1.0) — quản lý nội dung khoá học/bài
 * học qua Admin 1.0 (`/admin/course-pricing` → nút "Quản lý nội dung" mở
 * Course Builder từng khoá), không xây trùng UI kéo-thả Section→Lesson.
 */
export default async function AdminHocVienAiPage() {
  const [paths, courses] = await Promise.all([getAcademyPaths(), getAcademyFeaturedCourses()]);

  const totalLessons = paths.reduce((sum, p) => sum + p.lessonCount, 0);

  return (
    <AdminPortalMirror
      prefix="hva"
      title="Quản lý Học viện AI"
      description="4 giai đoạn lộ trình + khoá học nổi bật hiển thị ở đây đọc trực tiếp từ learning_paths/courses/course_sections/course_lessons — quản lý nội dung qua Admin 1.0."
      stats={[
        { label: "Giai đoạn lộ trình", value: String(paths.length) },
        { label: "Khoá học có nội dung", value: String(courses.length) },
        { label: "Bài học đã Published", value: String(totalLessons) },
      ]}
      note={`Giai đoạn thật: ${paths.map((p) => p.title).join(" · ")}.`}
      links={[
        { label: "Giá & danh sách khoá học (Admin 1.0) →", href: "/admin/course-pricing" },
        { label: "Hệ tri thức AI (CKOS) — Lesson (Admin 1.0) →", href: "/admin/ckos/lessons" },
      ]}
    />
  );
}
