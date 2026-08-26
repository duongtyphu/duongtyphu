"use client";

/* =============================================================================
 * Học viện AI 2.0 — TRANG GỘP (gộp CKOS + Học viện AI thành 1 trang "Học
 * viện AI" duy nhất, 3 tab nội bộ).
 *
 * Đây LÀ trang thay thế `/v2/hoc-vien-ai` cũ — gộp toàn bộ nội dung của
 * `/v2/he-tri-thuc` (CKOS). Route hub cũ đó đã XOÁ hẳn — mọi HREF_MAP/link
 * cứng trỏ vào route đó trong toàn bộ `/v2/*` đã đổi sang `/v2/hoc-vien-ai`.
 * 4 route CON của `/v2/he-tri-thuc` (`[slug]`/`bai-hoc/[slug]`/
 * `bo-suu-tap/[slug]`/`danh-muc/[slug]`) và file CSS `he-tri-thuc.css` VẪN
 * GIỮ NGUYÊN — vẫn là đích link thật của tài liệu/lesson/collection/category
 * CKOS (route con 2.0 native), và vẫn được trang này import trực tiếp để
 * dùng style `.ckos`. `ai-workspace.css` cũng VẪN GIỮ (import) — tab "Thư
 * viện tài nguyên" bên dưới vẫn dùng lại class `.aiw` cho lưới nguồn tài
 * nguyên, dù tab "AI Workspace" (công cụ/dự án/workflow) đã bị gỡ hẳn khỏi
 * trang này theo yêu cầu Founder — nội dung đó vẫn sống độc lập ở route
 * riêng `/v2/ai-workspace`.
 *
 * KIẾN TRÚC: 1 sidebar/topbar DUY NHẤT, bọc `.content > .center-col +
 * .right-col` của từng phần trong đúng class-root CSS gốc (`.ckos`/`.aiw`).
 *
 * 3 TAB (thứ tự cố định trong `TABS`, đã bỏ "Tổng quan" và "Tiến độ của
 * tôi", đã gộp "Thư viện của tôi" vào "Thư viện tài nguyên", đã gỡ tab
 * "AI Workspace"):
 *  0. Hệ tri thức — ĐÃ CHUYỂN VÀO ĐÂY 3 nhóm "Học AI theo nhu cầu/công
 *     cụ/nghề nghiệp" (55 bài slide, mỗi nhóm 3 bài đầu miễn phí — còn lại
 *     khoá Premium, xem `live-academy-slides.ts`), thay hẳn UI cũ (banner
 *     hero/"Danh mục tri thức nổi bật"/"Tài liệu mới nhất" — theo yêu cầu
 *     Founder, đã xoá 3 khối này). Trình chiếu native `SlideViewer.tsx` —
 *     không nhúng công cụ ngoài. Cột phải GIỮ NGUYÊN (CKOS là gì?/CKOS
 *     theo lộ trình/Tài liệu phổ biến/help-card) — không nằm trong phạm vi
 *     yêu cầu xoá.
 *  1. Khóa học & Lộ trình — sau khi chuyển 3 nhóm bài slide sang tab 0, tab
 *     này chỉ còn lưới "Video bài giảng AI" (đổi tên từ "Video hướng dẫn"
 *     theo yêu cầu Founder) + cột phải (vòng tiến độ `academy.progress`,
 *     "Lớp học sắp diễn ra").
 *  2. Thư viện tài nguyên — gộp cả 4 nguồn (Prompt/SOP/Resource/Best
 *     Practice) LẪN thư viện CKOS (Bộ sưu tập + Bài học). Mọi mục mở XEM
 *     ĐẦY ĐỦ ngay tại chỗ (panel inline trong tab này) thay vì điều hướng
 *     sang Portal 1.0 — không còn link nào từ 2.0 sang 1.0. Case Study và
 *     Blog AI đã bị gỡ hẳn khỏi danh mục này theo yêu cầu Founder (đúng kế
 *     hoạch gốc 14 hạng mục — mục 4c).
 *
 * CÒN GIỮ NGUYÊN "TRƠ" ĐÚNG NHƯ THIẾT KẾ GỐC: mọi hành vi trơ (nút lưu tài
 * liệu, ô tìm kiếm, chuông, CTA `href="#"`...) giữ nguyên hệt — không tự
 * thêm hành vi mới ngoài phạm vi yêu cầu.
 * ========================================================================== */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { CkosPopularDocumentsResult, CkosStage } from "@/lib/portal/live-ckos";
