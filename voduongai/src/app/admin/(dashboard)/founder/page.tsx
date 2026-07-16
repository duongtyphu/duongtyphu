"use client";

import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { Badge } from "@/components/admin/ui/Badge";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { WorkspaceOwnerPanel } from "@/components/admin/founder/WorkspaceOwnerPanel";
import { WORKSPACE_OWNERS, type WorkspaceMaturity } from "@/lib/admin/workspaceOwnership";
import { useCollection } from "@/lib/admin/store";
import { PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED, type PortalArea } from "@/lib/admin/portal/areaRegistry";
import { PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED, type PortalPageEntry } from "@/lib/admin/portal/pageRegistry";
import { PORTAL_SECTIONS_COLLECTION_KEY, PORTAL_SECTIONS_SEED, type PortalSection } from "@/lib/admin/portal/sectionRegistry";
import {
  PORTAL_CONTENT_BLOCKS_COLLECTION_KEY,
  PORTAL_CONTENT_BLOCKS_SEED,
  type PortalContentBlock,
} from "@/lib/admin/portal/contentBlockRegistry";
import { usePublishPipelineStats } from "@/lib/admin/founder/publishPipelineStats";

const MATURITY_TONE: Record<WorkspaceMaturity, "green" | "blue" | "orange" | "gray"> = {
  Canonical: "green",
  "Consistent-Legacy": "blue",
  "Mixed-Legacy": "orange",
  "Not Started": "gray",
};
const MATURITY_HEALTH: Record<WorkspaceMaturity, string> = {
  Canonical: "🟢",
  "Consistent-Legacy": "🟢",
  "Mixed-Legacy": "🟡",
  "Not Started": "🔴",
};

const OPEN_PMO_QUESTIONS = [
  "Cài đặt Website/Cài đặt Thương hiệu vs. màn hình cài đặt hệ thống cũ — chồng lấn field logo/favicon/tagline (WEB-SPR-001, BRAND-SPR-001).",
  "Banner vs. Announcement (Website Shared Sections) — cùng dùng portal_banners, chưa rõ có phải 2 khái niệm khác nhau (WEB-SPR-004). Lưu ý (IMP-ADM-001R): portal_banners/NotificationTicker.tsx thực ra chưa được mount ở bất kỳ đâu trong Portal — \"đã nối dây thật\" ghi ở WEB-SPR-004 là sai, cần đính chính.",
  "Brand Orange có 2 mã màu khác nhau (#FF7A00 vs #F97316) — cần chọn 1 giá trị chính thức (BRAND-SPR-001).",
  "Theme kép (Portal/Admin dark hardcode vs. root token sáng) chưa hợp nhất — có đáng chuẩn hóa không (BRAND-SPR-001).",
  "Danh sách \"7 khu vực hoàn thành sản phẩm\" trong brief IMP-ADM-100 sai lệch với code thật — Thư viện Media/Companion khi đó chưa xây gì (IMP-ADM-100).",
  "Nhóm nội dung hiện tại (Blog AI/Template/Ebook...) — tách khu vực riêng, gộp vào Hệ tri thức AI, hay gộp vào Website? (IMP-ADM-100)",
  "/portal/hetrithucai (3 route) trùng tên khái niệm với /portal/ckos nhưng khác route — quan hệ giữa 2 route chưa xác nhận (ADM-SPR-200).",
  "1/10 khu vực Portal (Trang chủ Học viện) chưa có nơi phụ trách rõ ràng trong Admin — không khu vực quản trị nào khớp rõ ràng (ADM-SPR-200/201, xác nhận lại PORTAL-SPR-301).",
  "[ĐÃ XỬ LÝ — STABILIZATION-SPR-1101] case_study vs case_studies — đã hợp nhất về 1 nguồn Canonical (case_study, jsonb), Portal đọc cùng bảng Admin ghi.",
  "[ĐÃ XỬ LÝ — PROJECTS-SPR-602] Trang quản lý Tài sản số cũ (11 route) cho /portal/digital-assets đã khai tử — thay bằng trang quản lý Hệ sinh thái thật (/admin/projects-opportunities/ecosystems) bám đúng /portal/duan-cohoi (Canonical Product theo Founder Directive).",
  "Banner (portal_banners/NotificationTicker.tsx) — component đã có sẵn, chỉ thiếu 1 dòng mount vào Portal, chưa quyết định có nối dây hay deprecate (IMP-ADM-001R; toàn bộ 7 route dựng-Portal cũ đã xoá hẳn (FOUNDER PORTAL EXACT MIRROR), component Banner vẫn còn trong code, chưa mount).",
];

