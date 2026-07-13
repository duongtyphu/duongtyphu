/**
 * Workspace Ownership catalog — ADM-SPR-200 Task 5 (Workspace Owner
 * Panel), cập nhật ADM-SPR-201: thêm "AI Workspace" và "Journey" — 2
 * Workspace mới được chính thức hóa bởi "Workspace Navigation bắt buộc"
 * của brief ADM-SPR-201 (trước đó không tồn tại ở ADM-SPR-200).
 * READ-ONLY, sourced từ `docs/admin/workspaces/*.md` (WCS) và
 * `docs/admin/ADMIN_INFORMATION_ARCHITECTURE_V2.md` (bảng maturity,
 * IMP-ADM-100 Task 1/2) — không suy diễn thêm dữ liệu mới.
 *
 * JOURNEY-SPR-901: gộp 2 entry "journey" + "community" thành 1
 * "journey-community" — Founder Directive Phase 9 xác nhận đây là 1
 * Workspace (Journey Experience + Community Experience + Mission
 * Presentation), khớp nav.ts đã gộp nhóm. Danh sách còn 10 entry (trước
 * 11) — xem `docs/admin/JOURNEY_COMMUNITY_MANAGEMENT_JOURNEY-SPR-901.md`.
 */

export const WORKSPACE_MATURITY_LEVELS = [
  "Canonical",
  "Consistent-Legacy",
  "Mixed-Legacy",
  "Not Started",
] as const;
export type WorkspaceMaturity = (typeof WORKSPACE_MATURITY_LEVELS)[number];

export type WorkspaceWcsStatus = "Approved" | "Draft" | "Chưa có";

export type WorkspaceOwnerEntry = {
  key: string;
  name: string;
  href: string;
  maturity: WorkspaceMaturity;
  wcsStatus: WorkspaceWcsStatus;
  owns: string;
};

