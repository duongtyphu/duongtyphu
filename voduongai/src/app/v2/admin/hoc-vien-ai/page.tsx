import { getCkosCategories, getCkosStats } from "@/lib/portal/live-ckos";
import { getAcademyFeaturedCourses, getAcademyPaths } from "@/lib/portal/live-academy";

import "../../inter-gf.css";
import "../../he-tri-thuc/he-tri-thuc.css";
import "../../hoc-vien-ai/hoc-vien-ai.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Học viện AI — Admin" };

/**
 * `/v2/admin/hoc-vien-ai` — gộp mirror của các mảng nội dung thật sự đang
 * hiển thị trên `/v2/hoc-vien-ai`, theo Founder quyết định #2 (gộp menu
 * Portal 2.0) mở rộng sang Admin 2.0.
 *
 * Trước đây có 3 khối (CKOS/Học viện AI/AI Workspace, khớp 3 tab gốc của
 * trang Portal). Tab "AI Workspace" đã bị gỡ hẳn khỏi `/v2/hoc-vien-ai`
 * theo yêu cầu Founder (mục 4a của kế hoạch gốc 14 hạng mục) — route đứng
 * riêng cũ `/v2/ai-workspace` cũng đã sớm bị xoá + redirect vĩnh viễn về
 * `/v2/hoc-vien-ai` từ trước (xem `next.config.ts`), nên nội dung đó không
 * còn tồn tại ở BẤT KỲ đâu trong `/v2/*` nữa — đã xoá khối `AdminPortalMirror`
 * "aiw" tương ứng (mirror 1 nội dung không còn hiển thị thật là gây hiểu
 * lầm cho Admin, không phải chỉ dọn dẹp thẩm mỹ). Chỉ còn 2 khối CKOS/Học
 * viện AI, khớp đúng 2 tab đầu còn lại của trang Portal thật.
 */
export default async function AdminHocVienAiPage() {
  const [ckosStats, ckosCategories, academyPaths, academyCourses] = await Promise.all([
    getCkosStats(),
    getCkosCategories(),
    getAcademyPaths(),
    getAcademyFeaturedCourses(),
  ]);

  const totalAcademyLessons = academyPaths.reduce((sum, p) => sum + p.lessonCount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <AdminPortalMirror
        prefix="ckos"
        title="Hệ tri thức (CKOS)"
        description="Toàn bộ tài liệu/công cụ/prompt/lộ trình hiển thị ở đây đọc trực tiếp từ 9 bảng CKOS đã có sẵn — quản lý nội dung qua Admin 1.0."
        stats={[
          { label: "Tài liệu", value: String(ckosStats.documents) },
          { label: "Danh mục", value: String(ckosStats.categories) },
          { label: "Công cụ & Prompt", value: String(ckosStats.toolsAndPrompts) },
          { label: "Bài học liên kết", value: String(ckosStats.linkedLessons) },
          { label: "Lộ trình học tập", value: String(ckosStats.learningPaths) },
        ]}
        note={`${ckosCategories.length} danh mục đang hiển thị: ${ckosCategories.map((c) => c.name).join(" · ")}.`}
        links={[
          { label: "CKOS Dashboard đầy đủ (Admin 1.0) →", href: "/admin/ckos" },
          { label: "Quản lý Lesson (Admin 1.0) →", href: "/admin/ckos/lessons" },
          { label: "Quản lý Case Study (Admin 1.0) →", href: "/admin/ckos/case-studies" },
        ]}
      />

      <AdminPortalMirror
        prefix="hva"
        title="Khóa học & Lộ trình"
        description="4 giai đoạn lộ trình + khoá học nổi bật hiển thị ở đây đọc trực tiếp từ learning_paths/courses/course_sections/course_lessons — quản lý nội dung qua Admin 1.0."
        stats={[
          { label: "Giai đoạn lộ trình", value: String(academyPaths.length) },
          { label: "Khoá học có nội dung", value: String(academyCourses.length) },
          { label: "Bài học đã Published", value: String(totalAcademyLessons) },
        ]}
        note={`Giai đoạn thật: ${academyPaths.map((p) => p.title).join(" · ")}.`}
        links={[
          { label: "Giá & danh sách khoá học (Admin 1.0) →", href: "/admin/course-pricing" },
          { label: "Hệ tri thức AI (CKOS) — Lesson (Admin 1.0) →", href: "/admin/ckos/lessons" },
          { label: "Huy hiệu & Thành tựu (Admin 1.0) →", href: "/admin/premium/badges" },
        ]}
      />
    </div>
  );
}
