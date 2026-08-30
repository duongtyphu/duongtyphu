import QRCode from "qrcode";

import { getPremiumStatus } from "@/lib/v2/premium-access";
import { getAffiliateOverview, getAffiliateLeaderboard, getAffiliateTierRules } from "@/lib/portal/live-affiliate";
import { getLiveLandingChrome } from "@/lib/portal/live-landing-chrome";

import { AffiliateClient } from "./AffiliateClient";

export const metadata = { title: "Chương trình Affiliate | VO DUONG AI" };

/**
 * `/v2/affiliate` — 1:1 với `Chuong trinh Affilate.html`.
 *
 * Trang này ánh xạ gần như hoàn hảo sang Chương trình Affiliate CHÍNH THỨC
 * đã có thật ở 1.0 (`/portal/affiliate`, `getAffiliateOverview()` —
 * referral_code tự sinh cho mọi user, trigger tự ghi nhận/tính hoa hồng) —
 * tái dùng NGUYÊN hàm đó, không viết lại logic. Xem docblock đầu
 * `AffiliateClient.tsx` cho từng chỗ khác bản tĩnh.
 *
 * KHÔNG liên quan `Cac mo hinh Affilate.html`/`Affilate san giao dich.html`
 * — 2 trang đó có `nav-parent="Du an Co hoi.html"` (đã audit xác nhận qua
 * markup gốc), tức thuộc họ "Dự án & Cơ hội" (ecosystem `lam-affilate`/
 * `sangiaodich` đã có sẵn ở 1.0), không phải sub-page của trang này.
 *
 * Giai đoạn 6 — Founder xác nhận "gộp `/v2/affiliate` vào hệ thống
 * Affiliate đầy đủ" (trang này thực ra ĐÃ dùng đúng `getAffiliateOverview()`
 * thật từ trước, không phải xây lại). Việc còn thiếu: "Bảng xếp hạng
 * Affiliate" (trước honest empty-state vì RLS `referrals` chỉ cho đọc
 * dòng của chính mình) — nay đọc `getAffiliateLeaderboard()` (RPC
 * SECURITY DEFINER, xem `supabase-giai-doan-6-affiliate-leaderboard-rpc.sql`).
 *
 * Giai đoạn 6 (tiếp) — "Mức hoa hồng của bạn" (3 tầng, đúng thiết kế đã
 * chốt trong `vdaiportal2.0.html`) đọc `getAffiliateTierRules()` (bảng
 * `affiliate_tier_rules`, xem `supabase-giai-doan-6-affiliate-tier-rules.sql`).
 * "Bộ tài nguyên Marketing" soạn mới (Claude tự soạn nội dung thật, không
 * bịa) — video giới thiệu dùng lại NGUYÊN `youtubeId` thật của
 * `landing_chrome` (khối "skills-showcase", Single Source of Truth với
 * `/`), logo/bộ nhận diện trỏ file thật `public/brand/*`.
 */
export default async function AffiliatePage() {
  const [premium, overview, leaderboard, tierRules, landingChrome] = await Promise.all([
    getPremiumStatus(),
    getAffiliateOverview(),
    getAffiliateLeaderboard(),
    getAffiliateTierRules(),
    getLiveLandingChrome(),
  ]);

  const qrSvg = overview?.referralLink
    ? await QRCode.toString(overview.referralLink, { type: "svg", margin: 1, width: 176, color: { dark: "#1c1830", light: "#ffffffff" } })
    : null;

  const introVideoId = landingChrome.find((row) => row.id === "skills-showcase")?.youtubeId ?? null;

  return (
    <AffiliateClient
      premium={premium}
      overview={overview}
      qrSvg={qrSvg}
      leaderboard={leaderboard}
      tierRules={tierRules}
      introVideoId={introVideoId}
    />
  );
}
