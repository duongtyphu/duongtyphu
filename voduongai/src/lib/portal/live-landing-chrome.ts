import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * Landing Page CMS (Phase 25, theo yêu cầu Founder "Xây Quản lý Landing
 * Page"). Nguồn thật cho phần chữ tĩnh AN TOÀN của trang chủ marketing công
 * khai (`src/app/page.tsx` → `HomeClient.tsx` → 8 section) — quản qua
 * `/admin/landing`.
 *
 * CHỈ field text (eyebrow badge/tiêu đề/mô tả/CTA label) — KHÔNG đụng:
 * - Mảng `ITEMS`/`STEPS` (EcosystemPillars), `LIST` (PortalPreview),
 *   `FEATURES`/`VALUES` (TrustStats) — mỗi phần tử gắn 1 icon PNG cố định
 *   trong `public/images/landing-preview/icons/`, số lượng phần tử khớp
 *   đúng bố cục lưới (vd. `xl:flex-nowrap` 6 cột) — sửa tự do qua UI
 *   generic có rủi ro lệch layout/thiếu icon.
 * - Toàn bộ `QuizAssessment.tsx` (`QUESTIONS`/`LEVELS`) — có logic tính
 *   điểm dựa trên vị trí/số lượng câu trả lời, rủi ro cao nếu cho sửa tự do.
 * - Danh sách `tools` (`ToolsIUse.tsx`, import từ `@/data/tools` — dữ liệu
 *   dùng chung, không riêng cho Landing Page).
 * - Ảnh `founder.png`, 3 ảnh cộng đồng (`community-*.jpg`) — dự án chưa có
 *   hạ tầng upload, dán URL cũng không hợp lý cho ảnh tĩnh đã có sẵn.
 * - MỌI `href` (kể cả CTA `/login`) — giữ hardcode trong code, tránh Admin
 *   gõ sai tạo link chết trên trang công khai lưu lượng cao nhất hệ thống.
 *
 * Dùng `getSupabasePublic()` (không `cookies()`) — cùng pattern mọi
 * `live-*.ts` khác, an toàn gọi trong Server Component + `generateMetadata`.
 */
export type LandingChromeRow = {
  id: string;
  status: string;
  // Hero
  eyebrowBadge?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineHighlight?: string;
  subheadline?: string;
  ctaLabel?: string;
  tagline?: string;
  // EcosystemPillars (dùng chung eyebrowBadge/heading ở trên)
  heading?: string;
  roadmapHeading?: string;
  roadmapDesc?: string;
  roadmapCtaLabel?: string;
  // SkillsShowcase (dùng chung eyebrowBadge/heading)
  youtubeId?: string;
  // TrustStats (dùng chung eyebrowBadge/heading)
  description?: string;
  // Ecosystem (founder)
  founderQuote?: string;
  founderQuoteAttribution?: string;
  founderBioParagraph1?: string;
  founderBioParagraph2?: string;
  founderTitle?: string;
};

const DEFAULT_LANDING_CHROME: LandingChromeRow[] = [
  {
    id: "hero",
    status: "Published",
    eyebrowBadge: "Thương hiệu cá nhân · Hệ sinh thái AI",
    headlineLine1: "Học AI đúng hướng.",
    headlineLine2: "Xây hệ thống vững chắc.",
    headlineHighlight: "Tạo tài sản số bền vững.",
    subheadline:
      "VO DUONG AI là hệ sinh thái học tập AI giúp bạn học đúng, thực hành đúng và từng bước xây dựng hệ thống làm việc, thương hiệu cá nhân và tài sản số bền vững trong kỷ nguyên trí tuệ nhân tạo.",
    ctaLabel: "Bắt đầu ngay hôm nay",
    tagline: "Miễn phí tham gia • Học mọi lúc • Đồng hành cùng Companion AI",
  },
  {
    id: "ecosystem-pillars",
    status: "Published",
    eyebrowBadge: "🌐 Hệ sinh thái",
    heading: "Tất cả những gì bạn cần, trong một hệ sinh thái",
    roadmapHeading: "Lộ trình học tập dành cho mọi người",
    roadmapDesc:
      "Dù bạn là người mới bắt đầu hay đã có kinh nghiệm, chúng tôi có lộ trình phù hợp để bạn tiến xa hơn mỗi ngày.",
    roadmapCtaLabel: "Xem tất cả lộ trình",
  },
  {
    id: "portal-preview",
    status: "Published",
    eyebrowBadge: "🧭 Khám phá Học Viện",
    heading: "Nền tảng toàn diện, trải nghiệm liền mạch",
    ctaLabel: "Khám phá nền tảng",
  },
  {
    id: "skills-showcase",
    status: "Published",
    eyebrowBadge: "🎯 10 Kỹ năng AI cần có",
    heading: "Những kỹ năng thiết yếu giúp bạn tạo lợi thế cạnh tranh trong kỷ nguyên AI.",
    youtubeId: "zH5IvC-A6iI",
  },
  {
    id: "tools-i-use",
    status: "Published",
    eyebrowBadge: "🛠️ Thực chiến",
    heading: "Những công cụ tôi thực sự đang dùng",
  },
  {
    id: "trust-stats",
    status: "Published",
    eyebrowBadge: "🌐 Cộng đồng",
    heading: "Hệ sinh thái dành cho người Việt",
    description: "Kết nối tri thức, công cụ, cơ hội và cộng đồng để cùng nhau phát triển và tạo ra tác động tích cực.",
  },
  {
    id: "ecosystem",
    status: "Published",
    eyebrowBadge: "Hệ sinh thái của tôi",
    founderQuote: "AI không thay thế bạn, nhưng những người biết sử dụng AI sẽ thay thế bạn",
    founderQuoteAttribution: "— Võ Đương",
    founderBioParagraph1:
      "Tôi là một nhà đầu tư vào các dự án công nghệ, tôi tin rằng AI sẽ là một trong những kỹ năng sống còn trong thế kỷ 21. Tôi xây dựng VO DUONG AI như một hệ sinh thái cá nhân nơi tập hợp những kiến thức, tài liệu, công cụ và bao gồm những kinh nghiệm mà chính tôi đã từng trải nghiệm mỗi ngày trong công việc và sự nghiệp.",
    founderBioParagraph2:
      "Mục tiêu của tôi rất đơn giản: giúp bạn tiếp cận với AI nhanh hơn, dễ hiểu hơn, xây dựng hệ thống online bền vững và từng bước tạo ra tài sản số cho tương lai.",
    founderTitle: "Nhà sáng lập VÕ ĐƯƠNG AI",
  },
  {
    id: "final-cta",
    status: "Published",
    heading: "Bắt đầu hành trình chinh phục các kỹ năng AI của bạn ngay hôm nay.",
    ctaLabel: "Bắt đầu ngay hôm nay",
  },
];

export const getLiveLandingChrome = cache(async (): Promise<LandingChromeRow[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return DEFAULT_LANDING_CHROME;
  const { data, error } = await supabase
    .from("landing_chrome")
    .select("id, data, status")
    .eq("status", "Published");
  if (error || !data || data.length === 0) return DEFAULT_LANDING_CHROME;

  return DEFAULT_LANDING_CHROME.map((def) => {
    const row = data.find((r) => r.id === def.id);
    if (!row) return def;
    const d = (row.data ?? {}) as Record<string, unknown>;
    const merged: LandingChromeRow = { ...def, status: row.status };
    for (const key of Object.keys(def)) {
      if (key === "id" || key === "status") continue;
      const k = key as keyof LandingChromeRow;
      if (typeof d[key] === "string") (merged as Record<string, unknown>)[k] = d[key];
    }
    return merged;
  });
});
