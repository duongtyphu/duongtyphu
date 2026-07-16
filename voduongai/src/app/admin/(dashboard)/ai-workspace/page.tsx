"use client";

import { AdminWorkspaceShell } from "@/components/admin/AdminWorkspaceShell";
import { AI_WORKSPACE_SECTIONS } from "@/lib/admin/aiWorkspace/navigation";

type ContentMapping = {
  section: string;
  source: string;
  count: string;
  note: string;
};

/**
 * Đối chiếu trực tiếp 9 Section thật của `/portal/aiworkspace/page.tsx`
 * (Task 1, AIWS-SPR-501) — đúng thứ tự JSX render. Toàn bộ dữ liệu là
 * TypeScript hardcode, KHÔNG có bảng Supabase/collection CRUD nào đứng
 * sau — xem `docs/admin/AI_WORKSPACE_MANAGEMENT_AIWS-SPR-501.md`.
 */
const CONTENT_MAPPING: ContentMapping[] = [
  { section: "1. Hero", source: "collection ai-workspace-settings (/admin/ai-workspace/settings)", count: "—", note: "[ĐÃ XỬ LÝ — PMO-HARDENING-CONT] Text + CTA nay quản lý qua Admin." },
  { section: "2. Companion Desk", source: "Form nhập tự do", count: "—", note: "Không có danh sách — chuyển hướng /portal/workspace qua startCompanionWorkspace()." },
  { section: "3. Recommended Workspace", source: "collection ai-workspace-recommended (/admin/ai-workspace/recommended)", count: "8 mục", note: "[ĐÃ XỬ LÝ — PMO-HARDENING-CONT] Quản lý thật trong Admin." },
  { section: "4. AI Workflow", source: "collection ai-workspace-workflow (/admin/ai-workspace/workflow)", count: "4 mục", note: "[ĐÃ XỬ LÝ — PMO-HARDENING-CONT] Quản lý thật trong Admin." },
  { section: "5. Prompt Library", source: "collection ai-workspace-prompts (/admin/ai-workspace/prompts)", count: "12 mục (hiện 9)", note: "[ĐÃ XỬ LÝ — PMO-HARDENING-CONT] quản lý thật trong Admin, nhóm dữ liệu RIÊNG — cố ý không gộp vào bảng `prompts` (CKOS) hay AI_PROMPTS để tránh rủi ro hỏng dữ liệu 2 nguồn cũ." },
  { section: "6. AI Toolbox theo nhiệm vụ", source: "src/data/khong-gian-ai/index.ts → AI_TOOLS", count: "10 mục (6 featured hiện ở trang chính)", note: "Vẫn hardcode — dùng chung generateStaticParams() với route con /portal/aiworkspace/[slug], cần tách Server/Client trước khi CMS-hoá (như đã làm cho case-study/ecosystems) — ngoài phạm vi lượt PMO-HARDENING-CONT này." },
  { section: "7. Resource", source: "collection ai-workspace-resource (/admin/ai-workspace/resource)", count: "4 mục", note: "[ĐÃ XỬ LÝ — PMO-HARDENING-CONT] Quản lý thật trong Admin." },
  { section: "8. Blog AI", source: "src/data/khong-gian-ai/index.ts → AI_ARTICLES", count: "23 mục (10 featured hiện ở trang chính)", note: "Vẫn hardcode — cùng lý do AI Toolbox (dùng chung route con bai-viet/[slug])." },
  { section: "9. Footer CTA", source: "collection ai-workspace-settings (/admin/ai-workspace/settings)", count: "—", note: "[ĐÃ XỬ LÝ — PMO-HARDENING-CONT] Text + CTA nay quản lý qua Admin." },
];

const CHILD_ROUTE_MAPPING: ContentMapping[] = [
  { section: "/portal/aiworkspace/[slug]", source: "AI_TOOLS + NEED_CATEGORIES + PROFESSION_GROUPS", count: "10 + 9 + 10 mục", note: "generateStaticParams() union 3 mảng — routing/lookup, không phải nội dung riêng." },
  { section: "↳ Related Prompts (trong trang Tool/Need detail)", source: "src/data/khong-gian-ai/index.ts → AI_PROMPTS", count: "30 mục", note: "⚠️ Nguồn Prompt THỨ 3, tách biệt hoàn toàn khỏi Prompt Library (mục 5) và bảng CKOS." },
  { section: "/portal/aiworkspace/bai-viet/[slug]", source: "getBlogPost() (src/data/blog.ts)", count: "—", note: "Nội dung bài viết đầy đủ, hardcode." },
  { section: "/portal/aiworkspace/nghe/[slug]", source: "Redirect alias", count: "—", note: "Không có nội dung riêng — redirect(`/portal/aiworkspace/${slug}`)." },
];

