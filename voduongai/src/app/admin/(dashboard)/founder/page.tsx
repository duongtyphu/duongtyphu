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
  "Global Settings (Website)/Global Brand Settings (Brand Studio) vs. System Settings — chồng lấn field logo/favicon/tagline (WEB-SPR-001, BRAND-SPR-001).",
  "Banner vs. Announcement (Website Shared Sections) — cùng dùng portal_banners, chưa rõ có phải 2 khái niệm khác nhau (WEB-SPR-004). Lưu ý (IMP-ADM-001R): portal_banners/NotificationTicker.tsx thực ra chưa được mount ở bất kỳ đâu trong Portal — \"đã nối dây thật\" ghi ở WEB-SPR-004 là sai, cần đính chính.",
  "Brand Orange có 2 mã màu khác nhau (#FF7A00 vs #F97316) — cần chọn 1 giá trị chính thức (BRAND-SPR-001).",
  "Theme kép (Portal/Admin dark hardcode vs. root token sáng) chưa hợp nhất — có đáng chuẩn hóa không (BRAND-SPR-001).",
  "Danh sách \"7 Workspace hoàn thành Product\" trong brief IMP-ADM-100 sai lệch với code thật — Media Center/Companion Studio chưa xây gì (IMP-ADM-100).",
  "Content group hiện tại (Blog AI/Template/Ebook...) — tách Workspace riêng, gộp CKOS, hay gộp Website? (IMP-ADM-100)",
  "/portal/hetrithucai (3 route) trùng tên khái niệm với /portal/ckos nhưng khác route — quan hệ giữa 2 route chưa xác nhận (ADM-SPR-200).",
  "1/10 Portal Area (Trang chủ Học viện) chưa có Workspace Admin sở hữu rõ ràng — không Workspace nào trong \"Workspace Navigation bắt buộc\" khớp rõ ràng (ADM-SPR-200/201, xác nhận lại PORTAL-SPR-301).",
  "case_study (Admin ghi) vs case_studies (Portal đọc) — 2 bảng Supabase khác nhau, Case Study tạo mới trong Admin không lên Portal (IMP-ADM-001R, ưu tiên P0).",
  "[ĐÃ XỬ LÝ — PROJECTS-SPR-602] Digital Assets CRUD (11 route) quản lý /portal/digital-assets đã khai tử — thay bằng Ecosystem CRUD thật (/admin/projects-opportunities/ecosystems) bám đúng /portal/duan-cohoi (Canonical Product theo Founder Directive).",
  "Banner (portal_banners/NotificationTicker.tsx) — component đã có sẵn, chỉ thiếu 1 dòng mount vào Portal, chưa quyết định có nối dây hay deprecate (IMP-ADM-001R; 6/7 mục Portal Builder còn lại đã xoá ở PORTAL-SPR-301, chỉ Banner còn treo).",
];

const OPEN_BLOCKERS = [
  { title: "Premium: 3 \"Lớp học\" mua thành công nhưng không có nội dung", detail: "`courses` không có cột/bảng nội dung học (chủ đề/chương/bài học/video/tài liệu), `orders.course_id` là TEXT không phải FK — cần migration schema, chưa tự chạy (PREMIUM-SPR-701, P0)." },
  { title: "case_study vs case_studies", detail: "Admin ghi vào 1 bảng, Portal đọc bảng khác — Case Study tạo mới trong Admin không bao giờ lên Portal thật (IMP-ADM-001R, P0)." },
];

const TECHNICAL_DEBT = [
  "Companion Memory: 6 hệ thống bộ nhớ song song chưa hợp nhất (Workspace Runtime/Memory Capsule/Character/Core/Origin/Story Memory) — COMPANION-SPR-801.",
  "Social link tồn tại ở nhiều nơi: siteConfig.community/links (site.ts, nguồn thật cho hầu hết trang) — chỉ /portal/congdongai đã nối dây sang collection \"community\" thật (JOURNEY-SPR-901); các trang khác (Header/Footer) vẫn đọc siteConfig trực tiếp, chưa đồng bộ.",
  "3 nguồn \"Prompt\" trùng tên độc lập: bảng Supabase prompts (CKOS), src/data/prompts.ts (AI Workspace Prompt Library), AI_PROMPTS (AI Workspace Related Prompts) — AIWS-SPR-501.",
  "Brand Orange 2 mã màu khác nhau (#FF7A00 vs #F97316), Theme kép Portal/Admin chưa hợp nhất — BRAND-SPR-001/202.",
  "22 file thiết kế thương hiệu mồ côi trong public/brand/ — 0 tham chiếu, chưa quyết định KEEP hay xoá — BRAND-SPR-202.",
  "34+ collection thật trong Admin (đếm trực tiếp qua source), nhưng chỉ 15 có pipeline Draft→Review→Published→Archived — phần còn lại chỉ Active/Inactive, không đồng nhất giữa các Workspace.",
];

