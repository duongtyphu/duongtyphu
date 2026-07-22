import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { listCoursePricing } from "@/app/admin/(dashboard)/course-pricing/actions";
import { getCourseBuilderTree } from "./actions";
import { CourseBuilderClient } from "./CourseBuilderClient";

export const metadata = { title: "Course Builder · Admin" };

/**
 * Course Builder (Premium), Bước 3 — UI riêng (không phải VisualEditor/
 * DataTable, vì quan hệ lồng 2 cấp Section→Lesson không khớp pattern
 * generic đó). Dùng đúng 8 Server Actions từ Bước 2 (`./actions.ts`),
 * không viết thêm tầng dữ liệu mới.
 */
export default async function CourseBuilderPage({ params }: { params: Promise<{ courseId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { courseId } = await params;

  const [{ courses }, { sections, configured }] = await Promise.all([
    listCoursePricing(),
    getCourseBuilderTree(courseId),
  ]);

  const course = courses.find((c) => c.id === courseId);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/course-pricing" className="text-xs font-semibold text-brand-blue hover:underline">
          ← Quay lại Giá khoá học Premium
        </Link>
        <h1 className="mt-2 text-xl font-extrabold text-gray-900">Course Builder — {course?.name ?? courseId}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý Section/Lesson (nội dung bài học) của khoá học này. Kéo-thả để đổi thứ tự — trong cùng
          section, giữa các section, hoặc đổi thứ tự section.
        </p>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-gray-700">
          Chưa cấu hình <code className="text-orange-600">SUPABASE_SERVICE_ROLE_KEY</code> — cần quyền
          service role để quản lý nội dung khoá học.
        </div>
      )}

      {configured && <CourseBuilderClient courseId={courseId} initialSections={sections} />}
    </div>
  );
}
