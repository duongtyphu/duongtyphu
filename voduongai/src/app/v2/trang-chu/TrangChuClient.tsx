"use client";

/* =============================================================================
 * Trang chủ Portal 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Trang chu Portal.html`.
 *
 * Markup giữ NGUYÊN thứ tự phần tử, nguyên tên class, nguyên văn bản tiếng Việt,
 * nguyên toàn bộ SVG inline (KHÔNG thay bằng Lucide), nguyên mọi giá trị inline
 * style của bản gốc. CSS nằm ở `trang-chu.css` cạnh file này (xem phần đầu file
 * đó để biết đúng 4 điều chỉnh kỹ thuật bắt buộc).
 *
 * Chuyển đổi cú pháp HTML → JSX (không đổi DOM đầu ra):
 *   `class` → `className`, `stroke-width` → `strokeWidth`, `stroke-linecap` →
 *   `strokeLinecap`, `stop-color` → `stopColor`, `fill-rule` → `fillRule`,
 *   `<br>` → `<br />`, inline `style="a:b"` → `style={{ a: "b" }}`.
 *
 * Hai chỗ phải diễn giải, đều đã ghi rõ tại chỗ:
 *   1. `src="assets/..."` (đường dẫn tương đối của mockup) → `/v2-static/assets/...`
 *      (thư mục `public/`). Cùng file ảnh, chỉ khác cách trỏ.
 *   2. `<script>` cuối file gốc làm 2 việc: bật/tắt class `on` cho công tắc
 *      chủ đề, và `window.location.href = dataset.href` khi bấm phần tử có
 *      `data-href`. Tái hiện bằng React state + router; các đích `.html` của
 *      mockup ánh xạ sang route `/v2/*` tương ứng qua `HREF_MAP` bên dưới.
 *
 * ĐÃ BỎ cột `.right-col` (chào mừng/Premium hết hạn giả, XP/streak giả,
 * "Truy cập nhanh"/"Thông báo mới" giả) theo yêu cầu Founder — cột giữa
 * (`.center-col`, `flex:1`) tự giãn full-width, không cần sửa CSS.
 *
 * "Tiếp tục học tập"/"Gợi ý dành cho bạn" nối dữ liệu thật (props từ
 * `page.tsx`, Server Component) thay 8 thẻ bịa hoàn toàn của bản gốc —
 * xem `src/lib/portal/live-academy.ts`/`live-resource-suggestions.ts`.
 * Icon/màu gradient mỗi vị trí GIỮ TĨNH theo đúng bản thiết kế (không có
 * bảng nào lưu icon/màu riêng cho khoá học/tài nguyên) — cùng nguyên tắc
 * các mảng icon-bound khác trong dự án (`CHAPTER_DESTINATIONS`...).
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import "../inter-gf.css";
import "./trang-chu.css";

import type { AcademyCourse, AcademyProgress } from "@/lib/portal/live-academy";
import type { ResourceSuggestion, ResourceSuggestionType } from "@/lib/portal/live-resource-suggestions";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { GreetingState } from "@/lib/v2/live-greeting";
import { getWarmthLine } from "@/lib/portal/warmth-engine";
import { getRandomThoughtSeed } from "@/data/portal/thought-seeds";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

/** "Portal 2.0 trong một cái nhìn" — 4 số liệu thật, xem docblock ở `page.tsx`. */
export type PortalStats = {
  ecosystemCount: number;
  premiumPlanCount: number;
  communityChannelCount: number;
  toolCount: number;
};

/** "Cơ hội nổi bật" — preview 1 hệ sinh thái thật (`ecosystem_chrome`). */
export type OpportunityPreview = { slug: "digiu" | "solargroup"; name: string; description: string };

const OPPORTUNITY_HREF: Record<OpportunityPreview["slug"], string> = {
  digiu: "/v2/du-an-co-hoi/digiu",
  solargroup: "/v2/du-an-co-hoi/solargroup",
};

