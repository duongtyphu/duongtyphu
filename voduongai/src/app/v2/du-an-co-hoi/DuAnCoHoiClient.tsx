"use client";

/* =============================================================================
 * Dự án & Cơ hội (hub) 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/Du an Co hoi.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `du-an-co-hoi.css` (chép nguyên văn).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh:
 *
 *  1. `tabs-row` (6/7 tab điều hướng hệ sinh thái) đã BỎ HẲN theo đúng yêu
 *     cầu gốc của kế hoạch 14-hạng-mục (mục 5a — "bỏ tab hệ sinh thái,
 *     thêm 4 khối Đồng hành/Nguyên tắc chia sẻ/Companion gửi bạn/FAQ").
 *     KHÔNG mất khả năng vào 5 trang con — `cat-grid` (mục 3 dưới) và mục
 *     "Dự án & Cơ hội" trong sidebar (`nav-sub`) đã là 2 đường dẫn thật
 *     khác dẫn tới đúng 5 trang, tabs-row chỉ là đường thứ 3 trùng lặp.
 *  1b. 4 khối MỚI (Đồng hành/Nguyên tắc chia sẻ/FAQ/Companion gửi bạn) —
 *     port nội dung THẬT từ `/portal/duan-cohoi/page.tsx` (Portal 1.0,
 *     cùng trang, đã có sẵn 4 khối này) vào đúng thiết kế `.duo` của
 *     2.0 — port NỘI DUNG (mảng dữ liệu tĩnh: 5 ảnh thật, 4 tiêu chí, 3
 *     FAQ, 5 lời nhắn Companion), KHÔNG import/link ngược route
 *     `/portal/*` (đúng NGUYÊN TẮC BẤT BIẾN đầu CLAUDE.md) — 2 trang dùng
 *     2 hệ thiết kế hoàn toàn khác nhau (Tailwind+GemCard ở 1.0, CSS tay
 *     `.duo` ở 2.0) nên không chia sẻ được component, chỉ chia sẻ nội
 *     dung. 5 ảnh dùng lại đúng file đã có (`public/images/duan-cohoi/
 *     dong-hanh/`, không cần ảnh mới) — "Đồng hành" là marquee chạy liên
 *     tục phải→trái (cùng kỹ thuật `.tools-marquee`/`.eco-article-marquee`
 *     ở `globals.css`: track render 2 lần, animate đúng -50% để loop liền
 *     mạch, dừng khi hover/focus, tắt hẳn khi `prefers-reduced-motion`),
 *     không phải grid tĩnh — CSS riêng cho `.duo` vì 2 trang không dùng
 *     chung `globals.css` marquee classes. Đặt sau "Dự án nổi bật", đúng
 *     thứ tự 1.0: Đồng hành → Nguyên tắc chia sẻ → FAQ → Companion gửi bạn.
 *  2. `pj-hero` — h2/3 pj-feat mô tả chung giữ nguyên tĩnh (copy quảng bá
 *     chung, không khẳng định số liệu cụ thể). Nút "Xem hướng dẫn đầu tư"
 *     giữ trơ (chưa có tài liệu hướng dẫn đầu tư thật riêng biệt nào).
 *  3. `cat-grid` (5 thẻ danh mục) — bỏ 5 con số bịa ("12 dự án"/"8 dự
 *     án"/"6 sàn"/"15 dự án"/"7 nền tảng"), thay bằng mô tả thật:
 *     DigiU/SolarGroup dùng `chrome.shortDescription` thật + số dự án con
 *     thật; Các mô hình Affilate/Affilate sàn giao dịch dùng
 *     `chrome.shortDescription` thật + số chương trình/sàn thật; Ohana
 *     dùng ĐÚNG mô tả tĩnh đã duyệt riêng cho trang Ohana (không suy đoán
 *     số liệu mới, không map sang dữ liệu ecosystem nào). Mỗi thẻ link
 *     thật sang đúng trang con.
 *  4. "Dự án nổi bật" (bản gốc: DigiU/SolarGroup/Bybit/NEAR Protocol kèm
 *     số người theo dõi bịa — KHÔNG có hệ thống đếm follower nào trong dự
 *     án) → thay bằng DỰ ÁN CON THẬT của DigiU + SolarGroup
 *     (`getLiveSubProjects`, tối đa 4 trong 5 dự án con thật đang có: 3
 *     DigiU + 2 SolarGroup). Nhãn góc thẻ (`hot-pill`) đổi từ "Nổi bật"/
 *     "Mới" (tuyên bố xu hướng không kiểm chứng được) sang tên hệ sinh
 *     thái cha (trung lập, có thật). Bỏ dòng "X người theo dõi" (bịa) VÀ
 *     bỏ hẳn link "Xem chi tiết →" (trước trỏ `voduongai.com/portal/duan-cohoi/
 *     ...`, Portal 1.0 — vi phạm NGUYÊN TẮC BẤT BIẾN, và chưa có trang chi
 *     tiết dự án con nào ở `/v2/*` để trỏ tới) — theo đúng yêu cầu Founder,
 *     xoá hẳn thay vì trỏ bậy.
 *  5. "Cơ hội đang mở" (3 cơ hội đầu tư bịa kèm hạn chót cụ thể — KHÔNG có
 *     hệ thống "cơ hội đầu tư" nào trong dự án, và đây là nội dung mời
 *     gọi đầu tư với ngày cụ thể không có thật — rủi ro cao nếu để sai)
 *     → honest empty-state.
 *  6. "Tin tức & cập nhật" (3 tin bịa kèm mốc thời gian cụ thể "2 giờ
 *     trước"...) → 3 bài viết THẬT mới nhất, gộp từ DigiU/SolarGroup/Các
 *     mô hình Affilate/Affilate sàn giao dịch (`getAllLiveEcosystemArticles()`,
 *     lọc `subProjectId=""` — bài cấp hệ sinh thái, không lẫn bài dự án
 *     con). Nhãn `.time` giữ trung thực ("Cập nhật" — không bịa mốc thời
 *     gian cụ thể). **Rà soát lại (đợt kiểm tra Giai đoạn 4):** link trước
 *     đó trỏ `voduongai.com/portal/duan-cohoi/.../cap-nhat/...` (Portal
 *     1.0, vi phạm NGUYÊN TẮC BẤT BIẾN) — chưa có trang chi tiết bài viết
 *     nào ở `/v2/*`, đã sửa trỏ về đúng trang hệ sinh thái 2.0 tương ứng
 *     (`/v2/du-an-co-hoi/{slug}`) thay vì trang chi tiết.
 *  7. "Tài liệu & hướng dẫn" (4 tài liệu bịa kèm dung lượng cụ thể) → gộp
 *     `chrome.documents` THẬT từ 4 hệ sinh thái (DigiU/SolarGroup/Các mô
 *     hình Affilate/Affilate sàn giao dịch), tối đa 4, bỏ dung lượng bịa
 *     (không có metadata dung lượng thật) — chỉ hiện "Tải về".
 *  8. "Bạn cần hỗ trợ?" — avatar minh hoạ giữ nguyên (trang trí, không
 *     khẳng định số liệu). Nút "Liên hệ hỗ trợ" — **rà soát lại**: trước
 *     đó trỏ `/portal/support` (Portal 1.0), chưa có trang hỗ trợ nào ở
 *     `/v2/*` — đã đổi sang kênh liên hệ thật đang dùng chung toàn dự án
 *     (`siteConfig.community.zaloGroup`, cùng nguồn "Kết nối ngay hôm nay"
 *     ở `/portal/congdongai` đã dùng).
 * ========================================================================== */