export const WORKSPACE_OWNERS: WorkspaceOwnerEntry[] = [
  {
    key: "website",
    name: "Website",
    href: "/admin/website",
    maturity: "Canonical",
    wcsStatus: "Approved",
    owns: "Pages (Homepage/Landing/Static), Navigation, Shared Sections, SEO metadata, Redirect, Global Settings",
  },
  {
    key: "brand-studio",
    name: "Brand Studio",
    href: "/admin/brand",
    maturity: "Canonical",
    wcsStatus: "Approved",
    owns: "Logo, Wordmark, Typography, Color Palette, Theme, Icons, Open Graph Image, Global Brand Settings",
  },
  {
    key: "ckos",
    name: "CKOS",
    href: "/admin/ckos",
    maturity: "Consistent-Legacy",
    wcsStatus: "Chưa có",
    owns: "Goals, Tools, Prompts, Workflows, Evaluations, Resources, Case Study, Best Practices, FAQs",
  },
  {
    key: "academy",
    name: "Academy",
    href: "/admin/academy",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Lộ trình thành công, Nhiệm vụ hôm nay, Dự án thực chiến (dữ liệu sở hữu thật). Learning Journeys là view đọc, chiếu 1:1 từ CKOS Collection — KHÔNG phải dữ liệu Academy sở hữu (ACADEMY-SPR-401 Task 4). Không sở hữu Course/Module/Quiz/Certificate/Instructor — các object này không tồn tại trong Portal hiện tại.",
  },
  {
    key: "premium",
    name: "Premium",
    href: "/admin/premium",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Đúng Task 6 (PREMIUM-SPR-701): Pricing + Checkout + Order + Access Entitlement cho 6 chương trình (courses table, /admin/course-pricing + /admin/orders). KHÔNG sở hữu Course Structure/Learning Objects (Academy) hay Video/Image/Document (Media Center) — hiện chưa tồn tại cho 3 \"Lớp học\" (0% content model, xem báo cáo). \"Sản phẩm số\" (products table) Consumer = 0, giữ CRUD không tự xoá. Dịch vụ/Hỗ trợ/Leads/Affiliate Hub vẫn thuộc nhóm nav Premium nhưng ngoài phạm vi Course Commerce Task 6.",
  },
  {
    key: "projects-opportunities",
    name: "Projects & Opportunities",
    href: "/admin/projects-opportunities",
    maturity: "Consistent-Legacy",
    wcsStatus: "Chưa có",
    owns: "Đúng Founder Directive (PROJECTS-SPR-602): CRUD thật (Supabase \"ecosystems\") cho Ecosystem/Sub-project/CTA-Link/Tiêu chí đánh giá/FAQ/Bài viết liên quan/Publish — bám 100% cấu trúc /portal/duan-cohoi (Canonical Product). Category + Article (Supabase digital_asset_categories/digital_asset_articles) giữ nguyên, Consumer thật. Đã GỠ BỎ CRUD Digital Asset Project/Link cũ (Consumer = 0, chỉ phục vụ route /portal/digital-assets đã khai tử) — không còn dấu vết mô hình Admin cũ.",
  },
  {
    key: "companion-studio",
    name: "Companion Studio",
    href: "/admin/companion-studio",
    maturity: "Not Started",
    wcsStatus: "Chưa có",
    owns: "Mentor Runtime (JOURNEY-SPR-901 Task 6): /portal/companion (9 section) + /portal/ai-assistant + Companion Presence toàn cục (mount PortalShell, mọi route) + Persona/Identity + Agent Registry metadata (32 agent, 8 module, 100% \"planned\") + Orchestration Rules + Conversation/Inner-life library + Character/Core/Origin/Story Memory. Dashboard chỉ đọc, chưa có CRUD nào (100% TypeScript hardcode). KHÔNG sở hữu Knowledge/CKOS, Learning/Academy, Commercial/Premium, Website, Media, Brand, Reflection Meaning Engine (dùng chung toàn Portal). ĐÍNH CHÍNH JOURNEY-SPR-901: /portal/su-menh-companion (Mission Presentation) đã chuyển sang \"Journey & Community\" — trang đó chỉ trình bày câu chuyện, không chứa Runtime AI nào của Companion Studio.",
  },
  {
    key: "media-center",
    name: "Media Center",
    href: "/admin/media-center",
    maturity: "Canonical",
    wcsStatus: "Approved",
    owns: "Media Asset (Image/Video/Document/Audio) metadata, Folder, Collection, Tag, Media Settings",
  },
  {
    key: "ai-workspace",
    name: "AI Workspace",
    href: "/admin/ai-workspace",
    maturity: "Not Started",
    wcsStatus: "Chưa có",
    owns: "9 Section + 3 route con của Portal Area \"AI Workspace\" (/portal/aiworkspace) — Recommended Workspace/AI Workflow/Prompt Library/AI Toolbox/Resource/Blog AI (AIWS-SPR-501, xem báo cáo). 100% TypeScript hardcode, chưa có CRUD/collection nào — Dashboard chỉ đọc, chưa quản lý được. KHÔNG sở hữu WorkNeedSection (mount ở /portal/hocvienai, thuộc Academy dù data cùng file ai-workspace.ts).",
  },
  {
    key: "journey-community",
    name: "Journey & Community",
    href: "/admin/journey",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Đúng Task 6 (JOURNEY-SPR-901): Journey Experience (/portal/hanhtrinhcuatoi, 7 section + 5 route con — Bản đồ/My Story/Mirror/Nhật ký/Khu vườn, toàn bộ dữ liệu runtime thật của user, không phải CMS content) + Community Experience (/portal/congdongai, 10 section — 1 CRUD thật cho kênh cộng đồng, nay đã nối dây Portal) + Mission Presentation (/portal/su-menh-companion + child — trình bày câu chuyện/triết lý Companion, KHÔNG bao gồm Persona/Agent Registry/Runtime, vẫn thuộc Companion Studio). KHÔNG sở hữu Knowledge/CKOS, Learning/Academy, Commercial/Premium, Mentor Runtime (Companion Studio), Media, Brand, Website. Community Project Showcase đọc THÊM case_studies (CKOS/Academy sở hữu), không tạo bảng trùng lặp.",
  },
];
