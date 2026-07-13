/**
 * Workspace Ownership catalog — ADM-SPR-200 Task 5 (Workspace Owner
 * Panel), cập nhật ADM-SPR-201: thêm "AI Workspace" và "Journey" — 2
 * Workspace mới được chính thức hóa bởi "Workspace Navigation bắt buộc"
 * của brief ADM-SPR-201 (trước đó không tồn tại ở ADM-SPR-200). Danh
 * sách 11 entry dưới đây khớp ĐÚNG thứ tự Workspace Navigation bắt buộc.
 * READ-ONLY, sourced từ `docs/admin/workspaces/*.md` (WCS) và
 * `docs/admin/ADMIN_INFORMATION_ARCHITECTURE_V2.md` (bảng maturity,
 * IMP-ADM-100 Task 1/2) — không suy diễn thêm dữ liệu mới.
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
    href: "/admin/digital-assets",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "CRUD thật (Supabase) cho Digital Asset Category/Project/Link/Article/Settings — nhưng KHÔNG sở hữu 5 Ecosystem (DigiU/SolarGroup/Crypto/Blockchain/Trading) hiển thị trên /portal/duan-cohoi (100% hardcode trong ecosystems.ts, 0% CRUD, PROJECTS-SPR-601). Consumer thật hẹp: chỉ Category+Article đọc live tại /portal/duan-cohoi/bai-viet/[slug]; Project/Link/Settings Consumer = 0 (chỉ đọc bởi route /portal/digital-assets đã khai tử).",
  },
  {
    key: "community",
    name: "Community",
    href: "/admin/community",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Nội dung Cộng đồng (Scope thật chưa xác nhận — chỉ 1 route hiện có)",
  },
  {
    key: "companion-studio",
    name: "Companion Studio",
    href: "/admin/companion-studio",
    maturity: "Not Started",
    wcsStatus: "Chưa có",
    owns: "(Chưa xây) — dự kiến: Companion, Sứ mệnh Companion",
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
    key: "journey",
    name: "Journey",
    href: "/admin/journey",
    maturity: "Not Started",
    wcsStatus: "Chưa có",
    owns: "(Chưa xây) — sở hữu Portal Area \"Hành trình của tôi\" (/portal/hanhtrinhcuatoi + Journey Hub 5 cửa)",
  },
];