import type { KnowledgeCollection } from "@/features/knowledge/types/knowledge-collection.types";
import type { KnowledgeSeed } from "@/features/knowledge/types/knowledge-seed.types";
import type { AcademyProgress } from "@/lib/portal/live-academy";
import {
  ACADEMY_LESSON_GROUPS,
  type AcademyLessonGroup,
  type AcademySlideLessonDetail,
  type AcademyVideo,
} from "@/lib/portal/live-academy-slides";
import { SlideViewer } from "./SlideViewer";
import type { LivePrompt } from "@/lib/portal/live-prompts";
import type { LiveSop } from "@/lib/portal/live-sop";
import type { LiveResource } from "@/lib/portal/live-resources";
import type { LiveBestPractice } from "@/lib/portal/live-best-practices";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../inter-gf.css";
import "./hoc-vien-ai.css";
import "../he-tri-thuc/he-tri-thuc.css";
import "../ai-workspace/ai-workspace.css";

/** Đích điều hướng của mockup (tên file `.html`) → route thật trong `/v2`. */
const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "Moi ngay mot y tuong.html": "/v2/moi-ngay-mot-y-tuong",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Cong dong AI.html": "/v2/cong-dong-ai",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

const SPARKLE_PATH = "M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z";

const CROWN_SPARKLES: React.CSSProperties[] = [
  { top: -8, left: -10, width: 12, height: 12, animationDelay: "0s" },
  { top: 4, right: -14, width: 9, height: 9, animationDelay: ".7s" },
  { bottom: -6, left: 6, width: 8, height: 8, animationDelay: "1.4s" },
  { top: 22, left: -16, width: 7, height: 7, animationDelay: ".3s" },
  { bottom: 2, right: -10, width: 8, height: 8, animationDelay: "1s" },
  { top: -14, left: 20, width: 6, height: 6, animationDelay: "1.8s" },
  { bottom: -10, right: 14, width: 7, height: 7, animationDelay: "2.1s" },
  { top: 30, right: 2, width: 6, height: 6, animationDelay: ".5s" },
  { top: -4, left: 36, width: 7, height: 7, animationDelay: "1.1s" },
  { bottom: 20, left: -14, width: 6, height: 6, animationDelay: "1.6s" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} phút`;
  return `${hours} giờ ${minutes} phút`;
}

/* ------------------------------------------------------------------- Tabs */

const TABS = ["Hệ tri thức", "Khóa học & Lộ trình", "Thư viện tài nguyên"] as const;
/** Khoá `?tab=` tương ứng từng phần tử `TABS` — dùng cho link ngoài. */
const TAB_QUERY_KEYS = ["he-tri-thuc", "khoa-hoc", "thu-vien"] as const;

function TabIcon({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10L12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7l2-3h14l2 3M3 7v12a1 1 0 001 1h16a1 1 0 001-1V7M3 7h18" />
        </svg>
      );
  }
}

/* -------------------------------------------------------------- CKOS tab */

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
    </svg>
  );
}

/* -------------------------------------------- Resource Library tab (mới) */

type IconStyle = { bg: string; icon: React.ReactNode };

type ResourceCategoryKey = "prompt" | "sop" | "resource" | "best-practice";

/** 1 mục hiển thị trong danh sách "Thư viện tài nguyên" — quy về 1 shape
 * chung cho cả 4 nguồn dữ liệu khác nhau (Prompt/SOP/Resource/Best
 * Practice), mỗi nguồn tự map sang shape này.
 *
 * KHÔNG có `href` sang Portal 1.0 — bấm vào 1 mục mở panel xem đầy đủ
 * NGAY TẠI TRANG NÀY (state `openResourceKey`), tra lại bản ghi gốc qua
 * `id` trong đúng mảng nguồn (`resourceLibrary.*`). */
type ResourceItem = {
  key: string;
  category: ResourceCategoryKey;
  id: string;
  title: string;
  tag: string;
  subtitle: string;
};

const RESOURCE_CATEGORY_STYLE: Record<ResourceCategoryKey, IconStyle> = {
  prompt: {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M4 5h16v10H8l-4 4z" />
      </svg>
    ),
  },
  sop: {
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M9 6h10M9 12h10M9 18h10" />
        <path d="M4.5 6l.7.7L6.5 5M4.5 12l.7.7L6.5 11M4.5 18l.7.7L6.5 17" />
      </svg>
    ),
  },
  resource: {
    bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M6 2h9l5 5v15H6z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
  "best-practice": {
    bg: "linear-gradient(145deg,#e2b23c,#b3801f)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M12 2l2.9 6.9 7.1.6-5.4 4.6 1.7 7-6.3-4-6.3 4 1.7-7L1.9 9.5l7.1-.6z" />
      </svg>
    ),
  },
};

const RESOURCE_CATEGORY_LABEL: Record<ResourceCategoryKey, string> = {
  prompt: "Prompt",
  sop: "SOP & Quy trình",
  resource: "Tài nguyên",
  "best-practice": "Thực hành tốt",
};

/**
 * Khoá lọc DUY NHẤT cho lưới "N nguồn tài nguyên" — 4 nguồn tĩnh
 * (`ResourceCategoryKey`) GỘP CHUNG với N bộ sưu tập CKOS (mỗi bộ sưu tập
 * 1 card `collection-${slug}`, số lượng ăn theo `ckos.collections` thật,
 * không hardcode số 2). Gộp về 1 lưới/1 state để người dùng thấy TOÀN BỘ
 * nguồn tài nguyên ở 1 nơi duy nhất, không phải lục 2 khu vực khác nhau
 * (trước đây "6 nguồn tài nguyên" và "Bộ sưu tập tri thức" là 2 khối
 * tách rời, mỗi khối 1 kiểu thẻ khác nhau — đã gộp cho gọn/nhất quán).
 */
type LibraryFilterKey = ResourceCategoryKey | `collection-${string}`;

const COLLECTION_CARD_STYLE: IconStyle = {
  bg: "linear-gradient(145deg,#14b8a6,#0f766e)",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
      <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
    </svg>
  ),
};

/* ---------------------------------------------------------------- Props */

type CkosData = {
  stages: CkosStage[];
  ckosIntro: string;
  popular: CkosPopularDocumentsResult;
  collections: KnowledgeCollection[];
  seeds: KnowledgeSeed[];
};

type AcademyData = {
  progress: AcademyProgress;
  slideLessons: AcademySlideLessonDetail[];
  videos: AcademyVideo[];
};

type ResourceLibraryData = {
  prompts: LivePrompt[];
  sops: LiveSop[];
  resources: LiveResource[];
  bestPractices: LiveBestPractice[];
};

export function HocVienAiClient({
  premium,
  ckos,
  academy,
  resourceLibrary,
}: {
  premium: PremiumStatus;
  ckos: CkosData;
  academy: AcademyData;
  resourceLibrary: ResourceLibraryData;
}) {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  // Đọc `?tab=` ở `useEffect` (không phải lazy init của `useState`) để khớp
  // đúng HTML server-render ban đầu (luôn tab 0), tránh hydration mismatch —
  // chỉ đổi tab sau khi mount xong.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wanted = params.get("tab");
    const index = TABS.findIndex((_, i) => TAB_QUERY_KEYS[i] === wanted);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc `window.location.search` thật, không có tương đương SSR
    if (index >= 0) setTab(index);
  }, []);

  // Tab "Khóa học & Lộ trình" — nhóm đang lọc + bài đang mở trong SlideViewer.
  const [lessonGroup, setLessonGroup] = useState<AcademyLessonGroup>("nhu-cau");
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const visibleLessons = academy.slideLessons.filter((l) => l.group === lessonGroup);
  const openLesson = academy.slideLessons.find((l) => l.id === openLessonId) ?? null;

  // Tab "Thư viện tài nguyên" — 1 state filter DUY NHẤT cho cả lưới N nguồn
  // (4 nguồn tài nguyên tĩnh + N bộ sưu tập CKOS động) — key là
  // `ResourceCategoryKey` cho 4 nguồn tĩnh, hoặc `collection-${slug}` cho
  // bộ sưu tập CKOS. Gộp về 1 state (thay vì 2 state rời `resourceFilter`/
  // `libChip` như trước) để lưới chỉ có ĐÚNG 1 card active tại 1 thời điểm.
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilterKey | null>(null);
  const [openResourceKey, setOpenResourceKey] = useState<string | null>(null);
  const [promptCopiedKey, setPromptCopiedKey] = useState<string | null>(null);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  /** Prefetch lúc hover/focus — xem lý do trong `PortalV2Shell.tsx`'s
      `navItem()`; trang này (trang có lượt truy cập cao nhất, gộp cả
      CKOS/Học viện AI/AI Workspace) chưa dùng shell dùng chung nên sidebar
      tự chép tay, cần đúng cơ chế tương tự riêng. */
  const prefetchNav = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.prefetch(target);
  };

  // Tab "Thư viện tài nguyên" — gộp 4 nguồn thật (Prompt/SOP/Resource/Best
  // Practice) về cùng 1 shape `ResourceItem`. KHÔNG còn `href` sang Portal
  // 1.0 — bấm vào 1 mục mở panel xem đầy đủ NGAY TẠI TRANG NÀY (xem
  // `openResource` + JSX panel bên dưới).
  const resourceItems: ResourceItem[] = [
    ...resourceLibrary.prompts.map(
      (p): ResourceItem => ({
        key: `prompt-${p.id}`,
        category: "prompt",
        id: p.id,
        title: p.title,
        tag: p.category || "Prompt",
        subtitle: p.description,
      }),
    ),
    ...resourceLibrary.sops.map(
      (s): ResourceItem => ({
        key: `sop-${s.id}`,
        category: "sop",
        id: s.id,
        title: s.title,
        tag: "SOP",
        subtitle: s.description,
      }),
    ),
    ...resourceLibrary.resources.map(
      (r): ResourceItem => ({
        key: `resource-${r.id}`,
        category: "resource",
        id: r.id,
        title: r.title,
        tag: r.type || "Tài nguyên",
        subtitle: r.description,
      }),
    ),
    ...resourceLibrary.bestPractices.map(
      (b): ResourceItem => ({
        key: `bp-${b.id}`,
        category: "best-practice",
        id: b.id,
        title: b.title,
        tag: "Thực hành tốt",
        subtitle: b.description,
      }),
    ),
  ];
  const resourceCountByCategory = resourceItems.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<ResourceCategoryKey, number>,
  );

  // Lưới "N nguồn tài nguyên" — 4 card tĩnh + 1 card/bộ sưu tập CKOS (tăng
  // theo đúng số bộ sưu tập thật, không hardcode "8"). Mỗi bộ sưu tập đếm
  // số bài học (seed) thuộc về nó qua `collectionSlug`.
  const libraryCards = [
    ...(Object.keys(RESOURCE_CATEGORY_LABEL) as ResourceCategoryKey[]).map((key) => ({
      key: key as LibraryFilterKey,
      label: RESOURCE_CATEGORY_LABEL[key],
      count: resourceCountByCategory[key] ?? 0,
      style: RESOURCE_CATEGORY_STYLE[key],
    })),
    ...ckos.collections.map((col) => ({
      key: `collection-${col.slug}` as LibraryFilterKey,
      label: col.title,
      count: ckos.seeds.filter((s) => s.collectionSlug === col.slug).length,
      style: COLLECTION_CARD_STYLE,
    })),
  ];

  const activeCollection = libraryFilter?.startsWith("collection-")
    ? ckos.collections.find((c) => `collection-${c.slug}` === libraryFilter)
    : undefined;
  const activeResourceCategory =
    libraryFilter && !activeCollection ? (libraryFilter as ResourceCategoryKey) : null;
  const activeCollectionSeeds = activeCollection
    ? ckos.seeds.filter((s) => s.collectionSlug === activeCollection.slug)
    : [];
  const libraryFilterLabel = activeCollection
    ? activeCollection.title
    : activeResourceCategory
      ? RESOURCE_CATEGORY_LABEL[activeResourceCategory]
      : "Tất cả tài nguyên";

  const visibleResourceItems = activeResourceCategory
    ? resourceItems.filter((item) => item.category === activeResourceCategory)
    : resourceItems;
  const openResource = resourceItems.find((item) => item.key === openResourceKey) ?? null;
  const openPrompt = openResource?.category === "prompt" ? resourceLibrary.prompts.find((p) => p.id === openResource.id) : undefined;
  const openSop = openResource?.category === "sop" ? resourceLibrary.sops.find((s) => s.id === openResource.id) : undefined;
  const openResourceDoc =
    openResource?.category === "resource" ? resourceLibrary.resources.find((r) => r.id === openResource.id) : undefined;
  const openBestPractice =
    openResource?.category === "best-practice" ? resourceLibrary.bestPractices.find((b) => b.id === openResource.id) : undefined;

  return (
    <div className="hva">
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
            <button className="nav-item" onClick={() => go("Trang chu Portal.html")}
              onMouseEnter={() => prefetchNav("Trang chu Portal.html")}
              onFocus={() => prefetchNav("Trang chu Portal.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Trang chủ
            </button>
            <button className="nav-item" onClick={() => go("Companion.html")}
              onMouseEnter={() => prefetchNav("Companion.html")}
              onFocus={() => prefetchNav("Companion.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Companion AI
            </button>
            <button className="nav-item" onClick={() => go("Moi ngay mot y tuong.html")}
              onMouseEnter={() => prefetchNav("Moi ngay mot y tuong.html")}
              onFocus={() => prefetchNav("Moi ngay mot y tuong.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17a1 1 0 001 1h4a1 1 0 001-1v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" />
              </svg>
              Mỗi ngày một ý tưởng
            </button>
            <button className="nav-item active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item" onClick={() => go("Du an Co hoi.html")}
              onMouseEnter={() => prefetchNav("Du an Co hoi.html")}
              onFocus={() => prefetchNav("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <button className="nav-item" onClick={() => go("Premium.html")}
              onMouseEnter={() => prefetchNav("Premium.html")}
              onFocus={() => prefetchNav("Premium.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
              Premium
            </button>
            <button className="nav-item" onClick={() => go("Chuong trinh Affilate.html")}
              onMouseEnter={() => prefetchNav("Chuong trinh Affilate.html")}
              onFocus={() => prefetchNav("Chuong trinh Affilate.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
              </svg>
              Chương trình Affilate
            </button>
            <button className="nav-item" onClick={() => go("Cong dong AI.html")}
              onMouseEnter={() => prefetchNav("Cong dong AI.html")}
              onFocus={() => prefetchNav("Cong dong AI.html")}>
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
            <button className="nav-item" onClick={() => go("Nhat ky hoc tap.html")}
              onMouseEnter={() => prefetchNav("Nhat ky hoc tap.html")}
              onFocus={() => prefetchNav("Nhat ky hoc tap.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
              </svg>
              Nhật ký học tập
            </button>
            <button className="nav-item" onClick={() => go("Hanh trinh cua toi.html")}
              onMouseEnter={() => prefetchNav("Hanh trinh cua toi.html")}
              onFocus={() => prefetchNav("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
            </button>
            <button className="nav-item" onClick={() => go("Khu vuon cua ban.html")}
              onMouseEnter={() => prefetchNav("Khu vuon cua ban.html")}
              onFocus={() => prefetchNav("Khu vuon cua ban.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
              </svg>
              Khu vườn của bạn
            </button>
          </nav>

          {!premium.isPremium && (
            <div className="promo">
              <div
                className="crown"
                style={{ background: "none", boxShadow: "none", width: 54, height: 54, overflow: "visible" }}
              >
                {CROWN_SPARKLES.map((style, i) => (
                  <svg key={i} className="crown-sparkle" style={style} viewBox="0 0 24 24" fill="currentColor">
                    <path d={SPARKLE_PATH} />
                  </svg>
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh
                    của bản thiết kế, kích thước cố định 58.5px; dùng <img> để giữ đúng
                    markup gốc (next/image chèn thêm wrapper làm lệch bố cục). */}
                <img
                  src="/v2-static/assets/icon-premium.png"
                  alt=""
                  style={{ width: 58.5, height: 58.5, objectFit: "contain", position: "relative", zIndex: 1 }}
                />
              </div>
              <h4>Nâng cấp Premium</h4>
              <p>Mở khóa toàn bộ nội dung nâng cao của Học viện AI và CKOS.</p>
              <button onClick={() => go("Premium.html")}
              onMouseEnter={() => prefetchNav("Premium.html")}
              onFocus={() => prefetchNav("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm khoá học, tri thức, công cụ, workflow..." variant="box" />
            <div className="topbar-right">
              {!premium.isPremium && (
                <button className="upgrade-btn" onClick={() => go("Premium.html")}
              onMouseEnter={() => prefetchNav("Premium.html")}
              onFocus={() => prefetchNav("Premium.html")}>
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

          {/* ---------------------------------------------------- Tab 0: Hệ tri thức */}
          {tab === 0 && (
            <div className="ckos">
              <div className="content">
                <div className="center-col">
                  <div className="page-head">
                    <h1>Học viện AI</h1>
                    <p>Hệ tri thức, khóa học và không gian thực hành AI — tất cả trong một nơi.</p>
                  </div>

                  <div className="tabs-row">
                    {TABS.map((label, i) => (
                      <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                        <TabIcon index={i} />
                        {label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="section-head">
                      <h3>Học AI theo...</h3>
                    </div>
                    <div className="acad-groups" style={{ marginTop: 14 }}>
                      {ACADEMY_LESSON_GROUPS.map((g) => {
                        const count = academy.slideLessons.filter((l) => l.group === g.key).length;
                        return (
                          <button
                            key={g.key}
                            type="button"
                            className={g.key === lessonGroup ? "acad-group-chip active" : "acad-group-chip"}
                            onClick={() => setLessonGroup(g.key)}
                          >
                            {g.label}
                            <span className="cnt">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                    {visibleLessons.length === 0 ? (
                      <div className="empty-hint" style={{ marginTop: 14 }}>
                        Chưa có bài học nào ở nhóm này — nội dung sẽ hiện ở đây khi được xuất bản.
                      </div>
                    ) : (
                      <div className="lesson-grid" style={{ marginTop: 14 }}>
                        {visibleLessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            type="button"
                            className="lesson-card"
                            onClick={() => (lesson.locked ? go("Premium.html") : setOpenLessonId(lesson.id))}
                          >
                            <span className="cat">{lesson.categoryLabel}</span>
                            <h5>{lesson.title}</h5>
                            <p>{lesson.summary}</p>
                            <div className="meta">
                              <span>{lesson.slideCount || "—"} slide</span>
                              {lesson.locked ? (
                                <span className="lesson-lock">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <rect x="4" y="10" width="16" height="10" rx="2" />
                                    <path d="M8 10V7a4 4 0 018 0v3" />
                                  </svg>
                                  Premium
                                </span>
                              ) : (
                                <span>Miễn phí</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="right-col">
                  <div className="card">
                    <div className="card-head">
                      <h4>CKOS là gì?</h4>
                      <a href="#">Xem chi tiết →</a>
                    </div>
                    <p>{ckos.ckosIntro}</p>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <h4>CKOS theo lộ trình</h4>
                    </div>
                    <div className="roadmap">
                      {ckos.stages.map((stage) => (
                        <div className="rm-item" key={stage.slug}>
                          <div className="rm-num">{stage.stageOrder}</div>
                          <div className="rm-text">
                            <h5>{stage.title}</h5>
                            <span>{stage.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <h4>Tài liệu phổ biến</h4>
                    </div>
                    {ckos.popular.documents.length === 0 ? (
                      <div className="empty-hint" style={{ padding: 0 }}>
                        Chưa có tài liệu nào — nội dung sẽ hiện ở đây khi được xuất bản.
                      </div>
                    ) : (
                      <>
                        {ckos.popular.documents.map((doc) => (
                          <Link
                            href={`/v2/he-tri-thuc/${doc.slug}`}
                            className="pop-row"
                            key={doc.slug}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            <div className="ico">
                              <DocIcon />
                            </div>
                            <div className="info">
                              <h5>{doc.title}</h5>
                              <span className="views">
                                {ckos.popular.sortedByViews
                                  ? `${doc.viewCount.toLocaleString("vi-VN")} lượt xem`
                                  : formatDate(doc.createdAt)}
                              </span>
                            </div>
                          </Link>
                        ))}
                        {!ckos.popular.sortedByViews ? (
                          <div className="empty-hint" style={{ padding: "10px 0 0" }}>
                            Chưa có dữ liệu lượt xem — đang hiện theo tài liệu mới nhất.
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="help-card">
                    <div className="stack-mini">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7.5 4.5h9l3.5 5-8 10-8-10z" />
                        <path d="M2 9.5h20M9 4.5l-1.5 5 4.5 10 4.5-10-1.5-5" />
                      </svg>
                    </div>
                    <h4>Mở khóa toàn bộ CKOS</h4>
                    <p>Truy cập tất cả tài liệu, khóa học và tài nguyên độc quyền.</p>
                    <button onClick={() => go("Premium.html")}
              onMouseEnter={() => prefetchNav("Premium.html")}
              onFocus={() => prefetchNav("Premium.html")}>Nâng cấp Premium</button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* --------------------------------------------- Tab 1: Khóa học & Lộ trình */}
          {tab === 1 && (
            <div className="content">
              <div className="center-col">
                <div className="page-head">
                  <h1>Học viện AI</h1>
                  <p>Hệ tri thức, khóa học và không gian thực hành AI — tất cả trong một nơi.</p>
                </div>

                <div className="tabs-row">
                  {TABS.map((label, i) => (
                    <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                      <TabIcon index={i} />
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="section-head">
                    <h3>Video bài giảng AI</h3>
                  </div>
                  {academy.videos.length === 0 ? (
                    <div className="empty-hint" style={{ marginTop: 14 }}>
                      Chưa có video nào — nội dung sẽ hiện ở đây khi được xuất bản.
                    </div>
                  ) : (
                    <div className="video-grid" style={{ marginTop: 14 }}>
                      {academy.videos.map((video) => {
                        const videoId = video.embedUrl?.split("/embed/")[1];
                        return (
                          <a
                            key={video.id}
                            className="video-card"
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <div className="thumb">
                              {videoId ? (
                                // eslint-disable-next-line @next/next/no-img-element -- thumbnail YouTube công khai, không cần next/image cho ảnh ngoài kích thước cố định
                                <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" />
                              ) : null}
                            </div>
                            <div className="body">
                              <h6>{video.title}</h6>
                              {video.description ? <div className="desc">{video.description}</div> : null}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <aside className="right-col">
                <div className="card">
                  <div className="card-head">
                    <h4>Hành trình học tập</h4>
                    <a href="#">Xem chi tiết →</a>
                  </div>
                  <div className="ring-block">
                    <div
                      className="ring"
                      style={{
                        background: `conic-gradient(var(--violet) 0% ${academy.progress.percent}%, var(--violet-light) ${academy.progress.percent}% 100%)`,
                      }}
                    >
                      <div className="ring-inner">
                        <div className="pct">{academy.progress.percent}%</div>
                        <div className="pct-label">Hoàn thành</div>
                      </div>
                    </div>
                    <div className="stat-lines">
                      <div className="stat-line">
                        Khóa học đã học
                        <b>
                          {academy.progress.startedCourses} / {academy.progress.totalCourses}
                        </b>
                      </div>
                      <div className="stat-line">
                        Bài học đã hoàn thành
                        <b>
                          {academy.progress.completedLessons} / {academy.progress.totalLessons}
                        </b>
                      </div>
                      <div className="stat-line">
                        Thời gian học
                        <b>{formatMinutes(academy.progress.totalMinutes)}</b>
                      </div>
                    </div>
                  </div>
                  <a className="btn-primary" style={{ width: "100%", justifyContent: "center" }} href="#">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Tiếp tục học
                  </a>
                </div>

                <div className="card">
                  <div className="card-head">
                    <h4>Lớp học sắp diễn ra</h4>
                    <a href="#">Xem lịch học →</a>
                  </div>
                  <div className="empty-hint">Chưa có lịch học trực tuyến nào — cập nhật khi có.</div>
                </div>
              </aside>
            </div>
          )}

          {/* -------------------------------------------- Tab 2: Thư viện tài nguyên */}
          {tab === 2 && (
            <div className="content">
              <div className="center-col" style={{ width: "100%" }}>
                <div className="page-head">
                  <h1>Học viện AI</h1>
                  <p>Hệ tri thức, khóa học và không gian thực hành AI — tất cả trong một nơi.</p>
                </div>

                <div className="tabs-row">
                  {TABS.map((label, i) => (
                    <button key={label} className={i === tab ? "tab active" : "tab"} onClick={() => setTab(i)}>
                      <TabIcon index={i} />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="aiw">
                  <div className="section-head">
                    <h3>{libraryCards.length} nguồn tài nguyên</h3>
                  </div>
                  <div className="grp-grid" style={{ marginTop: 14, gridTemplateColumns: "repeat(4,1fr)" }}>
                    {libraryCards.map((card) => {
                      const active = libraryFilter === card.key;
                      return (
                        <div
                          className="grp-card"
                          key={card.key}
                          onClick={() => {
                            setLibraryFilter(active ? null : card.key);
                            setOpenResourceKey(null);
                          }}
                          style={active ? { boxShadow: "0 0 0 2px var(--violet) inset" } : undefined}
                        >
                          <div className="ico" style={{ background: card.style.bg }}>
                            {card.style.icon}
                          </div>
                          <h5>{card.label}</h5>
                          <span>{card.count} mục</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="ckos">
                  {openResource ? (
                    <div className="card" style={{ marginTop: 18, padding: 22 }}>
                      <button
                        type="button"
                        onClick={() => setOpenResourceKey(null)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          font: "inherit",
                          color: "var(--violet)",
                          cursor: "pointer",
                        }}
                      >
                        ← Quay lại danh sách
                      </button>
                      <div style={{ marginTop: 14 }}>
                        <span className="doc-tag">{openResource.tag}</span>
                      </div>
                      <h2 style={{ marginTop: 10 }}>{openResource.title}</h2>

                      {openResource.category === "prompt" && openPrompt && (
                        <>
                          <p style={{ color: "var(--muted)", marginTop: 8 }}>{openPrompt.description}</p>
                          <div
                            style={{
                              marginTop: 16,
                              background: "var(--bg)",
                              border: "1px solid var(--line)",
                              borderRadius: 10,
                              padding: 16,
                              whiteSpace: "pre-wrap",
                              fontSize: 13.5,
                              lineHeight: 1.6,
                            }}
                          >
                            {openPrompt.content}
                          </div>
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ marginTop: 14 }}
                            onClick={() => {
                              navigator.clipboard.writeText(openPrompt.content);
                              setPromptCopiedKey(openResource.key);
                              setTimeout(() => setPromptCopiedKey(null), 2000);
                            }}
                          >
                            {promptCopiedKey === openResource.key ? "Đã sao chép ✓" : "Sao chép prompt"}
                          </button>
                        </>
                      )}

                      {openResource.category === "sop" && openSop && (
                        <>
                          <p style={{ color: "var(--muted)", marginTop: 8 }}>{openSop.description}</p>
                          <div style={{ marginTop: 16 }}>
                            <h5>Khi nào dùng</h5>
                            <p style={{ color: "var(--muted)" }}>{openSop.whenToUse}</p>
                          </div>
                          <div style={{ marginTop: 12 }}>
                            <h5>Khi nào không nên dùng</h5>
                            <p style={{ color: "var(--muted)" }}>{openSop.whenNotToUse}</p>
                          </div>
                          {openSop.steps.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                              <h5>Các bước thực hiện</h5>
                              <ol style={{ marginTop: 8, paddingLeft: 20, color: "var(--muted)" }}>
                                {openSop.steps.map((step, i) => (
                                  <li key={i} style={{ marginBottom: 6 }}>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </>
                      )}

                      {openResource.category === "resource" && openResourceDoc && (
                        <>
                          <p style={{ color: "var(--muted)", marginTop: 8 }}>{openResourceDoc.description}</p>
                          <div style={{ marginTop: 16 }}>
                            <h5>Khi nào dùng</h5>
                            <p style={{ color: "var(--muted)" }}>{openResourceDoc.whenToUse}</p>
                          </div>
                          <div style={{ marginTop: 12 }}>
                            <h5>Khi nào không nên dùng</h5>
                            <p style={{ color: "var(--muted)" }}>{openResourceDoc.whenNotToUse}</p>
                          </div>
                        </>
                      )}

                      {openResource.category === "best-practice" && openBestPractice && (
                        <>
                          <p style={{ color: "var(--muted)", marginTop: 8 }}>{openBestPractice.description}</p>
                          <div style={{ marginTop: 16, whiteSpace: "pre-wrap", color: "var(--muted)", lineHeight: 1.6 }}>
                            {openBestPractice.principle}
                          </div>
                        </>
                      )}

                    </div>
                  ) : activeCollection ? (
                    <>
                      <div className="section-head" style={{ marginTop: 18 }}>
                        <h3>{libraryFilterLabel}</h3>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setLibraryFilter(null);
                          }}
                        >
                          Xem tất cả →
                        </a>
                      </div>
                      <div className="doc-list" style={{ marginTop: 14 }}>
                        {activeCollectionSeeds.length === 0 ? (
                          <div className="empty-hint">Chưa có bài học nào trong bộ sưu tập này.</div>
                        ) : (
                          activeCollectionSeeds.map((seed) => (
                            <Link
                              key={seed.id}
                              className="doc-row"
                              href={`/v2/he-tri-thuc/bai-hoc/${seed.slug}`}
                              style={{ textDecoration: "none", color: "inherit" }}
                            >
                              <div className="ico">
                                <DocIcon />
                              </div>
                              <div className="info">
                                <h5>{seed.title}</h5>
                                <div className="meta">
                                  <span className="doc-tag">Bài học</span>
                                  {seed.estimatedTime ? <span>{seed.estimatedTime}</span> : null}
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="section-head" style={{ marginTop: 18 }}>
                        <h3>{libraryFilterLabel}</h3>
                        {activeResourceCategory && (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setLibraryFilter(null);
                            }}
                          >
                            Xem tất cả →
                          </a>
                        )}
                      </div>
                      <div className="doc-list" style={{ marginTop: 14 }}>
                        {visibleResourceItems.length === 0 ? (
                          <div className="empty-hint">Chưa có tài nguyên nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                        ) : (
                          visibleResourceItems.map((item) => (
                            <button
                              type="button"
                              key={item.key}
                              className="doc-row"
                              onClick={() => setOpenResourceKey(item.key)}
                              style={{
                                width: "100%",
                                background: "none",
                                border: "none",
                                textAlign: "left",
                                font: "inherit",
                                color: "inherit",
                              }}
                            >
                              <div className="ico">
                                <DocIcon />
                              </div>
                              <div className="info">
                                <h5>{item.title}</h5>
                                <div className="meta">
                                  <span className="doc-tag">{item.tag}</span>
                                  {item.subtitle ? (
                                    <span
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: 340,
                                      }}
                                    >
                                      {item.subtitle}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="ckos">
            <div className="footer-bar">
              <span>© 2024 VO DUONG AI. All rights reserved.</span>
              <span>Học viện AI 2.0</span>
            </div>
          </div>
        </div>
      </div>
      {openLesson && !openLesson.locked ? (
        <SlideViewer lesson={openLesson} onClose={() => setOpenLessonId(null)} />
      ) : null}
    </div>
  );
}