const OPEN_BLOCKERS = [
  { title: "Migration chưa chạy trên Production", detail: "supabase-premium-learning-content-migration.sql (course_modules/course_lessons/orders.course_ref_id) và supabase-projects-opportunities-migration.sql (bảng ecosystems) đã viết nhưng CHƯA tự chạy (thiếu credentials) — Founder phải chạy trong Supabase SQL Editor trước khi merge/deploy, nếu không /admin/academy/courses và /portal/duan-cohoi sẽ trống (STABILIZATION-SPR-1101, PROJECTS-SPR-602)." },
];

const TECHNICAL_DEBT = [
  "Companion Memory: 6 hệ thống bộ nhớ song song chưa hợp nhất (bộ nhớ phiên AI Workspace/Memory Capsule/Character/Core/Origin/Story Memory) — COMPANION-SPR-801.",
  "Social link tồn tại ở nhiều nơi: siteConfig.community/links (site.ts, nguồn thật cho hầu hết trang) — chỉ /portal/congdongai đã nối dây sang collection \"community\" thật (JOURNEY-SPR-901); các trang khác (Header/Footer) vẫn đọc siteConfig trực tiếp, chưa đồng bộ.",
  "3 nguồn \"Prompt\" trùng tên độc lập: bảng Supabase prompts (CKOS), src/data/prompts.ts (AI Workspace Prompt Library), AI_PROMPTS (AI Workspace Related Prompts) — AIWS-SPR-501.",
  "Brand Orange 2 mã màu khác nhau (#FF7A00 vs #F97316), Theme kép Portal/Admin chưa hợp nhất — BRAND-SPR-001/202.",
  "[ĐÃ XỬ LÝ — STABILIZATION-SPR-1101] 22 file thiết kế thương hiệu mồ côi — không xóa (source asset thật), đã chuyển từ public/brand/ (runtime-served) sang design-source/brand/ (không public) — BRAND-SPR-202/STABILIZATION-SPR-1101.",
  "34+ collection thật trong Admin (đếm trực tiếp qua source), nhưng chỉ 15 có pipeline Draft→Review→Published→Archived — phần còn lại chỉ Active/Inactive, không đồng nhất giữa các khu vực.",
];

const FOUNDER_DECISIONS = [
  "6 chương trình Premium cố định (Lớp AI Cơ bản/Nâng cao/OpenClaw, V-Solo, V-Scale, Tư vấn 1:1) — không đổi tên/gộp/tạo mới (PREMIUM-SPR-701).",
  "5 nhóm Projects & Opportunities cố định (DigiU/SolarGroup/Crypto/Blockchain/Trading) — PROJECTS-SPR-601.",
  "\"Sứ mệnh Companion\" (Mission Presentation) chuyển nơi phụ trách từ Companion sang Hành trình & Cộng đồng, tách bạch khỏi hệ thống AI Mentor — JOURNEY-SPR-901.",
  "Hành trình + Cộng đồng hợp nhất thành 1 khu vực quản trị duy nhất (không giữ 2 khu vực riêng như ADM-SPR-201 từng dự kiến) — JOURNEY-SPR-901.",
  "/portal/duan-cohoi là Canonical Product của Projects & Opportunities — trang quản lý cũ (Digital Asset Project/Link, Consumer = 0) gỡ bỏ hoàn toàn, thay bằng trang quản lý Hệ sinh thái bám đúng Portal thật — PROJECTS-SPR-602 (Founder Directive).",
  "Case Study canonical = bảng jsonb case_study (Admin ghi, Portal đọc cùng bảng) — bảng typed case_studies cũ không còn Consumer — STABILIZATION-SPR-1101.",
  "Premium Learning Content: Course (Premium sở hữu giá/checkout/entitlement) tách khỏi Course Structure (Academy sở hữu Module/Lesson/Video/PDF, /admin/academy/courses) — course_modules/course_lessons mới, /portal/premium/hoc/[courseId] là trang xem bài học thật đầu tiên — STABILIZATION-SPR-1101.",
];

