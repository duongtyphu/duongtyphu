"use client";

/* =============================================================================
 * Hệ tri thức (CKOS) 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/He tri thuc CKOS.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `he-tri-thuc.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * CÁC CHỖ KHÁC bản tĩnh — dữ liệu thật + thay đổi theo yêu cầu riêng của
 * Founder (không phải diễn giải lại thiết kế tự ý):
 *
 *  1. SỐ LIỆU & DANH SÁCH → dữ liệu thật từ Supabase thay cho số mẫu.
 *     6 thẻ danh mục lấy đúng số tài liệu Published thật theo `categorySlug`
 *     (`getCkosCategories()`, không hardcode) — tự động khớp phân bổ 6 danh
 *     mục thật (Công cụ AI/Prompt Engineering/Kỹ năng & Tư duy/Tri thức
 *     nâng cao/Nền tảng AI/Ứng dụng AI).
 *  2. KHOÁ PREMIUM (Bước D) — bản thiết kế KHÔNG có trạng thái khoá. Thêm
 *     đúng 1 chip `.doc-lock` trên dòng tài liệu Premium khi user chưa
 *     Premium, dùng lại y hệt token của `.doc-tag` có sẵn (nền
 *     `--violet-light`, chữ `--violet`, radius 6px, font 10.5px/800) — không
 *     tạo màu/bo góc/shadow mới. Nội dung tài liệu đã bị cắt từ SERVER
 *     (xem `live-ckos.ts`), chip chỉ là phần nhìn thấy được.
 *  3. ĐÃ XOÁ khối 5 ô thống kê ("109 Tài liệu"...) + hàng 8 chip lọc
 *     ("Tất cả"/"Nền tảng AI"...) ở view "Tất cả tri thức" — theo yêu cầu
 *     Founder (đánh dấu trực tiếp trên ảnh chụp), `page-head` giờ nối thẳng
 *     vào `ckos-hero`.
 *  4. "Xem thêm ↓" (dưới 4 tài liệu mới nhất) — ĐÃ BẤM ĐƯỢC, tăng dần
 *     `visibleCount` để hiện thêm tài liệu thật (không phải link chết).
 *  5. ĐÃ BỎ 3 nút "Xem tất cả →" (Danh mục tri thức nổi bật/CKOS theo lộ
 *     trình/Tài liệu phổ biến) — theo yêu cầu Founder, các danh mục này
 *     chưa có trang xem đầy đủ riêng trong 2.0 nên nút không có đích thật.
 *     "Xem chi tiết →" ở card "CKOS là gì?" GIỮ NGUYÊN (không nằm trong
 *     yêu cầu xoá).
 *  6. "Thư viện của tôi" — thay hẳn nội dung "thư mục cá nhân"/"tài liệu đã
 *     lưu" (luôn trống, chưa có bảng "đã lưu" nào) bằng nội dung "Thư viện
 *     AI" THẬT từ 1.0 (`getLiveKnowledgeCollections()`/`getLiveKnowledgeSeeds()`,
 *     cùng bảng `knowledge_collections`/`knowledge_seeds` nuôi
 *     `/portal/hetrithucai`): lưới Bộ sưu tập (`.folder-card`, tái dùng
 *     đúng class có sẵn) + danh sách Bài học (`.doc-row`, tái dùng). Chip lọc
 *     đổi từ tĩnh sang tên 2 Bộ sưu tập thật, BẤM ĐƯỢC (lọc danh sách bài học
 *     — dữ liệu đã tải hết ở server, không cần gọi mạng thêm). Mỗi bộ sưu
 *     tập/bài học giờ trỏ sang trình xem GỐC của chính 2.0
 *     (`/v2/he-tri-thuc/bo-suu-tap/[slug]`, `/v2/he-tri-thuc/bai-hoc/[slug]`
 *     — xây tiếp sau khi Founder chọn ưu tiên "xây trang xem Bài học/Bộ sưu
 *     tập gốc"), không còn trỏ ra 1.0 nữa.
 *  7. 6 thẻ "Danh mục tri thức nổi bật" giờ BẤM ĐƯỢC — mỗi thẻ trỏ sang
 *     `/v2/he-tri-thuc/danh-muc/[slug]` (trang mới, xem docblock riêng của
 *     nó), liệt kê đầy đủ tài liệu Published thuộc đúng danh mục đó (lọc từ
 *     `getCkosDocuments()` theo `categorySlug`). Trước đó thẻ chỉ hiển thị
 *     số đếm, không có đích — đúng lý do nút "Xem tất cả →" của khối này bị
 *     xoá ở mục 5 (chưa có trang xem đầy đủ riêng); giờ có trang riêng nên
 *     bản thân 6 thẻ trở thành lối vào chính, không cần khôi phục nút đó.
 *
 * CÒN GIỮ NGUYÊN "TRƠ" NHƯ BẢN GỐC (bản mockup cũng không làm gì): nút lưu
 * (dấu trang) trên "Tài liệu mới nhất", ô tìm kiếm, chuông thông báo. Không
 * tự thêm hành vi để không "diễn giải lại thiết kế" — chờ Founder chốt.
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
import { Difficulty } from "@/features/knowledge/types/knowledge.types";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../inter-gf.css";
import "./he-tri-thuc.css";

/** Đích điều hướng của mockup (tên file `.html`) → route thật trong `/v2`. */
const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "He tri thuc CKOS.html": "/v2/he-tri-thuc",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/ai-workspace",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Cong dong AI.html": "/v2/cong-dong-ai",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

