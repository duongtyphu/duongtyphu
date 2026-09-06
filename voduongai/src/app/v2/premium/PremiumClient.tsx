"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PortalV2Shell } from "@/components/v2/PortalV2Shell";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { formatVnd } from "@/components/portal/premium/premium-programs";
import type { PremiumPlan } from "@/lib/portal/live-premium-plans";
import type { PremiumPlanMemberSummary, PremiumPerk, PremiumAdvisorSituation, PremiumFounder, PremiumLibraryCounts } from "@/lib/portal/live-premium-v2";
import type { PremiumFaqItem, PremiumChrome, PremiumPaymentStep } from "@/lib/portal/live-premium";
import type { JourneyOverview } from "@/lib/portal/live-journey-overview";
import { siteConfig } from "@/lib/site";
import { PremiumPerksGrid } from "@/components/v2/premium/PremiumPerksGrid";
import { PremiumPaymentStepsBlock } from "@/components/v2/premium/PremiumPaymentStepsBlock";
import { PremiumAdvisorBlock } from "@/components/v2/premium/PremiumAdvisorBlock";
import { PremiumFounderBlock } from "@/components/v2/premium/PremiumFounderBlock";
import { PremiumComparisonTable } from "@/components/v2/premium/PremiumComparisonTable";

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
 * 3. Bảng "So sánh quyền lợi" — quyết định gốc từng BỎ HẲN (mockup có sẵn
 *    nhưng không bắt buộc, 3 thẻ giá đã đủ) — Founder ĐẢO NGƯỢC quyết định
 *    này ở đợt rework sau (xem mục "GIAI ĐOẠN 5 — REWORK" cuối docblock),
 *    yêu cầu thêm lại. CSS `.comp-table` vẫn còn nguyên trong `premium.css`
 *    từ đầu (chưa từng bị xoá) — chỉ JSX bị bỏ, giờ dựng lại qua
 *    `PremiumComparisonTable.tsx`.
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
 *    bạn" (`.privilege-grid`, TĨNH — 6 link thật tới Học viện AI/Chương
 *    trình Affiliate/Companion/Dự án & Cơ hội/Hành trình của tôi/Cộng
 *    đồng AI, đều là route `/v2/*` đã build thật) — đúng yêu cầu "dùng
 *    nội dung đặc quyền có thật ở Portal 2.0", không bịa tính năng mới.
 *    ĐÍNH CHÍNH (Founder phát hiện): bản đầu có 2 link CHẾT
 *    (`/v2/he-tri-thuc`/`/v2/ai-workspace`) — cả 2 route hub đã bị XOÁ từ
 *    trước (gộp vào `/v2/hoc-vien-ai`, xem `src/lib/v2/href-map.ts`'s
 *    comment "Giai đoạn 9") nhưng docblock cũ của file này chưa cập nhật
 *    kịp nên không phát hiện lúc build. Đã đổi sang 2 route thật khác
 *    (Hành trình của tôi/Cộng đồng AI) — đồng thời sửa `premium_perks`/
 *    `premium_plans.features`/`premium_advisor_situations` (dữ liệu, qua
 *    Supabase MCP) khỏi mọi chỗ nhắc "CKOS"/"AI Workspace" như tính năng
 *    RIÊNG — nội dung đó vẫn thật, chỉ không còn sống ở route độc lập.
 *
 * F. Admin quản lý: `/admin/premium/plans` (giá/trạng thái/`features` từng
 *    gói, đã có sẵn), `/admin/premium/dashboard` (Hero/2 nhãn section/
 *    thanh toán/FAQ — dùng chung Portal 1.0), `/admin/premium/v2-dashboard`
 *    (MỚI — quyền lợi/cố vấn chọn gói/người đồng hành, 3 khối riêng của
 *    `/v2/premium`, xem `src/app/admin/(dashboard)/premium/v2-dashboard/page.tsx`).
 *
 * ─── GIAI ĐOẠN 5 — REWORK (yêu cầu riêng, ngay sau khi Giai đoạn 5 gốc lên
 * Production) ───────────────────────────────────────────────────────────
 *
 * 1. Guest state — "Vì sao nên nâng cấp Premium?" (`.perk-grid`, 8 mục)
 *    đổi lưới desktop từ `repeat(6,1fr)` (8 mục = 6+2 lệch hàng) sang
 *    `repeat(4,1fr)` (8 mục = 2 hàng x 4, cân bằng thật) + thêm hover
 *    effect (`premium.css`).
 *
 * 2. "Chọn gói Premium phù hợp với bạn" — 3 thẻ giá thêm badge phân tầng
 *    TÍNH THẬT từ dữ liệu (không bịa nhãn marketing): `plan.isFeatured`
 *    (cột thật) → "🔥 Phổ biến nhất"; `bestValuePlanId()` (gói KHÔNG
 *    featured có % tiết kiệm thật cao nhất, tính qua `savingsPercent()`)
 *    → "💎 Giá trị tốt nhất"; còn lại → "🚀 Bắt đầu nhẹ nhàng". Xem
 *    `planTier()`.
 *
 * 3. Bỏ dòng "Thanh toán 1 lần · Sở hữu trọn đời" ở `bottom-cta` (cuối
 *    trang guest) — Founder yêu cầu trực tiếp (đây cũng là claim SAI với
 *    mô hình thuê bao có thời hạn hiện tại — Phase 38 đã đổi Premium sang
 *    "gói thuê bao có `durationDays`", không còn "sở hữu trọn đời" đúng
 *    nghĩa). Dòng y hệt còn ở `hero-trust` (đầu trang) — GIỮ NGUYÊN, ngoài
 *    phạm vi yêu cầu (chỉ nhắc "ở cuối trang").
 *
 * 4. Thêm lại "So sánh quyền lợi" — `PremiumComparisonTable.tsx` (component
 *    mới), dựng THẬT từ `premium_plans.features` (đệ quy resolve "Tất cả
 *    quyền lợi Gói X" thành danh sách đầy đủ), không hardcode nội dung.
 *
 * 5. Member state — `.perk-card` (dùng chung guest/member) hover effect từ
 *    mục 1 áp dụng luôn cho "Quyền lợi dành riêng cho Premium Member".
 *    **ĐÃ THÊM quyền lợi "Mỗi ngày một ý tưởng"** (Giai đoạn 11, Đợt 2 —
 *    audit NO-FAKE-DATA phát hiện docblock này lỗi thời: gap từng ghi
 *    "route vẫn placeholder đang xây dựng" — SAI, `/v2/moi-ngay-mot-y-tuong`
 *    đã hoàn thiện đầy đủ từ lâu, 446 ý tưởng/35 lĩnh vực/100 thuật ngữ,
 *    10 view). Đã thêm 2 dòng `premium_perks` (`perk_guest_mnyt`/
 *    `perk_member_mnyt`, `order:1` — đúng vị trí trống đã để sẵn từ đầu,
 *    mọi perk khác bắt đầu từ `order:2`), icon `book` (có sẵn trong
 *    `ICON_MAP`, chưa dòng nào dùng tới trước đó), số liệu trích nguyên
 *    văn đã xác nhận qua Supabase MCP (xem mục "Task #1/#12" đầu
 *    CLAUDE.md) — không bịa số mới.
 *
 * 6. "Đặc quyền Portal 2.0 của bạn" (6 link điều hướng, TRÙNG nội dung với
 *    "Quyền lợi dành riêng cho Premium Member" ngay phía trên — cả 2 đều
 *    liệt kê Học viện AI/Affiliate/Companion...) → thay hẳn bằng "Đặc
 *    quyền truy cập kho tài nguyên Premium" — 10 hộp nguồn tài nguyên,
 *    cùng link `/v2/hoc-vien-ai?tab=thu-vien` (tab "Thư viện tài nguyên").
 *    6 hộp đầu (Prompt/SOP & Quy trình/Tài nguyên/Thực hành tốt/AI Office
 *    2026/AI Research & Productivity) có SỐ ĐẾM THẬT
 *    (`getLibraryResourceCounts()`, mới, đếm `prompts`/`sop`/`resources`/
 *    `best_practices` + 2 bộ sưu tập CKOS qua `knowledge_seeds.collectionSlug`).
 *    4 hộp cuối (Claude/ChatGPT/Gemini/Nhóm Workflow) — Founder xác nhận sẽ
 *    tự bổ sung nội dung sau, hiện "Sắp cập nhật" trung thực, KHÔNG bịa số
 *    đếm dù `tools`/`ai_workflow_sections` đã có dữ liệu thật liên quan
 *    (cố ý không tự suy diễn nội dung Founder chưa xác nhận). Đã tách khỏi
 *    `.two-col` với "Lộ trình Premium của bạn" (10 hộp cần đủ chiều rộng
 *    trang mới cân bằng — nhồi vào nửa `.two-col` sẽ làm hộp quá hẹp) —
 *    "Lộ trình Premium của bạn" giờ là 1 card riêng, giữ nguyên nội dung.
 *
 * 7. "Cộng đồng Premium" — thêm nút "Nhóm Zalo Premium"
 *    (`PREMIUM_ZALO_GROUP_URL`, link thật Founder cung cấp trực tiếp —
 *    KHÁC kênh Zalo cộng đồng chung `community.ch_4`) cạnh nút "Tham gia
 *    ngay" hiện có, không thay thế.
 *
 * 8. "Ngày/giờ đăng ký Premium" — `formatDateTime()` (mới) hiện đủ NGÀY +
 *    GIỜ cho "Bắt đầu gói hiện tại" (trước chỉ có ngày,
 *    `toLocaleDateString`) — vẫn cùng nguồn thật `memberSummary.purchasedAt`
 *    (`orders.created_at`) đã đúng từ Phase 38, chỉ đổi cách hiển thị.
 *    "Bộ đếm thật của người dùng" (`ustat-grid`) đã audit lại — toàn bộ 6
 *    số đều đọc thật từ `getJourneyOverview()`/`memberSummary`, không có
 *    số nào bịa (đã đúng từ mục 6 phía trên, không cần sửa thêm).
 *
 * 9. "Cơ chế tự động nâng cấp Premium khi xác nhận thanh toán" — ĐÃ CÓ SẴN
 *    TỪ PHASE 38, không cần xây mới: trigger `on_order_confirmed_premium_plan`
 *    (hàm `handle_premium_plan_order_confirmed()`) gắn trên `orders`,
 *    `AFTER UPDATE`, tự gia hạn `members.premium_expires_at` ngay khi
 *    `status` chuyển `confirmed` VÀ đơn có `plan_id`. Đã xác nhận qua
 *    `pg_trigger` (Supabase MCP): trigger đang BẬT (`tgenabled='O'`) trên
 *    bảng `orders` thật — không phải chỉ định nghĩa function rồi bỏ quên
 *    gắn trigger.
 */

/** Nhóm Zalo riêng cho Premium Member — link thật Founder cung cấp trực
 * tiếp (khác kênh Zalo cộng đồng chung `community.ch_4` đọc từ
 * `getLiveCommunityChannels()` — Giai đoạn 7 xoá hẳn `/v2/cong-dong-ai`,
 * nơi duy nhất từng dùng kênh đó ở Portal 2.0). */
const PREMIUM_ZALO_GROUP_URL = "https://zalo.me/g/ijozriwaktv2pserw1q9";

/**
 * "Đặc quyền truy cập kho tài nguyên Premium" (memberState) — thay hẳn
 * "Đặc quyền Portal 2.0 của bạn" cũ (Founder phát hiện: trùng nội dung với
 * "Quyền lợi dành riêng cho Premium Member" ngay phía trên — 2 khối cùng
 * liệt kê Học viện AI/Affiliate/Companion...). Khối mới liệt kê ĐÚNG 10
 * nguồn của tab "Thư viện tài nguyên" (`/v2/hoc-vien-ai?tab=thu-vien`,
 * xem `TAB_QUERY_KEYS` trong `HocVienAiClient.tsx`) — 6 nguồn đầu có số
 * đếm THẬT (`getLibraryResourceCounts()`), 4 nguồn cuối (Claude/ChatGPT/
 * Gemini/Nhóm Workflow) Founder xác nhận sẽ tự bổ sung nội dung sau —
 * hiện "Sắp cập nhật" trung thực, KHÔNG bịa số đếm/mô tả cho 4 mục này.
 */
type ResourceLibraryBox = { key: string; bg: string; title: string; icon: React.ReactNode; count: number | null };

function buildResourceLibraryBoxes(counts: PremiumLibraryCounts): ResourceLibraryBox[] {
  return [
    {
      key: "prompt",
      bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
      title: "Prompt",
      icon: (
        <>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </>
      ),
      count: counts.prompt,
    },
    {
      key: "sop",
      bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
      title: "SOP & Quy trình",
      icon: (
        <>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </>
      ),
      count: counts.sop,
    },
    {
      key: "resource",
      bg: "linear-gradient(145deg,#5f8fff,#1d5fd8)",
      title: "Tài nguyên",
      icon: <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />,
      count: counts.resource,
    },
    {
      key: "best-practice",
      bg: "linear-gradient(145deg,#e2b23c,#c2660a)",
      title: "Thực hành tốt",
      icon: <path d="M12 2l2.6 6.6L21 9.3l-5 4.6L17.4 21 12 17.6 6.6 21 8 13.9l-5-4.6 6.4-.7z" />,
      count: counts.bestPractice,
    },
    {
      key: "ai-office",
      bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
      title: "AI Office 2026",
      icon: (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </>
      ),
      count: counts.aiOffice,
    },
    {
      key: "ai-research",
      bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
      title: "AI Research & Productivity",
      icon: (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </>
      ),
      count: counts.aiResearch,
    },
    {
      key: "claude",
      bg: "linear-gradient(145deg,#e879b9,#b4348a)",
      title: "Claude",
      icon: <path d="M12 2l2.6 6.6L21 9.3l-5 4.6L17.4 21 12 17.6 6.6 21 8 13.9l-5-4.6 6.4-.7z" />,
      count: null,
    },
    {
      key: "chatgpt",
      bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
      title: "ChatGPT",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </>
      ),
      count: null,
    },
    {
      key: "gemini",
      bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
      title: "Gemini",
      icon: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
      count: null,
    },
    {
      key: "workflow",
      bg: "linear-gradient(145deg,#8b6bff,#5a37e6)",
      title: "Nhóm Workflow",
      icon: (
        <>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M6 8.5V13a3 3 0 003 3h1M18 8.5V13a3 3 0 01-3 3h-1" />
        </>
      ),
      count: null,
    },
  ];
}

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

