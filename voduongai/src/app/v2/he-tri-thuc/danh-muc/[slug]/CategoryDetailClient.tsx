"use client";

/* =============================================================================
 * `/v2/he-tri-thuc/danh-muc/[slug]` — trang chi tiết 1 Danh mục tri thức,
 * KHÔNG có mockup riêng (xem docblock ở `page.tsx`). Sidebar/topbar chép
 * NGUYÊN VĂN từ `CkosDocumentClient.tsx`/`LessonDetailClient.tsx`
 * (page-shell duplication, đúng tiền lệ).
 *
 * Icon + gradient nền của khối tiêu đề danh mục chép NGUYÊN VĂN
 * `CAT_ICON_BG`/`CategoryIcon` từ `CkosClient.tsx` (đúng icon/màu của thẻ
 * danh mục trên trang danh sách, không tự vẽ icon khác cho cùng 1 danh
 * mục). Danh sách tài liệu dùng lại NGUYÊN `.doc-list`/`.doc-row`/`.doc-tag`/
 * `.doc-lock` — cùng cách hiển thị + khoá Premium đã dùng ở "Tài liệu mới
 * nhất" trên trang danh sách CKOS.
 * ========================================================================== */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CkosCategory, CkosDocumentSummary } from "@/lib/portal/live-ckos";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../../../inter-gf.css";
import "../../he-tri-thuc.css";

const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "He tri thuc CKOS.html": "/v2/hoc-vien-ai",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/hoc-vien-ai",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
};

/** Nền icon 6 danh mục — chép nguyên gradient từ `CkosClient.tsx`. */
const CAT_ICON_BG: Record<string, string> = {
  "nen-tang-ai": "linear-gradient(145deg,#8b6bff,#5a37e6)",
  "prompt-engineering": "linear-gradient(145deg,#5f8fff,#1d5fd8)",
  "ung-dung-ai": "linear-gradient(145deg,#3ecf7e,#189a52)",
  "cong-cu-ai": "linear-gradient(145deg,#ff9d52,#c2660a)",
  "ky-nang-tu-duy": "linear-gradient(145deg,#e879b9,#b4348a)",
  "tri-thuc-nang-cao": "linear-gradient(145deg,#4bc4e0,#0e7490)",
};

/** SVG 6 danh mục — chép nguyên vẹn từ `CkosClient.tsx`. */
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

export function CategoryDetailClient({
  category,
  documents,
  premium,
}: {
  category: CkosCategory;
  documents: CkosDocumentSummary[];
  premium: PremiumStatus;
}) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(10);
  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const visible = documents.slice(0, visibleCount);

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
            <button className="nav-item" onClick={() => go("Moi ngay mot y tuong.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.1V17a1 1 0 001 1h4a1 1 0 001-1v-.2c0-.8.4-1.6 1-2.1A7 7 0 0012 2z" />
              </svg>
              Mỗi ngày một ý tưởng
            </button>
            <button className="nav-item active" onClick={() => go("Hoc vien AI.html")}>
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
          </nav>

          <div className="side-label">GÓC TIẾN BỘ</div>
          <nav className="main">
            <button className="nav-item" onClick={() => go("Hanh trinh cua toi.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              Hành trình của tôi
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
            <div className="center-col" style={{ maxWidth: 760 }}>
              <Link href="/v2/hoc-vien-ai" className="doc-back-link">
                ← Hệ tri thức (CKOS)
              </Link>

              <div className="card" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  className="ico"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: CAT_ICON_BG[category.slug],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: 24, height: 24 }}>
                    <CategoryIcon slug={category.slug} />
                  </div>
                </div>
                <div>
                  <h1 className="doc-article-title" style={{ fontSize: 20 }}>
                    {category.name}
                  </h1>
                  <p className="doc-article-summary" style={{ marginTop: 4 }}>
                    {documents.length} tài liệu{category.description ? ` · ${category.description}` : ""}
                  </p>
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Tài liệu trong danh mục</h3>
                </div>
                <div className="doc-list" style={{ marginTop: 14 }}>
                  {visible.length === 0 ? (
                    <div className="empty-hint">Chưa có tài liệu nào trong danh mục này.</div>
                  ) : (
                    visible.map((doc) => {
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
                  {documents.length > visible.length ? (
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
          </div>
        </div>
      </div>
    </div>
  );
}
