"use client";

/* =============================================================================
 * Học viện AI 2.0 — TRANG GỘP (gộp CKOS + Học viện AI + AI Workspace thành
 * 1 trang "Học viện AI" duy nhất, 4 tab nội bộ).
 *
 * Đây LÀ trang thay thế `/v2/hoc-vien-ai` cũ — gộp toàn bộ nội dung của
 * `/v2/he-tri-thuc` (CKOS) và `/v2/ai-workspace`. 2 route hub cũ đó đã XOÁ
 * hẳn — mọi HREF_MAP/link cứng trỏ vào 2 route đó trong toàn bộ `/v2/*` đã
 * đổi sang `/v2/hoc-vien-ai`. 4 route CON của `/v2/he-tri-thuc` (`[slug]`/
 * `bai-hoc/[slug]`/`bo-suu-tap/[slug]`/`danh-muc/[slug]`) và cả 2 file CSS
 * (`he-tri-thuc.css`/`ai-workspace.css`) VẪN GIỮ NGUYÊN — vẫn là đích link
 * thật của tài liệu/lesson/collection/category CKOS (route con 2.0 native),
 * và vẫn được trang này import trực tiếp để dùng style `.ckos`/`.aiw`.
 *
 * KIẾN TRÚC: 1 sidebar/topbar DUY NHẤT, bọc `.content > .center-col +
 * .right-col` của từng phần trong đúng class-root CSS gốc (`.ckos`/`.aiw`).
 *
 * 4 TAB (thứ tự cố định trong `TABS`, đã bỏ "Tổng quan" và "Tiến độ của
 * tôi", đã gộp "Thư viện của tôi" vào "Thư viện tài nguyên"):
 *  0. Hệ tri thức — view "Tất cả tri thức" của CKOS (6 danh mục, tài liệu
 *     mới nhất, "CKOS là gì?"/lộ trình/tài liệu phổ biến).
 *  1. Khóa học & Lộ trình — 4 giai đoạn lộ trình + khóa học nổi bật + vòng
 *     tiến độ (đã có sẵn ở sidebar cột phải, không cần tab "Tiến độ" riêng).
 *  2. AI Workspace — công cụ theo nhóm, dự án, workflow mẫu, công cụ yêu
 *     thích, hoạt động gần đây.
 *  3. Thư viện tài nguyên — gộp cả 6 nguồn (Prompt/SOP/Resource/Best
 *     Practice/Case Study/Blog AI) LẪN thư viện CKOS (Bộ sưu tập + Bài
 *     học). Mọi mục Prompt/SOP/Resource/Best Practice/Blog AI mở XEM ĐẦY
 *     ĐỦ ngay tại chỗ (panel inline trong tab này) thay vì điều hướng sang
 *     Portal 1.0 — không còn link nào từ 2.0 sang 1.0. Case Study giữ
 *     link ngoài `linkUrl` nếu có (đó là site khách hàng thật, không phải
 *     Portal 1.0).
 *
 * CÒN GIỮ NGUYÊN "TRƠ" ĐÚNG NHƯ THIẾT KẾ GỐC: mọi hành vi trơ (nút lưu tài
 * liệu, ô tìm kiếm, chuông, CTA `href="#"`...) giữ nguyên hệt — không tự
 * thêm hành vi mới ngoài phạm vi yêu cầu.
 * ========================================================================== */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type {
  CkosCategory,
  CkosDocumentSummary,
  CkosPopularDocumentsResult,
  CkosStage,
} from "@/lib/portal/live-ckos";
import type { KnowledgeCollection } from "@/features/knowledge/types/knowledge-collection.types";
import type { KnowledgeSeed } from "@/features/knowledge/types/knowledge-seed.types";
import type { AcademyCourse, AcademyPath, AcademyProgress } from "@/lib/portal/live-academy";
import type {
  WorkspaceActivity,
  WorkspaceFavoriteTool,
  WorkspaceLimits,
  WorkspaceProject,
  WorkspaceToolGroup,
  WorkspaceWorkflow,
} from "@/lib/portal/live-workspace";
import type { LivePrompt } from "@/lib/portal/live-prompts";
import type { LiveSop } from "@/lib/portal/live-sop";
import type { LiveResource } from "@/lib/portal/live-resources";
import type { LiveBestPractice } from "@/lib/portal/live-best-practices";
import type { LiveCaseStudy } from "@/lib/portal/live-case-studies";
import type { BlogPost } from "@/data/blog";
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

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Hôm qua";
  if (diffDay < 7) return `${diffDay} ngày trước`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek} tuần trước`;
  return date.toLocaleDateString("vi-VN");
}

/* ------------------------------------------------------------------- Tabs */

const TABS = ["Hệ tri thức", "Khóa học & Lộ trình", "AI Workspace", "Thư viện tài nguyên"] as const;

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
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 21h8M12 18v3" />
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

const CAT_ICON_BG: Record<string, string> = {
  "nen-tang-ai": "linear-gradient(145deg,#8b6bff,#5a37e6)",
  "prompt-engineering": "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  "ung-dung-ai": "linear-gradient(145deg,#3ecf7e,#189a52)",
  "cong-cu-ai": "linear-gradient(145deg,#ff9d52,#c2660a)",
  "ky-nang-tu-duy": "linear-gradient(145deg,#e879b9,#b4348a)",
  "tri-thuc-nang-cao": "linear-gradient(145deg,#4bc4e0,#0e7490)",
};

function CategoryIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "nen-tang-ai":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "prompt-engineering":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
        </svg>
      );
    case "ung-dung-ai":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
        </svg>
      );
    case "cong-cu-ai":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0L4 11v3h3zM12.5 5.5L15 8M6 15H3v-3" />
        </svg>
      );
    case "ky-nang-tu-duy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <circle cx="9" cy="9" r="5.5" />
          <circle cx="15" cy="15" r="5.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
      );
  }
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12v18l-6-4-6 4z" />
    </svg>
  );
}

/* --------------------------------------------------------- Academy tab */

const PATH_STYLES = [
  {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    fill: "linear-gradient(90deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r=".5" fill="#fff" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    fill: "linear-gradient(90deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    fill: "linear-gradient(90deg,#ff9d52,#c2660a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </svg>
    ),
  },
  {
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    fill: "linear-gradient(90deg,#4bc4e0,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M4 19h16M7 15l3-4 3 3 5-7" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------ Workspace tab */

type IconStyle = { bg: string; icon: React.ReactNode };

const GROUP_STYLE: Record<string, IconStyle> = {
  "Trợ lý AI": {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M21 11.5a8.5 8.5 0 01-8.5 8.5 8.4 8.4 0 01-3.9-.94L3 21l1.5-4.5A8.4 8.4 0 013.5 12 8.5 8.5 0 0112 3.5a8.5 8.5 0 019 8z" />
      </svg>
    ),
  },
  "Viết lách & Nội dung": {
    bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M14.7 6.3a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0L4 11v3h3z" />
      </svg>
    ),
  },
  "Hình ảnh AI": {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="7" r="3" />
        <circle cx="12" cy="16" r="3" />
        <path d="M7 11v3M17 10v3M9 16h6" />
      </svg>
    ),
  },
  "Video AI": {
    bg: "linear-gradient(145deg,#ff6b6b,#c22e46)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M9 9l6 3-6 3z" />
      </svg>
    ),
  },
  "Âm thanh AI": {
    bg: "linear-gradient(145deg,#e2b23c,#b3801f)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M11 5L6 9H3v6h3l5 4z" />
        <path d="M15.5 8.5a5 5 0 010 7" />
      </svg>
    ),
  },
  "Nghiên cứu & Phân tích": {
    bg: "linear-gradient(145deg,#3ecf7e,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M4 19h16M7 15l3-4 3 3 5-7" />
      </svg>
    ),
  },
};

const DEFAULT_GROUP_STYLE: IconStyle = {
  bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </svg>
  ),
};

const FAVORITE_STYLE: Record<string, IconStyle> = {
  chatgpt: GROUP_STYLE["Trợ lý AI"],
  claude: {
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M12 2.5c2.4 1.8 3.8 4.6 3.8 8.3 0 2-.5 3.8-1.3 5.3l-2.5 2.4-2.5-2.4c-.8-1.5-1.3-3.3-1.3-5.3 0-3.7 1.4-6.5 3.8-8.3z" />
      </svg>
    ),
  },
  midjourney: {
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="7" r="3" />
        <circle cx="12" cy="16" r="3" />
      </svg>
    ),
  },
  "notion-ai": {
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
      </svg>
    ),
  },
  perplexity: {
    bg: "linear-gradient(145deg,#e879b9,#b4348a)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
};

const WORKFLOW_STYLE: Record<string, IconStyle> = {
  "viet-bai-blog-chuan-seo": GROUP_STYLE["Viết lách & Nội dung"],
  "tao-video-youtube": GROUP_STYLE["Video AI"],
  "content-facebook": {
    bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M18 2H6a2 2 0 00-2 2v16l4-3h10a2 2 0 002-2V4a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  "nghien-cuu-thi-truong": GROUP_STYLE["Nghiên cứu & Phân tích"],
};

/* -------------------------------------------- Resource Library tab (mới) */

type ResourceCategoryKey = "prompt" | "sop" | "resource" | "best-practice" | "case-study" | "blog";

/** 1 mục hiển thị trong danh sách "Thư viện tài nguyên" — quy về 1 shape
 * chung cho cả 6 nguồn dữ liệu khác nhau (Prompt/SOP/Resource/Best
 * Practice/Case Study/Blog AI), mỗi nguồn tự map sang shape này.
 *
 * KHÔNG có `href` sang Portal 1.0 — bấm vào 1 mục mở panel xem đầy đủ
 * NGAY TẠI TRANG NÀY (state `openResourceKey`), tra lại bản ghi gốc qua
 * `id` trong đúng mảng nguồn (`resourceLibrary.*`). Case Study là ngoại lệ
 * duy nhất còn "link ra ngoài" (`caseStudyLinkUrl`) — đó là site khách
 * hàng thật, không phải route Portal 1.0. */
type ResourceItem = {
  key: string;
  category: ResourceCategoryKey;
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  caseStudyLinkUrl?: string;
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
  "case-study": {
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M5 21V10M12 21V4M19 21v-7" />
      </svg>
    ),
  },
  blog: {
    bg: "linear-gradient(145deg,#ff6b6b,#c22e46)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
};

const RESOURCE_CATEGORY_LABEL: Record<ResourceCategoryKey, string> = {
  prompt: "Prompt",
  sop: "SOP & Quy trình",
  resource: "Tài nguyên",
  "best-practice": "Thực hành tốt",
  "case-study": "Case Study",
  blog: "Blog AI",
};

/**
 * Khoá lọc DUY NHẤT cho lưới "N nguồn tài nguyên" — 6 nguồn tĩnh
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

const STATUS_STYLE: Record<WorkspaceProject["status"], { label: string; pillBg: string; pillColor: string; fill?: string }> = {
  in_progress: { label: "Đang thực hiện", pillBg: "var(--violet-light)", pillColor: "var(--violet)" },
  completed: { label: "Hoàn thành", pillBg: "#e6f7ed", pillColor: "#189a52", fill: "#189a52" },
  paused: { label: "Tạm dừng", pillBg: "#fdf1e0", pillColor: "#a9822c", fill: "#c2660a" },
};

/* ---------------------------------------------------------------- Props */

type CkosData = {
  categories: CkosCategory[];
  documents: CkosDocumentSummary[];
  stages: CkosStage[];
  ckosIntro: string;
  popular: CkosPopularDocumentsResult;
  collections: KnowledgeCollection[];
  seeds: KnowledgeSeed[];
};

type AcademyData = {
  paths: AcademyPath[];
  courses: AcademyCourse[];
  progress: AcademyProgress;
};

type WorkspaceData = {
  groups: WorkspaceToolGroup[];
  favorites: WorkspaceFavoriteTool[];
  workflows: WorkspaceWorkflow[];
  projects: WorkspaceProject[];
  activity: WorkspaceActivity[];
  limits: WorkspaceLimits;
};

type ResourceLibraryData = {
  prompts: LivePrompt[];
  sops: LiveSop[];
  resources: LiveResource[];
  bestPractices: LiveBestPractice[];
  caseStudies: LiveCaseStudy[];
  blogPosts: BlogPost[];
};

export function HocVienAiClient({
  premium,
  ckos,
  academy,
  workspace,
  resourceLibrary,
}: {
  premium: PremiumStatus;
  ckos: CkosData;
  academy: AcademyData;
  workspace: WorkspaceData;
  resourceLibrary: ResourceLibraryData;
}) {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  // Tab "Hệ tri thức"
  const [ckosVisibleCount, setCkosVisibleCount] = useState(4);
  // Tab "AI Workspace"
  const [projTab, setProjTab] = useState(0);
  const [viewMode, setViewMode] = useState(0);
  const [starOff, setStarOff] = useState<Record<string, boolean>>({});
  // Tab "Thư viện tài nguyên" — 1 state filter DUY NHẤT cho cả lưới 8 nguồn
  // (6 nguồn tài nguyên tĩnh + N bộ sưu tập CKOS động) — key là
  // `ResourceCategoryKey` cho 6 nguồn tĩnh, hoặc `collection-${slug}` cho
  // bộ sưu tập CKOS. Gộp về 1 state (thay vì 2 state rời `resourceFilter`/
  // `libChip` như trước) để lưới chỉ có ĐÚNG 1 card active tại 1 thời điểm.
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilterKey | null>(null);
  const [openResourceKey, setOpenResourceKey] = useState<string | null>(null);
  const [promptCopiedKey, setPromptCopiedKey] = useState<string | null>(null);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const latestDocs = ckos.documents.slice(0, ckosVisibleCount);

  // Tab "Thư viện tài nguyên" — gộp 6 nguồn thật (Prompt/SOP/Resource/Best
  // Practice/Case Study/Blog AI) về cùng 1 shape `ResourceItem`. KHÔNG còn
  // `href` sang Portal 1.0 — bấm vào 1 mục mở panel xem đầy đủ NGAY TẠI
  // TRANG NÀY (xem `openResource` + JSX panel bên dưới).
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
    ...resourceLibrary.caseStudies.map(
      (c): ResourceItem => ({
        key: `cs-${c.id}`,
        category: "case-study",
        id: String(c.id),
        title: c.title,
        tag: c.clientName || "Case Study",
        subtitle: c.resultMetric || c.summary,
        caseStudyLinkUrl: c.linkUrl || undefined,
      }),
    ),
    ...resourceLibrary.blogPosts.map(
      (post): ResourceItem => ({
        key: `blog-${post.slug}`,
        category: "blog",
        id: post.slug,
        title: post.title,
        tag: post.category || "Blog AI",
        subtitle: post.excerpt,
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

  // Lưới "N nguồn tài nguyên" — 6 card tĩnh + 1 card/bộ sưu tập CKOS (tăng
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
  const openCaseStudy =
    openResource?.category === "case-study"
      ? resourceLibrary.caseStudies.find((c) => String(c.id) === openResource.id)
      : undefined;
  const openBlogPost =
    openResource?.category === "blog" ? resourceLibrary.blogPosts.find((post) => post.slug === openResource.id) : undefined;

  const countByStatus = (status: WorkspaceProject["status"]) => workspace.projects.filter((p) => p.status === status).length;
  const suggestedWorkflows = workspace.workflows.slice(0, 3);
  const showLimitBanner = premium.signedIn && !workspace.limits.isPremium;

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
            <button className="nav-item" onClick={() => go("Trang chu Portal.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Trang chủ
            </button>
            <button className="nav-item" onClick={() => go("Companion.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Companion AI
            </button>
            <button className="nav-item" onClick={() => go("Moi ngay mot y tuong.html")}>
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
            <button className="nav-item" onClick={() => go("Du an Co hoi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <button className="nav-item" onClick={() => go("Premium.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
              </svg>
              Premium
            </button>
            <button className="nav-item" onClick={() => go("Chuong trinh Affilate.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.6l6.9-4M8.6 13.4l6.9 4" />
              </svg>
              Chương trình Affilate
            </button>
            <button className="nav-item" onClick={() => go("Cong dong AI.html")}>
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
            <button className="nav-item" onClick={() => go("Nhat ky hoc tap.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5z" />
              </svg>
              Nhật ký học tập
            </button>
            <button className="nav-item" onClick={() => go("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
            </button>
            <button className="nav-item" onClick={() => go("Khu vuon cua ban.html")}>
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
              <p>Mở khóa toàn bộ nội dung nâng cao của Học viện AI, CKOS và AI Workspace.</p>
              <button onClick={() => go("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm khoá học, tri thức, công cụ, workflow..." variant="box" />
            <div className="topbar-right">
              {!premium.isPremium && (
                <button className="upgrade-btn" onClick={() => go("Premium.html")}>
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

                  <div className="ckos-hero">
                    <div className="ckos-hero-text">
                      <div className="tag">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
                        </svg>
                        HỆ TRI THỨC TOÀN DIỆN
                      </div>
                      <h2>Tri thức đúng — Ứng dụng nhanh — Tạo giá trị lớn</h2>
                      <p>
                        CKOS là hệ tri thức được chọn lọc và hệ thống hóa, giúp bạn học AI một cách bài bản và ứng dụng hiệu
                        quả.
                      </p>
                    </div>
                    <div className="brain-wrap">
                      <div className="brain-glow" />
                      <svg className="brain-svg" width="180" height="150" viewBox="0 0 180 150" fill="none">
                        <path
                          d="M90 20c-22 0-36 14-38 30-10 4-16 14-14 26 1 8 7 14 14 16-2 12 6 24 20 26 2 8 10 14 18 14s16-6 18-14c14-2 22-14 20-26 7-2 13-8 14-16 2-12-4-22-14-26-2-16-16-30-38-30z"
                          stroke="#7fb4ff"
                          strokeWidth="1.6"
                          opacity=".85"
                        />
                        <path
                          d="M90 20v100M60 40c8 6 8 18 0 26M120 40c-8 6-8 18 0 26M52 76c10-2 18 4 20 14M128 76c-10-2-18 4-20 14M58 108c10 2 16-4 18-12M122 108c-10 2-16-4-18-12"
                          stroke="#7fb4ff"
                          strokeWidth="1.2"
                          opacity=".6"
                        />
                        <g className="brain-node" fill="#9fd4ff">
                          <circle cx="60" cy="40" r="2.6" />
                        </g>
                        <g className="brain-node" fill="#9fd4ff" style={{ animationDelay: ".4s" }}>
                          <circle cx="120" cy="40" r="2.6" />
                        </g>
                        <g className="brain-node" fill="#9fd4ff" style={{ animationDelay: ".8s" }}>
                          <circle cx="52" cy="76" r="2.6" />
                        </g>
                        <g className="brain-node" fill="#9fd4ff" style={{ animationDelay: "1.2s" }}>
                          <circle cx="128" cy="76" r="2.6" />
                        </g>
                        <g className="brain-node" fill="#9fd4ff" style={{ animationDelay: "1.6s" }}>
                          <circle cx="58" cy="108" r="2.6" />
                        </g>
                        <g className="brain-node" fill="#9fd4ff" style={{ animationDelay: "2s" }}>
                          <circle cx="122" cy="108" r="2.6" />
                        </g>
                        <g className="brain-node" fill="#c9bdff" style={{ animationDelay: ".6s" }}>
                          <circle cx="90" cy="20" r="3" />
                        </g>
                        <g className="brain-node" fill="#c9bdff" style={{ animationDelay: "1s" }}>
                          <circle cx="90" cy="120" r="3" />
                        </g>
                        <rect x="66" y="120" width="18" height="24" rx="2" fill="#3d2a8f" stroke="#8b6bff" strokeWidth="1.2" />
                        <rect x="86" y="116" width="18" height="28" rx="2" fill="#4a2fb0" stroke="#9b7bff" strokeWidth="1.2" />
                        <text x="90" y="135" fontFamily="Inter,sans-serif" fontSize="8" fontWeight="800" fill="#e4e1f5" textAnchor="middle">
                          CKOS
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div>
                    <div className="section-head">
                      <h3>Danh mục tri thức nổi bật</h3>
                    </div>
                    <div className="cat-grid" style={{ marginTop: 14 }}>
                      {ckos.categories.map((cat) => (
                        <Link
                          className="cat-card"
                          key={cat.slug}
                          href={`/v2/he-tri-thuc/danh-muc/${cat.slug}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="ico" style={{ background: CAT_ICON_BG[cat.slug] }}>
                            <CategoryIcon slug={cat.slug} />
                          </div>
                          <h5>{cat.name}</h5>
                          <span>{cat.documentCount} tài liệu</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="section-head">
                      <h3>Tài liệu mới nhất</h3>
                    </div>
                    <div className="doc-list" style={{ marginTop: 14 }}>
                      {latestDocs.length === 0 ? (
                        <div className="empty-hint">Chưa có tài liệu nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                      ) : (
                        latestDocs.map((doc) => {
                          const locked = doc.accessLevel === "premium" && !premium.isPremium;
                          return (
                            <div className="doc-row" key={doc.slug}>
                              <Link
                                href={`/v2/he-tri-thuc/${doc.slug}`}
                                style={{ display: "contents", color: "inherit", textDecoration: "none" }}
                              >
                                <div className="ico">
                                  <DocIcon />
                                </div>
                                <div className="info">
                                  <h5>{doc.title}</h5>
                                  <div className="meta">
                                    <span className="doc-tag">{doc.categoryName}</span>
                                    <span>{doc.readingTime}</span>
                                    {locked ? <span className="doc-lock">Premium</span> : null}
                                  </div>
                                </div>
                              </Link>
                              <span className="date">{formatDate(doc.createdAt)}</span>
                              <button className="save">
                                <SaveIcon />
                              </button>
                            </div>
                          );
                        })
                      )}
                      {ckos.documents.length > latestDocs.length ? (
                        <div
                          className="doc-more"
                          role="button"
                          tabIndex={0}
                          onClick={() => setCkosVisibleCount((v) => v + 10)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setCkosVisibleCount((v) => v + 10);
                          }}
                        >
                          Xem thêm ↓
                        </div>
                      ) : null}
                    </div>
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
                    <button onClick={() => go("Premium.html")}>Nâng cấp Premium</button>
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
                    <h3>Lộ trình học tập gợi ý</h3>
                    <a href="#">Xem tất cả lộ trình →</a>
                  </div>
                  {academy.paths.length === 0 ? (
                    <div className="empty-hint" style={{ marginTop: 14 }}>
                      Chưa có lộ trình nào — nội dung sẽ hiện ở đây khi được xuất bản.
                    </div>
                  ) : (
                    <div className="path-grid" style={{ marginTop: 14 }}>
                      {academy.paths.map((path, i) => {
                        const style = PATH_STYLES[i % PATH_STYLES.length];
                        const completed = academy.progress.completedByPath[path.slug] ?? 0;
                        const pct = path.lessonCount > 0 ? Math.round((completed / path.lessonCount) * 100) : 0;
                        return (
                          <div className="path-card" key={path.slug}>
                            <div className="top">
                              <div className="ico" style={{ background: style.bg }}>
                                {style.icon}
                              </div>
                              <h5>{path.title}</h5>
                            </div>
                            <p>{path.description}</p>
                            <div className="path-pct">{pct}% hoàn thành</div>
                            <div className="path-track">
                              <div className="path-fill" style={{ width: `${pct}%`, background: style.fill }} />
                            </div>
                            <div className="cnt">
                              {completed}/{path.lessonCount} bài học khoá học
                            </div>
                            {path.ckosLessonCount > 0 && (
                              <div className="cnt" style={{ marginTop: 2 }}>
                                <button
                                  type="button"
                                  onClick={() => setTab(3)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    font: "inherit",
                                    color: "var(--violet)",
                                    cursor: "pointer",
                                  }}
                                >
                                  + {path.ckosLessonCount} bài học Hệ tri thức →
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <div className="section-head">
                    <h3>Khóa học nổi bật</h3>
                    <a href="#">Xem tất cả khóa học →</a>
                  </div>
                  <div className="course-scroll" style={{ marginTop: 14 }}>
                    {academy.courses.length === 0 ? (
                      <div className="empty-hint">Chưa có khoá học nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                    ) : (
                      academy.courses.map((course) => {
                        const completed = academy.progress.completedByCourse[course.id] ?? 0;
                        const pct = course.lessonCount > 0 ? Math.round((completed / course.lessonCount) * 100) : 0;
                        return (
                          <div className="course-card" key={course.id}>
                            <div className="course-thumb" style={{ background: "linear-gradient(160deg,#1a1044,#3d2a8f)" }}>
                              <div className="course-badges">
                                <span className="badge-pill" style={{ background: "#189a52" }}>
                                  Miễn phí
                                </span>
                              </div>
                              <svg viewBox="0 0 24 24" fill="none" stroke="#9fd4ff" strokeWidth="1.6">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                              </svg>
                            </div>
                            <div className="course-body">
                              <h5>{course.name}</h5>
                              <div className="desc">{course.description}</div>
                              <div className="course-meta">
                                <span>{course.lessonCount} bài học</span>
                              </div>
                              <div className="course-track">
                                <div className="course-fill" style={{ width: `${pct}%` }} />
                              </div>
                              <div className="course-pct">{pct}%</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
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

          {/* --------------------------------------------------- Tab 2: AI Workspace */}
          {tab === 2 && (
            <div className="aiw">
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

                  <div className="ws-hero">
                    <div className="ws-hero-text">
                      <h2>Không gian thực hành AI của bạn</h2>
                      <p>Chọn công cụ phù hợp, áp dụng kiến thức và biến ý tưởng thành kết quả thực tế.</p>
                      <div className="feat-tags">
                        <div className="feat-tag">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                          </svg>
                          Nhiều công cụ AI
                        </div>
                        <div className="feat-tag">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                          </svg>
                          Workflow thực chiến
                        </div>
                        <div className="feat-tag">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <path d="M4 9h16" />
                          </svg>
                          Lưu &amp; quản lý
                        </div>
                        <div className="feat-tag">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="2" width="10" height="20" rx="2" />
                            <rect x="16" y="7" width="6" height="12" rx="1.5" />
                          </svg>
                          Đồng bộ đa thiết bị
                        </div>
                      </div>
                      <button className="btn-primary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Tạo dự án mới
                      </button>
                    </div>
                    <div className="ws-graphic">
                      <div className="ws-glow" />
                      <svg width="260" height="190" viewBox="0 0 260 190" fill="none">
                        <g className="ws-orb" style={{ animationDelay: "0s" }}>
                          <rect x="8" y="22" width="24" height="24" rx="7" fill="rgba(109,74,255,.28)" stroke="#9b7bff" strokeWidth="1.2" />
                          <circle cx="20" cy="34" r="4" fill="#c9bdff" />
                        </g>
                        <path d="M32 34h20" stroke="#6d84ff" strokeWidth="1.4" strokeDasharray="3 3" />
                        <path d="M52 34l-4-3M52 34l-4 3" stroke="#6d84ff" strokeWidth="1.4" />
                        <g className="ws-orb" style={{ animationDelay: ".4s" }}>
                          <rect x="8" y="70" width="24" height="24" rx="7" fill="rgba(109,74,255,.28)" stroke="#9b7bff" strokeWidth="1.2" />
                          <path d="M14 88l4-10 4 6 4-12" stroke="#c9bdff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        </g>
                        <g className="ws-orb" style={{ animationDelay: ".8s" }}>
                          <rect x="222" y="20" width="24" height="24" rx="7" fill="rgba(109,74,255,.28)" stroke="#9b7bff" strokeWidth="1.2" />
                          <circle cx="234" cy="32" r="7" fill="none" stroke="#c9bdff" strokeWidth="1.6" />
                        </g>
                        <g className="ws-orb" style={{ animationDelay: "1.2s" }}>
                          <rect x="222" y="66" width="24" height="24" rx="7" fill="rgba(109,74,255,.28)" stroke="#9b7bff" strokeWidth="1.2" />
                          <path d="M228 84l6-14 6 14M230 80h8" stroke="#c9bdff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </g>
                        <g className="ws-orb" style={{ animationDelay: "1.6s" }}>
                          <rect x="14" y="118" width="24" height="24" rx="7" fill="rgba(109,74,255,.28)" stroke="#9b7bff" strokeWidth="1.2" />
                          <path d="M20 136c0-6 4-10 8-10s8 4 8 10" stroke="#c9bdff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </g>
                        <g className="ws-orb" style={{ animationDelay: "2s" }}>
                          <rect x="216" y="120" width="24" height="24" rx="7" fill="rgba(109,74,255,.28)" stroke="#9b7bff" strokeWidth="1.2" />
                          <circle cx="228" cy="128" r="3" fill="#c9bdff" />
                          <path d="M222 138c2-4 10-4 12 0" stroke="#c9bdff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                        </g>
                        <rect x="66" y="30" width="128" height="94" rx="10" fill="url(#wsScreen)" stroke="#8b6bff" strokeWidth="1.6" />
                        <rect x="76" y="40" width="108" height="66" rx="6" fill="#0c0824" stroke="#6d4aff" strokeWidth="1" />
                        <text x="130" y="82" fontFamily="Inter,sans-serif" fontSize="30" fontWeight="800" fill="#fff" textAnchor="middle">
                          AI
                        </text>
                        <rect x="100" y="126" width="60" height="8" rx="4" fill="#3d2a8f" />
                        <defs>
                          <linearGradient id="wsScreen" x1="66" y1="30" x2="194" y2="124">
                            <stop offset="0" stopColor="#3d2a8f" />
                            <stop offset="1" stopColor="#1a1044" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <div>
                    <div className="section-head">
                      <h3>Công cụ theo nhóm</h3>
                      <a href="#">Xem tất cả công cụ →</a>
                    </div>
                    {workspace.groups.length === 0 ? (
                      <div className="empty-hint" style={{ marginTop: 14 }}>
                        Chưa có công cụ nào — nội dung sẽ hiện ở đây khi được xuất bản.
                      </div>
                    ) : (
                      <div className="grp-grid" style={{ marginTop: 14 }}>
                        {workspace.groups.map((group) => {
                          const style = GROUP_STYLE[group.category] ?? DEFAULT_GROUP_STYLE;
                          return (
                            <div className="grp-card" key={group.category}>
                              <div className="ico" style={{ background: style.bg }}>
                                {style.icon}
                              </div>
                              <h5>{group.category}</h5>
                              <span>{group.count} công cụ</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="section-head">
                      <h3>Dự án của bạn</h3>
                    </div>
                    <div className="proj-row">
                      <div className="proj-tabs">
                        <button className={projTab === 0 ? "p-tab active" : "p-tab"} onClick={() => setProjTab(0)}>
                          Tất cả ({workspace.projects.length})
                        </button>
                        <button className={projTab === 1 ? "p-tab active" : "p-tab"} onClick={() => setProjTab(1)}>
                          Đang thực hiện ({countByStatus("in_progress")})
                        </button>
                        <button className={projTab === 2 ? "p-tab active" : "p-tab"} onClick={() => setProjTab(2)}>
                          Hoàn thành ({countByStatus("completed")})
                        </button>
                        <button className={projTab === 3 ? "p-tab active" : "p-tab"} onClick={() => setProjTab(3)}>
                          Tạm dừng ({countByStatus("paused")})
                        </button>
                      </div>
                      <div className="proj-toolbar">
                        <div className="sort-select">
                          Sắp xếp: Mới nhất
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                        <div className="view-toggle">
                          <button className={viewMode === 0 ? "active" : undefined} onClick={() => setViewMode(0)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="7" height="7" rx="1.5" />
                              <rect x="14" y="3" width="7" height="7" rx="1.5" />
                              <rect x="3" y="14" width="7" height="7" rx="1.5" />
                              <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            </svg>
                          </button>
                          <button className={viewMode === 1 ? "active" : undefined} onClick={() => setViewMode(1)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {workspace.projects.length === 0 ? (
                      <div className="empty-hint" style={{ marginTop: 14 }}>
                        Chưa có dự án nào — bắt đầu dự án đầu tiên của bạn bên dưới.
                      </div>
                    ) : (
                      <div className="proj-grid" style={{ marginTop: 14 }}>
                        {workspace.projects.map((project) => {
                          const workflowStyle = project.workflowId ? WORKFLOW_STYLE[project.workflowId] : undefined;
                          const style = workflowStyle ?? DEFAULT_GROUP_STYLE;
                          const statusStyle = STATUS_STYLE[project.status];
                          return (
                            <div className="proj-card" key={project.id}>
                              <div className="proj-top">
                                <div className="ico" style={{ background: style.bg }}>
                                  {style.icon}
                                </div>
                                <div>
                                  <h5>{project.title}</h5>
                                  <span className="status-pill" style={{ background: statusStyle.pillBg, color: statusStyle.pillColor }}>
                                    {statusStyle.label}
                                  </span>
                                </div>
                              </div>
                              <div className="desc">{project.description}</div>
                              <div className="proj-progress-lbl">
                                Tiến độ<b>{project.progressPercent}%</b>
                              </div>
                              <div className="proj-track">
                                <div
                                  className="proj-fill"
                                  style={{ width: `${project.progressPercent}%`, background: statusStyle.fill }}
                                />
                              </div>
                              <div className="proj-foot">
                                <span className="updated">Cập nhật: {formatRelativeTime(project.updatedAt)}</span>
                                <button className="more-btn">⋯</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {workspace.limits.isPremium || workspace.limits.canCreateProject ? (
                      <div className="new-proj" style={{ marginTop: 14 }}>
                        <div className="plus">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          Tạo dự án mới
                        </div>
                        <span>Bắt đầu một dự án mới với AI</span>
                      </div>
                    ) : (
                      <div className="new-proj locked" style={{ marginTop: 14 }} onClick={() => go("Premium.html")}>
                        <div className="plus">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <rect x="5" y="10" width="14" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 018 0v3" />
                          </svg>
                          Đã đạt giới hạn 3 dự án cùng lúc (Free)
                        </div>
                        <span>Nâng cấp Premium để tạo thêm dự án không giới hạn</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="section-head">
                      <h3>Workflow mẫu</h3>
                      <a href="#">Xem tất cả workflow →</a>
                    </div>
                    {showLimitBanner ? (
                      <div className="limit-badge">
                        Gói Free — đã dùng {Math.min(workspace.limits.workflowsOpenedThisMonth, 1)}/1 lượt mở workflow tháng này
                        {!workspace.limits.canOpenNewWorkflow ? " · Nâng cấp Premium để mở không giới hạn" : ""}
                      </div>
                    ) : null}
                    {workspace.workflows.length === 0 ? (
                      <div className="empty-hint" style={{ marginTop: 14 }}>
                        Chưa có workflow nào — nội dung sẽ hiện ở đây khi được xuất bản.
                      </div>
                    ) : (
                      <div className="wf-grid" style={{ marginTop: 14 }}>
                        {workspace.workflows.map((workflow) => {
                          const style = WORKFLOW_STYLE[workflow.id] ?? DEFAULT_GROUP_STYLE;
                          return (
                            <div className="wf-card" key={workflow.id}>
                              <div className="wf-top">
                                <div className="ico" style={{ background: style.bg }}>
                                  {style.icon}
                                </div>
                                <div>
                                  <h5>{workflow.title}</h5>
                                  <span className="steps">
                                    {workflow.steps.length} bước · {workflow.suggestedTools.length} công cụ
                                  </span>
                                </div>
                              </div>
                              <div className="desc">{workflow.description}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="right-col">
                  <div className="card">
                    <div className="card-head">
                      <h4>Công cụ yêu thích</h4>
                      <a href="#">Quản lý</a>
                    </div>
                    {workspace.favorites.length === 0 ? (
                      <div className="empty-hint">Chưa có công cụ nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                    ) : (
                      workspace.favorites.map((tool) => {
                        const style = FAVORITE_STYLE[tool.id] ?? DEFAULT_GROUP_STYLE;
                        const off = Boolean(starOff[tool.id]);
                        return (
                          <div className="tool-fav-row" key={tool.id}>
                            <div className="ico" style={{ background: style.bg }}>
                              {style.icon}
                            </div>
                            <div className="info">
                              <h6>{tool.name}</h6>
                              <span>{tool.tagline}</span>
                            </div>
                            <button
                              className={off ? "star-btn off" : "star-btn"}
                              onClick={() => setStarOff((prev) => ({ ...prev, [tool.id]: !prev[tool.id] }))}
                            >
                              <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                              </svg>
                            </button>
                          </div>
                        );
                      })
                    )}
                    <a href="#" style={{ display: "block", textAlign: "center", fontSize: "12.5px", fontWeight: 700, marginTop: 10 }}>
                      Xem tất cả công cụ →
                    </a>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <h4>Hoạt động gần đây</h4>
                      <a href="#">Xem tất cả</a>
                    </div>
                    {workspace.activity.length === 0 ? (
                      <div className="empty-hint">Chưa có hoạt động nào — bắt đầu 1 dự án để thấy lịch sử ở đây.</div>
                    ) : (
                      workspace.activity.map((item) => (
                        <div className="act-row" key={item.id}>
                          <div className="ico">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                          <div className="info">
                            {item.label}
                            <span className="time">{formatRelativeTime(item.occurredAt)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <h4>Gợi ý cho bạn</h4>
                    </div>
                    {suggestedWorkflows.length === 0 ? (
                      <div className="empty-hint">Chưa có gợi ý nào — nội dung sẽ hiện ở đây khi có thêm dữ liệu.</div>
                    ) : (
                      suggestedWorkflows.map((workflow, i) => {
                        const style = WORKFLOW_STYLE[workflow.id] ?? DEFAULT_GROUP_STYLE;
                        const isLast = i === suggestedWorkflows.length - 1;
                        return (
                          <div className="sugg-card" style={isLast ? { marginBottom: 0 } : undefined} key={workflow.id}>
                            <div className="sugg-top">
                              <div className="ico" style={{ background: style.bg }}>
                                {style.icon}
                              </div>
                              <h6>Workflow: {workflow.title}</h6>
                            </div>
                            <p>{workflow.description}</p>
                          </div>
                        );
                      })
                    )}
                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>
                      Xem thêm gợi ý →
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* -------------------------------------------- Tab 3: Thư viện tài nguyên */}
          {tab === 3 && (
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

                      {openResource.category === "case-study" && openCaseStudy && (
                        <>
                          <p style={{ color: "var(--muted)", marginTop: 8 }}>{openCaseStudy.summary}</p>
                          {openCaseStudy.resultMetric && (
                            <div style={{ marginTop: 12 }}>
                              <h5>Kết quả</h5>
                              <p style={{ color: "var(--muted)" }}>{openCaseStudy.resultMetric}</p>
                            </div>
                          )}
                          {openCaseStudy.thumbnailUrl && (
                            // eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ do Admin dán URL ngoài, không phải asset tĩnh cố định.
                            <img
                              src={openCaseStudy.thumbnailUrl}
                              alt=""
                              style={{ marginTop: 14, width: "100%", borderRadius: 10, objectFit: "cover" }}
                            />
                          )}
                          {openCaseStudy.linkUrl && (
                            <a
                              className="btn-primary"
                              style={{ marginTop: 14, display: "inline-flex", textDecoration: "none" }}
                              href={openCaseStudy.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Xem thêm ↗
                            </a>
                          )}
                        </>
                      )}

                      {openResource.category === "blog" && openBlogPost && (
                        <>
                          <div className="meta" style={{ marginTop: 8 }}>
                            <span>{openBlogPost.date}</span>
                            <span>·</span>
                            <span>{openBlogPost.readTime}</span>
                          </div>
                          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                            {openBlogPost.content.map((paragraph, i) => (
                              <p key={i} style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                                {paragraph}
                              </p>
                            ))}
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
    </div>
  );
}
