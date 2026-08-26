import { getCkosCategories, getCkosStats } from "@/lib/portal/live-ckos";
import {
  ACADEMY_LESSON_GROUPS,
  getAcademySlideLessonsWithContent,
  getAcademyVideos,
} from "@/lib/portal/live-academy-slides";

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
  const [ckosStats, ckosCategories, slideLessons, videos] = await Promise.all([
    getCkosStats(),
    getCkosCategories(),
    // Không cần khoá Premium ở đây (Admin chỉ đếm số liệu) — truyền
    // isPremium:true để không có bài nào bị lọc mất khỏi tổng đếm.
    getAcademySlideLessonsWithContent({ isPremium: true, signedIn: true, email: null, fullName: null }),
    getAcademyVideos(),
  ]);

  const lessonCountByGroup = Object.fromEntries(
    ACADEMY_LESSON_GROUPS.map((g) => [g.key, slideLessons.filter((l) => l.group === g.key).length]),
  );

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
        description="3 nhóm 'Học AI theo nhu cầu/công cụ/nghề nghiệp' (55 bài slide, hiển thị ở tab 'Hệ tri thức') + lưới 'Video bài giảng AI' (hiển thị ở tab 'Khóa học & Lộ trình') — đọc trực tiếp từ academy_slide_lessons/academy_videos, quản lý nội dung qua Admin 1.0."
        stats={[
          { label: "Tổng bài học đã Published", value: String(slideLessons.length) },
          { label: "Theo nhu cầu", value: String(lessonCountByGroup["nhu-cau"] ?? 0) },
          { label: "Theo công cụ", value: String(lessonCountByGroup["cong-cu"] ?? 0) },
          { label: "Theo nghề nghiệp", value: String(lessonCountByGroup["nghe-nghiep"] ?? 0) },
          { label: "Video bài giảng AI", value: String(videos.length) },
        ]}
        note="Mỗi nhóm 3 bài đầu (theo thứ tự soạn trong Admin) miễn phí xem thử — các bài còn lại chỉ tài khoản Premium xem được."
        links={[
          { label: "Học AI theo nhu cầu/công cụ/nghề nghiệp (Admin 1.0) →", href: "/admin/hocvienai/slide-lessons" },
          { label: "Video bài giảng AI (Admin 1.0) →", href: "/admin/hocvienai/videos" },
        ]}
      />
    </div>
  );
}