/** Đích điều hướng của mockup (tên file `.html`) → route thật trong `/v2`. */
const HREF_MAP: Record<string, string> = {
  "Companion.html": "/v2/companion",
  "Moi ngay mot y tuong.html": "/v2/moi-ngay-mot-y-tuong",
  "He tri thuc CKOS.html": "/v2/hoc-vien-ai",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/hoc-vien-ai",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Su menh Companion.html": "/v2/su-menh-companion",
  "Cong dong AI.html": "/v2/cong-dong-ai",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

/**
 * 39 hạt sáng trôi trong hero — chép nguyên từng bộ giá trị inline style của
 * bản gốc (top/left/kích thước/--dx/--dy/thời lượng/độ trễ), giữ đúng thứ tự
 * xuất hiện. Dựng bằng `map` nên DOM sinh ra giống hệt 39 thẻ `div` viết tay.
 */
const MOVE_DOTS: Array<{
  top: string; left: string; size: string; dx: string; dy: string; dur: string; delay: string;
}> = [
  { top: "82.7%", left: "78.9%", size: "3.1px", dx: "31px", dy: "10px", dur: "5.3s", delay: "2.2s" },
  { top: "7.9%", left: "68.1%", size: "2.8px", dx: "34px", dy: "45px", dur: "5.1s", delay: "1.3s" },
  { top: "92.4%", left: "86.0%", size: "1.9px", dx: "46px", dy: "-34px", dur: "3.4s", delay: "2.6s" },
  { top: "42.8%", left: "31.4%", size: "2.4px", dx: "6px", dy: "26px", dur: "5.0s", delay: "0.2s" },
  { top: "42.0%", left: "71.0%", size: "1.8px", dx: "-45px", dy: "38px", dur: "5.7s", delay: "1.9s" },
  { top: "19.8%", left: "34.0%", size: "2.8px", dx: "67px", dy: "-31px", dur: "3.9s", delay: "0.1s" },
  { top: "62.6%", left: "90.7%", size: "2.1px", dx: "-61px", dy: "-8px", dur: "5.0s", delay: "0.3s" },
  { top: "73.4%", left: "84.2%", size: "2.2px", dx: "62px", dy: "11px", dur: "4.5s", delay: "0.6s" },
  { top: "32.0%", left: "52.3%", size: "2.5px", dx: "37px", dy: "48px", dur: "5.4s", delay: "2.3s" },
  { top: "44.7%", left: "61.1%", size: "2.1px", dx: "-43px", dy: "-1px", dur: "4.9s", delay: "2.3s" },
  { top: "4.6%", left: "5.7%", size: "2.3px", dx: "64px", dy: "-44px", dur: "4.1s", delay: "1.1s" },
  { top: "31.4%", left: "39.1%", size: "2.4px", dx: "-56px", dy: "-3px", dur: "4.7s", delay: "0.8s" },
  { top: "71.6%", left: "28.6%", size: "2.3px", dx: "48px", dy: "40px", dur: "4.6s", delay: "1.9s" },
  { top: "8.1%", left: "15.8%", size: "2.1px", dx: "-51px", dy: "-35px", dur: "4.4s", delay: "3.0s" },
  { top: "10.7%", left: "80.4%", size: "2.4px", dx: "57px", dy: "7px", dur: "4.7s", delay: "3.2s" },
  { top: "45.8%", left: "79.5%", size: "2.5px", dx: "61px", dy: "5px", dur: "3.8s", delay: "2.6s" },
  { top: "76.4%", left: "12.6%", size: "2.9px", dx: "-15px", dy: "30px", dur: "5.2s", delay: "2.0s" },
  { top: "52.2%", left: "74.6%", size: "2.3px", dx: "-56px", dy: "-31px", dur: "4.9s", delay: "1.4s" },
  { top: "49.7%", left: "17.9%", size: "2.6px", dx: "-16px", dy: "-13px", dur: "5.2s", delay: "0.3s" },
  { top: "21.9%", left: "82.4%", size: "3.0px", dx: "21px", dy: "41px", dur: "3.1s", delay: "1.8s" },
  { top: "58.6%", left: "13.7%", size: "2.1px", dx: "14px", dy: "-24px", dur: "5.2s", delay: "2.8s" },
  { top: "76.0%", left: "23.9%", size: "2.5px", dx: "-54px", dy: "-23px", dur: "5.6s", delay: "2.5s" },
  { top: "17.3%", left: "29.1%", size: "2.3px", dx: "45px", dy: "-9px", dur: "3.9s", delay: "2.1s" },
  { top: "22.2%", left: "77.9%", size: "3.1px", dx: "-26px", dy: "18px", dur: "5.4s", delay: "3.3s" },
  { top: "27.1%", left: "89.8%", size: "2.1px", dx: "-65px", dy: "-34px", dur: "4.7s", delay: "0.9s" },
  { top: "55.0%", left: "33.2%", size: "2.3px", dx: "46px", dy: "-29px", dur: "4.3s", delay: "2.4s" },
  { top: "25.6%", left: "71.4%", size: "2.1px", dx: "-46px", dy: "-12px", dur: "5.1s", delay: "2.4s" },
  { top: "75.4%", left: "19.7%", size: "2.7px", dx: "-61px", dy: "47px", dur: "5.4s", delay: "3.1s" },
  { top: "37.4%", left: "86.6%", size: "2.8px", dx: "11px", dy: "-27px", dur: "4.2s", delay: "2.5s" },
  { top: "61.3%", left: "80.3%", size: "2.1px", dx: "-59px", dy: "-22px", dur: "4.2s", delay: "3.8s" },
  { top: "33.6%", left: "87.7%", size: "2.7px", dx: "-54px", dy: "11px", dur: "4.3s", delay: "1.0s" },
  { top: "47.2%", left: "87.5%", size: "2.1px", dx: "69px", dy: "-11px", dur: "3.2s", delay: "2.0s" },
  { top: "31.9%", left: "2.9%", size: "3.0px", dx: "64px", dy: "-22px", dur: "5.3s", delay: "3.2s" },
  { top: "74.0%", left: "4.1%", size: "2.0px", dx: "-54px", dy: "-50px", dur: "4.2s", delay: "2.0s" },
  { top: "76.7%", left: "28.2%", size: "1.7px", dx: "68px", dy: "11px", dur: "4.1s", delay: "0.7s" },
  { top: "19.7%", left: "19.2%", size: "3.1px", dx: "30px", dy: "-20px", dur: "5.3s", delay: "0.3s" },
  { top: "9.2%", left: "43.0%", size: "2.0px", dx: "66px", dy: "-44px", dur: "4.8s", delay: "1.9s" },
  { top: "28.5%", left: "88.8%", size: "3.0px", dx: "-3px", dy: "29px", dur: "3.7s", delay: "2.1s" },
  { top: "17.2%", left: "27.5%", size: "2.1px", dx: "-30px", dy: "-23px", dur: "3.8s", delay: "2.7s" },
];

/**
 * 10 ngôi sao lấp lánh quanh viên kim cương Premium ở sidebar — cùng một `path`,
 * chỉ khác vị trí/kích thước/độ trễ. Chép nguyên từng bộ giá trị của bản gốc.
 */
const CROWN_SPARKLES: React.CSSProperties[] = [
  { top: "-8px", left: "-10px", width: "12px", height: "12px", animationDelay: "0s" },
  { top: "4px", right: "-14px", width: "9px", height: "9px", animationDelay: ".7s" },
  { bottom: "-6px", left: "6px", width: "8px", height: "8px", animationDelay: "1.4s" },
  { top: "22px", left: "-16px", width: "7px", height: "7px", animationDelay: ".3s" },
  { bottom: "2px", right: "-10px", width: "8px", height: "8px", animationDelay: "1s" },
  { top: "-14px", left: "20px", width: "6px", height: "6px", animationDelay: "1.8s" },
  { bottom: "-10px", right: "14px", width: "7px", height: "7px", animationDelay: "2.1s" },
  { top: "30px", right: "2px", width: "6px", height: "6px", animationDelay: ".5s" },
  { top: "-4px", left: "36px", width: "7px", height: "7px", animationDelay: "1.1s" },
  { bottom: "20px", left: "-14px", width: "6px", height: "6px", animationDelay: "1.6s" },
];

const SPARKLE_PATH = "M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z";

/** 3 biến thể màu/icon "đang học" (cycle theo vị trí) + 1 biến thể "chưa bắt đầu" — chép nguyên từ bản thiết kế gốc. */
const LEARN_CARD_ACTIVE_STYLES = [
  {
    cardBg: "linear-gradient(155deg,#f4efff 0%,#e4d9ff 100%)",
    tagBg: "#ded0ff", tagColor: "#5a37e6",
    iconBg: "linear-gradient(145deg,#8b6bff,#5a37e6)", fillColor: "#7c5cfc",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5c-4.7 0-8.5 3.1-8.5 7 0 2.3 1.4 4.4 3.5 5.7-.1 1-.5 2-1.2 2.9 1.5-.1 2.8-.6 3.9-1.4.7.2 1.5.2 2.3.2 4.7 0 8.5-3.1 8.5-7s-3.8-7.4-8.5-7.4z" />
        <circle cx="8.7" cy="10.5" r=".9" fill="#fff" stroke="none" />
        <circle cx="12" cy="10.5" r=".9" fill="#fff" stroke="none" />
        <circle cx="15.3" cy="10.5" r=".9" fill="#fff" stroke="none" />
      </svg>
    ),
  },
  {
    cardBg: "linear-gradient(155deg,#eafaf0 0%,#cdf0dc 100%)",
    tagBg: "#c8ecd6", tagColor: "#16743a",
    iconBg: "linear-gradient(145deg,#3ecf7e,#189a52)", fillColor: "#22b35d",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
      </svg>
    ),
  },
  {
    cardBg: "linear-gradient(155deg,#eaf2ff 0%,#cfe1ff 100%)",
    tagBg: "#ded0ff", tagColor: "#5a37e6",
    iconBg: "linear-gradient(145deg,#8b6bff,#5a37e6)", fillColor: "#7c5cfc",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10v4a1 1 0 001 1h2l7 3.5V5.5L6 9H4a1 1 0 00-1 1z" />
        <path d="M17.5 8a4.5 4.5 0 010 8M20.3 5.5a8.5 8.5 0 010 13" />
      </svg>
    ),
  },
];

