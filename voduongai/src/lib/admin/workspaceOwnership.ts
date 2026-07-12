/**
 * Workspace Ownership catalog — ADM-SPR-200 Task 5 (Workspace Owner
 * Panel). READ-ONLY, sourced từ `docs/admin/workspaces/*.md` (WCS) và
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
    href: "/admin/roadmap",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Lộ trình thành công, Nhiệm vụ hôm nay, Dự án thực chiến",
  },
  {
    key: "premium",
    name: "Premium",
    href: "/admin/premium",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Sản phẩm số, Học phí, Đơn hàng, Mã giảm giá, Dịch vụ, Hỗ trợ, Leads, Affiliate Hub",
  },
  {
    key: "projects-opportunities",
    name: "Projects & Opportunities",
    href: "/admin/digital-assets",
    maturity: "Mixed-Legacy",
    wcsStatus: "Chưa có",
    owns: "Hệ sinh thái DigiU, SolarGroup, Crypto, Blockchain, Trading, Dự án, Bài viết",
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
    maturity: "Not Started",
    wcsStatus: "Draft",
    owns: "(Chưa xây) — dự kiến: thư viện media dùng chung",
  },
];
