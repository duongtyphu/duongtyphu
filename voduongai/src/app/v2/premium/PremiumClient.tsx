"use client";

import { useState } from "react";
import Link from "next/link";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { formatVnd } from "@/components/portal/premium/premium-programs";
import type { PremiumPlan } from "@/lib/portal/live-premium-plans";
import type { PremiumPlanMemberSummary, PremiumPerk, PremiumAdvisorSituation, PremiumFounder } from "@/lib/portal/live-premium-v2";
import type { LiveCommunityChannel } from "@/lib/portal/live-community";
import type { PremiumFaqItem, PremiumChrome, PremiumPaymentStep } from "@/lib/portal/live-premium";
import type { JourneyOverview } from "@/lib/portal/live-journey-overview";
import { siteConfig } from "@/lib/site";
import { PremiumPerksGrid } from "@/components/v2/premium/PremiumPerksGrid";
import { PremiumPaymentStepsBlock } from "@/components/v2/premium/PremiumPaymentStepsBlock";
import { PremiumAdvisorBlock } from "@/components/v2/premium/PremiumAdvisorBlock";
import { PremiumFounderBlock } from "@/components/v2/premium/PremiumFounderBlock";

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
 * 2. Bảng giá 3 gói thuê bao "Tháng/6 Tháng/12 Tháng" — PHASE 38 (yêu cầu
 *    riêng của Founder, đảo ngược quyết định gốc ở trên): hệ thống giờ ĐÃ
 *    CÓ backing thật — bảng `premium_plans` (typed, `getLivePremiumPlans()`),
 *    3 gói Published với giá/tính năng/nhãn tiết kiệm thật (299k/1.49tr/
 *    2.59tr). Mua bất kỳ gói nào là 1 đơn hàng qua đúng luồng
 *    checkout+SePay đang chạy (`itemType="premium_plan"`), xác nhận xong
 *    trigger DB `on_order_confirmed_premium_plan` tự gia hạn
 *    `members.premium_expires_at` đúng số ngày của gói — Premium giờ CÓ
 *    THỜI HẠN thật (khác quyết định "mua đứt = vĩnh viễn" cũ của 5 chương
 *    trình, 2 cơ chế cùng tồn tại song song ở `getPremiumStatus()`).
 *
 * 3. Bảng "So sánh quyền lợi" (7 hàng theo 3 gói thuê bao) — BỎ HẲN, đúng
 *    quyết định gốc: mockup có sẵn nhưng đây không phải yêu cầu bắt buộc,
 *    3 thẻ giá đã liệt kê đủ tính năng từng gói.
 *
 * 4. "Lộ trình Premium của bạn" (6 bước bịa % giả) → 4 giai đoạn thật của
 *    `learning_paths` qua `getJourneyOverview()` (tái dùng nguyên, không
 *    viết lại lần 2 — đã dùng ở `/v2/hanh-trinh-cua-toi`).
 *
 * 5. `member-status-card` — "Gói hiện tại: Premium Monthly / 99.000đ/tháng"
 *    + ngày bắt đầu/hết hạn giả → PHASE 38: tên GÓI đã mua gần nhất + số
 *    tiền thật đã trả (`getPremiumPlanMemberSummary()`, đọc `orders.plan_id`)
 *    + ngày mua thật + ngày hết hạn THẬT (`members.premium_expires_at`, do
 *    trigger gia hạn khi mua gói — không còn là "Không giới hạn" tĩnh).
 *    Trường hợp Premium được cấp qua đường khác (thủ công/mua đứt cũ, chưa
 *    từng mua gói nào) — `planName`/`expiresAt` đều `null`, hiển thị dòng
 *    fallback trung thực "Được cấp quyền Premium bởi VO DUONG AI" +
 *    "Không giới hạn thời gian" thay vì bịa ngày.
 *
 * 6. `ustat-grid` (6 số bịa: tài liệu đã tải/prompt đã lưu/workflow đã dùng/
 *    45 giờ/7 ngày/85%) — 3/6 không có hệ thống theo dõi thật (lượt tải,
 *    lượt lưu, lượt dùng workflow) → thay bằng 3 số Premium thật khác: bài
 *    học đã hoàn thành, số NGÀY CÒN LẠI của gói hiện tại (tính từ
 *    `expiresAt` thật — hợp lý hơn "số chương trình sở hữu" cũ vì giờ chỉ
 *    có 1 gói đang hoạt động, không phải danh sách nhiều chương trình),
 *    huy hiệu đã đạt. 3 còn lại (giờ học/chuỗi ngày/% hoàn thành) đã có
 *    backing thật, tái dùng nguyên từ `journey`.
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
 * 9. `support-mini`/`ms-manage`/nút "Đã là Premium — Xem sản phẩm" — trước
 *    trỏ `/portal/my-products`/`/portal/support` (Portal 1.0, VI PHẠM
 *    NGUYÊN TẮC BẤT BIẾN đầu CLAUDE.md, phát hiện khi audit Giai đoạn 5) →
 *    đổi sang `/v2/tai-khoan` (trang Tài khoản 2.0 đã có sẵn, hiển thị
 *    đúng "Sản phẩm đã mua" từ `orders` thật qua `AccountContent`) và
 *    `siteConfig.community.zaloGroup` (kênh liên hệ thật, cùng cách đã
 *    dùng cho "Liên hệ hỗ trợ" ở hub Dự án & Cơ hội). "Chat với chúng tôi"
 *    → `/v2/companion` (điểm chat AI thật duy nhất trong hệ thống, giữ
 *    nguyên, không đổi).
 *
 * ─── GIAI ĐOẠN 5 (đợt redesign lớn theo yêu cầu riêng Founder) ───────────
 *
 * A. Icon kim cương — SVG outline vàng cũ trước tiêu đề "Premium" → ảnh
 *    kim cương tím thật đã có sẵn (`icon-premium.png`, cùng ảnh dùng cho
 *    promo sidebar/topbar toàn `/v2/*`).
 *
 * B. BỎ HẲN "Kho tài nguyên Premium" (cả 2 trạng thái) — Founder yêu cầu
 *    trực tiếp, không còn dùng `getPremiumResourceCounts()` ở trang này
 *    nữa (hàm vẫn giữ nguyên, còn dùng bởi `/v2/admin/premium` — mirror
 *    thống kê CKOS riêng, không đụng). BỎ HẲN "Premium Member nói gì?"
 *    (honest empty-state cũ — Founder yêu cầu bỏ luôn, không chỉ ẩn khi
 *    rỗng).
 *
 * C. Quyền lợi Premium viết lại đầy đủ/uy tín hơn — `premium_plans.features`
 *    (mỗi gói) + 2 lưới "Vì sao nên nâng cấp?"/"Quyền lợi dành riêng cho
 *    Premium Member" đổi từ mảng hardcode sang bảng mới `premium_perks`
 *    (8 mục/trạng thái, `PremiumPerksGrid`, admin-editable) — mọi mục đều
 *    gắn tính năng THẬT đã build trong Portal 2.0 (CKOS/Học viện AI/AI
 *    Workspace/Chương trình Affiliate/Companion/Cộng đồng), không bịa số
 *    liệu/cam kết.
 *
 * D. 3 khối mới, đúng thứ tự Founder yêu cầu, port ý tưởng từ Portal 1.0
 *    (`/portal/premium/page.tsx`) nhưng thiết kế lại theo `.pm` (không copy
 *    Tailwind/canvas tối của 1.0):
 *    - "Thanh toán hoạt động thế nào?" (`PremiumPaymentStepsBlock`) — tái
 *      dùng NGUYÊN `premium_chrome.paymentSectionTitle` + `premium_payment_steps`
 *      (đã có sẵn, admin-editable qua `/admin/premium/dashboard` từ trước)
 *      — Single Source of Truth với Portal 1.0, không tạo bảng trùng.
 *    - "Không chắc nên chọn gì?" (`PremiumAdvisorBlock`) — CHỈ port Ý TƯỞNG
 *      Companion Advisor (1.0's `PremiumAdvisor.tsx`), không port thẳng nội
 *      dung vì 1.0 nhắm 5 chương trình mua đứt cũ không còn tồn tại ở đây
 *      — viết lại 6 tình huống mới nhắm đúng 3 gói thuê bao thật (bảng mới
 *      `premium_advisor_situations`).
 *    - "🤝 Người đồng hành" (`PremiumFounderBlock`) — port NGUYÊN VĂN hồ sơ
 *      Founder thật từ 1.0's `FounderSpotlight.tsx` (không bịa) vào bảng
 *      mới `premium_founder` (trước đó tĩnh 100%, kể cả ở 1.0 — giờ admin-
 *      editable). "Câu hỏi thường gặp" GIỮ NGUYÊN vị trí/nguồn dữ liệu
 *      (`getLivePremiumFaq()`, đã đúng từ trước).
 *
 * E. Trạng thái "Đã mua" (memberState) — khối "Kho tài nguyên Premium" đã
 *    bỏ ở cột trái `.two-col` được thay bằng "Đặc quyền Portal 2.0 của
 *    bạn" (`.privilege-grid`, TĨNH — 6 link thật tới CKOS/Học viện AI/AI
 *    Workspace/Chương trình Affiliate/Companion/Dự án & Cơ hội, đều là
 *    route `/v2/*` đã build thật) — đúng yêu cầu "dùng nội dung đặc quyền
 *    có thật ở Portal 2.0", không bịa tính năng mới.
 *
 * F. Admin quản lý: `/admin/premium/plans` (giá/trạng thái/`features` từng
 *    gói, đã có sẵn), `/admin/premium/dashboard` (Hero/2 nhãn section/
 *    thanh toán/FAQ — dùng chung Portal 1.0), `/admin/premium/v2-dashboard`
 *    (MỚI — quyền lợi/cố vấn chọn gói/người đồng hành, 3 khối riêng của
 *    `/v2/premium`, xem `src/app/admin/(dashboard)/premium/v2-dashboard/page.tsx`).
 */