const LEARN_CARD_INACTIVE_STYLE = {
  cardBg: "linear-gradient(155deg,#f6f5fa 0%,#e6e4ef 100%)",
  tagBg: "#e2e0ec", tagColor: "#57506f",
  iconBg: "linear-gradient(145deg,#9791b8,#5f5980)", fillColor: "#9791b8",
  icon: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="6" height="6" rx="1.5" />
      <rect x="14.5" y="4" width="6" height="6" rx="1.5" />
      <rect x="9" y="14" width="6" height="6" rx="1.5" />
      <path d="M6.5 10v2a2 2 0 002 2H9M17.5 10v2a2 2 0 01-2 2h-1.5" />
    </svg>
  ),
};

/** Nhãn/màu/icon theo loại tài nguyên — chép nguyên 5 biến thể của bản thiết kế gốc. */
const SUGG_STYLE: Record<ResourceSuggestionType, {
  label: string; badgeBg: string; badgeColor: string; iconBg: string; icon: React.ReactNode;
}> = {
  prompt: {
    label: "PROMPT", badgeBg: "#f1ebff", badgeColor: "#5a37e6", iconBg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 4.5h15v11.5H9l-4.5 4z" />
        <path d="M8.5 8.8h7M8.5 12h4.5" />
      </svg>
    ),
  },
  template: {
    label: "TEMPLATE", badgeBg: "#eaf1ff", badgeColor: "#1d4ed8", iconBg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 2.5h8l5 5v14h-13z" />
        <path d="M14.5 2.5v5h5M9 13h6M9 16.5h6" />
      </svg>
    ),
  },
  workflow: {
    label: "WORKFLOW", badgeBg: "#e6f7ec", badgeColor: "#16743a", iconBg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h12.5l-3-3M20 16H7.5l3 3" />
      </svg>
    ),
  },
  ebook: {
    label: "EBOOK", badgeBg: "#fdeee6", badgeColor: "#b45309", iconBg: "linear-gradient(145deg,#ff9d52,#b45309)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.2C10.4 4.9 8.2 4.2 5.5 4.2c-.6 0-1 .4-1 1v11.6c0 .6.4 1 1 1 2.7 0 4.9.7 6.5 2 1.6-1.3 3.8-2 6.5-2 .6 0 1-.4 1-1V5.2c0-.6-.4-1-1-1-2.7 0-4.9.7-6.5 2z" />
        <path d="M12 6.2v13.6" />
      </svg>
    ),
  },
  tool: {
    label: "TOOL", badgeBg: "#eaf6f9", badgeColor: "#0e7490", iconBg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 6.2a3.8 3.8 0 00-5 4.8l-6 6 2.5 2.5 6-6a3.8 3.8 0 004.8-5l-2.4 2.4-2.1-.6-.6-2.1z" />
      </svg>
    ),
  },
};