/** Nền icon của 6 thẻ danh mục — chép nguyên gradient theo đúng thứ tự bản gốc. */
const CAT_ICON_BG: Record<string, string> = {
  "nen-tang-ai": "linear-gradient(145deg,#8b6bff,#5a37e6)",
  "prompt-engineering": "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  "ung-dung-ai": "linear-gradient(145deg,#3ecf7e,#189a52)",
  "cong-cu-ai": "linear-gradient(145deg,#ff9d52,#c2660a)",
  "ky-nang-tu-duy": "linear-gradient(145deg,#e879b9,#b4348a)",
  "tri-thuc-nang-cao": "linear-gradient(145deg,#4bc4e0,#0e7490)",
};

/** SVG trong 6 thẻ danh mục — chép nguyên vẹn từ bản gốc, không thay icon lib. */
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

/** Icon dòng tài liệu — 1 SVG duy nhất trong bản gốc, dùng lại nguyên vẹn. */
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

const SPARKLE_PATH = "M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z";

/** 10 tia sáng quanh vương miện — toạ độ/kích thước/delay chép nguyên bản gốc. */
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

export function CkosClient({
  categories,
  documents,
  stages,
  premium,
  ckosIntro,
  popular,
  collections,
  seeds,
}: {
  categories: CkosCategory[];
  documents: CkosDocumentSummary[];
  stages: CkosStage[];
  premium: PremiumStatus;
  ckosIntro: string;
  popular: CkosPopularDocumentsResult;
  collections: KnowledgeCollection[];
  seeds: KnowledgeSeed[];
}) {
  const router = useRouter();
  const [view, setView] = useState<"all" | "library">("all");
  const [libChip, setLibChip] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const latest = documents.slice(0, visibleCount);

  // "Thư viện của tôi" — nội dung "Thư viện AI" thật của 1.0 (knowledge_collections
  // + knowledge_seeds), xem docblock đầu file mục 6.
  const libraryChips = ["Tất cả", ...collections.map((c) => c.title)];
  const seedsByCollection = new Map(collections.map((c) => [c.slug, c] as const));
  const visibleSeeds =
    libChip === 0 ? seeds : seeds.filter((s) => s.collectionSlug === collections[libChip - 1]?.slug);
  const beginnerCount = seeds.filter((s) => s.difficulty === Difficulty.BEGINNER).length;
  const advancedCount = seeds.filter((s) => s.difficulty === Difficulty.ADVANCED).length;

  return (
    <div className="ckos">
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
            <button className="nav-item active nav-parent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
              </svg>
              Hệ tri thức (CKOS)
            </button>
            <div className="nav-sub">
              <button
                className={view === "all" ? "nav-item active" : "nav-item"}
                onClick={() => setView("all")}
              >
                Tất cả tri thức
              </button>
              <button
                className={view === "library" ? "nav-item active" : "nav-item"}
                onClick={() => setView("library")}
              >
                Thư viện của tôi
              </button>
            </div>
            <button className="nav-item" onClick={() => go("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item" onClick={() => go("AI Workspace.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
              </svg>
              AI Workspace
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

          {/* Founder: tài khoản đã Premium không thấy mục nâng cấp ở bất kỳ đâu
              trong portal 2.0 — nguyên tắc site-wide đã áp dụng cho `PortalV2Shell`. */}
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
              <p>Mở khóa toàn bộ tính năng nâng cao của Companion AI và Học viện.</p>
              <button onClick={() => go("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm kiếm tri thức, chủ đề, công cụ..." variant="box" />
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

          <div className="content">
            <div className="center-col">
              <div id="view-all" style={{ display: view === "all" ? undefined : "none" }}>
                <div className="page-head">
                  <h1>Hệ tri thức (CKOS)</h1>
                  <p>
                    Kho tri thức tập trung, được cấu trúc khoa học giúp bạn học nhanh hơn và làm chủ AI một
                    cách hệ thống.
                  </p>
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
                      CKOS là hệ tri thức được chọn lọc và hệ thống hóa, giúp bạn học AI một cách bài bản và
                      ứng dụng hiệu quả.
                    </p>
                    <button className="ckos-cta">
                      Khám phá CKOS{" "}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
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
                      <text
                        x="90"
                        y="135"
                        fontFamily="Inter,sans-serif"
                        fontSize="8"
                        fontWeight="800"
                        fill="#e4e1f5"
                        textAnchor="middle"
                      >
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
                    {categories.map((cat) => (
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
                    {latest.length === 0 ? (
                      <div className="empty-hint">Chưa có tài liệu nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                    ) : (
                      latest.map((doc) => {
                        const locked = doc.accessLevel === "premium" && !premium.isPremium;
                        return (
                          <div className="doc-row" key={doc.slug}>
                            {/* `display:contents` — Link không tham gia layout, ico+info
                                vẫn là con trực tiếp của `.doc-row` (giữ đúng `gap:14px`
                                CSS gốc), tránh lồng <button> (nút Lưu) vào trong <a>. */}
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
                    {documents.length > latest.length ? (
                      <div
                        className="doc-more"
                        role="button"
                        tabIndex={0}
                        onClick={() => setVisibleCount((v) => v + 10)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setVisibleCount((v) => v + 10);
                        }}
                      >
                        Xem thêm ↓
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div id="view-library" style={{ display: view === "library" ? undefined : "none" }}>
                <div className="page-head">
                  <h1>Thư viện của tôi</h1>
                  <p>Thư viện AI — bộ sưu tập và bài học được VO DUONG AI tuyển chọn, học theo lộ trình hoặc tra cứu riêng lẻ.</p>
                </div>

                <div className="stat-row" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                  <div className="stat-box">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#8b6bff,#5a37e6)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M3 7l2-3h14l2 3M3 7v12a1 1 0 001 1h16a1 1 0 001-1V7M3 7h18" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{collections.length}</div>
                      <div className="lbl">Bộ sưu tập</div>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{seeds.length}</div>
                      <div className="lbl">Bài học</div>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{beginnerCount}</div>
                      <div className="lbl">Người mới bắt đầu</div>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="ico" style={{ background: "linear-gradient(145deg,#ff9d52,#c2660a)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="num">{advancedCount}</div>
                      <div className="lbl">Nâng cao</div>
                    </div>
                  </div>
                </div>

                <div className="lib-toolbar">
                  <div className="filter-row">
                    {libraryChips.map((label, i) => (
                      <button
                        key={label}
                        className={i === libChip ? "f-chip active" : "f-chip"}
                        onClick={() => setLibChip(i)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <Link
                    className="new-folder-btn"
                    href="/portal/hetrithucai"
                    style={{ textDecoration: "none" }}
                  >
                    Xem đầy đủ trên Thư viện AI →
                  </Link>
                </div>

                <div>
                  <div className="section-head">
                    <h3>Bộ sưu tập tri thức</h3>
                  </div>
                  {collections.length === 0 ? (
                    <div className="empty-hint">Chưa có bộ sưu tập nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                  ) : (
                    <div className="folder-grid" style={{ marginTop: 14 }}>
                      {collections.map((col) => (
                        <Link
                          key={col.slug}
                          className="folder-card"
                          href={`/v2/he-tri-thuc/bo-suu-tap/${col.slug}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div className="ico" style={{ background: "linear-gradient(145deg,#8b6bff,#5a37e6)" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                              <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
                            </svg>
                          </div>
                          <h5>{col.title}</h5>
                          <span>{seeds.filter((s) => s.collectionSlug === col.slug).length} bài học</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="section-head">
                    <h3>Tất cả bài học</h3>
                  </div>
                  <div className="doc-list" style={{ marginTop: 14 }}>
                    {visibleSeeds.length === 0 ? (
                      <div className="empty-hint">Chưa có bài học nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                    ) : (
                      visibleSeeds.map((seed) => (
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
                              <span className="doc-tag">
                                {seedsByCollection.get(seed.collectionSlug)?.title ?? "Bài học lẻ"}
                              </span>
                              {seed.estimatedTime ? <span>{seed.estimatedTime}</span> : null}
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>CKOS là gì?</h4>
                  <a href="#">Xem chi tiết →</a>
                </div>
                <p>{ckosIntro}</p>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>CKOS theo lộ trình</h4>
                </div>
                <div className="roadmap">
                  {stages.map((stage) => (
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
                {/* MỤC 2 — đếm lượt xem thật (`ckos_content_views`, xem
                    live-ckos.ts). Hệ thống mới nên có thể toàn bộ đang 0 lượt —
                    khi đó fallback hiện theo "mới nhất" (`sortedByViews: false`),
                    kèm 1 dòng nói thật thay vì bịa số như bản thiết kế mẫu
                    (12,8k/9,6k/8,3k). */}
                {popular.documents.length === 0 ? (
                  <div className="empty-hint" style={{ padding: 0 }}>
                    Chưa có tài liệu nào — nội dung sẽ hiện ở đây khi được xuất bản.
                  </div>
                ) : (
                  <>
                    {popular.documents.map((doc) => (
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
                            {popular.sortedByViews
                              ? `${doc.viewCount.toLocaleString("vi-VN")} lượt xem`
                              : formatDate(doc.createdAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {!popular.sortedByViews ? (
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

          <div className="footer-bar">
            <span>© 2024 VO DUONG AI. All rights reserved.</span>
            <span>CKOS v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