/** Gói "Giá trị tốt nhất" — gói KHÔNG phải `isFeatured` có % tiết kiệm thật cao nhất (tính qua `savingsPercent()`). `null` nếu không gói nào đủ điều kiện (không có `originalPrice` hoặc tất cả đều `isFeatured`). */
function bestValuePlanId(plans: PremiumPlan[]): string | null {
  let best: { id: string; percent: number } | null = null;
  for (const p of plans) {
    if (p.isFeatured) continue;
    const percent = savingsPercent(p.price, p.originalPrice);
    if (percent !== null && (!best || percent > best.percent)) best = { id: p.id, percent };
  }
  return best?.id ?? null;
}

/** `Date.now()` là hàm impure — tách khỏi thân `PremiumClient` (component,
 * trả JSX) sang hàm thuần độc lập, đúng lỗi `react-hooks/purity` đã gặp
 * nhiều lần trong dự án (xem CLAUDE.md "countNewUsers()" ở Admin Người dùng). */
function computeDaysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
}

/** "Ngày/giờ đăng ký Premium phải kết nối thật" — `purchasedAt` là
 * `orders.created_at` thật của đơn mua gói gần nhất (`getPremiumPlanMemberSummary()`),
 * hiển thị kèm GIỜ (không chỉ ngày như bản cũ) theo đúng yêu cầu. */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  // Tự dựng chuỗi thay vì `toLocaleString("vi-VN", {...})` — locale này tự
  // đổi thứ tự thành "giờ trước ngày" khi kết hợp `hour`/`minute` với
  // `day`/`month`/`year`, khác thứ tự "ngày/giờ" Founder yêu cầu.
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * Đồng hồ đếm ngược "Thời gian còn lại của gói" — Founder yêu cầu thêm ở
 * mục Premium Member, tính THẬT từ `memberSummary.expiresAt` (`members.premium_expires_at`
 * thật, do trigger `on_order_confirmed_premium_plan` gia hạn đúng số ngày
 * gói đã mua — 1/6/12 tháng đều tự phản ánh đúng qua cùng 1 cột này,
 * không cần biết gói nào để tính). Chỉ hiện khi `expiresAt` có giá trị —
 * Premium cấp thủ công (không mua gói, `expiresAt=null`) hiện badge
 * "Không giới hạn thời gian" riêng, KHÔNG đếm ngược giả.
 *
 * `now=null` ban đầu (chỉ set thật sau `useEffect`, chạy đúng 1 lần khi
 * mount) — tránh hydration mismatch giữa giờ server-render và giờ máy
 * trình duyệt, cùng kỹ thuật đã dùng cho lời chào theo giờ trong ngày ở
 * `/v2/trang-chu` (`TrangChuClient.tsx`).
 */