const PLATFORM_LABEL_SHORT: Record<string, string> = {
  Facebook: "FB",
  YouTube: "YT",
  TikTok: "TT",
  Zalo: "ZL",
  Telegram: "TG",
};

/**
 * "Đặc quyền Portal 2.0 của bạn" (memberState) — thay "Kho tài nguyên
 * Premium" đã bỏ, đúng yêu cầu Founder "dùng nội dung đặc quyền có thật ở
 * Portal 2.0" — 6 link TĨNH tới đúng 6 route `/v2/*` thật đã build (không
 * bịa route/tính năng mới).
 */
const PORTAL_PRIVILEGES: { href: string; bg: string; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    href: "/v2/he-tri-thuc",
    bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
    title: "Hệ tri thức AI (CKOS)",
    desc: "Prompt · Workflow · Template · Case Study",
    icon: (
      <>
        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
      </>
    ),
  },
  {
    href: "/v2/hoc-vien-ai",
    bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
    title: "Học viện AI",
    desc: "Trọn lộ trình bài giảng slide & video",
    icon: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </>
    ),
  },
  {
    href: "/v2/ai-workspace",
    bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
    title: "AI Workspace",
    desc: "Công cụ AI & workflow không giới hạn",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </>
    ),
  },
  {
    href: "/v2/affiliate",
    bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
    title: "Chương trình Affiliate",
    desc: "Mã giới thiệu & hoa hồng của bạn",
    icon: <path d="M8 12l3 3 5-6M12 22c5.5-1.5 9-6 9-11V5l-9-3-9 3v6c0 5 3.5 9.5 9 11z" />,
  },
  {
    href: "/v2/companion",
    bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
    title: "Companion",
    desc: "Trò chuyện, gợi ý theo tiến độ thật",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r=".5" fill="#fff" />
      </>
    ),
  },
  {
    href: "/v2/du-an-co-hoi",
    bg: "linear-gradient(145deg,#e879b9,#b4348a)",
    title: "Dự án & Cơ hội",
    desc: "DigiU · SolarGroup · Ohana và hơn thế",
    icon: (
      <>
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
      </>
    ),
  },
];