/** Đích thật của mỗi loại tài nguyên khi bấm thẻ — `null` = không có trang xem nội dung nào (không gắn link giả). */
const SUGG_TARGET: Record<ResourceSuggestionType, string | null> = {
  prompt: "/portal/prompts",
  template: "/portal/templates",
  workflow: "/portal/sop",
  ebook: null,
  tool: "/v2/hoc-vien-ai",
};

export function TrangChuClient({
  courses,
  progress,
  suggestions,
  premium,
  greeting,
  stats,
  opportunities,
}: {
  courses: AcademyCourse[];
  progress: AcademyProgress;
  suggestions: ResourceSuggestion[];
  premium: PremiumStatus;
  greeting: GreetingState;
  stats: PortalStats;
  opportunities: OpportunityPreview[];
}) {
  const router = useRouter();
  // `<script>` gốc: `this.classList.toggle('on')` trên #themeSwitch.
  const [themeOn, setThemeOn] = useState(false);

  // `<script>` gốc: mọi phần tử `[data-href]` điều hướng khi bấm.
  const go = (htmlFile: string) => () => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  // GIAI ĐOẠN 1 (rework) — "Companion sống": lời chào theo giờ trong ngày.
  // Tính CLIENT-SIDE (sau mount, cùng kỹ thuật `CompanionThoughtLine`) vì
  // giờ máy chủ (UTC) không phản ánh đúng múi giờ thật của người dùng.
  const [timeLine, setTimeLine] = useState<string | null>(null);
  useEffect(() => {
    const hour = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc đồng hồ thiết bị thật, không có tương đương SSR
    if (hour < 12) setTimeLine(getWarmthLine("goodMorning"));
    else if (hour >= 18) setTimeLine(getWarmthLine("goodEvening"));
  }, []);

  // Câu suy ngẫm ngắn của Companion (cùng nguồn Thought Seeds thật đã
  // dùng ở `/portal/companion`/`CompanionThoughtLine`) — chọn 1 lần/lượt ghé.
  const [thought, setThought] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chọn 1 lần từ danh sách tĩnh, không có tương đương SSR
    setThought(getRandomThoughtSeed());
  }, []);

  // "Hoạt động gần nhất" — khoá đang học dở thật (từ props `courses`/
  // `progress` đã có sẵn, không gọi thêm dữ liệu mới).
  const activityLine = useMemo(() => {
    const inProgress = courses.find((c) => {
      const done = progress.completedByCourse[c.id] ?? 0;
      return done > 0 && c.lessonCount > 0 && done < c.lessonCount;
    });
    if (!inProgress) return null;
    const done = progress.completedByCourse[inProgress.id] ?? 0;
    const remaining = inProgress.lessonCount - done;
    return `Bạn đang học dở "${inProgress.name}" — còn ${remaining} bài nữa là xong.`;
  }, [courses, progress]);

  const [welcomeFirstLine, ...welcomeRestLines] = greeting.welcomeMessage.split("\n");
  const heroSubtitle =
    greeting.comebackLine ??
    activityLine ??
    timeLine ??
    (welcomeRestLines.length > 0
      ? welcomeRestLines.join(" ")
      : "Hôm nay là một ngày tuyệt vời để học hỏi và phát triển cùng AI.");
  const showNameEyebrow = Boolean(greeting.fullName) && greeting.welcomeState !== "first";

  return (
    <div className="tcp">
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="mark">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#3B82F6" />
                <circle cx="27" cy="7.5" r="3" fill="#F97316" />
              </svg>
            </div>
            <div className="name">
              <span className="vo">VO DUONG</span> <span className="ai">AI</span>
            </div>
          </div>
          <nav className="main">
            <button className="nav-item active" data-page="home">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Trang chủ
            </button>
            <button className="nav-item" onClick={go("Companion.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Companion AI
            </button>
            <button className="nav-item" onClick={go("Moi ngay mot y tuong.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17a1 1 0 001 1h4a1 1 0 001-1v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" />
              </svg>
              Mỗi ngày một ý tưởng
            </button>
            <button className="nav-item" onClick={go("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item" onClick={go("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <button className="nav-item" onClick={go("Premium.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
              Premium
            </button>
            <button className="nav-item" onClick={go("Chuong trinh Affilate.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
              </svg>
              Chương trình Affilate
            </button>
            <button className="nav-item" onClick={go("Cong dong AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="8" r="3" />
                <circle cx="17" cy="9" r="3" />
                <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
              </svg>
              Cộng đồng AI
            </button>
          </nav>
          <div className="side-label">TIỆN ÍCH NHANH</div>
          <nav className="main">
            <button className="nav-item" onClick={go("Nhat ky hoc tap.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
              </svg>
              Nhật ký học tập
            </button>
            <button className="nav-item" onClick={go("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
            </button>
            <button className="nav-item" onClick={go("Khu vuon cua ban.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
              </svg>
              Khu vườn của bạn
            </button>
          </nav>
          {/* Founder: tài khoản đã Premium không thấy mục nâng cấp ở bất kỳ đâu
              trong portal 2.0 — nguyên tắc site-wide đã áp dụng cho `PortalV2Shell`. */}
          {!premium.isPremium && (
            <div className="promo">
              <div
                className="crown"
                style={{ background: "none", boxShadow: "none", width: "54px", height: "54px", overflow: "visible" }}
              >
                {CROWN_SPARKLES.map((style, i) => (
                  <svg key={i} className="crown-sparkle" style={style} viewBox="0 0 24 24" fill="currentColor">
                    <path d={SPARKLE_PATH} />
                  </svg>
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element -- giữ nguyên thẻ <img>
                    của bản gốc: kích thước cố định 58.5px do CSS/inline style quy định, không
                    cần lớp tối ưu của next/image và next/image sẽ chèn thêm wrapper làm lệch
                    DOM so với thiết kế chuẩn. */}
                <img
                  src="/v2-static/assets/icon-premium.png"
                  alt=""
                  style={{ width: "58.5px", height: "58.5px", objectFit: "contain", position: "relative", zIndex: 1 }}
                />
              </div>
              <h4>Nâng cấp Premium</h4>
              <p>Mở khóa toàn bộ lộ trình, tài nguyên và trải nghiệm đồng hành cùng AI.</p>
              <button onClick={go("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
          <div className="theme-toggle">
            <div
              className={themeOn ? "switch on" : "switch"}
              id="themeSwitch"
              onClick={() => setThemeOn((v) => !v)}
            />
            Chế độ sáng
          </div>
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm kiếm khóa học, tài liệu, công cụ, prompt..." variant="bare" />
            <div className="topbar-right">
              {!premium.isPremium && (
                <button className="upgrade-btn" onClick={go("Premium.html")}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                  </svg>
                  Nâng cấp Premium
                </button>
              )}
              <NotificationBell />
              <ProfileMenu premium={premium} />
            </div>
          </div>

          <div className="content">
            <div className="center-col">
              <section className="hero">
                {MOVE_DOTS.map((d, i) => (
                  <div
                    key={i}
                    className="move-dot"
                    style={
                      {
                        top: d.top,
                        left: d.left,
                        width: d.size,
                        height: d.size,
                        "--dx": d.dx,
                        "--dy": d.dy,
                        animation: `dotDrift ${d.dur} ease-in-out infinite`,
                        animationDelay: d.delay,
                      } as React.CSSProperties
                    }
                  />
                ))}
                <div className="hero-text">
                  {showNameEyebrow && <p className="hero-eyebrow">Chào {greeting.fullName}</p>}
                  <h1>{welcomeFirstLine}</h1>
                  <p style={{ whiteSpace: "pre-line" }}>{heroSubtitle}</p>
                  <div className="hero-actions">
                    <button className="btn-primary" onClick={go("Hoc vien AI.html")}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Tiếp tục học
                    </button>
                    <button className="btn-ghost" onClick={go("Companion.html")}>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
                      </svg>
                      Gặp Companion AI Mentor
                    </button>
                  </div>
                </div>
                <div className="hero-bot-wrap">
                  <div className="hero-bot-glow" />
                  {/* eslint-disable-next-line @next/next/no-img-element -- xem ghi chú ở <img> Premium trên. */}
                  <img src="/v2-static/assets/companion-robot.png" alt="Companion AI Mentor" />
                  <svg className="hero-stars" viewBox="0 0 110 90" fill="none">
                    <defs>
                      <linearGradient id="starGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fff6d8" />
                        <stop offset="45%" stopColor="#ffd75e" />
                        <stop offset="100%" stopColor="#e0a721" />
                      </linearGradient>
                      <filter id="starGlow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="1.4" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <g filter="url(#starGlow)">
                      <path className="star" style={{ animationDelay: "0s" }} d="M55 4l3.6 8.6 9.3.8-7.1 6.1 2.2 9.1L55 23.8l-8 4.8 2.2-9.1-7.1-6.1 9.3-.8z" fill="url(#starGold)" />
                      <path className="star" style={{ animationDelay: ".3s" }} d="M24 20l2.6 6.2 6.7.6-5.1 4.4 1.6 6.5L24 34.2l-5.8 3.5 1.6-6.5-5.1-4.4 6.7-.6z" fill="url(#starGold)" />
                      <path className="star" style={{ animationDelay: ".6s" }} d="M86 22l2.6 6.2 6.7.6-5.1 4.4 1.6 6.5L86 36.2l-5.8 3.5 1.6-6.5-5.1-4.4 6.7-.6z" fill="url(#starGold)" />
                      <path className="star" style={{ animationDelay: ".9s" }} d="M12 44l2 4.8 5.2.5-4 3.4 1.3 5-4.5-2.7-4.5 2.7 1.3-5-4-3.4 5.2-.5z" fill="url(#starGold)" />
                      <path className="star" style={{ animationDelay: "1.2s" }} d="M98 46l2 4.8 5.2.5-4 3.4 1.3 5-4.5-2.7-4.5 2.7 1.3-5-4-3.4 5.2-.5z" fill="url(#starGold)" />
                    </g>
                  </svg>
                </div>
              </section>

              {thought && <p className="companion-quote">&ldquo;{thought}&rdquo;</p>}

              <section>
                <div className="section-head">
                  <h2>Portal 2.0 trong một cái nhìn</h2>
                </div>
                <div className="portal-stats">
                  <div className="portal-stat-card" onClick={go("Du an Co hoi.html")}>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#8b7bde,#5f4bc9)" }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="portal-stat-num">{stats.ecosystemCount}</div>
                      <div className="portal-stat-label">Hệ sinh thái Dự án &amp; Cơ hội</div>
                    </div>
                  </div>
                  <div className="portal-stat-card" onClick={go("Premium.html")}>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#f5c56b,#e2b23c)" }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="portal-stat-num">{stats.premiumPlanCount}</div>
                      <div className="portal-stat-label">Gói Premium đang mở</div>
                    </div>
                  </div>
                  <div className="portal-stat-card" onClick={go("Cong dong AI.html")}>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#60a5fa,#2563eb)" }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87" />
                        <path d="M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    </div>
                    <div>
                      <div className="portal-stat-num">{stats.communityChannelCount}</div>
                      <div className="portal-stat-label">Kênh cộng đồng đang hoạt động</div>
                    </div>
                  </div>
                  <div className="portal-stat-card" onClick={go("Hoc vien AI.html")}>
                    <div className="ico" style={{ background: "linear-gradient(145deg,#4ade80,#16a34a)" }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 6.2a3.8 3.8 0 00-5 4.8l-6 6 2.5 2.5 6-6a3.8 3.8 0 004.8-5l-2.4 2.4-2.1-.6-.6-2.1z" />
                      </svg>
                    </div>
                    <div>
                      <div className="portal-stat-num">{stats.toolCount}</div>
                      <div className="portal-stat-label">Công cụ AI trong Workspace</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="section-head">
                  <h2>Khám phá nhanh</h2>
                </div>
                <div className="explore-grid">
                  <div className="explore-card" onClick={go("Companion.html")}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- xem ghi chú ở <img> Premium trên. */}
                    <div className="ico ico-img"><img src="/v2-static/assets/icon-companion.png" alt="Companion" /></div>
                    <h3>Companion AI</h3>
                    <p>AI Mentor cá nhân hóa, hiểu bạn, nhớ bạn và đồng hành cùng bạn 24/7</p>
                  </div>
                  <div className="explore-card" onClick={go("Moi ngay mot y tuong.html")}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- xem ghi chú ở <img> Premium trên. */}
                    <div className="ico ico-img"><img src="/v2-static/assets/icon-moi-ngay-mot-y-tuong.png" alt="Mỗi ngày một ý tưởng" /></div>
                    <h3>Mỗi ngày một ý tưởng</h3>
                    <p>Trái tim của Portal — kết nối tới mọi mục khác. Đang được xây dựng.</p>
                  </div>
                  <div className="explore-card" onClick={go("Hoc vien AI.html")}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- xem ghi chú ở <img> Premium trên. */}
                    <div className="ico ico-img"><img src="/v2-static/assets/icon-hocvien.png" alt="Học viện AI" /></div>
                    <h3>Học viện AI</h3>
                    <p>Lộ trình bài bản từ cơ bản đến nâng cao, học đi đôi với thực hành.</p>
                  </div>
                  <div className="explore-card" onClick={go("Du an Co hoi.html")}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- xem ghi chú ở <img> Premium trên. */}
                    <div className="ico ico-img"><img src="/v2-static/assets/icon-duan.png" alt="Dự án &amp; Cơ hội" /></div>
                    <h3>Dự án &amp; Cơ hội</h3>
                    <p>Cơ hội hợp tác, đầu tư và đồng hành trong các dự án công nghệ AI.</p>
                  </div>
                  <div className="explore-card" onClick={go("Premium.html")}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- xem ghi chú ở <img> Premium trên. */}
                    <div className="ico ico-img"><img src="/v2-static/assets/icon-premium.png" alt="Premium" /></div>
                    <h3>Premium</h3>
                    <p>Tài nguyên độc quyền dành cho thành viên. Nội dung chuyên sâu, công cụ cao cấp và tư vấn 1:1 cùng chuyên gia.</p>
                  </div>
                </div>
              </section>

              <section>
                <div className="section-head">
                  <h2>Tiếp tục học tập</h2>
                  <a onClick={go("Hoc vien AI.html")} style={{ cursor: "pointer" }}>Xem tất cả khóa học</a>
                </div>
                {courses.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                    Chưa có khoá học nào sẵn sàng để hiển thị ở đây — xem toàn bộ lộ trình tại Học viện AI.
                  </p>
                ) : (
                  <div className="learn-grid">
                    {courses.map((course, i) => {
                      const completed = progress.completedByCourse[course.id] ?? 0;
                      const percent = course.lessonCount > 0 ? Math.round((completed / course.lessonCount) * 100) : 0;
                      const style = percent > 0 ? LEARN_CARD_ACTIVE_STYLES[i % LEARN_CARD_ACTIVE_STYLES.length] : LEARN_CARD_INACTIVE_STYLE;
                      return (
                        <div
                          key={course.id}
                          className="learn-card"
                          style={{ background: style.cardBg, cursor: "pointer" }}
                          onClick={() => router.push(`/portal/premium/${course.id}/hoc`)}
                        >
                          <span className="learn-tag" style={{ background: style.tagBg, color: style.tagColor }}>
                            {percent > 0 ? "ĐANG HỌC" : "CHƯA BẮT ĐẦU"}
                          </span>
                          <div className="learn-icon" style={{ width: "44px", height: "44px", borderRadius: "11px", background: style.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {style.icon}
                          </div>
                          <h4>{course.name}</h4>
                          <div className="learn-progress-track"><div className="learn-progress-fill" style={{ width: `${percent}%`, background: style.fillColor }} /></div>
                          <span className="learn-pct">{percent}%</span>
                          <div className="learn-cta">{percent > 0 ? "Tiếp tục học" : "Bắt đầu học"}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {opportunities.length > 0 && (
                <section>
                  <div className="section-head">
                    <h2>Cơ hội nổi bật</h2>
                    <a onClick={go("Du an Co hoi.html")} style={{ cursor: "pointer" }}>Xem tất cả</a>
                  </div>
                  <div className="opportunity-grid">
                    {opportunities.map((o) => (
                      <div key={o.slug} className="opportunity-card" onClick={() => router.push(OPPORTUNITY_HREF[o.slug])}>
                        <h4>{o.name}</h4>
                        <p>{o.description}</p>
                        <span className="cta">
                          Xem chi tiết
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="section-head">
                  <h2>Gợi ý dành cho bạn</h2>
                  <a onClick={go("He tri thuc CKOS.html")} style={{ cursor: "pointer" }}>Xem tất cả</a>
                </div>
                {suggestions.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                    Chưa có nội dung nào sẵn sàng để gợi ý — ghé Hệ tri thức AI để khám phá thêm.
                  </p>
                ) : (
                  <div className="sugg-grid">
                    {suggestions.map((s) => {
                      const style = SUGG_STYLE[s.type];
                      const target = SUGG_TARGET[s.type];
                      return (
                        <div
                          key={s.type}
                          className="sugg-card"
                          style={target ? { cursor: "pointer" } : undefined}
                          onClick={target ? () => router.push(target) : undefined}
                        >
                          <span className="sugg-type" style={{ background: style.badgeBg, color: style.badgeColor }}>{style.label}</span>
                          <div className="sugg-icon" style={{ background: style.iconBg }}>{style.icon}</div>
                          <h5>{s.title}</h5>
                          {s.category && <span className="sugg-meta">{s.category}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
