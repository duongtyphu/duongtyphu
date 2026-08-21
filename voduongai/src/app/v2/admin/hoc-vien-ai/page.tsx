import { getCkosCategories, getCkosStats } from "@/lib/portal/live-ckos";
import { getAcademyFeaturedCourses, getAcademyPaths } from "@/lib/portal/live-academy";
import { getWorkspaceToolGroups, getWorkspaceWorkflows } from "@/lib/portal/live-workspace";

import "../../inter-gf.css";
import "../../he-tri-thuc/he-tri-thuc.css";
import "../../hoc-vien-ai/hoc-vien-ai.css";
import "../../ai-workspace/ai-workspace.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Học viện AI — Admin" };

/**
 * `/v2/admin/hoc-vien-ai` — gộp 3 trang mirror cũ (`/v2/admin/he-tri-thuc`,
 * `/v2/admin/hoc-vien-ai`, `/v2/admin/ai-workspace`) thành 1, theo Founder
 * quyết định #2 (gộp menu Portal 2.0) mở rộng sang Admin 2.0 (đã hỏi riêng,
 * Founder xác nhận gộp luôn).
 *
 * Vẫn là 3 khối `AdminPortalMirror` xếp dọc (không viết lại component
 * dùng chung — mỗi khối giữ đúng `prefix` CSS gốc của chính mảng nội dung
 * đó, vì 3 mảng vẫn đọc 3 bộ bảng Supabase khác nhau và trỏ sang 3 khu vực
 * khác nhau của Admin 1.0). Nội dung từng khối copy nguyên vẹn từ 3 trang
 * cũ đã xoá (`/v2/admin/he-tri-thuc`, `/v2/admin/ai-workspace`).
 */
export default async function AdminHocVienAiPage() {
  const [ckosStats, ckosCategories, academyPaths, academyCourses, workspaceGroups, workspaceWorkflows] =
    await Promise.all([
      getCkosStats(),
      getCkosCategories(),
      getAcademyPaths(),
      getAcademyFeaturedCourses(),
      getWorkspaceToolGroups(),
      getWorkspaceWorkflows(),
    ]);

  const totalAcademyLessons = academyPaths.reduce((sum, p) => sum + p.lessonCount, 0);
  const totalWorkspaceTools = workspaceGroups.reduce((sum, g) => sum + g.count, 0);

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
        ]}
      />

      <AdminPortalMirror
        prefix="aiw"
        title="AI Workspace"
        description="Danh sách công cụ AI + workflow mẫu hiển thị ở đây đọc trực tiếp từ bảng tools/ai_workflow_sections — quản lý nội dung qua Admin 1.0."
        stats={[
          { label: "Công cụ AI (Published)", value: String(totalWorkspaceTools) },
          { label: "Nhóm công cụ", value: String(workspaceGroups.length) },
          { label: "Workflow mẫu", value: String(workspaceWorkflows.length) },
        ]}
        note={`Nhóm công cụ thật: ${workspaceGroups.map((g) => `${g.category} (${g.count})`).join(" · ")}.`}
        links={[
          { label: "Quản lý Công cụ AI (Admin 1.0) →", href: "/admin/tools" },
          { label: "Quản lý Quy trình AI (Admin 1.0) →", href: "/admin/aiworkspace/ai-workflow-sections" },
          { label: "Quản lý Workspace đề xuất (Admin 1.0) →", href: "/admin/aiworkspace/recommended-workspace" },
        ]}
      />
    </div>
  );
}
