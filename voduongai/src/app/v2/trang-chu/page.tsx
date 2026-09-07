import { getAcademyFeaturedCourses, getAcademyProgress } from "@/lib/portal/live-academy";
import { getResourceSuggestions } from "@/lib/portal/live-resource-suggestions";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getGreetingState } from "@/lib/v2/live-greeting";
import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import { getLiveMnytTopicsCount, getLiveMnytCategories } from "@/lib/portal/live-mnyt";
import { getAcademyLessonGroupCounts } from "@/lib/portal/live-academy-slides";

import { TrangChuClient, type PortalStats, type OpportunityPreview } from "./TrangChuClient";

/**
 * `/v2/trang-chu` — Server Component: đọc dữ liệu thật cho "Tiếp tục học
 * tập" (khoá có nội dung Course Builder + tiến độ per-user thật, cùng
 * nguồn `getAcademyFeaturedCourses()`/`getAcademyProgress()` đã dùng ở
 * `/v2/hoc-vien-ai`) và "Gợi ý dành cho bạn" (1 mục mới nhất/loại từ 5
 * bảng CKOS `prompts`/`templates`/`sop`/`ebooks`/`tools`) + trạng thái
 * Premium thật (`getPremiumStatus()`, dropdown hồ sơ thật + ẩn mời nâng
 * cấp cho tài khoản đã Premium — cùng nguyên tắc site-wide đã áp dụng cho
 * `PortalV2Shell`), rồi truyền xuống `TrangChuClient` (Client Component vì
 * bản gốc có state công tắc chủ đề + điều hướng bằng router).
 *
 * GIAI ĐOẠN 1 (rework, "Companion sống") — 3 nguồn dữ liệu mới:
 * - `getGreetingState()` (mới, `lib/v2/live-greeting.ts`) — lời chào đổi
 *   theo lần đầu/mới quay lại/lâu không ghé, tái dùng `warmth-engine.ts`.
 * - `opportunities` — preview 2 hệ sinh thái (DigiU/SolarGroup, 2 hệ sinh
 *   thái có đủ `ecosystem_chrome` + dự án con thật) cho section "Cơ hội
 *   nổi bật", tái dùng đúng `getLiveEcosystemChrome()` đã dùng ở
 *   `/v2/du-an-co-hoi`.
 *
 * ĐỔI TÊN "Portal 2.0 trong một cái nhìn" → "Hệ sinh thái VO DUONG AI" +
 * 5 ô số liệu (thay 3 ô cũ ecosystemCount/premiumPlanCount/toolCount, đã
 * bỏ hẳn — xem `PortalStats` mới ở `TrangChuClient.tsx`) — toàn bộ 5 số
 * đếm THẬT, không hằng số/không bịa:
 * - `ideaCount` — `getLiveMnytTopicsCount()` (bảng `mnyt_topics`
 *   Published, 446 tại thời điểm viết, tự đúng nếu Founder thêm ý tưởng).
 * - `fieldCount` — `getLiveMnytCategories().length` (bảng `mnyt_categories`
 *   Published, 35 tại thời điểm viết).
 * - `lessonGroupCounts` — `getAcademyLessonGroupCounts()` (bảng
 *   `academy_slide_lessons`, đếm theo `data.group` — nhu-cầu/công-cụ/
 *   nghề-nghiệp, 15/20/20 tại thời điểm viết).
 * Mỗi ô dẫn đúng trang học tương ứng (`Mỗi ngày một ý tưởng`, "Bản đồ
 * lĩnh vực", 3 nhóm bài trong tab "Hệ tri thức" của `/v2/hoc-vien-ai`
 * qua `?group=`) — xem `TrangChuClient.tsx`.
 */
export default async function TrangChuPortalPage() {
  const [
    courses,
    progress,
    suggestions,
    premium,
    greeting,
    digiuChrome,
    solarGroupChrome,
    ideaCount,
    fields,
    lessonGroupCounts,
  ] = await Promise.all([
    getAcademyFeaturedCourses(),
    getAcademyProgress(),
    getResourceSuggestions(),
    getPremiumStatus(),
    getGreetingState(),
    getLiveEcosystemChrome("eco_digiu"),
    getLiveEcosystemChrome("eco_solargroup"),
    getLiveMnytTopicsCount(),
    getLiveMnytCategories(),
    getAcademyLessonGroupCounts(),
  ]);

  const stats: PortalStats = {
    ideaCount,
    fieldCount: fields.length,
    needLessonCount: lessonGroupCounts["nhu-cau"],
    toolLessonCount: lessonGroupCounts["cong-cu"],
    careerLessonCount: lessonGroupCounts["nghe-nghiep"],
  };

  const allOpportunities: OpportunityPreview[] = [
    { slug: "digiu", name: digiuChrome.name, description: digiuChrome.shortDescription },
    { slug: "solargroup", name: solarGroupChrome.name, description: solarGroupChrome.shortDescription },
  ];
  const opportunities = allOpportunities.filter((o) => o.name.length > 0);

  return (
    <TrangChuClient
      courses={courses}
      progress={progress}
      suggestions={suggestions}
      premium={premium}
      greeting={greeting}
      stats={stats}
      opportunities={opportunities}
    />
  );
}