/** `Math.round(durationDays/30)` — "30 ngày" của DB hiển thị gọn thành "1 tháng" thay vì số ngày lẻ. */
function planMonths(durationDays: number): number {
  return Math.max(1, Math.round(durationDays / 30));
}

/** % tiết kiệm tính THẬT từ `price`/`originalPrice` — không hardcode "20%"/"40%" tĩnh, luôn khớp đúng giá Admin đang cấu hình qua `/admin/premium/plans`. */
function savingsPercent(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

/** Badge "Tiết kiệm đến X%" ở đầu bảng giá — X = % tiết kiệm CAO NHẤT trong các gói đang có, tính thật (không hardcode "40%"). `null` nếu không gói nào có `originalPrice`. */
function maxSavingsLabel(plans: PremiumPlan[]): string | null {
  const percents = plans.map((p) => savingsPercent(p.price, p.originalPrice)).filter((p): p is number => p !== null);
  if (percents.length === 0) return null;
  return `Tiết kiệm đến ${Math.max(...percents)}%`;
}

/** `Date.now()` là hàm impure — tách khỏi thân `PremiumClient` (component,
 * trả JSX) sang hàm thuần độc lập, đúng lỗi `react-hooks/purity` đã gặp
 * nhiều lần trong dự án (xem CLAUDE.md "countNewUsers()" ở Admin Người dùng). */
function computeDaysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
}

