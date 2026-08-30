import { getAcademyFeaturedCourses, getAcademyProgress } from "@/lib/portal/live-academy";
import { getResourceSuggestions } from "@/lib/portal/live-resource-suggestions";
import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getGreetingState } from "@/lib/v2/live-greeting";
import { getLivePremiumPlans } from "@/lib/portal/live-premium-plans";
import { getLiveTools } from "@/lib/portal/live-tools";
import { getLiveEcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";

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
 * - `stats` — 3 số liệu THẬT cho section "Portal 2.0 trong một cái nhìn"
 *   (Giai đoạn 7 bỏ số thứ 4 "Kênh cộng đồng đang hoạt động" khi xoá hẳn
 *   `/v2/cong-dong-ai` — xem CLAUDE.md): `ecosystemCount` là hằng số cấu
 *   trúc (5 route `/v2/du-an-co-hoi/*` đã dựng thật — bảng `projects`
 *   generic không map 1:1 vào 5 route này nên không đếm qua query, xem
 *   `DuAnCoHoiClient.tsx`), 2 số còn lại đếm thật từ Supabase
 *   (`premium_plans`/`tools`, đều đã lọc Published ở tầng `live-*.ts`).
 * - `opportunities` — preview 2 hệ sinh thái (DigiU/SolarGroup, 2 hệ sinh
 *   thái có đủ `ecosystem_chrome` + dự án con thật) cho section "Cơ hội
 *   nổi bật", tái dùng đúng `getLiveEcosystemChrome()` đã dùng ở
 *   `/v2/du-an-co-hoi`.
 */
export default async function TrangChuPortalPage() {
  const [courses, progress, suggestions, premium, greeting, premiumPlans, tools, digiuChrome, solarGroupChrome] =
    await Promise.all([
      getAcademyFeaturedCourses(),
      getAcademyProgress(),
      getResourceSuggestions(),
      getPremiumStatus(),
      getGreetingState(),
      getLivePremiumPlans(),
      getLiveTools(),
      getLiveEcosystemChrome("eco_digiu"),
      getLiveEcosystemChrome("eco_solargroup"),
    ]);

  const stats: PortalStats = {
    ecosystemCount: 5,
    premiumPlanCount: premiumPlans.length,
    toolCount: tools.length,
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