function Table<T extends Record<string, string>>({ columns, rows }: { columns: { key: keyof T; label: string; mono?: boolean }[]; rows: T[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40">
            {columns.map((c) => (
              <th key={String(c.key)} className="py-2 pr-4 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 align-top">
              {columns.map((c, ci) => (
                <td
                  key={String(c.key)}
                  className={`py-2 ${ci < columns.length - 1 ? "pr-4" : ""} ${c.mono ? "font-mono text-xs text-white/60" : "text-xs text-white/60"} ${
                    ci === 0 ? "font-semibold text-white/80 whitespace-nowrap" : ""
                  }`}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

/**
 * Founder Operation Center (FOUNDER-SPR-1001) — Phase 10. Trung tâm điều
 * hành duy nhất, gộp 9 Task của brief vào 1 Dashboard. KHÔNG tạo Workspace
 * mới (vẫn đúng 10 Workspace của workspaceOwnership.ts + Portal Management
 * là lớp riêng, không phải Workspace), KHÔNG thay đổi Ownership (chỉ đọc
 * WORKSPACE_OWNERS, không sửa `owns`). Xem
 * `docs/admin/FOUNDER_OPERATION_CENTER_FOUNDER-SPR-1001.md`.
 */
export default function FounderWorkspacePage() {
  const areas = useCollection<PortalArea>(PORTAL_AREAS_COLLECTION_KEY, PORTAL_AREAS_SEED);
  const pages = useCollection<PortalPageEntry>(PORTAL_PAGES_COLLECTION_KEY, PORTAL_PAGES_SEED);
  const sections = useCollection<PortalSection>(PORTAL_SECTIONS_COLLECTION_KEY, PORTAL_SECTIONS_SEED);
  const content = useCollection<PortalContentBlock>(PORTAL_CONTENT_BLOCKS_COLLECTION_KEY, PORTAL_CONTENT_BLOCKS_SEED);
  const { items: publishItems, ready: publishReady, trackedCollectionCount } = usePublishPipelineStats();

  const portalReady = areas.ready && pages.ready && sections.ready && content.ready;
  const ownedAreas = areas.items.filter((a) => a.ownerWorkspace).length;
  const unownedContent = content.items.filter((c) => !c.workspaceOwner).length;

  const approvedWcs = WORKSPACE_OWNERS.filter((w) => w.wcsStatus === "Approved").length;
  const draftWcs = WORKSPACE_OWNERS.filter((w) => w.wcsStatus === "Draft").length;
  const missingWcs = WORKSPACE_OWNERS.filter((w) => w.wcsStatus === "Chưa có").length;
  const maturityCounts: Record<WorkspaceMaturity, number> = {
    Canonical: WORKSPACE_OWNERS.filter((w) => w.maturity === "Canonical").length,
    "Consistent-Legacy": WORKSPACE_OWNERS.filter((w) => w.maturity === "Consistent-Legacy").length,
    "Mixed-Legacy": WORKSPACE_OWNERS.filter((w) => w.maturity === "Mixed-Legacy").length,
    "Not Started": WORKSPACE_OWNERS.filter((w) => w.maturity === "Not Started").length,
  };

  const isPublishedLike = (s: string) => s === "Published" || s === "Active";
  const isReviewLike = (s: string) => s === "Review" || s === "In Review" || s === "Approved" || s === "Changes Requested";
  const draftCount = publishItems.filter((it) => it.status === "Draft").length;
  const reviewCount = publishItems.filter((it) => isReviewLike(it.status)).length;
  const publishedCount = publishItems.filter((it) => isPublishedLike(it.status)).length;
  const archivedCount = publishItems.filter((it) => it.status === "Archived").length;

  const pendingReview = publishItems.filter((it) => it.status === "Review" || it.status === "In Review").length;
  const approvedReview = publishItems.filter((it) => it.status === "Approved").length;
  const needsChange = publishItems.filter((it) => it.status === "Changes Requested").length;

  const auditByWorkspace = Object.entries(
    content.items.reduce<Record<string, { count: number; lastUpdate: string; owner: string }>>((acc, c) => {
      const key = c.workspaceOwner || "(Chưa có Owner)";
      if (!acc[key]) acc[key] = { count: 0, lastUpdate: c.updatedDate, owner: key };
      acc[key].count += 1;
      if (c.updatedDate > acc[key].lastUpdate) acc[key].lastUpdate = c.updatedDate;
      return acc;
    }, {})
  )
    .map(([workspace, v]) => ({ workspace, content: `${v.count} Content Block`, owner: v.owner, lastUpdate: v.lastUpdate, publish: "Active (Portal Management)" }))
    .sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate));

  return (
    <AdminWorkspaceShell
      title="Tổng quan"
      description="Trung tâm điều hành duy nhất — tình trạng từng khu vực, hàng chờ xuất bản, và hoạt động gần đây của toàn hệ thống."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <div className="space-y-6">
        {/* Task 1 — Workspace Health */}
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">Tình trạng các khu vực</h2>
          <p className="mt-1 text-xs text-white/50">
            10 khu vực quản trị thật + Portal (lớp cấu trúc chéo, không phải nội dung riêng của khu vực nào).
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-4 py-2 font-semibold">Health</th>
                  <th className="px-4 py-2 font-semibold">Khu vực</th>
                  <th className="px-4 py-2 font-semibold">Mức độ hoàn thiện</th>
                  <th className="px-4 py-2 font-semibold">Tài liệu</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-2">🟡</td>
                  <td className="px-4 py-2 font-semibold text-white">Portal</td>
                  <td className="px-4 py-2 text-white/60">
                    {ownedAreas}/{areas.items.length} khu vực có nơi phụ trách · {content.items.length - unownedContent}/{content.items.length} nội dung có nơi phụ trách
                  </td>
                  <td className="px-4 py-2 text-white/40">Không có tài liệu riêng (lớp cấu trúc)</td>
                  <td className="px-4 py-2 text-right">
                    <Link href="/admin/portal" className="text-xs text-brand-blue hover:underline">Mở →</Link>
                  </td>
                </tr>
                {WORKSPACE_OWNERS.map((w) => (
                  <tr key={w.key} className="border-b border-white/5">
                    <td className="px-4 py-2">{MATURITY_HEALTH[w.maturity]}</td>
                    <td className="px-4 py-2 font-semibold text-white">{w.name}</td>
                    <td className="px-4 py-2">
                      <Badge tone={MATURITY_TONE[w.maturity]}>{w.maturity}</Badge>
                    </td>
                    <td className="px-4 py-2 text-white/60">{w.wcsStatus}</td>
                    <td className="px-4 py-2 text-right">
                      <Link href={w.href} className="text-xs text-brand-blue hover:underline">Mở →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task 2 — Publish Center */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Trung tâm xuất bản</h2>
          <p className="mt-1 text-xs text-white/50">
            {publishReady
              ? `Gộp ${publishItems.length} mục thật từ ${trackedCollectionCount} nhóm dữ liệu có quy trình Draft→Review→Published→Archived (13 Hệ tri thức AI + Trang Website + Nội dung dùng chung).`
              : "Đang tải..."}{" "}
            34+ nhóm dữ liệu khác trong Admin chỉ dùng Active/Inactive — không có quy trình xuất bản, không gộp vào đây để tránh ép sai dữ liệu.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Draft" value={draftCount} />
            <StatCard label="Review" value={reviewCount} sub="Review/In Review/Approved/Changes Requested" />
            <StatCard label="Published" value={publishedCount} />
            <StatCard label="Archived" value={archivedCount} />
          </div>
        </div>

        {/* Task 3 — Review Queue summary */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Hàng chờ duyệt</h2>
            <Link href="/admin/founder/review-queue" className="text-xs text-brand-blue hover:underline">Xem danh sách đầy đủ →</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Pending Review" value={pendingReview} />
            <StatCard label="Approved" value={approvedReview} />
            <StatCard label="Needs Change" value={needsChange} />
            <StatCard label="Rejected" value={0} sub="Không tồn tại trạng thái này ở bất kỳ collection nào" />
          </div>
        </div>

        {/* Task 4 — Activity Timeline */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Dòng thời gian hoạt động</h2>
          <p className="mt-2 text-sm text-white/60">
            <strong className="text-white/80">Không tồn tại.</strong> Xác nhận qua grep trực tiếp — 0 kết quả cho{" "}
            <code className="text-brand-orange">activity_log</code>/<code className="text-brand-orange">audit_log</code>/
            <code className="text-brand-orange">ActivityLog</code> trong toàn bộ codebase. Không có bảng nào ghi lại &quot;ai sửa gì lúc nào&quot; —
            mỗi bảng dữ liệu chỉ có <code className="text-brand-orange">updatedDate</code> (ngày sửa cuối, không phải log đầy đủ). Không tự dựng
            Activity Log giả cho sprint này (đúng &quot;Không tạo tài liệu Product mới&quot; — đây là quyết định kiến trúc, không phải hiển thị).
          </p>
        </div>

        {/* Task 5 — Audit Center */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Trung tâm rà soát</h2>
          <p className="mt-1 text-xs text-white/50">
            Khu vực → Nội dung → Nơi phụ trách → Sửa cuối → Xuất bản, gộp theo nơi phụ trách từ {content.items.length} khối nội dung thật của Portal. Nội dung nghiệp vụ nằm ngoài lớp cấu trúc Portal (Premium/Học viện AI/Hệ tri thức AI...) không nằm trong bảng này — xem từng khu vực riêng.
          </p>
          <Table
            columns={[
              { key: "workspace", label: "Khu vực" },
              { key: "content", label: "Nội dung" },
              { key: "owner", label: "Nơi phụ trách" },
              { key: "lastUpdate", label: "Sửa cuối" },
              { key: "publish", label: "Xuất bản" },
            ]}
            rows={auditByWorkspace}
          />
          {!portalReady && <p className="mt-2 text-xs text-white/40">Đang tải dữ liệu Portal...</p>}
        </div>

        {/* Task 6 — System Health */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Sức khỏe hệ thống</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Độ phủ Portal</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <StatCard label="Area" value={areas.items.length} />
                <StatCard label="Page" value={pages.items.length} />
                <StatCard label="Section" value={sections.items.length} />
                <StatCard label="Content" value={content.items.length} sub={unownedContent > 0 ? `${unownedContent} chưa có nơi phụ trách` : "100% có nơi phụ trách"} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Độ phủ các khu vực</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <StatCard label="Canonical" value={maturityCounts.Canonical} />
                <StatCard label="Consistent-Legacy" value={maturityCounts["Consistent-Legacy"]} />
                <StatCard label="Mixed-Legacy" value={maturityCounts["Mixed-Legacy"]} />
                <StatCard label="Not Started" value={maturityCounts["Not Started"]} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Độ phủ nội dung</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <StatCard label="Tài liệu đã duyệt" value={approvedWcs} />
                <StatCard label="Tài liệu nháp" value={draftWcs} />
                <StatCard label="Chưa có tài liệu" value={missingWcs} />
                <StatCard label="Quy trình xuất bản" value={`${trackedCollectionCount}/34+`} sub="Nhóm dữ liệu có Draft→Review→Published→Archived" />
              </div>
            </div>
          </div>
        </div>

        {/* Task 7 — Founder Decision */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <h2 className="text-sm font-bold text-white">Open Blocker (P0)</h2>
            <ul className="mt-3 space-y-3">
              {OPEN_BLOCKERS.map((b) => (
                <li key={b.title} className="text-sm">
                  <p className="font-semibold text-white/80">{b.title}</p>
                  <p className="mt-0.5 text-xs text-white/50">{b.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-bold text-white">Nợ kỹ thuật</h2>
            <ul className="mt-3 space-y-2">
              {TECHNICAL_DEBT.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-bold text-white">PMO Decision ({OPEN_PMO_QUESTIONS.length} câu hỏi mở)</h2>
            <ul className="mt-3 space-y-2">
              {OPEN_PMO_QUESTIONS.map((q) => (
                <li key={q} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-orange" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-bold text-white">Founder Decision (đã quyết, đã thực thi)</h2>
            <ul className="mt-3 space-y-2">
              {FOUNDER_DECISIONS.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Task 8 — Workspace Ownership Matrix */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-white/40">Nơi phụ trách nội dung — mỗi nội dung đúng 1 nơi</p>
            <Link href="/admin/founder/owners" className="text-xs text-brand-blue hover:underline">Xem đầy đủ →</Link>
          </div>
          <WorkspaceOwnerPanel />
        </div>

        {/* Task 9 — Future Flexibility */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Khả năng mở rộng tương lai</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <strong className="text-white/80">Quản lý toàn bộ Portal:</strong> ⚠️ một phần — cấu trúc Khu vực/Trang/Phần/Nội dung của Portal
              quản lý được cấu trúc + metadata, nhưng một phần nội dung nghiệp vụ thật vẫn hardcode ở AI Workspace và trang Sứ mệnh
              Companion.
            </li>
            <li>
              <strong className="text-white/80">Theo dõi toàn bộ các khu vực:</strong> ✅ đạt — trang Tổng quan hiển thị đủ 10
              khu vực + lớp cấu trúc Portal tại 1 nơi, không cần sửa code để xem trạng thái.
            </li>
            <li>
              <strong className="text-white/80">Xuất bản:</strong> ⚠️ một phần — chỉ {trackedCollectionCount}/34+ nhóm dữ liệu có quy trình
              Draft→Review→Published→Archived thật; phần còn lại chỉ Active/Inactive.
            </li>
            <li>
              <strong className="text-white/80">Duyệt:</strong> ⚠️ một phần — cùng giới hạn {trackedCollectionCount}/34+ ở trên.
            </li>
            <li>
              <strong className="text-white/80">Rà soát:</strong> ✅ đạt cho lớp cấu trúc Portal (đầy đủ Khu vực→Nội dung→Nơi phụ trách→Sửa cuối→
              Xuất bản); ⚠️ hạn chế cho nội dung nghiệp vụ ngoài lớp này (Premium/Học viện AI/Hệ tri thức AI...) — phải vào từng khu vực riêng,
              chưa gộp về 1 bảng.
            </li>
          </ul>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