const FOUNDER_DECISIONS = [
  "6 chương trình Premium cố định (Lớp AI Cơ bản/Nâng cao/OpenClaw, V-Solo, V-Scale, Tư vấn 1:1) — không đổi tên/gộp/tạo mới (PREMIUM-SPR-701).",
  "5 nhóm Projects & Opportunities cố định (DigiU/SolarGroup/Crypto/Blockchain/Trading) — PROJECTS-SPR-601.",
  "\"Sứ mệnh Companion\" (Mission Presentation) chuyển ownership từ Companion Studio sang Journey & Community, tách bạch khỏi Mentor Runtime — JOURNEY-SPR-901.",
  "Journey + Community hợp nhất thành 1 Workspace duy nhất (không giữ 2 Workspace riêng như ADM-SPR-201 từng dự kiến) — JOURNEY-SPR-901.",
  "/portal/duan-cohoi là Canonical Product của Projects & Opportunities — Admin CRUD cũ (Digital Asset Project/Link, Consumer = 0) gỡ bỏ hoàn toàn, thay bằng Ecosystem CRUD bám đúng Portal thật — PROJECTS-SPR-602 (Founder Directive).",
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
      title="Founder Operation Center"
      description="Trung tâm điều hành duy nhất — gộp Workspace Health/Publish Center/Review Queue/Activity Timeline/Audit Center/System Health/Founder Decision/Ownership Matrix của toàn hệ thống (FOUNDER-SPR-1001). Không tạo Workspace mới, không đổi Ownership."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <div className="space-y-6">
        {/* Task 1 — Workspace Health */}
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">Workspace Health (Task 1)</h2>
          <p className="mt-1 text-xs text-white/50">
            10 Workspace thật (workspaceOwnership.ts) + Portal Management (lớp cấu trúc chéo, không phải 1 Workspace nội dung — brief liệt kê riêng &quot;Portal&quot;).
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-4 py-2 font-semibold">Health</th>
                  <th className="px-4 py-2 font-semibold">Workspace</th>
                  <th className="px-4 py-2 font-semibold">Maturity</th>
                  <th className="px-4 py-2 font-semibold">WCS</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-2">🟡</td>
                  <td className="px-4 py-2 font-semibold text-white">Portal Management</td>
                  <td className="px-4 py-2 text-white/60">
                    {ownedAreas}/{areas.items.length} Area có Owner · {content.items.length - unownedContent}/{content.items.length} Content có Owner
                  </td>
                  <td className="px-4 py-2 text-white/40">Không có WCS riêng (lớp cấu trúc)</td>
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
          <h2 className="text-sm font-bold text-white">Publish Center (Task 2)</h2>
          <p className="mt-1 text-xs text-white/50">
            {publishReady
              ? `Gộp ${publishItems.length} item thật từ ${trackedCollectionCount} collection có pipeline Draft→Review→Published→Archived (13 CKOS + Website Pages + Shared Sections).`
              : "Đang tải..."}{" "}
            34+ collection khác trong Admin chỉ dùng Active/Inactive — không có khái niệm Publish pipeline, không gộp vào đây để tránh ép sai dữ liệu.
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
            <h2 className="text-sm font-bold text-white">Review Queue (Task 3)</h2>
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
          <h2 className="text-sm font-bold text-white">Activity Timeline (Task 4)</h2>
          <p className="mt-2 text-sm text-white/60">
            <strong className="text-white/80">Không tồn tại.</strong> Xác nhận qua grep trực tiếp — 0 kết quả cho{" "}
            <code className="text-brand-orange">activity_log</code>/<code className="text-brand-orange">audit_log</code>/
            <code className="text-brand-orange">ActivityLog</code> trong toàn bộ codebase. Không có bảng nào ghi lại &quot;ai sửa gì lúc nào&quot; —
            mỗi Registry chỉ có <code className="text-brand-orange">updatedDate</code> (ngày sửa cuối, không phải log đầy đủ). Không tự dựng
            Activity Log giả cho sprint này (đúng &quot;Không tạo tài liệu Product mới&quot; — đây là quyết định kiến trúc, không phải hiển thị).
          </p>
        </div>

        {/* Task 5 — Audit Center */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Audit Center (Task 5)</h2>
          <p className="mt-1 text-xs text-white/50">
            Workspace → Content → Owner → Last Update → Publish, gộp theo Owner từ {content.items.length} Content Block thật (Portal Management). Nội dung nghiệp vụ nằm ngoài Portal Management (Premium/Academy/CKOS...) không nằm trong bảng này — xem từng Workspace riêng.
          </p>
          <Table
            columns={[
              { key: "workspace", label: "Workspace" },
              { key: "content", label: "Content" },
              { key: "owner", label: "Owner" },
              { key: "lastUpdate", label: "Last Update" },
              { key: "publish", label: "Publish" },
            ]}
            rows={auditByWorkspace}
          />
          {!portalReady && <p className="mt-2 text-xs text-white/40">Đang tải dữ liệu Portal Management...</p>}
        </div>

        {/* Task 6 — System Health */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">System Health (Task 6)</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Portal Coverage</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <StatCard label="Area" value={areas.items.length} />
                <StatCard label="Page" value={pages.items.length} />
                <StatCard label="Section" value={sections.items.length} />
                <StatCard label="Content" value={content.items.length} sub={unownedContent > 0 ? `${unownedContent} chưa Owner` : "100% có Owner"} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Workspace Coverage</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <StatCard label="Canonical" value={maturityCounts.Canonical} />
                <StatCard label="Consistent-Legacy" value={maturityCounts["Consistent-Legacy"]} />
                <StatCard label="Mixed-Legacy" value={maturityCounts["Mixed-Legacy"]} />
                <StatCard label="Not Started" value={maturityCounts["Not Started"]} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Content Coverage</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <StatCard label="WCS Approved" value={approvedWcs} />
                <StatCard label="WCS Draft" value={draftWcs} />
                <StatCard label="Chưa có WCS" value={missingWcs} />
                <StatCard label="Publish pipeline" value={`${trackedCollectionCount}/34+`} sub="Collection có Draft→Review→Published→Archived" />
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
            <h2 className="text-sm font-bold text-white">Technical Debt</h2>
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
            <p className="text-xs font-bold uppercase tracking-wide text-white/40">Workspace Ownership — Single Ownership Matrix (Task 8)</p>
            <Link href="/admin/founder/owners" className="text-xs text-brand-blue hover:underline">Xem đầy đủ →</Link>
          </div>
          <WorkspaceOwnerPanel />
        </div>

        {/* Task 9 — Future Flexibility */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Future Flexibility Review (Task 9)</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <strong className="text-white/80">Quản lý toàn bộ Portal:</strong> ⚠️ một phần — Portal Area/Page/Section/Content Registry
              quản lý được cấu trúc + metadata, nhưng nội dung nghiệp vụ thật vẫn 100% hardcode ở AI Workspace, Projects Ecosystem, Mission
              Presentation.
            </li>
            <li>
              <strong className="text-white/80">Theo dõi toàn bộ Workspace:</strong> ✅ đạt — Founder Operation Center hiển thị đủ 10
              Workspace + Portal Management tại 1 nơi, không cần sửa code để xem trạng thái.
            </li>
            <li>
              <strong className="text-white/80">Publish:</strong> ⚠️ một phần — chỉ {trackedCollectionCount}/34+ collection có pipeline
              Draft→Review→Published→Archived thật; phần còn lại chỉ Active/Inactive.
            </li>
            <li>
              <strong className="text-white/80">Review:</strong> ⚠️ một phần — cùng giới hạn {trackedCollectionCount}/34+ ở trên.
            </li>
            <li>
              <strong className="text-white/80">Audit:</strong> ✅ đạt cho Portal Management (đầy đủ Workspace→Content→Owner→LastUpdate→
              Publish); ⚠️ hạn chế cho nội dung nghiệp vụ ngoài Portal Management (Premium/Academy/CKOS...) — phải vào từng Workspace riêng,
              chưa gộp về 1 bảng.
            </li>
          </ul>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
