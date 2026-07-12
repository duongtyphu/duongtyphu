import Link from "next/link";
import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { FOUNDER_SECTIONS } from "@/lib/admin/founder/navigation";
import { WorkspaceOwnerPanel } from "@/components/admin/founder/WorkspaceOwnerPanel";
import { WORKSPACE_OWNERS } from "@/lib/admin/workspaceOwnership";

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
  "Digital Assets CRUD (11 route) quản lý /portal/digital-assets — route đã bị Product Owner khai tử, route thật /portal/duan-cohoi vẫn 100% hardcode (IMP-ADM-001R, ưu tiên P0).",
  "Banner (portal_banners/NotificationTicker.tsx) — component đã có sẵn, chỉ thiếu 1 dòng mount vào Portal, chưa quyết định có nối dây hay deprecate (IMP-ADM-001R; 6/7 mục Portal Builder còn lại đã xoá ở PORTAL-SPR-301, chỉ Banner còn treo).",
];

/**
 * WEB-SPR-201R: đã loại bỏ 2 câu hỏi "SEO (Website) vs SEO độc lập cấp
 * cao nhất" — đã giải quyết dứt điểm bằng cách xoá `/admin/seo`
 * (ComingSoon rỗng), giữ `/admin/website/seo` làm bản chính thức duy
 * nhất, theo đúng khuyến nghị REMOVE (không mơ hồ) của
 * `docs/admin/ADMIN_BASELINE_AUDIT_IMP-ADM-001R.md`.
 *
 * PORTAL-SPR-301: đã xoá câu hỏi "Portal Builder (7/8 bảng orphan)" —
 * giải quyết dứt điểm bằng cách xoá 6/7 route (Dashboard Portal/Bắt đầu
 * tại đây/Hôm nay bạn muốn làm gì/Nội dung nổi bật/CTA/Mục tiêu người
 * dùng), xác nhận độc lập 0 Portal consumer cho mỗi bảng. Chỉ giữ lại
 * Banner (verdict khác — NEEDS PMO DECISION, không phải REMOVE), tách
 * thành câu hỏi riêng. Đồng thời sửa số liệu sai "4/10 Portal Area chưa
 * có Owner" — con số đúng đã là 1/10 từ ADM-SPR-201 (`areas.ts` cũ đã ghi
 * chú rõ), founder/page.tsx trước đó chưa cập nhật theo.
 */

/**
 * Founder Workspace (Task 8) — lớp oversight duy nhất, KHÔNG quản lý
 * Content Core nào (không phải Workspace nội dung). Gộp Governance
 * Overview (trạng thái WCS mọi Workspace) + Open PMO Questions tích lũy
 * xuyên suốt EPIC-02 vào một nơi, đúng đề xuất Task 10 của
 * docs/admin/ADMIN_FOUNDATION_V2.md (IMP-ADM-100).
 */
export default function FounderWorkspacePage() {
  const approvedCount = WORKSPACE_OWNERS.filter((w) => w.wcsStatus === "Approved").length;
  const draftCount = WORKSPACE_OWNERS.filter((w) => w.wcsStatus === "Draft").length;
  const missingCount = WORKSPACE_OWNERS.filter((w) => w.wcsStatus === "Chưa có").length;

  return (
    <AdminWorkspaceShell
      title="Founder Workspace"
      description="Không phải Workspace nội dung — lớp oversight cho Founder: trạng thái governance mọi Workspace, và mọi câu hỏi đang chờ PMO/Founder quyết định, gộp từ tất cả báo cáo sprint thay vì đọc rải rác từng file."
      rootHref="/admin/founder"
      sections={FOUNDER_SECTIONS}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">WCS Approved</p>
            <p className="mt-1.5 text-2xl font-extrabold text-white">{approvedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">WCS Draft</p>
            <p className="mt-1.5 text-2xl font-extrabold text-white">{draftCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">Chưa có WCS</p>
            <p className="mt-1.5 text-2xl font-extrabold text-white">{missingCount}</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-white/40">Governance Overview</p>
            <Link href="/admin/founder/owners" className="text-xs text-brand-blue hover:underline">
              Xem đầy đủ Workspace Owner Panel →
            </Link>
          </div>
          <WorkspaceOwnerPanel />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Open PMO Questions ({OPEN_PMO_QUESTIONS.length})</h2>
          <p className="mt-1 text-xs text-white/40">
            Gộp từ mọi báo cáo sprint EPIC-02 — chưa có câu nào được PMO xử lý dứt điểm tại thời điểm viết sprint này.
          </p>
          <ul className="mt-3 space-y-2">
            {OPEN_PMO_QUESTIONS.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-orange" />
                {q}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/founder/review-queue"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
          >
            <p className="font-semibold text-white">Review Queue</p>
            <p className="mt-1 text-xs text-white/40">Placeholder — chưa triển khai</p>
          </Link>
          <Link
            href="/admin/founder/search"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-brand-blue/40 hover:bg-white/[0.05]"
          >
            <p className="font-semibold text-white">Global Search</p>
            <p className="mt-1 text-xs text-white/40">Placeholder — chưa triển khai</p>
          </Link>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