function useCountdownParts(expiresAt: string | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!expiresAt) return;
    // Đọc `Date.now()` thật ngay khi mount — không có tương đương SSR
    // (server không biết giờ máy trình duyệt), cùng lý do đã dùng cho
    // `TrangChuClient.tsx`'s lời chào theo giờ trong ngày.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt || now === null) return null;
  const diff = Math.max(0, new Date(expiresAt).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function PremiumCountdown({ expiresAt }: { expiresAt: string }) {
  const parts = useCountdownParts(expiresAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="ms-countdown">
      <div className="ms-countdown-label">⏳ Thời gian còn lại của gói</div>
      <div className="ms-countdown-units">
        <div className="cd-unit">
          <b>{parts ? pad(parts.days) : "--"}</b>
          <span>Ngày</span>
        </div>
        <div className="cd-unit">
          <b>{parts ? pad(parts.hours) : "--"}</b>
          <span>Giờ</span>
        </div>
        <div className="cd-unit">
          <b>{parts ? pad(parts.minutes) : "--"}</b>
          <span>Phút</span>
        </div>
        <div className="cd-unit">
          <b>{parts ? pad(parts.seconds) : "--"}</b>
          <span>Giây</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Đợt sửa "3 hộp thiết kế sáng tạo hơn, đẳng cấp" — tier badge tính THẬT
 * từ dữ liệu (không bịa nhãn marketing): `plan.isFeatured` (cột thật
 * `premium_plans.is_featured`, Admin tự chọn qua `/admin/premium/plans`)
 * → "Phổ biến nhất"; `isBestValue` (gói có % tiết kiệm CAO NHẤT trong các
 * gói đang có, tính thật qua `savingsPercent()`, KHÔNG phải gói featured)
 * → "Giá trị tốt nhất"; còn lại (thường là gói rẻ nhất, không giảm giá)
 * → "Bắt đầu nhẹ nhàng".
 */
function planTier(plan: PremiumPlan, isBestValue: boolean): { label: string; icon: string; className: string; savePillBg?: string } {
  if (plan.isFeatured) return { label: "Phổ biến nhất", icon: "🔥", className: "price-card featured" };
  if (isBestValue) return { label: "Giá trị tốt nhất", icon: "💎", className: "price-card best-value", savePillBg: "#8a6a1f" };
  return { label: "Bắt đầu nhẹ nhàng", icon: "🚀", className: "price-card", savePillBg: "#5a37e6" };
}

function PlanPriceCard({ plan, isPremium, isBestValue }: { plan: PremiumPlan; isPremium: boolean; isBestValue: boolean }) {
  const savePercent = savingsPercent(plan.price, plan.originalPrice);
  const months = planMonths(plan.durationDays);
  const perMonth = months > 1 ? Math.round(plan.price / months) : null;
  const tier = planTier(plan, isBestValue);
  const checkoutHref = `/v2/checkout?${new URLSearchParams({
    type: "premium_plan",
    id: plan.id,
    title: plan.name,
    price: String(plan.price),
  }).toString()}`;

  return (
    <div className={tier.className}>
      {savePercent !== null && (
        <span className="save-pill" style={tier.savePillBg ? { background: tier.savePillBg } : undefined}>
          Tiết kiệm {savePercent}%
        </span>
      )}
      <span className="tier-tag">
        {tier.icon} {tier.label}
      </span>
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

/**
 * "Cộng đồng Premium" — Founder gửi ảnh chụp bố cục 4 quyền lợi cộng đồng
 * (Nhóm kín/Livestream/Workshop/Q&A) + CTA "Tham gia ngay", yêu cầu thiết
 * kế lại theo đúng nội dung đó, CTA gắn link nhóm Zalo thật.
 *
 * "Nhóm kín Premium"/"Livestream độc quyền"/"Workshop thực chiến"/"Q&A
 * cùng chuyên gia" — 4 dòng mô tả QUYỀN LỢI tĩnh (không phải số liệu đo
 * được), do Founder trực tiếp cung cấp qua ảnh thiết kế — giữ nguyên như
 * bản gửi. "Nhóm kín Premium" CHÍNH LÀ nhóm Zalo Premium
 * (`PREMIUM_ZALO_GROUP_URL`), không phải 1 kênh riêng khác.
 *
 * CỐ Ý BỎ 2 phần trong ảnh gốc — vi phạm NO-FAKE-DATA đã xác nhận qua
 * Supabase MCP: (1) dãy avatar tròn "A B C D" — không có cơ chế/quyền hiển
 * thị ảnh đại diện thành viên khác (vừa lộ dữ liệu cá nhân, vừa không có
 * ảnh thật); (2) "Hơn 1.200 thành viên Premium..." — số liệu thực tế hiện
 * tại chỉ có 1 tài khoản Premium đang hoạt động (đếm qua
 * `members.premium_expires_at`), lệch ~1200 lần so với con số trong ảnh.
 * Thay bằng 1 dòng giới thiệu trung thực, không kèm số. Đã báo lại Founder
 * trong tóm tắt cuối phiên — xem CLAUDE.md.
 *
 * Không còn phụ thuộc `getLiveCommunityChannels()` (bảng `community`,
 * FB/YouTube/TikTok/Zalo chung) — khối này giờ MÔ TẢ QUYỀN LỢI Premium,
 * không phải danh sách kênh mạng xã hội chung. Đã bỏ hẳn prop `channels`/
 * `communityChannels` khỏi `PremiumClient`/`page.tsx` (không còn consumer
 * nào khác trong trang này). (Giai đoạn 7 xoá hẳn `/v2/cong-dong-ai` —
 * `getLiveCommunityChannels()` không còn consumer nào trong `/v2/*`.)
 */
const COMMUNITY_PERKS: { title: string; desc: string; icon: React.ReactNode }[] = [
  {
    title: "Nhóm kín Premium",
    desc: "Cộng đồng học viên chất lượng cao",
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
        <path d="M16 3.13a4 4 0 010 7.75M22 21v-2a4 4 0 00-3-3.87" />
      </>
    ),
  },
  {
    title: "Livestream độc quyền",
    desc: "Chia sẻ kiến thức hàng tuần",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 8.5l6 3.5-6 3.5z" />
      </>
    ),
  },
  {
    title: "Workshop thực chiến",
    desc: "Ứng dụng AI vào công việc",
    icon: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </>
    ),
  },
  {
    title: "Q&A cùng chuyên gia",
    desc: "Giải đáp thắc mắc trực tiếp",
    icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  },
];

function CommunityStrip() {
  return (
    <div className="community-strip">
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Cộng đồng Premium</h3>
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>Kết nối, chia sẻ và phát triển cùng cộng đồng Premium Member</p>
        <div className="community-links">
          {COMMUNITY_PERKS.map((p) => (
            <div className="cl-item" key={p.title}>
              <div className="ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {p.icon}
                </svg>
              </div>
              <div>
                <h6>{p.title}</h6>
                <span>{p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="community-right">
        <p>Kết nối trực tiếp với VO DUONG AI và cộng đồng Premium Member qua nhóm Zalo chính thức.</p>
        <a href={PREMIUM_ZALO_GROUP_URL} target="_blank" rel="noopener noreferrer">
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
  faq,
  journey,
  memberSummary,
  chrome,
  paymentSteps,
  perks,
  advisorSituations,
  founder,
  libraryCounts,
}: {
  premium: PremiumStatus;
  plans: PremiumPlan[];
  faq: PremiumFaqItem[];
  journey: JourneyOverview;
  memberSummary: PremiumPlanMemberSummary;
  chrome: PremiumChrome;
  paymentSteps: PremiumPaymentStep[];
  perks: PremiumPerk[];
  advisorSituations: PremiumAdvisorSituation[];
  founder: PremiumFounder;
  libraryCounts: PremiumLibraryCounts;
}) {
  const daysRemaining = computeDaysRemaining(memberSummary.expiresAt);
  const bestValueId = bestValuePlanId(plans);

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
                          style={{ background: "#e6f7ed", color: "#066b4d", fontWeight: 800, padding: "4px 10px", borderRadius: 7, fontSize: 11.5 }}
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
                          <PlanPriceCard
                            plan={plan}
                            isPremium={premium.isPremium}
                            isBestValue={plan.id === bestValueId}
                            key={plan.id}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <PremiumComparisonTable plans={plans} />

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

                  <div style={{ marginTop: 24 }}>
                    <div className="section-head">
                      <h3>Đặc quyền truy cập kho tài nguyên Premium</h3>
                    </div>
                    <div className="resource-grid" style={{ marginTop: 14 }}>
                      {buildResourceLibraryBoxes(libraryCounts).map((item) => (
                        <Link href="/v2/hoc-vien-ai?tab=thu-vien" className="resource-card" key={item.key}>
                          <div className="ico" style={{ background: item.bg }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                              {item.icon}
                            </svg>
                          </div>
                          <div>
                            <h6>{item.title}</h6>
                            <span>{item.count !== null ? `${item.count} mục` : "Sắp cập nhật"}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="card roadmap-card" style={{ marginTop: 24 }}>
                    <div className="card-head">
                      <h4>Lộ trình Premium của bạn</h4>
                    </div>
                    <PremiumRoadmap journey={journey} />
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

                      {memberSummary.expiresAt ? (
                        <PremiumCountdown expiresAt={memberSummary.expiresAt} />
                      ) : (
                        <div className="ms-unlimited">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.06-8-12.356-8-5.096 0-5.096 8 0 8 5.296 0 7.26-8 12.356-8z" />
                          </svg>
                          Premium không giới hạn thời gian
                        </div>
                      )}

                      <div className="ms-info-rows">
                        <div className="ms-info-row">
                          <span>Bắt đầu gói hiện tại</span>
                          <b>{memberSummary.purchasedAt ? formatDateTime(memberSummary.purchasedAt) : "—"}</b>
                        </div>
                        <div className="ms-info-row">
                          <span>Hết hạn</span>
                          <b>{memberSummary.expiresAt ? formatDateTime(memberSummary.expiresAt) : "Không giới hạn"}</b>
                        </div>
                      </div>

                      <Link href="/v2/tai-khoan" className="ms-manage" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
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
                    <CommunityStrip />
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
