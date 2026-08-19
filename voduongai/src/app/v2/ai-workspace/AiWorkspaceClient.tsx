"use client";

/* =============================================================================
 * AI Workspace 2.0 — chuyển 1:1 từ
 * `design_handoff_vo_duong_ai/AI Workspace.html`.
 *
 * NGUYÊN TẮC: markup, thứ tự phần tử, class, chữ tiếng Việt giữ NGUYÊN VĂN.
 * Mọi icon là inline SVG của bản gốc, chép nguyên vẹn — KHÔNG thay bằng
 * lucide-react. CSS ở `ai-workspace.css` (chép nguyên văn, xem đầu file đó).
 *
 * ---------------------------------------------------------------------------
 * NHỮNG CHỖ KHÁC bản tĩnh — đều là phần được phép theo lệnh giao ("import nội
 * dung + nối dữ liệu thật + áp phân quyền Bước D — không đổi giao diện/
 * layout/màu sắc/font"):
 *
 *  1. "Công cụ theo nhóm" — 6 nhóm khớp đúng 6 danh mục thật trong bảng
 *     `tools` (cùng thứ tự migration đã tạo, trùng khớp thứ tự 6 thẻ bản
 *     thiết kế). Số đếm là số THẬT (5/4/5/4/3/4), không phải số mẫu
 *     (12/18/15/12/8/10) trong bản thiết kế.
 *  2. "Công cụ yêu thích" — 5 công cụ THẬT, khớp đúng 5 id bản thiết kế minh
 *     hoạ (ChatGPT/Claude/Midjourney/Notion AI/Perplexity — đều tồn tại thật
 *     trong bảng `tools` sau migration). Không có bảng lưu "yêu thích" nào —
 *     nút star CHỈ đổi trạng thái client-side, không lưu (đúng hành vi JS gốc
 *     của bản thiết kế, vốn cũng không persist). Khác 1 điểm: mặc định CẢ 5
 *     đều đang "yêu thích" (sao đầy) — đây chính là danh sách được coi là
 *     "yêu thích" hiển thị, không có dữ liệu preference thật nào để suy ra 2
 *     dòng cuối nên bắt đầu ở trạng thái tắt như minh hoạ trong ảnh tĩnh.
 *  3. "Dự án của bạn" — dự án THẬT: 2 dự án mẫu (`is_sample=true`, công khai
 *     mọi người) + dự án riêng của user đang đăng nhập (đa số tài khoản Free
 *     mới sẽ chỉ thấy 2 dự án mẫu vì hệ thống mới). Đã BỎ HẲN dãy avatar cộng
 *     tác viên giả (`.avatars`) — không có bảng lưu cộng tác viên/thành viên
 *     dự án nào, hiển thị avatar giả sẽ vi phạm nguyên tắc không bịa dữ liệu.
 *     Giữ nguyên "Cập nhật: X" (thời gian tương đối THẬT từ `updated_at`) và
 *     nút "⋯" (trơ, không có menu — đúng hành vi gốc, bản thiết kế cũng
 *     không gắn hành động thật cho nút này).
 *  4. Tab lọc (`.p-tab`) / sort-select / view-toggle — giữ TRƠ đúng như bản
 *     gốc: script gốc của chính mockup cũng CHỈ đổi class `active`, không
 *     thực sự lọc danh sách/sắp xếp/đổi layout lưới. Chỉ đổi SỐ ĐẾM trong
 *     nhãn tab ("Tất cả (N)"...) sang số thật tính từ dữ liệu đang có.
 *  5. "Workflow mẫu" — 4 workflow THẬT từ `ai_workflow_sections`. "X bước · Y
 *     công cụ" là số THẬT (đếm từ `steps`/`suggestedTools` thật của từng
 *     dòng), không phải số mẫu cố định trong bản thiết kế.
 *  6. "Hoạt động gần đây" — đọc `workspace_project_history` thật (bảng có
 *     thật, hiện 0 dòng vì hệ thống mới, không phải thiếu hạ tầng) — trạng
 *     thái rỗng trung thực thay vì 5 dòng mẫu cố định.
 *  7. "Gợi ý cho bạn" — không có bảng "gợi ý"/nhãn "mới" thật nào trong hệ
 *     thống. Ghép từ dữ liệu thật đang có: tối đa 3 workflow (khớp đúng số vị
 *     trí mẫu, ít hơn nếu không đủ dữ liệu) — không thêm nguồn dữ liệu mới
 *     ngoài `ai_workflow_sections` đã dùng ở "Workflow mẫu". Bỏ hẳn nhãn
 *     "Mới" (`.new-pill`) — không có tín hiệu "mới" thật
 *     nào để gắn, không bịa.
 *  8. BƯỚC D — giới hạn Free "1 workflow mở/tháng, tối đa 3 dự án cùng lúc":
 *     banner `.limit-badge` (chỉ hiện cho user Free đã đăng nhập) dưới
 *     "Workflow mẫu" báo số lượt đã dùng; khoá "+ Tạo dự án mới" (đổi màu +
 *     đổi chữ, dùng lại đúng tông "Premium" có sẵn) khi Free đã đạt 3 dự án
 *     `in_progress` cùng lúc. Premium: không giới hạn, không banner.
 *  9. "Xem tất cả công cụ →" / các CTA không có đích thật khác — giữ
 *     `href="#"` (chưa có trang `/v2/khong-gian-ai`, nằm trong 42 trang còn
 *     lại của Bước F).
 * ========================================================================== */

import { useRouter } from "next/navigation";
import { useState } from "react";

