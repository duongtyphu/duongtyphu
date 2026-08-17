"use client";

import { useState } from "react";
import Link from "next/link";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import type { PremiumProgram as PremiumProgramFull } from "@/components/portal/premium/premium-programs";

/** `program.icon` (LucideIcon) bị loại bỏ ở `page.tsx` trước khi truyền
 * xuống Client Component (function không serialize được qua ranh giới
 * Server→Client) — type ở đây khớp đúng shape thực tế nhận được. */
type PremiumProgram = Omit<PremiumProgramFull, "icon">;
import type { PremiumCourseMatch } from "@/components/portal/premium/PremiumProgramCard";
import { formatVnd } from "@/components/portal/premium/premium-programs";
import type { PremiumResourceCounts, PremiumMemberSummary } from "@/lib/portal/live-premium-v2";
import type { LiveCommunityChannel } from "@/lib/portal/live-community";
import type { PremiumFaqItem } from "@/lib/portal/live-premium";
import type { JourneyOverview } from "@/lib/portal/live-journey-overview";

import "./premium.css";

/**
 * `/v2/premium` — 1:1 với `Premium.html` (Bước F).
 *
 * KHÔNG dùng dev-toggle "Xem: Chưa đăng ký"/"Xem: Đã đăng ký Premium" của
 * bản thiết kế — `premium.isPremium` (thật, từ `getPremiumStatus()`) quyết
 * định trực tiếp guestState/memberState hiện ra, không có nút giả lập nào.
 *
 * ĐÚNG những chỗ khác bản tĩnh (đều thuộc phạm vi "nối dữ liệu thật hoặc
 * honest empty-state", không đổi layout/màu/font):
 *
 * 1. "Kho tài nguyên Premium" (`res-grid`, cả 2 trạng thái) — 6 số mẫu cố
 *    định (250+/80+/120+/60+/45+/30+) → số thật từ `getPremiumResourceCounts()`
 *    (5/9 "Intelligence" CKOS: prompts/sop/templates/ebooks/checklists +
 *    `case_studies`). Bản memberState còn 3 card thêm "công cụ"/"video"/
 *    "cập nhật hàng tuần" — BỎ "video" (không có bảng video nào) và "cập
 *    nhật hàng tuần" (không có tín hiệu "mới" thật), GIỮ "công cụ" (bảng
 *    `tools` thật, đã Full ở CKOS Coverage) — dùng CHUNG 1 lưới 7 thẻ cho cả
 *    2 trạng thái (đúng dữ liệu công khai, không có gì Premium-only ở đây).
 *    Card "Tài liệu" (ebook) không có "Xem ngay →" — audit xác nhận bảng
 *    `ebooks` có Admin CRUD (`/admin/ckos/ebooks`) nhưng KHÔNG route Portal
 *    nào đọc (mồ côi thật, khác 5 bảng còn lại đều có trang Portal xem được).
 *
 * 2. Bảng giá 3 gói thuê bao "Tháng/6 Tháng/12 Tháng" (299k/1.49tr/2.59tr,
 *    hoàn toàn không có backing — hệ thống mua hàng thật là 5 chương trình
 *    MUA ĐỨT theo `courses`, không có khái niệm subscription nào) → 5 thẻ
 *    `PREMIUM_PROGRAMS` thật, tái dùng NGUYÊN `matchCourse()`/`getPurchasedIds()`
 *    — đúng cơ chế đã chạy ở `/portal/premium` 1.0, không phát minh luồng
 *    thanh toán mới.
 *
 * 3. Bảng "So sánh quyền lợi" (7 hàng theo 3 gói thuê bao) — BỎ HẲN, không
 *    có cách honest nào ánh xạ bảng so sánh phân cấp 3-gói sang 5 chương
 *    trình mua đứt có nội dung khác hẳn nhau (không phải các cấp của cùng 1
 *    gói). "Premium Member nói gì?" (3 đánh giá bịa tên/quote) → honest
 *    empty-state, cùng tiền lệ NO-FAKE-DATA đã áp dụng cho
 *    `student_success_stories`. Gộp 2 khối `.two-col` cũ thành 1 card đơn
 *    (bỏ cột trái đã xoá).
 *
 * 4. "Lộ trình Premium của bạn" (6 bước bịa % giả) → 4 giai đoạn thật của
 *    `learning_paths` qua `getJourneyOverview()` (tái dùng nguyên, không
 *    viết lại lần 2 — đã dùng ở `/v2/hanh-trinh-cua-toi`).
 *
 * 5. `member-status-card` — "Gói hiện tại: Premium Monthly / 99.000đ/tháng"
 *    + ngày bắt đầu/hết hạn giả → tên chương trình ĐÃ SỞ HỮU thật + tổng số
 *    tiền thật đã thanh toán (`getPremiumMemberSummary()`, cộng dồn
 *    `orders.amount` các đơn `confirmed` khớp 5 `courseId` Premium) + ngày
 *    mua sớm nhất thật. KHÔNG có khái niệm "hết hạn" thật (mọi thành viên
 *    Premium hiện tại đến từ mua đứt, `premium_expires_at` luôn `NULL`) —
 *    hiển thị "Không giới hạn (trọn đời)" tĩnh thay vì bịa ngày hết hạn.
 *
 * 6. `ustat-grid` (6 số bịa: tài liệu đã tải/prompt đã lưu/workflow đã dùng/
 *    45 giờ/7 ngày/85%) — 3/6 không có hệ thống theo dõi thật (lượt tải,
 *    lượt lưu, lượt dùng workflow) → thay bằng 3 số Premium thật khác:
 *    bài học đã hoàn thành, số chương trình đã sở hữu, huy hiệu đã đạt.
 *    3 còn lại (giờ học/chuỗi ngày/% hoàn thành) đã có backing thật, tái
 *    dùng nguyên từ `journey`.
 *
 * 7. `community-strip` — "Hơn 1.200 thành viên..." (số bịa) + 4 avatar giả
 *    → bỏ hẳn, thay dòng giới thiệu chung không kèm số liệu. 4 "cl-item"
 *    (Nhóm kín/Livestream/Workshop/Q&A — tính năng chưa tồn tại) → danh
 *    sách kênh THẬT (`getLiveCommunityChannels()`, cùng bảng `community`
 *    Việc 8 đã nối cho `/portal/congdongai`).
 *
 * 8. Nút "Xem video giới thiệu" (hero guest) — BỎ, không có video giới
 *    thiệu thật nào trong dự án.
 *
 * 9. `support-mini`/`ms-manage` — không có trang "Quản lý gói Premium"/
 *    "hỗ trợ" riêng nào ở `/v2` (2 trang đó KHÔNG nằm trong danh sách 42
 *    trang Bước F) → trỏ thẳng route 1.0 THẬT đã có sẵn (`/portal/my-products`,
 *    `/portal/support`) — an toàn vì route Next.js là đường dẫn tuyệt đối,
 *    không phụ thuộc `/v2`/`/portal` đang đứng ở đâu. "Chat với chúng tôi"
 *    → `/v2/companion` (điểm chat AI thật duy nhất trong hệ thống).
 */