import { useRouter } from "next/navigation";

import { siteConfig } from "@/lib/site";

import type { EcosystemChrome } from "@/lib/portal/live-ecosystem-chrome";
import type { SubProjectRow } from "@/lib/portal/live-subprojects";
import type { EcosystemArticleRow } from "@/lib/portal/live-ecosystem-articles";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../inter-gf.css";
import "./du-an-co-hoi.css";

/** 5 ảnh thật cộng đồng/sự kiện digiU — cùng file đã dùng ở
 * `/portal/duan-cohoi/page.tsx` (`public/images/duan-cohoi/dong-hanh/`),
 * không phải ảnh mới. */
const COMPANION_PHOTOS = [
  { src: "/images/duan-cohoi/dong-hanh/digiu-doi-ngu-01.jpg", alt: "Đội ngũ digiU" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-hoi-thao-ai-blockchain.jpg", alt: "Hội thảo Trí tuệ nhân tạo & Blockchain cùng cộng đồng digiU" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-dai-dien-hoi-thao.jpg", alt: "Đại diện digiU tại hội thảo" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-5-nam-thanh-lap.jpg", alt: "Sự kiện kỷ niệm 5 năm thành lập digiU" },
  { src: "/images/duan-cohoi/dong-hanh/digiu-doi-ngu-02.jpg", alt: "Đội ngũ digiU tại sự kiện cộng đồng" },
] as const;

/** 4 tiêu chí — nội dung THẬT, port nguyên văn từ `/portal/duan-cohoi/page.tsx`. */
const CRITERIA = [
  "Mình đã thực sự tham gia và có trải nghiệm trực tiếp",
  "Góc nhìn trung thực — bao gồm cả điểm yếu và rủi ro",
  "Không cam kết lợi nhuận dưới bất kỳ hình thức nào",
  "Mọi quyết định tài chính là của bạn — mình chỉ chia sẻ góc nhìn",
];

/** 3 câu FAQ — nội dung THẬT, port nguyên văn từ `/portal/duan-cohoi/page.tsx`. */
const FAQ = [
  {
    q: "Đây có phải là lời khuyến nghị đầu tư không?",
    a: "Không. Tất cả nội dung ở đây là chia sẻ góc nhìn và trải nghiệm cá nhân của tôi. Bạn phải tự nghiên cứu và chịu trách nhiệm với quyết định tài chính của mình.",
  },
  {
    q: "Tại sao VO DUONG AI chia sẻ về các dự án này?",
    a: "Vì tôi tin rằng minh bạch về những gì mình đang theo dõi và tham gia sẽ giúp cộng đồng có nhiều góc nhìn hơn — không phải để ai đó làm theo tôi.",
  },
  {
    q: "Làm thế nào để tôi đánh giá một dự án?",
    a: "Đọc phần 'Nguyên tắc chia sẻ' của chúng tôi, đọc tài liệu gốc của dự án, tham gia cộng đồng để hỏi thêm, và chỉ tham gia với số tiền bạn sẵn sàng mất hoàn toàn.",
  },
];

/** 5 lời nhắn Companion (Đầu tư thông minh & Thành công) — nội dung THẬT,
 * port nguyên văn từ `/portal/duan-cohoi/page.tsx`. Bảng màu chuyển từ
 * Tailwind gradient sang hex/gradient CSS tay khớp bảng màu sẵn có của
 * `.duo` (violet/gold/xanh lá/đỏ/xám — không bịa hue mới). */
const COMPANION_QUOTES = [
  {
    topic: "Đầu tư thông minh",
    quote: "Khoản đầu tư khôn ngoan nhất không phải là khoản sinh lời nhanh nhất — mà là khoản bạn hiểu rõ nhất.",
    tint: "#eef2ff",
    accent: "linear-gradient(135deg,#2563eb,#4f46e5)",
  },
  {
    topic: "Kỷ luật",
    quote: "Đừng trả học phí đắt cho một bài học rẻ: hiểu trước, tham gia sau — và chỉ với số tiền bạn chấp nhận mất.",
    tint: "#fff7ed",
    accent: "linear-gradient(135deg,#e2b23c,#c2660a)",
  },
  {
    topic: "Kiên nhẫn",
    quote: "Thành công không đến từ việc nắm bắt mọi cơ hội, mà từ việc đủ kiên nhẫn chờ cơ hội thuộc về mình.",
    tint: "#ecfdf5",
    accent: "linear-gradient(135deg,#189a52,#3ecf7e)",
  },
  {
    topic: "Thành công",
    quote: "Người thành công không phải người chưa từng sai — họ là người biết dừng đúng lúc và bắt đầu lại đủ nhanh.",
    tint: "#f3f0ff",
    accent: "linear-gradient(135deg,#6d4aff,#4f46e5)",
  },
  {
    topic: "Tri thức",
    quote: "Tài sản lớn nhất của bạn không nằm trong ví — nó nằm ở kiến thức bạn tích luỹ mỗi ngày.",
    tint: "#f4f4f5",
    accent: "linear-gradient(135deg,#334155,#189a52)",
  },
] as const;

const HREF_MAP: Record<string, string> = {
  "Trang chu Portal.html": "/v2/trang-chu",
  "Companion.html": "/v2/companion",
  "Moi ngay mot y tuong.html": "/v2/moi-ngay-mot-y-tuong",
  "He tri thuc CKOS.html": "/v2/hoc-vien-ai",
  "Hoc vien AI.html": "/v2/hoc-vien-ai",
  "AI Workspace.html": "/v2/hoc-vien-ai",
  "Du an Co hoi.html": "/v2/du-an-co-hoi",
  "DigiU.html": "/v2/du-an-co-hoi/digiu",
  "SolarGroup.html": "/v2/du-an-co-hoi/solargroup",
  "Ohana.html": "/v2/du-an-co-hoi/ohana",
  "Cac mo hinh Affilate.html": "/v2/du-an-co-hoi/cac-mo-hinh-affilate",
  "Affilate san giao dich.html": "/v2/du-an-co-hoi/affilate-san-giao-dich",
  "Premium.html": "/v2/premium",
  "Chuong trinh Affilate.html": "/v2/affiliate",
  "Nhat ky hoc tap.html": "/v2/nhat-ky-hoc-tap",
  "Hanh trinh cua toi.html": "/v2/hanh-trinh-cua-toi",
  "Khu vuon cua ban.html": "/v2/khu-vuon-cua-ban",
};

export function DuAnCoHoiClient({
  chromeDigiu,
  chromeSolarGroup,
  chromeAffilate,
  chromeTrading,
  subDigiu,
  subSolarGroup,
  allArticles,
  premium,
}: {
  chromeDigiu: EcosystemChrome;
  chromeSolarGroup: EcosystemChrome;
  chromeAffilate: EcosystemChrome;
  chromeTrading: EcosystemChrome;
  subDigiu: SubProjectRow[];
  subSolarGroup: SubProjectRow[];
  allArticles: EcosystemArticleRow[];
  premium: PremiumStatus;
}) {
  const router = useRouter();

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  /** Prefetch lúc hover/focus (giữ nguyên `<button onClick>`, xem lý do
      trong `PortalV2Shell.tsx`'s `navItem()`) — trang này chưa dùng shell
      dùng chung nên sidebar tự chép tay, cần đúng cơ chế tương tự riêng. */
  const prefetchNav = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.prefetch(target);
  };

  const categories = [
    {
      name: "Hệ sinh thái DigiU",
      href: "DigiU.html",
      bg: "linear-gradient(145deg,#a08bff,#6d4aff)",
      icon: <><circle cx="7" cy="8" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="12" cy="16" r="3" /></>,
      stat: `${subDigiu.length} dự án con`,
      desc: chromeDigiu.shortDescription,
    },
    {
      name: "SolarGroup",
      href: "SolarGroup.html",
      bg: "linear-gradient(145deg,#ff9d52,#c2660a)",
      icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
      stat: `${subSolarGroup.length} dự án con`,
      desc: chromeSolarGroup.shortDescription,
    },
    {
      name: "Ohana",
      href: "Ohana.html",
      bg: "linear-gradient(145deg,#4bc4e0,#0e7490)",
      icon: <path d="M4 19h16M7 15l3-4 3 3 5-7" />,
      stat: "Vũ trụ hợp nhất",
      desc: "Mạng lưới siêu kết nối hợp nhất SaaS, AI và Web3 trong hệ sinh thái Astronixa.",
    },
    {
      name: "Các mô hình Affilate",
      href: "Cac mo hinh Affilate.html",
      bg: "linear-gradient(145deg,#3ecf7e,#189a52)",
      icon: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
      stat: `${chromeAffilate.affiliateOffers.filter((o) => o.visible).length} chương trình`,
      desc: chromeAffilate.shortDescription,
    },
    {
      name: "Affilate sàn giao dịch",
      href: "Affilate san giao dich.html",
      bg: "linear-gradient(145deg,#ff6b6b,#c22e46)",
      icon: <><path d="M4 19h4v-9H4zM10 19h4V5h-4zM16 19h4v-6h-4z" /></>,
      stat: `${chromeTrading.exchanges.filter((e) => e.visible).length} sàn`,
      desc: chromeTrading.shortDescription,
    },
  ];

  const featuredSubs = [
    ...subDigiu.map((s) => ({ sub: s, parent: "DigiU", bg: "linear-gradient(160deg,#241c56,#0c0824)" })),
    ...subSolarGroup.map((s) => ({ sub: s, parent: "SolarGroup", bg: "linear-gradient(160deg,#0e3a4a,#1d5fd8)" })),
  ].slice(0, 4);

  const newsItems = allArticles
    .filter(
      (a) =>
        a.status === "Published" &&
        a.subProjectId === "" &&
        ["eco_digiu", "eco_solargroup", "eco_blockchain", "eco_trading"].includes(a.ecosystemId),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 3);

  const ECO_SLUG: Record<string, string> = {
    eco_digiu: "digiu",
    eco_solargroup: "solargroup",
    eco_blockchain: "lam-affilate",
    eco_trading: "sangiaodich",
  };

  const documents = [
    ...chromeDigiu.documents.filter((d) => d.visible),
    ...chromeSolarGroup.documents.filter((d) => d.visible),
    ...chromeAffilate.documents.filter((d) => d.visible),
    ...chromeTrading.documents.filter((d) => d.visible),
  ].slice(0, 4);

  return (
    <div className="duo">
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
            <button className="nav-item" onClick={() => go("Hoc vien AI.html")}
              onMouseEnter={() => prefetchNav("Hoc vien AI.html")}
              onFocus={() => prefetchNav("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item active nav-parent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 17l9 4 9-4M3 12l9 4 9-4" />
              </svg>
              Dự án &amp; Cơ hội
            </button>
            <div className="nav-sub">
              <button className="nav-item" onClick={() => go("DigiU.html")}
              onMouseEnter={() => prefetchNav("DigiU.html")}
              onFocus={() => prefetchNav("DigiU.html")}>
                DigiU
              </button>
              <button className="nav-item" onClick={() => go("SolarGroup.html")}
              onMouseEnter={() => prefetchNav("SolarGroup.html")}
              onFocus={() => prefetchNav("SolarGroup.html")}>
                SolarGroup
              </button>
              <button className="nav-item" onClick={() => go("Ohana.html")}
              onMouseEnter={() => prefetchNav("Ohana.html")}
              onFocus={() => prefetchNav("Ohana.html")}>
                Ohana
              </button>
              <button className="nav-item" onClick={() => go("Cac mo hinh Affilate.html")}
              onMouseEnter={() => prefetchNav("Cac mo hinh Affilate.html")}
              onFocus={() => prefetchNav("Cac mo hinh Affilate.html")}>
                Các mô hình Affilate
              </button>
              <button className="nav-item" onClick={() => go("Affilate san giao dich.html")}
              onMouseEnter={() => prefetchNav("Affilate san giao dich.html")}
              onFocus={() => prefetchNav("Affilate san giao dich.html")}>
                Affilate sàn giao dịch
              </button>
            </div>
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
          </nav>

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

          <div className="promo" style={premium.isPremium ? { display: "none" } : undefined}>
            <div className="crown" style={{ background: "none", boxShadow: "none", width: 54, height: 54, overflow: "visible" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh minh hoạ tĩnh cố định của bản thiết kế */}
              <img
                src="/v2-static/assets/icon-premium.png"
                alt=""
                style={{ width: 58.5, height: 58.5, objectFit: "contain", position: "relative", zIndex: 1 }}
              />
            </div>
            <h4>Nâng cấp Premium</h4>
            <p>Mở khoá tất cả khoá học nâng cao, tài nguyên độc quyền và đặc quyền.</p>
            <button onClick={() => go("Premium.html")}
              onMouseEnter={() => prefetchNav("Premium.html")}
              onFocus={() => prefetchNav("Premium.html")}>Nâng cấp ngay</button>
          </div>
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm dự án, cơ hội, từ khoá..." variant="box" />
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

          <div className="content">
            <div className="center-col">
              <div className="page-head">
                <h1>Dự án &amp; Cơ hội</h1>
                <p>Khám phá các dự án tiềm năng và cơ hội phát triển cùng VO DUONG AI.</p>
              </div>

              <div className="pj-hero">
                <div className="pj-hero-text">
                  <h2>
                    Đầu tư thông minh.
                    <br />
                    Đồng hành dài hạn.
                  </h2>
                  <button className="pj-btn">
                    Xem hướng dẫn đầu tư
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                <div className="pj-feats">
                  <div className="pj-feat">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                      </svg>
                    </div>
                    <div>
                      <h6>Dự án uy tín</h6>
                      <span>Được phân tích và chọn lọc kỹ lưỡng</span>
                    </div>
                  </div>
                  <div className="pj-feat">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                        <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                      </svg>
                    </div>
                    <div>
                      <h6>Minh bạch thông tin</h6>
                      <span>Cập nhật dữ liệu chính xác, rõ ràng</span>
                    </div>
                  </div>
                  <div className="pj-feat">
                    <div className="ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                        <circle cx="8" cy="8" r="3" />
                        <circle cx="17" cy="9" r="3" />
                        <path d="M2 21c0-3.3 2.7-6 6-6s6 2.7 6 6M13 15c3 0 6 2 6 6" />
                      </svg>
                    </div>
                    <div>
                      <h6>Cộng đồng đồng hành</h6>
                      <span>Hỗ trợ và chia sẻ cùng phát triển</span>
                    </div>
                  </div>
                </div>
                <div className="pj-graphic">
                  <div className="pj-glow" />
                  <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
                    <g className="pj-globe" style={{ transformOrigin: "70px 80px" }}>
                      <circle cx="70" cy="80" r="46" fill="url(#globeGrad)" stroke="#8b6bff" strokeWidth="1.6" />
                      <ellipse cx="70" cy="80" rx="46" ry="18" fill="none" stroke="#9fd4ff" strokeWidth="1" />
                      <ellipse cx="70" cy="80" rx="46" ry="34" fill="none" stroke="#9fd4ff" strokeWidth="1" opacity=".6" />
                      <path d="M70 34v92M24 80h92" stroke="#9fd4ff" strokeWidth="1" opacity=".6" />
                    </g>
                    <g>
                      <rect className="pj-bar" x="128" y="96" width="14" height="34" fill="#6d84ff" style={{ transformOrigin: "135px 130px", animationDelay: "0s" }} />
                      <rect className="pj-bar" x="148" y="80" width="14" height="50" fill="#8b6bff" style={{ transformOrigin: "155px 130px", animationDelay: ".3s" }} />
                      <rect className="pj-bar" x="168" y="60" width="14" height="70" fill="#a08bff" style={{ transformOrigin: "175px 130px", animationDelay: ".6s" }} />
                    </g>
                    <path d="M126 92l24-22 18 10 26-32" stroke="#c9bdff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <path d="M186 40l8 8-12 2z" fill="#c9bdff" />
                    <defs>
                      <linearGradient id="globeGrad" x1="24" y1="34" x2="116" y2="126">
                        <stop offset="0" stopColor="#4a2fb0" />
                        <stop offset="1" stopColor="#1a1044" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Danh mục dự án &amp; cơ hội</h3>
                </div>
                <div className="cat-grid" style={{ marginTop: 14 }}>
                  {categories.map((c) => (
                    <div key={c.name} className="cat-card" onClick={() => go(c.href)}>
                      <div className="ico" style={{ background: c.bg }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                          {c.icon}
                        </svg>
                      </div>
                      <h5>{c.name}</h5>
                      <p>{c.stat}</p>
                      <p style={{ marginTop: 2 }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Dự án nổi bật</h3>
                </div>
                {featuredSubs.length === 0 ? (
                  <p className="empty-hint">Chưa có dự án con nào được công bố.</p>
                ) : (
                  <div className="pf-grid" style={{ marginTop: 14 }}>
                    {featuredSubs.map(({ sub, parent, bg }) => (
                      <div className="pf-card" key={sub.id}>
                        <div className="pf-thumb" style={{ background: bg }}>
                          <span className="hot-pill" style={{ background: "#189a52" }}>
                            {parent}
                          </span>
                          <div className="brand-txt">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#c9bdff" strokeWidth="1.8">
                              <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
                            </svg>
                            {parent.toUpperCase()}
                          </div>
                        </div>
                        <div className="pf-body">
                          <h5>{sub.name}</h5>
                          <div className="pf-tags">
                            <span className="pf-tag">{parent}</span>
                          </div>
                          <div className="desc">{sub.shortDescription}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="section-head">
                  <h3>Đồng hành</h3>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                  Những người bạn đồng hành theo năm tháng — khoảnh khắc cùng cộng đồng digiU qua các sự kiện.
                </p>
                <div className="companion-marquee" style={{ marginTop: 14 }}>
                  <div className="companion-marquee-track">
                    {[...COMPANION_PHOTOS, ...COMPANION_PHOTOS].map((p, i) => (
                      <div className="companion-photo" key={`${p.src}-${i}`} aria-hidden={i >= COMPANION_PHOTOS.length}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh, cùng convention <img> đã dùng cho icon Premium ở sidebar file này */}
                        <img src={p.src} alt={p.alt} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Nguyên tắc chia sẻ</h3>
                </div>
                <div className="card" style={{ marginTop: 14 }}>
                  {CRITERIA.map((c, i) => (
                    <div className="doc-row2" key={i}>
                      <div className="ico" style={{ background: "#e9f9ef", color: "#189a52" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                      <div className="info">
                        <span style={{ fontSize: 12.5, color: "var(--text)" }}>{c}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Câu hỏi thường gặp</h3>
                </div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {FAQ.map((item) => (
                    <div className="card" key={item.q}>
                      <h5 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>{item.q}</h5>
                      <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="section-head">
                  <h3>Companion gửi bạn</h3>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
                  5 điều Companion muốn bạn mang theo — không phải lời khuyên đầu tư, là những nguyên tắc để bạn tự tin hơn trước mọi quyết định.
                </p>
                <div className="quote-grid" style={{ marginTop: 14 }}>
                  {COMPANION_QUOTES.map((item) => (
                    <div className="quote-card" key={item.topic} style={{ background: item.tint }}>
                      <span className="topic" style={{ background: item.accent }}>
                        {item.topic}
                      </span>
                      <p>{item.quote}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="right-col">
              <div className="card">
                <div className="card-head">
                  <h4>Cơ hội đang mở</h4>
                </div>
                <p className="empty-hint">Chưa có cơ hội đầu tư nào được công bố chính thức — sẽ cập nhật khi có.</p>
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Tin tức &amp; cập nhật</h4>
                </div>
                {newsItems.length === 0 ? (
                  <p className="empty-hint">Chưa có tin tức cập nhật nào.</p>
                ) : (
                  newsItems.map((a) => (
                    <a
                      className="news-row"
                      key={a.id}
                      href={`/v2/du-an-co-hoi/${ECO_SLUG[a.ecosystemId] ?? ""}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="news-thumb" style={{ background: "linear-gradient(145deg,#241c4d,#5a37e6)" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#c9bdff" strokeWidth="1.8">
                          <path d="M4 19h16M7 15l3-4 3 3 5-7" />
                        </svg>
                      </div>
                      <div>
                        <h6>{a.title}</h6>
                        <span className="time">Cập nhật</span>
                      </div>
                    </a>
                  ))
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <h4>Tài liệu &amp; hướng dẫn</h4>
                </div>
                {documents.length === 0 ? (
                  <p className="empty-hint">Chưa có tài liệu nào.</p>
                ) : (
                  documents.map((d) => (
                    <a
                      className="doc-row2"
                      key={d.id}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4.5A2.5 2.5 0 016.5 2H20v18H6.5A2.5 2.5 0 014 17.5z" />
                        </svg>
                      </div>
                      <div className="info">
                        <h6>{d.label}</h6>
                        <span>Tải về</span>
                      </div>
                    </a>
                  ))
                )}
              </div>

              <div className="card help-card2">
                <div className="avatars-h">
                  <div className="av">A</div>
                  <div className="av">B</div>
                  <div className="av">C</div>
                </div>
                <h4 style={{ marginBottom: 8 }}>Bạn cần hỗ trợ?</h4>
                <p>Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
                <a className="help-link-btn" href={siteConfig.community.zaloGroup} target="_blank" rel="noopener noreferrer">
                  Liên hệ hỗ trợ
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