function PlanPriceCard({ plan, isPremium }: { plan: PremiumPlan; isPremium: boolean }) {
  const savePercent = savingsPercent(plan.price, plan.originalPrice);
  const months = planMonths(plan.durationDays);
  const perMonth = months > 1 ? Math.round(plan.price / months) : null;
  const checkoutHref = `/portal/checkout?${new URLSearchParams({
    type: "premium_plan",
    id: plan.id,
    title: plan.name,
    price: String(plan.price),
  }).toString()}`;

  return (
    <div className={plan.isFeatured ? "price-card featured" : "price-card"}>
      {savePercent !== null && (
        <span className="save-pill" style={plan.isFeatured ? undefined : { background: "#5a37e6" }}>
          Tiết kiệm {savePercent}%
        </span>
      )}
      <h5>{plan.name}</h5>
      <div className="sub">{plan.subtitle}</div>
      <div className="amt">
        {formatVnd(plan.price)}
        {plan.originalPrice ? <span className="strike">{formatVnd(plan.originalPrice)}</span> : null}
      </div>
      <div className="per">{perMonth ? `${formatVnd(perMonth)}/tháng` : "/ tháng"}</div>
      <div className="price-feat">
        {plan.features.map((f) => (
          <div key={f}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {f}
          </div>
        ))}
      </div>
      {isPremium ? (
        <Link href="/v2/tai-khoan" className="price-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Đã là Premium — Xem sản phẩm
        </Link>
      ) : (
        <Link href={checkoutHref} className="price-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          {plan.ctaLabel}
        </Link>
      )}
      {months > 1 && <div className="price-note">Thanh toán 1 lần – học {months} tháng</div>}
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
  plans,
  communityChannels,
  faq,
  journey,
  memberSummary,
  chrome,
  paymentSteps,
  perks,
  advisorSituations,
  founder,
}: {
  premium: PremiumStatus;
  plans: PremiumPlan[];
  communityChannels: LiveCommunityChannel[];
  faq: PremiumFaqItem[];
  journey: JourneyOverview;
  memberSummary: PremiumPlanMemberSummary;
  chrome: PremiumChrome;
  paymentSteps: PremiumPaymentStep[];
  perks: PremiumPerk[];
  advisorSituations: PremiumAdvisorSituation[];
  founder: PremiumFounder;
}) {
  const daysRemaining = computeDaysRemaining(memberSummary.expiresAt);

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
                    {/* eslint-disable-next-line @next/next/no-img-element -- icon tĩnh cố định */}
                    <img src="/v2-static/assets/icon-premium.png" alt="" width={24} height={24} style={{ objectFit: "contain" }} />
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
                    <PremiumPerksGrid seed={perks} audience="guest" />
                  </div>

                  <div style={{ marginTop: 24 }} id="chuong-trinh">
                    <div className="section-head">
                      <h3>Chọn gói Premium phù hợp với bạn</h3>
                      {maxSavingsLabel(plans) && (
                        <span
                          className="p-tag"
                          style={{ background: "#e6f7ed", color: "#189a52", fontWeight: 800, padding: "4px 10px", borderRadius: 7, fontSize: 11.5 }}
                        >
                          {maxSavingsLabel(plans)}
                        </span>
                      )}
                    </div>
                    {plans.length === 0 ? (
                      <p className="empty-hint">Chưa có gói Premium nào đang mở bán.</p>
                    ) : (
                      <div className="price-grid" style={{ marginTop: 14 }}>
                        {plans.map((plan) => (
                          <PlanPriceCard plan={plan} isPremium={premium.isPremium} key={plan.id} />
                        ))}
                      </div>
                    )}
                  </div>

                  <PremiumPaymentStepsBlock seedChrome={chrome} seedSteps={paymentSteps} />

                  <PremiumAdvisorBlock seed={advisorSituations} plans={plans} />

                  <PremiumFounderBlock seed={founder} />

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
                        <Link href="/v2/tai-khoan" className="btn-gold">
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
                    <div style={{ marginTop: 14 }}>
                      <PremiumPerksGrid seed={perks} audience="member" />
                    </div>
                  </div>

                  <div className="two-col" style={{ marginTop: 24 }}>
                    <div>
                      <div className="section-head">
                        <h3>Đặc quyền Portal 2.0 của bạn</h3>
                      </div>
                      <div className="privilege-grid" style={{ marginTop: 14 }}>
                        {PORTAL_PRIVILEGES.map((item) => (
                          <Link href={item.href} className="privilege-card" key={item.href}>
                            <div className="ico" style={{ background: item.bg }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                {item.icon}
                              </svg>
                            </div>
                            <div>
                              <h6>{item.title}</h6>
                              <span>{item.desc}</span>
                            </div>
                          </Link>
                        ))}
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
                          <div className="plan-line">
                            {memberSummary.planName ? `Gói hiện tại: ${memberSummary.planName}` : "Được cấp quyền Premium bởi VO DUONG AI"}
                          </div>
                          {memberSummary.lastPaidAmount > 0 ? <div className="price">Đã thanh toán: {formatVnd(memberSummary.lastPaidAmount)}</div> : null}
                        </div>
                      </div>
                      <div className="ms-dates">
                        <div>
                          <b>{memberSummary.purchasedAt ? new Date(memberSummary.purchasedAt).toLocaleDateString("vi-VN") : "—"}</b>
                          Bắt đầu gói hiện tại
                        </div>
                        <div>
                          <b>{memberSummary.expiresAt ? new Date(memberSummary.expiresAt).toLocaleDateString("vi-VN") : "Trọn đời"}</b>
                          {memberSummary.expiresAt ? `Hết hạn (còn ${daysRemaining} ngày)` : "Không giới hạn thời gian"}
                        </div>
                      </div>
                      <Link href="/v2/tai-khoan" className="ms-manage" style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                        Quản lý gói Premium
                      </Link>
                    </div>
                    <div className="ustat-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <div className="ustat">
                        <div className="num">{journey.completedLessons}</div>
                        <div className="lbl">Bài học đã hoàn thành</div>
                      </div>
                      <div className="ustat">
                        <div className="num">{daysRemaining !== null ? daysRemaining : "—"}</div>
                        <div className="lbl">Ngày còn lại của gói</div>
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
                      <a href={siteConfig.community.zaloGroup} target="_blank" rel="noopener noreferrer" className="ghost-link">
                        Hoặc liên hệ qua Zalo
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