const PLATFORM_LABEL_SHORT: Record<string, string> = {
  Facebook: "FB",
  YouTube: "YT",
  TikTok: "TT",
  Zalo: "ZL",
  Telegram: "TG",
};

function ResourceGrid({ counts }: { counts: PremiumResourceCounts }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Tất cả", "Prompt", "Workflow", "Template", "Tài liệu", "Công cụ"];
  const cards: { icon: string; num: number; label: string; href: string | null }[] = [
    { icon: "linear-gradient(145deg,#8b6bff,#5a37e6)", num: counts.prompts, label: "Prompt", href: "/portal/prompts" },
    { icon: "linear-gradient(145deg,#5f8fff,#1d5fd8)", num: counts.workflows, label: "Workflow", href: "/portal/sop" },
    { icon: "linear-gradient(145deg,#3ecf7e,#189a52)", num: counts.templates, label: "Template", href: "/portal/templates" },
    { icon: "linear-gradient(145deg,#ff9d52,#c2660a)", num: counts.ebooks, label: "Tài liệu", href: null },
    { icon: "linear-gradient(145deg,#e879b9,#b4348a)", num: counts.checklists, label: "Checklist", href: "/portal/checklists" },
    { icon: "linear-gradient(145deg,#4bc4e0,#0e7490)", num: counts.caseStudies, label: "Case Study", href: "/portal/case-studies" },
  ];
  return (
    <>
      <div className="res-tabs">
        {tabs.map((t, i) => (
          <button key={t} className={i === activeTab ? "active" : ""} onClick={() => setActiveTab(i)}>
            {t}
          </button>
        ))}
      </div>
      <div className="res-grid">
        {cards.map((c) => (
          <div className="res-card" key={c.label}>
            <div className="ico" style={{ background: c.icon }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
              </svg>
            </div>
            <div className="num">{c.num}+</div>
            <div className="lbl">{c.label}</div>
            {c.href ? <Link href={c.href}>Xem ngay →</Link> : null}
          </div>
        ))}
      </div>
    </>
  );
}

function ProgramPriceCard({ program, course }: { program: PremiumProgram; course: PremiumCourseMatch }) {
  const features = (program.topics[0]?.items ?? []).slice(0, 4);
  const owned = course?.owned ?? false;
  const open = course?.open ?? false;
  return (
    <div className="price-card">
      <h5>{program.name}</h5>
      <div className="sub">{program.level}</div>
      {course && open ? (
        <div className="amt">{formatVnd(course.price)}</div>
      ) : (
        <div className="amt" style={{ fontSize: 15 }}>
          Sắp mở đăng ký
        </div>
      )}
      <div className="per">Thanh toán 1 lần</div>
      <div className="price-feat">
        {features.map((f) => (
          <div key={f}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {f}
          </div>
        ))}
      </div>
      {owned ? (
        <Link href="/portal/my-products" className="price-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Đã sở hữu — Xem sản phẩm
        </Link>
      ) : open ? (
        <Link
          href={`/portal/checkout?type=course&id=${program.courseId}`}
          className="price-btn"
          style={{ display: "block", textAlign: "center", textDecoration: "none" }}
        >
          {program.ctaLabel}
        </Link>
      ) : (
        <button className="price-btn" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
          Sắp mở đăng ký
        </button>
      )}
    </div>
  );
}

const STAGE_STATUS_LABEL = ["Hoàn thành", "Đang thực hiện", "Chưa bắt đầu"] as const;

function PremiumRoadmap({ journey }: { journey: JourneyOverview }) {
  if (journey.stages.length === 0) {
    return <p className="empty-hint">Chưa có lộ trình học tập nào — bắt đầu học ở Học viện AI để mở khoá lộ trình.</p>;
  }
  return (
    <>
      {journey.stages.map((stage, i) => {
        const state = journey.currentStageIndex === null ? 2 : i < journey.currentStageIndex ? 0 : i === journey.currentStageIndex ? 1 : 2;
        const cls = state === 0 ? "rm2-item done" : state === 1 ? "rm2-item active" : "rm2-item";
        return (
          <div className={cls} key={stage.slug}>
            <div className="rm2-dot">
              {state === 0 ? (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="rm2-text">
              <div className="top-row">
                <span>{stage.title}</span>
                <span className={state === 0 ? "stat done" : state === 1 ? "stat active" : "stat"}>{STAGE_STATUS_LABEL[state]}</span>
              </div>
              <p>{state === 1 ? `Hoàn thành ${stage.percent}%` : stage.description}</p>
              {state === 1 ? (
                <div className="rm2-track">
                  <div className="rm2-fill" style={{ width: `${stage.percent}%` }} />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </>
  );
}

function CommunityStrip({ channels }: { channels: LiveCommunityChannel[] }) {
  if (channels.length === 0) {
    return (
      <div className="community-strip">
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Cộng đồng Premium</h3>
          <p className="empty-hint">Chưa có kênh cộng đồng nào đang hoạt động.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="community-strip">
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Cộng đồng Premium</h3>
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>Kết nối, chia sẻ và phát triển cùng cộng đồng Premium Member</p>
        <div className="community-links">
          {channels.map((c) => (
            <div className="cl-item" key={c.id}>
              <div className="ico" style={{ fontSize: 11, fontWeight: 800 }}>
                {PLATFORM_LABEL_SHORT[c.platform] ?? c.platform.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h6>{c.label}</h6>
                <span>{c.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="community-right">
        <p>Kết nối trực tiếp với VO DUONG AI qua các kênh chính thức bên trên.</p>
        <a href={channels[0].url} target="_blank" rel="noopener noreferrer">
          <button>Tham gia ngay</button>
        </a>
      </div>
    </div>
  );
}

function FaqList({ faq }: { faq: PremiumFaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-head">
        <h4>Câu hỏi thường gặp</h4>
      </div>
      {faq.map((item) => (
        <div className={item.id === openId ? "faq-item open" : "faq-item"} key={item.id}>
          <div className="faq-q" onClick={() => setOpenId(item.id === openId ? null : item.id)}>
            {item.q}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}

export function PremiumClient({
  premium,
  programCards,
  resourceCounts,
  communityChannels,
  faq,
  journey,
  memberSummary,
}: {
  premium: PremiumStatus;
  programCards: { program: PremiumProgram; course: PremiumCourseMatch }[];
  resourceCounts: PremiumResourceCounts;
  communityChannels: LiveCommunityChannel[];
  faq: PremiumFaqItem[];
  journey: JourneyOverview;
  memberSummary: PremiumMemberSummary;
}) {
  const ownedPrograms = programCards.filter((c) => c.course?.owned);
  const ownedNames = ownedPrograms.map((c) => c.program.name);

  return (
    <div className="pm">
      <div className="app">
        <PortalV2Shell
          premium={premium}
          searchPlaceholder="Tìm kiếm khóa học, tài liệu, công cụ, prompt..."
          promoText="Nâng cấp Premium ngay hôm nay!"
          activeHtmlFile="Premium.html"
          hidePromo={premium.isPremium}
        >
          <div className="content">
            <div className="center-col">
              <div className="crumb">
                <Link href="/v2/trang-chu">Trang chủ</Link> › Premium
              </div>
              <div className="page-head">
                <div>
                  <h1>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e2b23c" strokeWidth="2">
                      <path d="M7.5 4.5h9l3.5 5-8 10-8-10z" />
                      <path d="M2 9.5h20" />
                    </svg>
                    Premium
                  </h1>
                  <p>Đồng hành – Định hướng – Chuyển hóa cùng AI</p>
                </div>
              </div>

              {!premium.isPremium ? (
                <>
                  {/* ============ GUEST/FREE STATE ============ */}
                  <div className="pm-hero">
                    <div className="pm-hero-text">
                      <h2>
                        Đầu tư cho bản thân hôm nay
                        <br />
                        <span className="hl">Kiến tạo tương lai cùng AI</span>
                      </h2>
                      <p>
                        Premium Member là không gian đặc quyền dành riêng cho bạn: được định hướng, đồng hành và trang bị đầy đủ công cụ để ứng
                        dụng AI hiệu quả và bền vững.
                      </p>
                      <div className="hero-btn-row">
                        <a href="#chuong-trinh" className="btn-gold">
                          Nâng cấp Premium ngay
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b2a06" strokeWidth="2.4">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      </div>
                      <div className="hero-trust">
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Thanh toán 1 lần · Sở hữu trọn đời
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Thanh toán an toàn
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Hoàn tiền trong 7 ngày nếu không hài lòng
                        </span>
                      </div>
                    </div>
                    <div className="pm-graphic">
                      <div className="gem-glow" />
                      <svg width="230" height="200" viewBox="0 0 230 200" fill="none">
                        <ellipse cx="115" cy="172" rx="58" ry="10" fill="rgba(155,123,255,.25)" />
                        <rect x="60" y="150" width="110" height="22" rx="4" fill="url(#pedestal)" />
                        <path d="M115 60l-30 34 30 78 30-78z" fill="url(#gemGrad)" stroke="#c9bdff" strokeWidth="1.4" />
                        <path d="M115 60l-16 34h32z" fill="#c9bdff" opacity=".7" />
                        <path d="M85 94h60M99 94l16 78M131 94l-16 78" stroke="#fff" strokeWidth="1" opacity=".5" />
                        <g className="orbit-icon" style={{ animationDelay: "0s" }}>
                          <circle cx="38" cy="60" r="18" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M31 60h14M38 53v14" stroke="#fff" strokeWidth="1.6" />
                        </g>
                        <g className="orbit-icon" style={{ animationDelay: ".5s" }}>
                          <circle cx="192" cy="60" r="18" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M186 66l12-12M186 54h12v12" stroke="#fff" strokeWidth="1.6" fill="none" />
                        </g>
                        <g className="orbit-icon" style={{ animationDelay: "1s" }}>
                          <circle cx="30" cy="130" r="15" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M23 134l4-8 4 5 4-9" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                        </g>
                        <g className="orbit-icon" style={{ animationDelay: "1.5s" }}>
                          <circle cx="198" cy="130" r="15" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M198 122v16M191 130h14" stroke="#fff" strokeWidth="1.4" />
                        </g>
                        <path className="sparkle" style={{ animationDelay: "0s" }} d="M55 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#e2b23c" />
                        <path className="sparkle" style={{ animationDelay: ".7s" }} d="M180 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#e2b23c" />
                        <path className="sparkle" style={{ animationDelay: "1.3s" }} d="M195 175l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#c9bdff" />
                        <defs>
                          <linearGradient id="gemGrad" x1="85" y1="60" x2="145" y2="172">
                            <stop offset="0" stopColor="#c9bdff" />
                            <stop offset="1" stopColor="#6d4aff" />
                          </linearGradient>
                          <linearGradient id="pedestal" x1="60" y1="150" x2="170" y2="172">
                            <stop offset="0" stopColor="#3d2a8f" />
                            <stop offset="1" stopColor="#1a1044" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>Vì sao nên nâng cấp Premium?</h3>
                    <div className="perk-grid">
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#8b6bff,#5a37e6)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="12" cy="12" r=".5" fill="#fff" />
                          </svg>
                        </div>
                        <h5>Định hướng & Lộ trình cá nhân</h5>
                        <p>Lộ trình được AI & chuyên gia thiết kế riêng theo mục tiêu của bạn.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                          </svg>
                        </div>
                        <h5>Bài giảng & Tài liệu độc quyền</h5>
                        <p>Nội dung chuyên sâu chỉ dành riêng cho Premium Member, cập nhật liên tục.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#ff9d52,#c2660a)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="14" rx="2" />
                            <path d="M8 21h8M12 18v3" />
                          </svg>
                        </div>
                        <h5>Công cụ & Template thực chiến</h5>
                        <p>Bộ công cụ, prompt, template và workflow giúp bạn làm chủ công việc nhanh.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#a08bff,#6d4aff)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                          </svg>
                        </div>
                        <h5>Prompt Library cao cấp</h5>
                        <p>Thư viện prompt chất lượng cao, được chọn lọc cho từng tình huống ứng dụng.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#4bc4e0,#0e7490)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.7 21a2 2 0 01-3.4 0" />
                          </svg>
                        </div>
                        <h5>Hỗ trợ ưu tiên & đồng hành</h5>
                        <p>Được ưu tiên hỗ trợ và đồng hành trong suốt quá trình học tập.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <circle cx="8" cy="8" r="3" />
                            <circle cx="17" cy="9" r="3" />
                            <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
                          </svg>
                        </div>
                        <h5>Cộng đồng Premium chất lượng cao</h5>
                        <p>Kết nối với những người cùng tư duy, cùng mục tiêu phát triển.</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <div className="section-head">
                      <h3>Kho tài nguyên Premium</h3>
                    </div>
                    <div style={{ margin: "14px 0" }}>
                      <ResourceGrid counts={resourceCounts} />
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }} id="chuong-trinh">
                    <div className="section-head">
                      <h3>Chọn chương trình Premium phù hợp với bạn</h3>
                    </div>
                    <div className="price-grid" style={{ marginTop: 14 }}>
                      {programCards.map(({ program, course }) => (
                        <ProgramPriceCard program={program} course={course} key={program.key} />
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: 24 }}>
                    <div className="card-head">
                      <h4>Premium Member nói gì?</h4>
                    </div>
                    <p className="empty-hint">
                      Chưa có đánh giá thật từ học viên — tính năng thu thập đánh giá sẽ được bổ sung khi có phản hồi thật.
                    </p>
                  </div>

                  <FaqList faq={faq} />

                  <div className="bottom-cta" style={{ marginTop: 24 }}>
                    <div className="bottom-cta-left">
                      {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh của bản thiết kế */}
                      <img src="/v2-static/assets/icon-companion.png" alt="Companion" />
                      <div>
                        <h4>Đừng chờ đợi tương lai. Kiến tạo nó ngay hôm nay.</h4>
                        <p>Nâng cấp Premium để nhận đặc quyền và bắt đầu hành trình làm chủ AI một cách bài bản và hiệu quả.</p>
                      </div>
                    </div>
                    <div className="bottom-cta-right">
                      <a href="#chuong-trinh" className="btn-gold">
                        Nâng cấp Premium ngay
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b2a06" strokeWidth="2.4">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </a>
                      <span className="trust">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Thanh toán 1 lần · Sở hữu trọn đời
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* ============ MEMBER (PREMIUM) STATE ============ */}
                  <div className="pm-hero">
                    <div className="pm-hero-text">
                      <h2>
                        Đầu tư cho bản thân hôm nay
                        <br />
                        <span className="hl">Kiến tạo tương lai cùng AI</span>
                      </h2>
                      <p>
                        Premium Member là không gian đặc quyền dành riêng cho bạn: được định hướng, đồng hành và trang bị đầy đủ công cụ để ứng
                        dụng AI hiệu quả và bền vững.
                      </p>
                      <div className="hero-btn-row">
                        <Link href="/portal/my-products" className="btn-gold">
                          Quản lý gói Premium
                        </Link>
                        <a href="#loi-ich" className="btn-ghost">
                          Tìm hiểu thêm
                        </a>
                      </div>
                    </div>
                    <div className="pm-graphic">
                      <div className="gem-glow" />
                      <svg width="230" height="200" viewBox="0 0 230 200" fill="none">
                        <ellipse cx="115" cy="172" rx="58" ry="10" fill="rgba(155,123,255,.25)" />
                        <rect x="60" y="150" width="110" height="22" rx="4" fill="url(#pedestal2)" />
                        <path d="M115 60l-30 34 30 78 30-78z" fill="url(#gemGrad2)" stroke="#c9bdff" strokeWidth="1.4" />
                        <path d="M115 60l-16 34h32z" fill="#c9bdff" opacity=".7" />
                        <g className="orbit-icon" style={{ animationDelay: "0s" }}>
                          <circle cx="38" cy="60" r="18" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M31 55h14M31 60h14M31 65h9" stroke="#fff" strokeWidth="1.4" />
                        </g>
                        <g className="orbit-icon" style={{ animationDelay: ".5s" }}>
                          <circle cx="192" cy="60" r="18" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M192 52v16M184 60h16" stroke="#fff" strokeWidth="1.6" />
                        </g>
                        <g className="orbit-icon" style={{ animationDelay: "1s" }}>
                          <circle cx="30" cy="130" r="15" fill="rgba(109,74,255,.3)" stroke="#9b7bff" strokeWidth="1.3" />
                          <path d="M23 134l4-8 4 5 4-9" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                        </g>
                        <path className="sparkle" style={{ animationDelay: "0s" }} d="M195 175l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#c9bdff" />
                        <defs>
                          <linearGradient id="gemGrad2" x1="85" y1="60" x2="145" y2="172">
                            <stop offset="0" stopColor="#c9bdff" />
                            <stop offset="1" stopColor="#6d4aff" />
                          </linearGradient>
                          <linearGradient id="pedestal2" x1="60" y1="150" x2="170" y2="172">
                            <stop offset="0" stopColor="#3d2a8f" />
                            <stop offset="1" stopColor="#1a1044" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }} id="loi-ich">
                    <div className="section-head">
                      <h3>Quyền lợi dành riêng cho Premium Member</h3>
                    </div>
                    <div className="perk-grid" style={{ marginTop: 14 }}>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#8b6bff,#5a37e6)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="12" cy="12" r=".5" fill="#fff" />
                          </svg>
                        </div>
                        <h5>Định hướng & Lộ trình cá nhân</h5>
                        <p>Được định hướng 1:1 và thiết kế lộ trình học AI phù hợp với mục tiêu.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#5f8fff,#1d5fd8)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                          </svg>
                        </div>
                        <h5>Bản đồ học AI cá nhân hóa</h5>
                        <p>Bản đồ học AI riêng giúp bạn đi đúng hướng, tiết kiệm thời gian.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#ff9d52,#c2660a)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M22 10L12 5 2 10l10 5 10-5z" />
                            <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
                          </svg>
                        </div>
                        <h5>Tài liệu học chuẩn độc quyền</h5>
                        <p>Kho tài liệu chọn lọc, biên soạn chuẩn và luôn được cập nhật.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#a08bff,#6d4aff)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="14" rx="2" />
                            <path d="M8 21h8M12 18v3" />
                          </svg>
                        </div>
                        <h5>Mẫu công cụ & Workflow chuẩn</h5>
                        <p>Bộ công cụ, workflow thực chiến giúp bạn ứng dụng ngay.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#4bc4e0,#0e7490)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                          </svg>
                        </div>
                        <h5>Prompt Library cao cấp</h5>
                        <p>Thư viện prompt chất lượng cao cho mọi tình huống công việc.</p>
                      </div>
                      <div className="perk-card">
                        <div className="ico" style={{ background: "linear-gradient(145deg,#3ecf7e,#189a52)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.7 21a2 2 0 01-3.4 0" />
                          </svg>
                        </div>
                        <h5>Hỗ trợ ưu tiên & đồng hành</h5>
                        <p>Được ưu tiên hỗ trợ và đồng hành trong suốt quá trình học tập.</p>
                      </div>
                    </div>
                  </div>

                  <div className="two-col" style={{ marginTop: 24 }}>
                    <div>
                      <div className="section-head">
                        <h3>Kho tài nguyên Premium</h3>
                      </div>
                      <div style={{ margin: "14px 0" }}>
                        <ResourceGrid counts={resourceCounts} />
                      </div>
                    </div>

                    <div className="card roadmap-card">
                      <div className="card-head">
                        <h4>Lộ trình Premium của bạn</h4>
                      </div>
                      <PremiumRoadmap journey={journey} />
                    </div>
                  </div>

                  <div className="two-col" style={{ marginTop: 24, gridTemplateColumns: "1.4fr .8fr .8fr" }}>
                    <div className="member-status-card">
                      <div className="ms-badge">
                        <div className="ms-crown">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                            <path d="M7.5 4.5h9l3.5 5-8 10-8-10z" />
                          </svg>
                        </div>
                        <div>
                          <h4>
                            Premium Member <span className="status">Đang hoạt động</span>
                          </h4>
                          <div className="plan-line">{ownedNames.length > 0 ? `Sở hữu: ${ownedNames.join(", ")}` : "Được cấp quyền Premium bởi VO DUONG AI"}</div>
                          {memberSummary.totalAmount > 0 ? <div className="price">Tổng đã đầu tư: {formatVnd(memberSummary.totalAmount)}</div> : null}
                        </div>
                      </div>
                      <div className="ms-dates">
                        <div>
                          <b>{memberSummary.firstPurchaseAt ? new Date(memberSummary.firstPurchaseAt).toLocaleDateString("vi-VN") : "—"}</b>
                          Bắt đầu Premium
                        </div>
                        <div>
                          <b>Trọn đời</b>
                          Không giới hạn thời gian
                        </div>
                      </div>
                      <Link href="/portal/my-products" className="ms-manage" style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                        Quản lý gói Premium
                      </Link>
                    </div>
                    <div className="ustat-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className="ustat">
                        <div className="num">{journey.completedLessons}</div>
                        <div className="lbl">Bài học đã hoàn thành</div>
                      </div>
                      <div className="ustat">
                        <div className="num">{ownedNames.length}</div>
                        <div className="lbl">Chương trình đã sở hữu</div>
                      </div>
                      <div className="ustat">
                        <div className="num">{journey.badges.length}</div>
                        <div className="lbl">Huy hiệu đã đạt</div>
                      </div>
                      <div className="ustat">
                        <div className="num">{journey.totalHours} giờ</div>
                        <div className="lbl">Tổng thời gian học</div>
                      </div>
                      <div className="ustat">
                        <div className="num">{journey.streakDays} ngày</div>
                        <div className="lbl">Chuỗi ngày học</div>
                      </div>
                      <div className="ustat">
                        <div className="num">{journey.overallPercent}%</div>
                        <div className="lbl">Mức độ hoàn thành</div>
                      </div>
                    </div>
                    <div className="support-mini">
                      <h4>Bạn cần hỗ trợ?</h4>
                      <p>Đội ngũ VO DUONG AI luôn sẵn sàng hỗ trợ bạn.</p>
                      <Link href="/v2/companion" style={{ display: "block" }}>
                        <button style={{ width: "100%" }}>Chat với chúng tôi</button>
                      </Link>
                      <a href="/portal/support" className="ghost-link">
                        Hoặc gửi yêu cầu hỗ trợ
                      </a>
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <CommunityStrip channels={communityChannels} />
                  </div>
                </>
              )}
            </div>
          </div>
        </PortalV2Shell>
      </div>
    </div>
  );
}
