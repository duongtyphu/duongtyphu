import { getCkosCategories, getCkosStats } from "@/lib/portal/live-ckos";

import "../../inter-gf.css";
import "../../he-tri-thuc/he-tri-thuc.css";

import { AdminPortalMirror } from "@/components/v2/admin/AdminPortalMirror";

export const metadata = { title: "Hệ tri thức (CKOS) — Admin" };

/**
 * `/v2/admin/he-tri-thuc` — khớp trực quan `/v2/he-tri-thuc` (CSS `.ckos`).
 * CKOS đã có hạ tầng quản trị RẤT đầy đủ ở Admin 1.0 (11 route dưới
 * `/admin/ckos/*` — Dashboard, Prompt, Workflow, Resource, Lesson,
 * Knowledge Collection, Case Study, Best Practice...), Portal 2.0 đọc
 * đúng cùng bảng qua `getCkosCategories()`/`getCkosDocuments()`/
 * `getCkosStats()` (`live-ckos.ts`). Không xây trùng CRUD — trang này chỉ
 * hiện đúng số liệu thật + trỏ sang Admin 1.0.
 */
export default async function AdminHeTriThucPage() {
  const [stats, categories] = await Promise.all([getCkosStats(), getCkosCategories()]);

  return (
    <AdminPortalMirror
      prefix="ckos"
      title="Quản lý Hệ tri thức (CKOS)"
      description="Toàn bộ tài liệu/công cụ/prompt/lộ trình hiển thị ở đây đọc trực tiếp từ 9 bảng CKOS đã có sẵn — quản lý nội dung qua Admin 1.0."
      stats={[
        { label: "Tài liệu", value: String(stats.documents) },
        { label: "Danh mục", value: String(stats.categories) },
        { label: "Công cụ & Prompt", value: String(stats.toolsAndPrompts) },
        { label: "Bài học liên kết", value: String(stats.linkedLessons) },
        { label: "Lộ trình học tập", value: String(stats.learningPaths) },
      ]}
      note={`${categories.length} danh mục đang hiển thị: ${categories.map((c) => c.name).join(" · ")}.`}
      links={[
        { label: "CKOS Dashboard đầy đủ (Admin 1.0) →", href: "/admin/ckos" },
        { label: "Quản lý Lesson (Admin 1.0) →", href: "/admin/ckos/lessons" },
        { label: "Quản lý Case Study (Admin 1.0) →", href: "/admin/ckos/case-studies" },
      ]}
    />
  );
}