import type {
  WorkspaceActivity,
  WorkspaceFavoriteTool,
  WorkspaceLimits,
  WorkspaceProject,
  WorkspaceToolGroup,
  WorkspaceWorkflow,
} from "@/lib/portal/live-workspace";
import type { PremiumStatus } from "@/lib/v2/premium-access";
import { ProfileMenu } from "@/components/v2/ProfileMenu";
import { NotificationBell } from "@/components/v2/NotificationBell";
import { PortalSearchBox } from "@/components/v2/PortalSearchBox";

import "../inter-gf.css";
import "./ai-workspace.css";

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

type IconStyle = { bg: string; icon: React.ReactNode };

/** 6 nhóm — icon/gradient theo VỊ TRÍ khớp đúng bản thiết kế (bảng `tools` không có cột icon/màu). */
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

/** Icon/gradient theo 5 id công cụ yêu thích — khớp đúng `.tool-fav-row` bản thiết kế. */
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

/** 4 workflow — icon/gradient theo id, khớp đúng thứ tự 4 `.wf-card` bản thiết kế. */
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

const STATUS_STYLE: Record<WorkspaceProject["status"], { label: string; pillBg: string; pillColor: string; fill?: string }> = {
  in_progress: { label: "Đang thực hiện", pillBg: "var(--violet-light)", pillColor: "var(--violet)" },
  completed: { label: "Hoàn thành", pillBg: "#e6f7ed", pillColor: "#189a52", fill: "#189a52" },
  paused: { label: "Tạm dừng", pillBg: "#fdf1e0", pillColor: "#a9822c", fill: "#c2660a" },
};

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

export function AiWorkspaceClient({
  premium,
  limits,
  groups,
  favorites,
  workflows,
  projects,
  activity,
}: {
  premium: PremiumStatus;
  limits: WorkspaceLimits;
  groups: WorkspaceToolGroup[];
  favorites: WorkspaceFavoriteTool[];
  workflows: WorkspaceWorkflow[];
  projects: WorkspaceProject[];
  activity: WorkspaceActivity[];
}) {
  const router = useRouter();
  const [projTab, setProjTab] = useState(0);
  const [viewMode, setViewMode] = useState(0);
  const [starOff, setStarOff] = useState<Record<string, boolean>>({});

  const go = (htmlFile: string) => {
    const target = HREF_MAP[htmlFile];
    if (target) router.push(target);
  };

  const countByStatus = (status: WorkspaceProject["status"]) => projects.filter((p) => p.status === status).length;

  /** "Gợi ý cho bạn" — tối đa 3 workflow thật (khớp đúng số vị trí mẫu bản
   * thiết kế), không cần nguồn dữ liệu mới, không bịa nhãn "Mới"/"gợi ý theo
   * hành vi" nào (xem chú thích #7 đầu file). */
  const suggestedWorkflows = workflows.slice(0, 3);

  const showLimitBanner = premium.signedIn && !limits.isPremium;

  return (
    <div className="aiw">
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
            <button className="nav-item" onClick={() => go("He tri thuc CKOS.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h6v16H4zM14 4h6v16h-6z" />
              </svg>
              Hệ tri thức (CKOS)
            </button>
            <button className="nav-item" onClick={() => go("Hoc vien AI.html")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
              </svg>
              Học viện AI
            </button>
            <button className="nav-item active">
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
              <p>Mở khoá mọi công cụ AI cao cấp, và nâng giới hạn sử dụng.</p>
              <button onClick={() => go("Premium.html")}>Nâng cấp ngay</button>
            </div>
          )}
        </aside>

        <div className="main-col">
          <div className="topbar">
            <PortalSearchBox placeholder="Tìm công cụ, prompt, workflow, tài liệu..." variant="box" />
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
              <div className="page-head">
                <h1>AI Workspace</h1>
                <p>Thực hành, ứng dụng và tạo ra giá trị với AI mỗi ngày.</p>
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
                {groups.length === 0 ? (
                  <div className="empty-hint" style={{ marginTop: 14 }}>
                    Chưa có công cụ nào — nội dung sẽ hiện ở đây khi được xuất bản.
                  </div>
                ) : (
                  <div className="grp-grid" style={{ marginTop: 14 }}>
                    {groups.map((group) => {
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
                      Tất cả ({projects.length})
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

                {projects.length === 0 ? (
                  <div className="empty-hint" style={{ marginTop: 14 }}>
                    Chưa có dự án nào — bắt đầu dự án đầu tiên của bạn bên dưới.
                  </div>
                ) : (
                  <div className="proj-grid" style={{ marginTop: 14 }}>
                    {projects.map((project) => {
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

                {limits.isPremium || limits.canCreateProject ? (
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
                    Gói Free — đã dùng {Math.min(limits.workflowsOpenedThisMonth, 1)}/1 lượt mở workflow tháng này
                    {!limits.canOpenNewWorkflow ? " · Nâng cấp Premium để mở không giới hạn" : ""}
                  </div>
                ) : null}
                {workflows.length === 0 ? (
                  <div className="empty-hint" style={{ marginTop: 14 }}>
                    Chưa có workflow nào — nội dung sẽ hiện ở đây khi được xuất bản.
                  </div>
                ) : (
                  <div className="wf-grid" style={{ marginTop: 14 }}>
                    {workflows.map((workflow) => {
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
                {favorites.length === 0 ? (
                  <div className="empty-hint">Chưa có công cụ nào — nội dung sẽ hiện ở đây khi được xuất bản.</div>
                ) : (
                  favorites.map((tool) => {
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
                {activity.length === 0 ? (
                  <div className="empty-hint">Chưa có hoạt động nào — bắt đầu 1 dự án để thấy lịch sử ở đây.</div>
                ) : (
                  activity.map((item) => (
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
      </div>
    </div>
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