export default function AiWorkspaceAdminPage() {
  return (
    <AdminWorkspaceShell
      title="AI Workspace"
      description="Không gian thực hành AI của Portal (/portal/aiworkspace) — 9 Section + 3 route con thật, đối chiếu trực tiếp bên dưới (AIWS-SPR-501, cập nhật PMO-HARDENING-CONT). 5/9 Section (Hero/Workspace đề xuất/AI Workflow/Prompt Library/Resource/Footer CTA) nay sửa được thật trong Admin — 2/9 (AI Toolbox, Blog AI) vẫn hardcode do dùng chung generateStaticParams với route con."
      rootHref="/admin/ai-workspace"
      sections={AI_WORKSPACE_SECTIONS}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <h2 className="text-sm font-bold text-white">Portal Mapping — 9 Section trang chính (/portal/aiworkspace)</h2>
          <p className="mt-1 text-xs text-white/50">
            Đúng thứ tự JSX render thật — đính chính lại danh sách section cũ (PORTAL-SPR-301) vốn thiếu 4 section và sai thứ tự.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 pr-4 font-semibold">Section</th>
                  <th className="py-2 pr-4 font-semibold">Nguồn dữ liệu</th>
                  <th className="py-2 pr-4 font-semibold">Số lượng</th>
                  <th className="py-2 font-semibold">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {CONTENT_MAPPING.map((row) => (
                  <tr key={row.section} className="border-b border-white/5 align-top">
                    <td className="py-2 pr-4 font-semibold text-white/80 whitespace-nowrap">{row.section}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-white/60">{row.source}</td>
                    <td className="py-2 pr-4 whitespace-nowrap text-white/70">{row.count}</td>
                    <td className="py-2 text-xs text-white/50">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Portal Mapping — 3 route con (Child Page)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="py-2 pr-4 font-semibold">Route / Nội dung</th>
                  <th className="py-2 pr-4 font-semibold">Nguồn dữ liệu</th>
                  <th className="py-2 pr-4 font-semibold">Số lượng</th>
                  <th className="py-2 font-semibold">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {CHILD_ROUTE_MAPPING.map((row) => (
                  <tr key={row.section} className="border-b border-white/5 align-top">
                    <td className="py-2 pr-4 font-semibold text-white/80 whitespace-nowrap">{row.section}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-white/60">{row.source}</td>
                    <td className="py-2 pr-4 whitespace-nowrap text-white/70">{row.count}</td>
                    <td className="py-2 text-xs text-white/50">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-bold text-white">Nơi phụ trách</h2>
          <p className="mt-2 text-sm text-white/60">
            AI Workspace chỉ sở hữu 9 Section + 3 route con ở trên. <strong className="text-white/80">Không sở hữu</strong> CKOS
            (Tools/Prompts Supabase, /admin/ckos), Academy (Roadmap/Daily Missions/Journeys, /admin/academy), Companion
            (chat/mentor), Brand, Media, Website. Lưu ý: <code className="text-brand-orange">WorkNeedSection</code> (dữ liệu
            <code className="text-brand-orange"> WORK_NEEDS</code>, cùng nằm trong file <code className="text-brand-orange">src/data/portal/ai-workspace.ts</code>)
            thật ra được mount tại <code className="text-brand-orange">/portal/hocvienai</code> (Academy), không phải
            <code className="text-brand-orange"> /portal/aiworkspace</code> — tên file gây nhầm lẫn nhưng AI Workspace không sở hữu
            nội dung đó. <code className="text-brand-orange">LearningPathSection</code>/<code className="text-brand-orange">LEARNING_PATHS</code> đã
            bị gỡ khỏi cả 2 Portal Area (comment gốc: &quot;Production Reconstruction (Phase 5): bỏ Lộ trình học AI&quot;) — xác nhận
            0 import thật, đã xóa code chết ở STABILIZATION-SPR-1101 (Task 12).
          </p>
        </div>
      </div>
    </AdminWorkspaceShell>
  );
}
